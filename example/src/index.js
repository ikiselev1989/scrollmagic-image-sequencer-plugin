import ScrollMagic from 'ScrollMagic'
import '../../index.min'

let controller = new ScrollMagic.Controller()
let scene = new ScrollMagic.Scene({
    duration: '1509%',
    triggerHook: 1
})

document.querySelector('canvas').width = innerWidth / 2
document.querySelector('canvas').height = innerHeight / 2

window.sequenser = scene.addImageSequencer({
    canvas: document.querySelector('canvas'),
    from: './images/Aaron_Kyro_001.jpg',
    to: './images/Aaron_Kyro_503.jpg'
})

scene.addTo(controller)
