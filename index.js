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
 * Version: 3.2.0
 *
 * Based on http://github.com/ertdfgcvb/Sequencer
 */

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
            from: '',
            to: '',
            asyncLoader: false,
            scaleMode: 'cover',      // can be: auto, cover, contain
            hiDPI: true,
            initFrameDraw: true,
            durationMultiply: 4,
            totalLoadCallback: null,
            imageLoadCallback: null
        }

        this.scene   = scene
        this._config = Object.assign({}, defaults, opts)

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

        this._stoped       = false
        this._loadedImages = 0
        this._totalLoaded  = false

        this._images = []

        this._canvasInit()

        const sequenceParser = this._parseSequence(this._config.from, this._config.to)
        this._fileList       = this._buildFileList(sequenceParser)

        if ( this._config.durationMultiply <= 0 ) this._config.durationMultiply = 1
        this.scene.duration(this._fileList.length * this._config.durationMultiply / 100 * document.documentElement.clientHeight)

        let init = ({ progress }) => {
            this._sceneProgressInit(progress)
            this.scene.off('progress', init)
        }

        this.scene.on('progress', init)
    }

    _canvasInit() {
        let { tagName } = this._config.canvas

        if ( tagName === 'CANVAS' ) {
            this._ctx = this._config.canvas.getContext('2d')
            this._size(this._ctx.canvas.width, this._ctx.canvas.height)
        }
        else if ( tagName === 'IMG' ) {
            this._imgMode = true
        }
        else {
            console.log('Wrong canvas node.')
        }
    }

    _sceneProgressInit(progress) {
        this._currentFrame = Math.round(progress * (this._fileList.length - 1))
        this._preloader()

        this.scene.on('progress', this._progressor.bind(this))
    }

    _frameLoader(targetFrame) {
        if ( this._images[ targetFrame ] ) return

        const img = new Image()

        img.onload = () => {
            img.loaded = true

            this._loadedImages++

            if ( !this._config.asyncLoader ) {
                if ( this._loadedImages >= this._fileList.length ) return

                this._frameLoader(this._loadedImages)
            }

            if ( this._config.initFrameDraw && targetFrame === this._currentFrame ) {
                !this._imgMode && this._canvasDraw()
                this._imgMode && this._imageDraw()
            }

            this._config.imageLoadCallback && this._config.imageLoadCallback({ img, frame: targetFrame })

            if ( this._loadedImages === this._fileList.length ) {
                this._loadedImagesCallback()
            }
        }

        img.onerror = function () {
            console.error(`Error with image-id: ${targetFrame}`)
        }

        this._images[ targetFrame ] = img

        img.src = this._fileList[ targetFrame ]
    }

    _preloader() {
        this._frameLoader(this._currentFrame)

        if ( this._config.asyncLoader ) {
            for ( var iter = 0; iter < this._fileList.length; iter++ ) {
                this._frameLoader(iter)
            }
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
        const cw = this._ctx.canvas.width / r
        const ch = this._ctx.canvas.height / r
        const ca = cw / ch
        const ia = img.width / img.height
        let iw, ih

        if ( this._config.scaleMode == 'cover' ) {
            if ( ca > ia ) {
                iw = cw
                ih = iw / ia
            }
            else {
                ih = ch
                iw = ih * ia
            }
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

        const ox = (cw / 2 - iw / 2)
        const oy = (ch / 2 - ih / 2)

        this._ctx.save()
        this._ctx.scale(r, r)
        this._ctx.clearRect(0, 0, cw, ch)  // support for images with alpha
        this._ctx.drawImage(img, 0, 0, img.width, img.height, ~~(ox), ~~(oy), ~~iw, ~~ih)
        this._ctx.restore()

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

