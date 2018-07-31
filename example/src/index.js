import ScrollMagic from 'ScrollMagic'
import '../../index.min'

let controller = new ScrollMagic.Controller()
let scene = new ScrollMagic.Scene({
    duration: '2000%',
    triggerHook: 1
})

scene.addImageSequencer({
    canvas: document.querySelector('canvas'),
    from: './images/Aaron_Kyro_001.jpg',
    to: './images/Aaron_Kyro_503.jpg',
    progressiveLoader: true,
    preloadFrameCount: 100,
    smoothFrameChange: true
})

scene.addTo(controller)
