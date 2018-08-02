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
 * Version: 2.0.0
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
            fps: 60,
            timeDeltaFactor: 5,
            totalLoadCallback: null,
            imageLoadCallback: null
        }

        this.config = Object.assign({}, defaults, opts)

        // backwards compatibility: .retina field is assigned to .hiDPI (Retina is an Apple trademark)
        if ( opts.hasOwnProperty('retina') ) this.config.hiDPI = opts.retina

        if ( this.config.from == '' && this.config.to == '' ) {
            console.error('Missing filenames.')
            return false
        }

        if ( !this.config.canvas ) {
            console.error('Missing canvas node.')
            return false
        }

        this.direction        = 'PAUSED'
        this.loadedImages     = 0
        this.totalLoaded      = false
        this.frameCountFactor = 1

        this.asyncPreloaderList = []

        this.stoped       = true
        this.currentFrame = 0
        this.images       = []
        this.ctx          = this.config.canvas.getContext('2d')

        const s       = this.parseSequence(this.config.from, this.config.to)
        this.fileList = this.buildFileList(s)

        this.size(this.ctx.canvas.width, this.ctx.canvas.height)

        this.load()
    }

    load() {
        if ( !this.config.asyncLoader ) {
            this.preloader()
        }
    }

    setDrawLoop(currentFrame, direction) {
        this.clearDrawLoop()

        if ( !this.config.asyncLoader && !this.totalLoaded ) return

        this.direction = direction
        this.stoped    = this.direction === 'PAUSED'

        let { fps, timeDeltaFactor } = this.config
        let frameCount               = Math.abs(this.currentFrame - currentFrame)
        let frameCountFactor         = Math.round(frameCount / fps * timeDeltaFactor)

        this.frameCountFactor = frameCountFactor <= 1 ? 1 : frameCountFactor

        this.drawLoop = setInterval(() => {

            this.setCurrentFrameByDirection(this.frameCountFactor)
            this.loaderMethodChecker()

            frameCount -= this.frameCountFactor

            if ( frameCount <= 0 ) {
                clearInterval(this.drawLoop)
            }

        }, 1000 / fps)
    }

    clearDrawLoop() {
        clearInterval(this.drawLoop)
        clearTimeout(this.drawLoopTimeout)
    }

    setCurrentFrameByDirection(factor = 1) {
        if ( this.direction === 'FORWARD' ) this.currentFrame += factor
        if ( this.direction === 'REVERSE' ) this.currentFrame -= factor

        let imagesCount   = this.fileList.length - 1
        this.currentFrame = this.currentFrame < 0 ? 0 : this.currentFrame > imagesCount ? imagesCount : this.currentFrame
    }

    loaderMethodChecker() {
        this.config.asyncLoader && this.asyncLoadedChecker()
        !this.config.asyncLoader && this.drawImage()
    }

    asyncLoadedChecker() {
        let image = this.images[ this.currentFrame ]

        image && image.loaded && this.drawImage()
        !image && this.frameLoader(this.currentFrame)

        if ( !this.totalLoaded ) {
            this.asyncPreloader()
        }
    }

    frameLoader(targetFrame) {

        if ( this.images[ targetFrame ] ) return

        const img = new Image()

        img.onload = () => {
            img.loaded = true

            this.loadedImages++

            this.config.asyncLoader && this.stoped && this.drawImage()
            this.config.imageLoadCallback && this.config.imageLoadCallback({ img, frame: targetFrame })

            if ( this.loadedImages === this.fileList.length ) {
                this.loadedImagesCallback()
            }
        }

        img.onerror = function () {
            console.error(`Error with image-id: ${targetFrame}`)
        }

        this.images[ targetFrame ] = img

        img.src = this.fileList[ targetFrame ]
    }

    asyncPreloader() {
        let { fps } = this.config

        let preloadFrames = 5
        let framesList    = []

        clearInterval(this.asyncPreloadInterval)

        for ( let iter = 1; iter < preloadFrames; iter++ ) {
            if ( this.currentFrame === 0 ) {
                this.direction = 'FORWARD'
            }
            if ( this.currentFrame === this.fileList.length - 1 ) {
                this.direction = 'REVERSE'
            }

            let preloadFrame = this.direction === 'REVERSE' ? this.currentFrame - iter : this.currentFrame + iter

            if ( preloadFrame < 0 || preloadFrame >= this.fileList.length ) {
                return
            }

            framesList.push(preloadFrame)
        }

        this.asyncPreloaderList = [ ...framesList, ...this.asyncPreloaderList ]

        this.asyncPreloadInterval = setInterval(() => {
            let image = this.asyncPreloaderList.shift()

            if ( !image ) {
                return clearInterval(this.asyncPreloadInterval)
            }

            this.frameLoader(image)
        }, 1000 / fps / 2)
    }

    preloader() {
        for ( var iter = 0; iter < this.fileList.length; iter++ ) {
            this.frameLoader(iter)
        }
    }

    loadedImagesCallback() {
        this.totalLoaded = true
        this.config.totalLoadCallback && this.config.totalLoadCallback()
        this.drawImage()
    }

    drawImage() {
        requestAnimationFrame(this.canvasDraw.bind(this))
    }

    canvasDraw() {
        const img = this.images[ this.currentFrame ]

        if ( !img || !img.loaded || this.currentDrawFrame === this.currentFrame ) return

        const r  = this.config.hiDPI ? window.devicePixelRatio : 1
        const cw = this.ctx.canvas.width / r
        const ch = this.ctx.canvas.height / r
        const ca = cw / ch
        const ia = img.width / img.height
        let iw, ih

        if ( this.config.scaleMode == 'cover' ) {
            if ( ca > ia ) {
                iw = cw
                ih = iw / ia
            }
            else {
                ih = ch
                iw = ih * ia
            }
        }
        else if ( this.config.scaleMode == 'contain' ) {
            if ( ca < ia ) {
                iw = cw
                ih = iw / ia
            }
            else {
                ih = ch
                iw = ih * ia
            }
        }
        else { //this.config.scaleMode == 'auto'
            iw = img.width
            ih = img.height
        }

        const ox = (cw / 2 - iw / 2)
        const oy = (ch / 2 - ih / 2)

        this.ctx.save()
        this.ctx.scale(r, r)
        this.ctx.clearRect(0, 0, cw, ch)  // support for images with alpha
        this.ctx.drawImage(img, 0, 0, img.width, img.height, ~~(ox), ~~(oy), ~~iw, ~~ih)
        this.ctx.restore()

        this.currentDrawFrame = this.currentFrame
    }

    size(w, h) {
        const r        = this.config.hiDPI ? window.devicePixelRatio : 1
        const c        = this.ctx.canvas
        c.width        = w * r
        c.height       = h * r
        c.style.width  = w + 'px'
        c.style.height = h + 'px'
    }

    parseSequence(from, to) {
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

    buildFileList(sequenceObj) {
        const q   = []
        const dir = sequenceObj.from > sequenceObj.to ? -1 : 1
        for ( let i = 0; i < sequenceObj.length; i++ ) {
            const n   = (sequenceObj.from + i * dir).toString()
            const num = padLeft(n, '0', sequenceObj.zeroes)
            q.push(sequenceObj.base + num + sequenceObj.ext)
        }
        return q
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

        this.on('progress', ({ progress, scrollDirection }) => {
            let currentFrame = Math.round(progress * (sequencer.fileList.length - 1))
            sequencer.setDrawLoop(currentFrame, scrollDirection)
        })
    }
}))

