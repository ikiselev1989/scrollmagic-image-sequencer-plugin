/*
 * Image Sequencer for ScrollMagic Scene
 * (c) 2018
 *
 * Author:
 *      Ilya Kiselev
 *      ikiselev1989@gmail.com
 *
 * Project:
 *      https://github.com/ikiselev1989/scrollmagic-image-sequencer-plugin
 *
 * Version: 3.6.1
 *
 * Based on http://github.com/ertdfgcvb/Sequencer
 */

import webglUtils from './webgl-utils/webgl-utils'
import m4 from './webgl-utils/m4'

String.prototype.repeat = String.prototype.repeat || function (n) {
        return n <= 1 ? this : (this + this.repeat(n - 1))
    };

function padLeft(str, char, length) {
    return char.repeat(Math.max(0, length - str.length)) + str
}

class Sequencer {
    constructor(opts, scene) {
        const defaults = {
            canvas: null,
            canvasContext: 'auto', // can be: auto, webgl, 2d
            from: '',
            to: '',
            asyncLoader: false,
            scaleMode: 'cover',      // can be: auto, cover, contain
            framePosition: 'center center',      // default: center center
            hiDPI: true,
            initFrameDraw: true,
            totalLoadCallback: null,
            imageLoadCallback: null,
            useWorkerPreloader: false
        }

        this.scene   = scene
        this._config = Object.assign({}, defaults, opts)

        this._workerAvailable = window.Worker

        // backwards compatibility: .retina field is assigned to .hiDPI (Retina is an Apple trademark)
        if ( opts.hasOwnProperty('retina') ) this._config.hiDPI = opts.retina

        if ( this._config.from == '' && this._config.to == '' ) {
            console.error('Missing filenames.')
            return false
        }

        if ( !this._config.canvas ) {
            console.error('Missing canvas node.')
            return false
        }

        this._stoped             = false
        this._loadedImages       = 0
        this._totalLoaded        = false
        this._preloadTotalLoaded = false

        this._images = []

        this._isWebGL = true
        this._canvasInit()

        const sequenceParser = this._parseSequence(this._config.from, this._config.to)
        this._fileList       = this._buildFileList(sequenceParser)

        if ( this._config.asyncLoader && typeof this._config.asyncLoader === 'boolean' ) {
            this._config.asyncLoader = this._fileList.length
        }

        let init = ({ progress }) => {
            if ( this._config.useWorkerPreloader && this._workerAvailable ) {

                function createWorker(f) {
                    return new Worker(URL.createObjectURL(new Blob([ `(${f})()` ])))
                }

                const worker = createWorker(() => {
                    self.addEventListener('message', ({ data }) => {
                        let { fileList, baseUrl, asyncLoader } = data

                        let i  = 0, tempArray
                        let id = 0

                        let chunkProgressor = () => {
                            tempArray = fileList.slice(i, i + asyncLoader)

                            let promiseArray = []

                            tempArray.forEach((src) => {
                                let url = new URL(src, baseUrl)

                                promiseArray.push(
                                    fetch(url.href, {
                                        mode: 'cors'
                                    }).then(response => {
                                        return response.blob()
                                    }).then(_ => id++ % fileList.length)
                                )
                            })

                            Promise.all(promiseArray).then((chunkList) => {
                                if ( i < fileList.length ) {
                                    i += asyncLoader

                                    self.postMessage({ type: 'CHUNK', chunkList })
                                    chunkProgressor()
                                }
                                else {
                                    self.postMessage({ type: 'TOTAL' })
                                }
                            })
                        }

                        chunkProgressor()
                    })
                })

                worker.onmessage = (e) => {
                    let { type, chunkList } = e.data

                    switch ( type ) {
                        case 'TOTAL':
                            this.scene.off('progress', init)
                            this.scene.on('progress', this._progressor.bind(this))
                            break

                        case 'CHUNK':
                            this._frameLoader(chunkList)
                            break

                        default:
                            return
                    }
                }

                let baseUrl = location.href

                worker.postMessage({
                    fileList: this._fileList,
                    baseUrl,
                    asyncLoader: this._config.asyncLoader || this._fileList.length
                })

                this._currentFrame = Math.round(progress * (this._fileList.length - 1))
            }
            else {
                this._sceneProgressInit(progress)
                this.scene.off('progress', init)
            }
        }

        this.scene.on('progress', init)
    }

