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
    canvas: null,                               // canvas node
    from: '',                                   // path to first frame
    to: '',                                     // path to last frame
    scaleMode: 'cover',                         // as in CSS3, can be: auto, cover, contain
    hiDPI: true,
    asyncLoader: false,                         // async frame loader by scene progress
    initFrameDraw: true,                        // drawing frame after sequencer init
    scrollEasing: 500,                          // easing for smooth scrolling ( ms )
    scrollBehaviorSmooth: true,                 // if "false" drawing request frame if progress diff>10%
    totalLoadCallback: () => {},                // callback after loading all frames
    imageLoadCallback: ({ img, frame }) => {}   // callback after loading each frame
}
```
> Based on [Andreas Gysin Sequencer](https://github.com/ertdfgcvb/Sequencer)

### Changes
**2.4.4**<br/>
Added **scrollBehaviorSmooth** option

**2.4.3**<br/>
Added **resize** public method

**2.4.2**<br/>
Fixed **initFrameDraw** option`s bugs
