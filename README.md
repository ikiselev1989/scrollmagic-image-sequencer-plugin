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

let sequencer = scene.addImageSequencer({
                    canvas: document.querySelector('#canvas'), // canvas node
                    from: '/path/to/first-frame.jpg',
                    to: '/path/to/last-frame.jpg',
                })

scene.addTo(controller)

// Methods
sequencer.stopDrawing()
sequencer.resumeDrawing()
```

## Options
```javascript
{
    canvas: null,                               // canvas node
    from: '',                                   // path to first frame
    to: '',                                     // path to last frame
    scaleMode: 'cover',                         // as in CSS3, can be: auto, cover, contain
    hiDPI: true,
    asyncLoader: false,                         // async frame loader by scene progress
    initFrameDraw: true,                        // drawing frame after sequencer init
    scrollEasing: 500,                          // easing for smooth scrolling ( ms )
    totalLoadCallback: () => {},                // callback after loading all frames
    imageLoadCallback: ({ img, frame }) => {}   // callback after loading each frame
}
```
> Based on [Andreas Gysin Sequencer](https://github.com/ertdfgcvb/Sequencer)

## Changes
#### 2.4.0
* Update frame render algorithm

2.3.0
* Fixed image render (60fps!)
* Added "scrollEasing" option
* Deprecated "fps" & "timeDeltaFactor" options

2.2.0
* Added public methods

2.1.0
* Added initFrameDraw options

2.0.0
* Added true fps image render
* Fixed async loader
* Added callback after loading
* ... a lot of code refactoring
