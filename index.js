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
 * Version: 2.4.4
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
    constructor(opts) {
        const defaults = {
            canvas: null,
            from: '',
            to: '',
            scaleMode: 'cover',      // can be: auto, cover, contain
            hiDPI: true,
            asyncLoader: false,
            initFrameDraw: true,
            scrollEasing: 500,
            scrollBehaviorSmooth: true,
            totalLoadCallback: null,
            imageLoadCallback: null
        }

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

        this._stoped           = false
        this._direction        = 'INIT'
        this._loadedImages     = 0
        this._totalLoaded      = false
        this._frameCountFactor = 1

        this._asyncPreloaderList = []

        this._currentFrame   = 0
        this._lastFrameQuery = 0
        this._images         = []
        this._ctx            = this._config.canvas.getContext('2d')

        const sequenceParser = this._parseSequence(this._config.from, this._config.to)
        this._fileList       = this._buildFileList(sequenceParser)

        this._size(this._ctx.canvas.width, this._ctx.canvas.height)

        this._load()
    }

    _load() {
        if ( !this._config.asyncLoader ) {
            this._preloader()
        }
        else {
            this._asyncPreloader()
        }
    }

    _setDrawLoop(currentFrame, direction) {
        this._clearDrawLoop()

        if ( this._stoped ) { return this._currentFrame = currentFrame }

        if ( this._direction === 'INIT' ) {
            return this._direction = direction
        }

        this._direction = direction

        let lastFrameDiff    = Math.abs(this._lastFrameQuery - currentFrame)
        this._lastFrameQuery = currentFrame

        if ( !this._config.scrollBehaviorSmooth && lastFrameDiff > this._fileList.length * 0.1 ) {
            this._currentFrame = currentFrame
            return this._drawImage()
        }

        let { scrollEasing } = this._config

        let now      = performance.now()
        let timeLaps = 0

        this._drawLoop = requestAnimationFrame(function loop(time) {
            let timeDelta  = Math.floor(time - now)
            let frameCount = Math.abs(this._currentFrame - currentFrame)

            let frameCountFactor = Math.round(frameCount / (scrollEasing / timeDelta))

            this._frameCountFactor = frameCountFactor < 1 ? 1 : frameCountFactor

            timeLaps = timeDelta / ((frameCount / this._frameCountFactor) * timeDelta)

            this._setCurrentFrameByDirection(this._frameCountFactor)
            this._loaderMethodChecker()

            if ( timeLaps < 1 ) {
                this._drawLoop = requestAnimationFrame(loop.bind(this))
            }
        }.bind(this))
    }

    _clearDrawLoop() {
        cancelAnimationFrame(this._drawLoop)
    }

    _setCurrentFrameByDirection(factor = 1) {
        if ( this._direction === 'FORWARD' ) this._currentFrame += factor
        if ( this._direction === 'REVERSE' ) this._currentFrame -= factor
        if ( this._direction != 'PAUSED' ) this._config.initFrameDraw = true

        let imagesCount    = this._fileList.length - 1
        this._currentFrame = this._currentFrame < 0 ? 0 : this._currentFrame > imagesCount ? imagesCount : this._currentFrame
    }

    _loaderMethodChecker() {
        this._config.asyncLoader && this._asyncLoadedChecker()
        !this._config.asyncLoader && this._drawImage()
    }

    _asyncLoadedChecker() {
        let image = this._images[ this._currentFrame ]

        image && image.loaded && this._drawImage()
        !image && this._frameLoader(this._currentFrame)

        if ( !this._totalLoaded ) {
            this._asyncPreloader()
        }
    }

    _frameLoader(targetFrame) {

        if ( this._images[ targetFrame ] ) return

        const img = new Image()

        img.onload = () => {
            img.loaded = true

            this._loadedImages++

            if ( this._config.initFrameDraw && targetFrame === 0 ) {
                this._drawImage()
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

    _asyncPreloader() {
        let preloadFrames = Math.round(this._config.scrollEasing / 16.6)
        let framesList    = []

        clearInterval(this._asyncPreloadInterval)

        for ( let iter = 1; iter < preloadFrames; iter++ ) {
            if ( this._currentFrame === 0 ) {
                this._direction = 'FORWARD'
            }
            if ( this._currentFrame === this._fileList.length - 1 ) {
                this._direction = 'REVERSE'
            }

            let preloadFrame = this._direction === 'REVERSE' ? this._currentFrame - iter : this._currentFrame + iter

            if ( preloadFrame < 0 || preloadFrame >= this._fileList.length ) {
                return
            }

            framesList.push(preloadFrame)
        }

        this._asyncPreloaderList = [ ...framesList, ...this._asyncPreloaderList ]

        this._asyncPreloadInterval = setInterval(() => {
            let image = this._asyncPreloaderList.shift()

            if ( !image ) {
                return clearInterval(this._asyncPreloadInterval)
            }

            this._frameLoader(image)
        }, 33.3)
    }

    _preloader() {
        for ( var iter = 0; iter < this._fileList.length; iter++ ) {
            this._frameLoader(iter)
        }
    }

    _loadedImagesCallback() {
        this._totalLoaded = true
        this._config.totalLoadCallback && this._config.totalLoadCallback()
    }

    _drawImage() {
        requestAnimationFrame(this._canvasDraw.bind(this))
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
        this._clearDrawLoop()
    }

    resize(width, height) {
        if ( !width || !height ) {
            return console.error('resize "width" or "height" missed')
        }

        this._size(width, height)
        this._drawImage()
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
        let sequencer = new Sequencer(opt)

        this.on('progress', ({ progress, scrollDirection, type }) => {
            let currentFrame = Math.round(progress * (sequencer._fileList.length - 1))
            sequencer._setDrawLoop(currentFrame, scrollDirection)
        })

        return sequencer
    }
}))

