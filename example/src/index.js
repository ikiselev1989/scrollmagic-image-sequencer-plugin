import ScrollMagic from 'ScrollMagic'
import '../../index.min'

let controller  = new ScrollMagic.Controller()
let sceneCanvas = new ScrollMagic.Scene({
    triggerHook: 1
})

let sceneImage = new ScrollMagic.Scene({
    triggerHook: 1
})

document.querySelector('canvas').width  = innerWidth / 2
document.querySelector('canvas').height = innerHeight / 2

sceneCanvas.addImageSequencer({
    canvas: document.querySelector('canvas'),
    from: './images/Aaron_Kyro_001.jpg',
    to: './images/Aaron_Kyro_503.jpg'
})

sceneImage.addImageSequencer({
    canvas: document.querySelector('img'),
    from: './images/Aaron_Kyro_001.jpg',
    to: './images/Aaron_Kyro_503.jpg'
})

sceneCanvas.addTo(controller)
sceneImage.addTo(controller)
