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
    canvas: null,                               // canvas node
    from: '',                                   // path to first frame
    to: '',                                     // path to last frame
    scaleMode: 'cover',                         // as in CSS3, can be: auto, cover, contain
    hiDPI: true,
    asyncLoader: false,                         // async frame loader by scene progress
    fps: 60,
    timeDeltaFactor: 5,                         // time compensation factor
    totalLoadCallback: () => {},                // callback after loading all frames
    imageLoadCallback: ({ img, frame }) => {}   // callback after loading each frame
}
```
> Based on [Andreas Gysin Sequencer](https://github.com/ertdfgcvb/Sequencer)

## Changes
##### 2.0.0
* Added true fps image render,<br/>
* Fixed async loader
* Added callback after loading
* ... a lot of code refactoring