    _webglInit() {
        let program = webglUtils.createProgramFromScripts(this._ctx, [ {
            src: 'attribute vec4 a_position;attribute vec2 a_texcoord;uniform mat4 u_matrix;uniform mat4 u_textureMatrix;varying vec2 v_texcoord;void main() {gl_Position = u_matrix * a_position;v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;}',
            type: 'x-shader/x-vertex'
        }, {
            src: 'precision mediump float;varying vec2 v_texcoord;uniform sampler2D u_texture;void main() {gl_FragColor = texture2D(u_texture, v_texcoord);}',
            type: 'x-shader/x-fragment'
        } ])

        let positionLocation      = this._ctx.getAttribLocation(program, 'a_position')
        let texcoordLocation      = this._ctx.getAttribLocation(program, 'a_texcoord')
        let matrixLocation        = this._ctx.getUniformLocation(program, 'u_matrix')
        let textureMatrixLocation = this._ctx.getUniformLocation(program, 'u_textureMatrix')
        let textureLocation       = this._ctx.getUniformLocation(program, 'u_texture')

        let positionBuffer = this._ctx.createBuffer()

        this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, positionBuffer)

        let positions = [ 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1 ]

        this._ctx.bufferData(this._ctx.ARRAY_BUFFER, new Float32Array(positions), this._ctx.STATIC_DRAW)

        let texcoordBuffer = this._ctx.createBuffer()

