import ScrollMagic from 'ScrollMagic'
import '../../index.min'

let controller = new ScrollMagic.Controller()
let scene      = new ScrollMagic.Scene({
    duration: '972%',
    triggerHook: 1
})

document.querySelector('canvas').width  = innerWidth / 2
document.querySelector('canvas').height = innerHeight / 2

window.sequenser = scene.addImageSequencer({
    canvas: document.querySelector('canvas'),
    from: './images/animatic/animatic_001.jpg',
    to: './images/animatic/animatic_486.jpg'
})

scene.addTo(controller)
