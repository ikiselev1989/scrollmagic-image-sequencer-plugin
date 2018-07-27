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
 * Version: 1.5.0
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
            progressiveLoader: false,
            preloadFrameCount: 30
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

        this.images = []
        this.ctx = this.config.canvas.getContext('2d')

        const s = this.parseSequence(this.config.from, this.config.to)
        this.fileList = this.buildFileList(s)

        this.size(this.ctx.canvas.width, this.ctx.canvas.height)

        this.load()
    }

    load() {
        this.load = function () {
            console.log('load() can be called only once.')
        }

        if ( !this.config.progressiveLoader ) {
            this.preloader()
        }
    }

    scrollDrawImage(reqFrame) {
        this.config.progressiveLoader && this.targetFrameDraw(reqFrame)
        !this.config.progressiveLoader && this.drawImage(reqFrame)
    }

    drawImage(id) {
        if ( !this.images[ id ] ) return

        const r = this.config.hiDPI ? window.devicePixelRatio : 1
        const cw = this.ctx.canvas.width / r
        const ch = this.ctx.canvas.height / r
        const ca = cw / ch
        const img = this.images[ id ]
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
    }

    size(w, h) {
        const r = this.config.hiDPI ? window.devicePixelRatio : 1
        const c = this.ctx.canvas
        c.width = w * r
        c.height = h * r
        c.style.width = w + 'px'
        c.style.height = h + 'px'
        this.drawImage()
    }

    parseSequence(from, to) {
        const l = Math.min(from.length, to.length)
        let i = Math.max(0, from.lastIndexOf('/'))

        while ( from.charAt(i) == to.charAt(i) && !/[1-9]/.test(from.charAt(i)) && i < l ) i++

        const a = from.slice(i, from.lastIndexOf('.'))      // from, may contain leading zeros
        const b = to.slice(i, to.lastIndexOf('.'))          // to
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
        const q = []
        const dir = sequenceObj.from > sequenceObj.to ? -1 : 1
        for ( let i = 0; i < sequenceObj.length; i++ ) {
            const n = (sequenceObj.from + i * dir).toString()
            const num = padLeft(n, '0', sequenceObj.zeroes)
            q.push(sequenceObj.base + num + sequenceObj.ext)
        }
        return q
    }

    targetFrameDraw(targetFrame) {
        this.images[ targetFrame ] && this.drawImage(targetFrame)
        !this.images[ targetFrame ] && this.frameLoader(targetFrame, true)

        let { preloadFrameCount } = this.config

        for ( var i = -preloadFrameCount; i < preloadFrameCount; i++ ) {
            this.frameLoader(targetFrame + i)
        }
    }

    frameLoader(targetFrame, drawAfterLoad = false) {
        if ( !this.fileList[ targetFrame ] ) return

        if ( !this.images[ targetFrame ] ) {
            const img = new Image()
            img.src = this.fileList[ targetFrame ]
            img.onload = drawAfterLoad ? () => {
                this.drawImage(targetFrame)
            } : null
            img.onerror = function () {
                console.log(`Error with image-id: ${targetFrame}`)
            }
            this.images[ targetFrame ] = img
        }
    }

    preloader() {
        let iterativeCount = [ 16, 8, 4, 2, 1 ]
        let firstLoadImageCount = this.config.preloadFrameCount

        this.frameLoader(0, true)

        for ( let firstImageCount = 1; firstImageCount <= firstLoadImageCount; firstImageCount++ ) {
            this.frameLoader(firstImageCount)

            if ( firstImageCount === firstLoadImageCount ) {
                iterativeCount.forEach((currentCount) => {
                    for ( var current = 0; current < this.fileList.length; current += currentCount ) {
                        this.frameLoader(current)
                    }
                })
            }
        }
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

        this.on('progress', () => {
            let currentFrame = Math.round(this.progress() * (sequencer.fileList.length - 1))
            sequencer.scrollDrawImage(currentFrame)
        })
    }
}))