        this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, texcoordBuffer)

        let texcoords = [ 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1 ]

        this._ctx.bufferData(this._ctx.ARRAY_BUFFER, new Float32Array(texcoords), this._ctx.STATIC_DRAW)

        this._ctx.drawImage = (tex, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight) => {
            this._ctx.bindTexture(this._ctx.TEXTURE_2D, tex)
            this._ctx.useProgram(program)
            this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, positionBuffer)
            this._ctx.enableVertexAttribArray(positionLocation)
            this._ctx.vertexAttribPointer(positionLocation, 2, this._ctx.FLOAT, false, 0, 0)
            this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, texcoordBuffer)
            this._ctx.enableVertexAttribArray(texcoordLocation)
            this._ctx.vertexAttribPointer(texcoordLocation, 2, this._ctx.FLOAT, false, 0, 0)

            let matrix = m4.orthographic(0, this._ctx.canvas.width, this._ctx.canvas.height, 0, -1, 1)

            matrix = m4.translate(matrix, dstX, dstY, 0)
            matrix = m4.scale(matrix, dstWidth, dstHeight, 1)

            this._ctx.uniformMatrix4fv(matrixLocation, false, matrix)

            let texMatrix = m4.translation(srcX / srcWidth, srcY / srcHeight, 0)

            texMatrix = m4.scale(texMatrix, 1, 1, 1)

            this._ctx.uniformMatrix4fv(textureMatrixLocation, false, texMatrix)
            this._ctx.uniform1i(textureLocation, 0)
            this._ctx.drawArrays(this._ctx.TRIANGLES, 0, 6)
        }
    }

    _canvasInit() {
        let { tagName } = this._config.canvas

        if ( tagName === 'CANVAS' ) {
            if ( this._config.canvasContext === 'auto' ) {
                this._ctx = this._config.canvas.getContext('webgl')

                if ( !this._ctx ) {
                    this._isWebGL = false

                    this._ctx = this._config.canvas.getContext('2d')
                    console.info('Scrollmagic sequencer use 2d context')
                }
                else {
                    console.info('Scrollmagic sequencer use WebGL context')
                    this._webglInit()
                }
            }
            else {
                this._ctx = this._config.canvas.getContext(this._config.canvasContext)

                if ( this._config.canvasContext === '2d' ) {
                    this._isWebGL = false
                    console.info('Scrollmagic sequencer use 2d context')
                }
                else {
                    console.info('Scrollmagic sequencer use WebGL context')
                }
            }

            this._size(this._ctx.canvas.width, this._ctx.canvas.height)
        }
        else if ( tagName === 'IMG' ) {
            this._imgMode = true
        }
        else {
            console.error('Wrong canvas node.')
        }
    }

    _sceneProgressInit(progress) {
        this._currentFrame = Math.round(progress * (this._fileList.length - 1))
        this._preloader()

        this.scene.on('progress', this._progressor.bind(this))
    }

    _frameLoader(targetFramesList) {
        let promisesList = []

        targetFramesList.forEach((frame) => {
            if ( this._images[ frame ] ) return

            let promise = new Promise((resolve, reject) => {
                const img = new Image()

                img.onload = () => {
                    img.loaded = true
                    this._loadedImages++

                    if ( this._config.initFrameDraw && frame === this._currentFrame ) {
                        !this._imgMode && this._canvasDraw()
                        this._imgMode && this._imageDraw()
                    }

                    this._config.imageLoadCallback && this._config.imageLoadCallback({ img, frame: frame })

                    if ( this._loadedImages === this._fileList.length ) {
                        this._loadedImagesCallback()
                    }

                    resolve()
                }

                img.onerror = function () {
                    console.error(`Error with image-id: ${frame}`)

                    reject()
                }

                this._images[ frame ] = img

                img.src = this._fileList[ frame ]
            })

            promisesList.push(promise)
        })

        return Promise.all(promisesList)
    }

    _preloader() {
        this._frameLoader([ this._currentFrame ]).then(() => {
            if ( this._config.asyncLoader ) {
                this._asyncLoader()
            }
            else {
                this._syncLoader()
            }
        })
    }

    _asyncLoader() {
        if ( this._loadedImages < this._fileList.length ) {
            let chunkStartIndex = (this._loadedImages + this._currentFrame) % this._fileList.length
            let chunkEndIndex   = chunkStartIndex + parseInt(this._config.asyncLoader)
            chunkEndIndex       = chunkEndIndex > this._fileList.length ? this._fileList.length : chunkEndIndex

            let chunkArray = []

            for ( var i = chunkStartIndex; i < chunkEndIndex; i++ ) {
                chunkArray.push(i)
            }

            this._frameLoader(chunkArray).then(() => {
                this._asyncLoader()
            })
        }
    }

    _syncLoader() {
        if ( this._loadedImages < this._fileList.length ) {
            let currentIndex = (this._loadedImages + this._currentFrame) % this._fileList.length

            this._frameLoader([ currentIndex ]).then(() => {
                this._syncLoader()
            })
        }
    }

    _loadedImagesCallback() {
        this._totalLoaded = true
        this._config.totalLoadCallback && this._config.totalLoadCallback()
    }

    _progressor({ progress }) {
        if ( this._stoped ) return

        this._currentFrame = Math.round(progress * (this._fileList.length - 1))
        this._drawFrame()
    }

    _drawFrame() {
        !this._imgMode && requestAnimationFrame(this._canvasDraw.bind(this))
        this._imgMode && requestAnimationFrame(this._imageDraw.bind(this))
    }

    _canvasDraw() {
        const img = this._images[ this._currentFrame ]

        if ( !img || !img.loaded ) return

        const r  = this._config.hiDPI ? window.devicePixelRatio : 1
        const cw = this._isWebGL ? this._ctx.canvas.width : this._ctx.canvas.width / r
        const ch = this._isWebGL ? this._ctx.canvas.height : this._ctx.canvas.height / r
        const ca = cw / ch
        const ia = img.width / img.height
        let iw, ih

        let ox = null,
            oy = null

        if ( this._config.scaleMode == 'cover' ) {
            if ( ca > ia ) {
                iw = cw
                ih = iw / ia
            }
            else {
                ih = ch
                iw = ih * ia
            }

            let position = this._config.framePosition.split(' ')

            ox = position[ 0 ] === 'center' ? (cw / 2 - iw / 2) : position[ 0 ] === 'left' ? 0 : cw - iw
            oy = position[ 1 ] === 'center' ? (ch / 2 - ih / 2) : position[ 1 ] === 'top' ? 0 : ch - ih
        }
        else if ( this._config.scaleMode == 'contain' ) {
            if ( ca < ia ) {
                iw = cw
                ih = iw / ia
            }
            else {
                ih = ch
                iw = ih * ia
            }
        }
        else { //this._config.scaleMode == 'auto'
            iw = img.width
            ih = img.height
        }

        ox = ox === null ? (cw / 2 - iw / 2) : ox
        oy = oy === null ? (ch / 2 - ih / 2) : oy

        if ( this._isWebGL ) {
            this._ctx.viewport(0, 0, this._ctx.canvas.width, this._ctx.canvas.height)

            this._ctx.clear(this._ctx.COLOR_BUFFER_BIT)

            let tex = this._ctx.createTexture()

            this._ctx.bindTexture(this._ctx.TEXTURE_2D, tex)
            this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, 1, 1, 0, this._ctx.RGBA, this._ctx.UNSIGNED_BYTE,
                new Uint8Array([ 0, 0, 255, 255 ]))

            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_S, this._ctx.CLAMP_TO_EDGE)
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_T, this._ctx.CLAMP_TO_EDGE)
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MIN_FILTER, this._ctx.LINEAR)

            this._ctx.bindTexture(this._ctx.TEXTURE_2D, tex)
            this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, this._ctx.RGBA, this._ctx.UNSIGNED_BYTE, img)

            this._ctx.drawImage(tex, 0, 0, img.width, img.height, ~~(ox), ~~(oy), ~~iw, ~~ih)
        }
        else {
            this._ctx.save()
            this._ctx.scale(r, r)
            this._ctx.clearRect(0, 0, cw, ch)  // support for images with alpha
            this._ctx.drawImage(img, 0, 0, img.width, img.height, ~~(ox), ~~(oy), ~~iw, ~~ih)
            this._ctx.restore()
        }
        this._currentDrawFrame = this._currentFrame
    }

    _imageDraw() {
        const img = this._images[ this._currentFrame ]

        if ( !img || !img.loaded ) return

        this._config.canvas.src = img.src
    }

    _size(w, h) {
        const r        = this._config.hiDPI ? window.devicePixelRatio : 1
        const c        = this._ctx.canvas
        c.width        = w * r
        c.height       = h * r
        c.style.width  = w + 'px'
        c.style.height = h + 'px'
    }

    _parseSequence(from, to) {
        const l = Math.min(from.length, to.length)
        let i   = Math.max(0, from.lastIndexOf('/'))

        while ( from.charAt(i) == to.charAt(i) && !/[1-9]/.test(from.charAt(i)) && i < l ) i++

        const a  = from.slice(i, from.lastIndexOf('.'))      // from, may contain leading zeros
        const b  = to.slice(i, to.lastIndexOf('.'))          // to
        const ia = parseInt(a)
        const ib = parseInt(b)

        return {
            from: ia,
            to: ib,
            base: from.substr(0, i),
            ext: from.substr(from.lastIndexOf('.')),
            zeroes: (a.length == b.length) && (Math.floor(log10(ia)) < Math.floor(log10(ib))) ? a.length : 0,
            length: Math.abs(ib - ia) + 1
        }

        function log10(x) {
            return Math.log(x) / Math.LN10
        }
    }

    _buildFileList(sequenceObj) {
        const q   = []
        const dir = sequenceObj.from > sequenceObj.to ? -1 : 1
        for ( let i = 0; i < sequenceObj.length; i++ ) {
            const n   = (sequenceObj.from + i * dir).toString()
            const num = padLeft(n, '0', sequenceObj.zeroes)
            q.push(sequenceObj.base + num + sequenceObj.ext)
        }
        return q
    }

    resumeDrawing() {
        this._stoped = false
    }

    stopDrawing() {
        this._stoped = true
    }

    resize(width, height) {
        if ( !width || !height ) {
            return console.error('resize "width" or "height" missed')
        }

        this._size(width, height)
        this._drawFrame()
    }
}

(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define([ 'ScrollMagic' ], factory)
    }
    else if ( typeof exports === 'object' ) {
        // CommonJS
        factory(require('scrollmagic'))
    }
    else {
        // no browser global export needed, just execute
        factory(root.ScrollMagic || (root.jQuery && root.jQuery.ScrollMagic))
    }
}(this, function (ScrollMagic) { // 'window' change to 'this'
    ScrollMagic.Scene.prototype.addImageSequencer = function (opt) {
        return new Sequencer(opt, this)
    }
}))

