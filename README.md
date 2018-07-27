# scrollmagic-image-sequencer-plugin
Progress-sync image sequencer for Scrollmagic Scene


## Usage
* install Scrollmagic
```
npm i --save scrollmagic
```
* instal image sequencer plugin
```
npm i --save scrollmagic-sequencer
```
* import modules
```javascript
import ScrollMagic from 'scrollmagic'
import 'scrollmagic-sequencer'
```

* add sequencer for scene
```javascript
let controller = new ScrollMagic.Controller()

let scene = new ScrollMagic.Scene()

scene.addImageSequencer({
    canvas: document.querySelector('#canvas'), // canvas node
    from: '/path/to/first-frame.jpg',
    to: '/path/to/last-frame.jpg',
})

scene.addTo(controller)
```

## Options
```javascript
{
  canvas: null,             // canvas node
  from: '',                 // path to first frame
  to: '',                   // path to last frame
  scaleMode: 'cover',       // as in CSS3, can be: auto, cover, contain
  hiDPI: true,
  progressiveLoader: true,  // use the progressive loading mode
  preloadFrameCount: 100    // number of frames for preloading ( for all loading mode )
}
```
> Based on [Andreas Gysin Sequencer](https://github.com/ertdfgcvb/Sequencer)

## Changes
* 1.5.0 Created progressive loader ( will load by request frame and some frame before and after it ) <br>
        removed bug with drawing the first frame
* 1.4.0 Add iterative way load image (each 16, 8, 4 and etc.)
