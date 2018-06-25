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
            scaleMode: 'cover',      // as in CSS3, can be: auto, cover, contain
            hiDPI: true
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

        this.current = -1
        this.images = []
        this.lastLoaded = -1
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

        this.preloader(this.images, this.fileList, this.config.imageLoad, this.config.queueComplete)
    }

    nextImage() {
        this.drawImage(++this.current)
    }

    prevImage() {
        this.drawImage(--this.current)
    }

    scrollDrawImage(reqFrame) {
        let frame = reqFrame - this.current

        for ( let i = 0; i < Math.abs(frame); i++ ) {
            requestAnimationFrame(() => {
                frame > 0 ? this.nextImage() : this.prevImage()
            })
        }
    }

    drawImage(id) {
        if ( id === undefined ) id = this.current
        if ( id < 0 || id >= this.images.length ) return

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

    preloader(arrayToPopulate, fileList, imageLoadCallback, queueCompleteCallbak) {
        const concurrentLoads = Math.min(fileList.length, 4)
        let current = arrayToPopulate.length - 1 // id: order in array
        let count = arrayToPopulate.length       // count: count of image loaded... can be out of sync of id.
        for ( let i = 0; i < concurrentLoads; i++ ) loadNext();

        function loadNext() {
            if ( current >= fileList.length - 1 ) return
            current++

            //console.log('Loading ' + fileList[current] + '...');
            const img = new Image()
            img.src = fileList[ current ];
            (function (id) {
                img.onload = function (e) {
                    if ( typeof imageLoadCallback === 'function' ) imageLoadCallback({
                        id: id,
                        img: img,
                        count: ++count,
                        total: fileList.length
                    })
                    if ( count < fileList.length ) {
                        loadNext()
                    }
                    if ( count == fileList.length ) {
                        if ( typeof queueCompleteCallbak === 'function' ) queueCompleteCallbak({
                            total: fileList.length
                        })
                    }
                }
                img.onerror = function (e) {
                    console.error('Error with: ' + fileList[ id ])
                }
            })(current)
            arrayToPopulate.push(img)
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
            let currentFrame = Math.round(this.progress() * (sequencer.images.length - 1))
            sequencer.scrollDrawImage(currentFrame)
        })
    }
}))

