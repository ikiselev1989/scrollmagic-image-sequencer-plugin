# scrollmagic-image-sequencer-plugin
Progress-sync image sequencer for Scrollmagic Scene


### Usage
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
sequencer.resize(width, height)
```

### Options
```javascript
{
    canvas: null,                               // canvas node ( canvas or img )
    canvasContext: 'auto',                      // can be: auto, webgl, 2d
    from: '',                                   // path to first frame
    to: '',                                     // path to last frame
    asyncLoader: false,                         // sequential loading of images ( false, true, number of
                                                   frames )
    scaleMode: 'cover',                         // as in CSS3, can be: auto, cover, contain
    framePosition: 'center center',             // x-axis: left, right, center; y-axis: top, bottom, center
    hiDPI: true,
    initFrameDraw: true,                        // drawing frame after sequencer init
    totalLoadCallback: () => {},                // callback after loading all frames
    imageLoadCallback: ({ img, frame }) => {}   // callback after loading each frame
}
```
> Based on [Andreas Gysin Sequencer](https://github.com/ertdfgcvb/Sequencer)

### Changes
**3.6.2**<br />
Fix *webgl* canvas context

**3.6.0**<br />
Add *canvasContext* option (yes, the plugin supports webgl now)