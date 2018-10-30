/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * ScrollMagic v2.0.6 (2018-10-08)
 * The javascript library for magical scroll interactions.
 * (c) 2018 Jan Paepke (@janpaepke)
 * Project Website: http://scrollmagic.io
 * 
 * @version 2.0.6
 * @license Dual licensed under MIT license and GPL.
 * @author Jan Paepke - e-mail@janpaepke.de
 *
 * @file ScrollMagic main library.
 */
/**
 * @namespace ScrollMagic
 */
(function (root, factory) {
	if (true) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser global
		root.ScrollMagic = factory();
	}
}(this, function () {
	"use strict";

	var ScrollMagic = function () {
		_util.log(2, '(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use \'new ScrollMagic.Controller()\' to create a new controller instance. Use \'new ScrollMagic.Scene()\' to instance a scene.');
	};

	ScrollMagic.version = "2.0.6";

	// TODO: temporary workaround for chrome's scroll jitter bug
	window.addEventListener("mousewheel", function () {});

	// global const
	var PIN_SPACER_ATTRIBUTE = "data-scrollmagic-pin-spacer";

	/**
	 * The main class that is needed once per scroll container.
	 *
	 * @class
	 *
	 * @example
	 * // basic initialization
	 * var controller = new ScrollMagic.Controller();
	 *
	 * // passing options
	 * var controller = new ScrollMagic.Controller({container: "#myContainer", loglevel: 3});
	 *
	 * @param {object} [options] - An object containing one or more options for the controller.
	 * @param {(string|object)} [options.container=window] - A selector, DOM object that references the main container for scrolling.
	 * @param {boolean} [options.vertical=true] - Sets the scroll mode to vertical (`true`) or horizontal (`false`) scrolling.
	 * @param {object} [options.globalSceneOptions={}] - These options will be passed to every Scene that is added to the controller using the addScene method. For more information on Scene options see {@link ScrollMagic.Scene}.
	 * @param {number} [options.loglevel=2] Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
	 ** `0` => silent
	 ** `1` => errors
	 ** `2` => errors, warnings
	 ** `3` => errors, warnings, debuginfo
	 * @param {boolean} [options.refreshInterval=100] - Some changes don't call events by default, like changing the container size or moving a scene trigger element.  
	 This interval polls these parameters to fire the necessary events.  
	 If you don't use custom containers, trigger elements or have static layouts, where the positions of the trigger elements don't change, you can set this to 0 disable interval checking and improve performance.
	 *
	 */
	ScrollMagic.Controller = function (options) {
/*
	 * ----------------------------------------------------------------
	 * settings
	 * ----------------------------------------------------------------
	 */
		var
		NAMESPACE = 'ScrollMagic.Controller',
			SCROLL_DIRECTION_FORWARD = 'FORWARD',
			SCROLL_DIRECTION_REVERSE = 'REVERSE',
			SCROLL_DIRECTION_PAUSED = 'PAUSED',
			DEFAULT_OPTIONS = CONTROLLER_OPTIONS.defaults;

/*
	 * ----------------------------------------------------------------
	 * private vars
	 * ----------------------------------------------------------------
	 */
		var
		Controller = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_sceneObjects = [],
			_updateScenesOnNextCycle = false,
			// can be boolean (true => all scenes) or an array of scenes to be updated
			_scrollPos = 0,
			_scrollDirection = SCROLL_DIRECTION_PAUSED,
			_isDocument = true,
			_viewPortSize = 0,
			_enabled = true,
			_updateTimeout, _refreshTimeout;

/*
	 * ----------------------------------------------------------------
	 * private functions
	 * ----------------------------------------------------------------
	 */

		/**
		 * Internal constructor function of the ScrollMagic Controller
		 * @private
		 */
		var construct = function () {
			for (var key in _options) {
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			_options.container = _util.get.elements(_options.container)[0];
			// check ScrollContainer
			if (!_options.container) {
				log(1, "ERROR creating object " + NAMESPACE + ": No valid scroll container supplied");
				throw NAMESPACE + " init failed."; // cancel
			}
			_isDocument = _options.container === window || _options.container === document.body || !document.body.contains(_options.container);
			// normalize to window
			if (_isDocument) {
				_options.container = window;
			}
			// update container size immediately
			_viewPortSize = getViewportSize();
			// set event handlers
			_options.container.addEventListener("resize", onChange);
			_options.container.addEventListener("scroll", onChange);

			var ri = parseInt(_options.refreshInterval, 10);
			_options.refreshInterval = _util.type.Number(ri) ? ri : DEFAULT_OPTIONS.refreshInterval;
			scheduleRefresh();

			log(3, "added new " + NAMESPACE + " controller (v" + ScrollMagic.version + ")");
		};

		/**
		 * Schedule the next execution of the refresh function
		 * @private
		 */
		var scheduleRefresh = function () {
			if (_options.refreshInterval > 0) {
				_refreshTimeout = window.setTimeout(refresh, _options.refreshInterval);
			}
		};

		/**
		 * Default function to get scroll pos - overwriteable using `Controller.scrollPos(newFunction)`
		 * @private
		 */
		var getScrollPos = function () {
			return _options.vertical ? _util.get.scrollTop(_options.container) : _util.get.scrollLeft(_options.container);
		};

		/**
		 * Returns the current viewport Size (width vor horizontal, height for vertical)
		 * @private
		 */
		var getViewportSize = function () {
			return _options.vertical ? _util.get.height(_options.container) : _util.get.width(_options.container);
		};

		/**
		 * Default function to set scroll pos - overwriteable using `Controller.scrollTo(newFunction)`
		 * Make available publicly for pinned mousewheel workaround.
		 * @private
		 */
		var setScrollPos = this._setScrollPos = function (pos) {
			if (_options.vertical) {
				if (_isDocument) {
					window.scrollTo(_util.get.scrollLeft(), pos);
				} else {
					_options.container.scrollTop = pos;
				}
			} else {
				if (_isDocument) {
					window.scrollTo(pos, _util.get.scrollTop());
				} else {
					_options.container.scrollLeft = pos;
				}
			}
		};

		/**
		 * Handle updates in cycles instead of on scroll (performance)
		 * @private
		 */
		var updateScenes = function () {
			if (_enabled && _updateScenesOnNextCycle) {
				// determine scenes to update
				var scenesToUpdate = _util.type.Array(_updateScenesOnNextCycle) ? _updateScenesOnNextCycle : _sceneObjects.slice(0);
				// reset scenes
				_updateScenesOnNextCycle = false;
				var oldScrollPos = _scrollPos;
				// update scroll pos now instead of onChange, as it might have changed since scheduling (i.e. in-browser smooth scroll)
				_scrollPos = Controller.scrollPos();
				var deltaScroll = _scrollPos - oldScrollPos;
				if (deltaScroll !== 0) { // scroll position changed?
					_scrollDirection = (deltaScroll > 0) ? SCROLL_DIRECTION_FORWARD : SCROLL_DIRECTION_REVERSE;
				}
				// reverse order of scenes if scrolling reverse
				if (_scrollDirection === SCROLL_DIRECTION_REVERSE) {
					scenesToUpdate.reverse();
				}
				// update scenes
				scenesToUpdate.forEach(function (scene, index) {
					log(3, "updating Scene " + (index + 1) + "/" + scenesToUpdate.length + " (" + _sceneObjects.length + " total)");
					scene.update(true);
				});
				if (scenesToUpdate.length === 0 && _options.loglevel >= 3) {
					log(3, "updating 0 Scenes (nothing added to controller)");
				}
			}
		};

		/**
		 * Initializes rAF callback
		 * @private
		 */
		var debounceUpdate = function () {
			_updateTimeout = _util.rAF(updateScenes);
		};

		/**
		 * Handles Container changes
		 * @private
		 */
		var onChange = function (e) {
			log(3, "event fired causing an update:", e.type);
			if (e.type == "resize") {
				// resize
				_viewPortSize = getViewportSize();
				_scrollDirection = SCROLL_DIRECTION_PAUSED;
			}
			// schedule update
			if (_updateScenesOnNextCycle !== true) {
				_updateScenesOnNextCycle = true;
				debounceUpdate();
			}
		};

		var refresh = function () {
			if (!_isDocument) {
				// simulate resize event. Only works for viewport relevant param (performance)
				if (_viewPortSize != getViewportSize()) {
					var resizeEvent;
					try {
						resizeEvent = new Event('resize', {
							bubbles: false,
							cancelable: false
						});
					} catch (e) { // stupid IE
						resizeEvent = document.createEvent("Event");
						resizeEvent.initEvent("resize", false, false);
					}
					_options.container.dispatchEvent(resizeEvent);
				}
			}
			_sceneObjects.forEach(function (scene, index) { // refresh all scenes
				scene.refresh();
			});
			scheduleRefresh();
		};

		/**
		 * Send a debug message to the console.
		 * provided publicly with _log for plugins
		 * @private
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */
		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};
		// for scenes we have getters for each option, but for the controller we don't, so we need to make it available externally for plugins
		this._options = _options;

		/**
		 * Sort scenes in ascending order of their start offset.
		 * @private
		 *
		 * @param {array} ScenesArray - an array of ScrollMagic Scenes that should be sorted
		 * @return {array} The sorted array of Scenes.
		 */
		var sortScenes = function (ScenesArray) {
			if (ScenesArray.length <= 1) {
				return ScenesArray;
			} else {
				var scenes = ScenesArray.slice(0);
				scenes.sort(function (a, b) {
					return a.scrollOffset() > b.scrollOffset() ? 1 : -1;
				});
				return scenes;
			}
		};

		/**
		 * ----------------------------------------------------------------
		 * public functions
		 * ----------------------------------------------------------------
		 */

		/**
		 * Add one ore more scene(s) to the controller.  
		 * This is the equivalent to `Scene.addTo(controller)`.
		 * @public
		 * @example
		 * // with a previously defined scene
		 * controller.addScene(scene);
		 *
		 * // with a newly created scene.
		 * controller.addScene(new ScrollMagic.Scene({duration : 0}));
		 *
		 * // adding multiple scenes
		 * controller.addScene([scene, scene2, new ScrollMagic.Scene({duration : 0})]);
		 *
		 * @param {(ScrollMagic.Scene|array)} newScene - ScrollMagic Scene or Array of Scenes to be added to the controller.
		 * @return {Controller} Parent object for chaining.
		 */
		this.addScene = function (newScene) {
			if (_util.type.Array(newScene)) {
				newScene.forEach(function (scene, index) {
					Controller.addScene(scene);
				});
			} else if (newScene instanceof ScrollMagic.Scene) {
				if (newScene.controller() !== Controller) {
					newScene.addTo(Controller);
				} else if (_sceneObjects.indexOf(newScene) < 0) {
					// new scene
					_sceneObjects.push(newScene); // add to array
					_sceneObjects = sortScenes(_sceneObjects); // sort
					newScene.on("shift.controller_sort", function () { // resort whenever scene moves
						_sceneObjects = sortScenes(_sceneObjects);
					});
					// insert Global defaults.
					for (var key in _options.globalSceneOptions) {
						if (newScene[key]) {
							newScene[key].call(newScene, _options.globalSceneOptions[key]);
						}
					}
					log(3, "adding Scene (now " + _sceneObjects.length + " total)");
				}
			} else {
				log(1, "ERROR: invalid argument supplied for '.addScene()'");
			}
			return Controller;
		};

		/**
		 * Remove one ore more scene(s) from the controller.  
		 * This is the equivalent to `Scene.remove()`.
		 * @public
		 * @example
		 * // remove a scene from the controller
		 * controller.removeScene(scene);
		 *
		 * // remove multiple scenes from the controller
		 * controller.removeScene([scene, scene2, scene3]);
		 *
		 * @param {(ScrollMagic.Scene|array)} Scene - ScrollMagic Scene or Array of Scenes to be removed from the controller.
		 * @returns {Controller} Parent object for chaining.
		 */
		this.removeScene = function (Scene) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.removeScene(scene);
				});
			} else {
				var index = _sceneObjects.indexOf(Scene);
				if (index > -1) {
					Scene.off("shift.controller_sort");
					_sceneObjects.splice(index, 1);
					log(3, "removing Scene (now " + _sceneObjects.length + " left)");
					Scene.remove();
				}
			}
			return Controller;
		};

		/**
		 * Update one ore more scene(s) according to the scroll position of the container.  
		 * This is the equivalent to `Scene.update()`.  
		 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
		 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.  
		 * _**Note:** This method gets called constantly whenever Controller detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
		 * @public
		 * @example
		 * // update a specific scene on next cycle
		 * controller.updateScene(scene);
		 *
		 * // update a specific scene immediately
		 * controller.updateScene(scene, true);
		 *
		 * // update multiple scenes scene on next cycle
		 * controller.updateScene([scene1, scene2, scene3]);
		 *
		 * @param {ScrollMagic.Scene} Scene - ScrollMagic Scene or Array of Scenes that is/are supposed to be updated.
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle.  
		 This is useful when changing multiple properties of the scene - this way it will only be updated once all new properties are set (updateScenes).
		 * @return {Controller} Parent object for chaining.
		 */
		this.updateScene = function (Scene, immediately) {
			if (_util.type.Array(Scene)) {
				Scene.forEach(function (scene, index) {
					Controller.updateScene(scene, immediately);
				});
			} else {
				if (immediately) {
					Scene.update(true);
				} else if (_updateScenesOnNextCycle !== true && Scene instanceof ScrollMagic.Scene) { // if _updateScenesOnNextCycle is true, all connected scenes are already scheduled for update
					// prep array for next update cycle
					_updateScenesOnNextCycle = _updateScenesOnNextCycle || [];
					if (_updateScenesOnNextCycle.indexOf(Scene) == -1) {
						_updateScenesOnNextCycle.push(Scene);
					}
					_updateScenesOnNextCycle = sortScenes(_updateScenesOnNextCycle); // sort
					debounceUpdate();
				}
			}
			return Controller;
		};

		/**
		 * Updates the controller params and calls updateScene on every scene, that is attached to the controller.  
		 * See `Controller.updateScene()` for more information about what this means.  
		 * In most cases you will not need this function, as it is called constantly, whenever ScrollMagic detects a state change event, like resize or scroll.  
		 * The only application for this method is when ScrollMagic fails to detect these events.  
		 * One application is with some external scroll libraries (like iScroll) that move an internal container to a negative offset instead of actually scrolling. In this case the update on the controller needs to be called whenever the child container's position changes.
		 * For this case there will also be the need to provide a custom function to calculate the correct scroll position. See `Controller.scrollPos()` for details.
		 * @public
		 * @example
		 * // update the controller on next cycle (saves performance due to elimination of redundant updates)
		 * controller.update();
		 *
		 * // update the controller immediately
		 * controller.update(true);
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance)
		 * @return {Controller} Parent object for chaining.
		 */
		this.update = function (immediately) {
			onChange({
				type: "resize"
			}); // will update size and set _updateScenesOnNextCycle to true
			if (immediately) {
				updateScenes();
			}
			return Controller;
		};

		/**
		 * Scroll to a numeric scroll offset, a DOM element, the start of a scene or provide an alternate method for scrolling.  
		 * For vertical controllers it will change the top scroll offset and for horizontal applications it will change the left offset.
		 * @public
		 *
		 * @since 1.1.0
		 * @example
		 * // scroll to an offset of 100
		 * controller.scrollTo(100);
		 *
		 * // scroll to a DOM element
		 * controller.scrollTo("#anchor");
		 *
		 * // scroll to the beginning of a scene
		 * var scene = new ScrollMagic.Scene({offset: 200});
		 * controller.scrollTo(scene);
		 *
		 * // define a new scroll position modification function (jQuery animate instead of jump)
		 * controller.scrollTo(function (newScrollPos) {
		 *	$("html, body").animate({scrollTop: newScrollPos});
		 * });
		 * controller.scrollTo(100); // call as usual, but the new function will be used instead
		 *
		 * // define a new scroll function with an additional parameter
		 * controller.scrollTo(function (newScrollPos, message) {
		 *  console.log(message);
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter to the defined custom function
		 * controller.scrollTo(100, "my message");
		 *
		 * // define a new scroll function with an additional parameter containing multiple variables
		 * controller.scrollTo(function (newScrollPos, options) {
		 *  someGlobalVar = options.a + options.b;
		 *	$(this).animate({scrollTop: newScrollPos});
		 * });
		 * // call as usual, but supply an extra parameter containing multiple options
		 * controller.scrollTo(100, {a: 1, b: 2});
		 *
		 * // define a new scroll function with a callback supplied as an additional parameter
		 * controller.scrollTo(function (newScrollPos, callback) {
		 *	$(this).animate({scrollTop: newScrollPos}, 400, "swing", callback);
		 * });
		 * // call as usual, but supply an extra parameter, which is used as a callback in the previously defined custom scroll function
		 * controller.scrollTo(100, function() {
		 *	console.log("scroll has finished.");
		 * });
		 *
		 * @param {mixed} scrollTarget - The supplied argument can be one of these types:
		 * 1. `number` -> The container will scroll to this new scroll offset.
		 * 2. `string` or `object` -> Can be a selector or a DOM object.  
		 *  The container will scroll to the position of this element.
		 * 3. `ScrollMagic Scene` -> The container will scroll to the start of this scene.
		 * 4. `function` -> This function will be used for future scroll position modifications.  
		 *  This provides a way for you to change the behaviour of scrolling and adding new behaviour like animation. The function receives the new scroll position as a parameter and a reference to the container element using `this`.  
		 *  It may also optionally receive an optional additional parameter (see below)  
		 *  _**NOTE:**  
		 *  All other options will still work as expected, using the new function to scroll._
		 * @param {mixed} [additionalParameter] - If a custom scroll function was defined (see above 4.), you may want to supply additional parameters to it, when calling it. You can do this using this parameter – see examples for details. Please note, that this parameter will have no effect, if you use the default scrolling function.
		 * @returns {Controller} Parent object for chaining.
		 */
		this.scrollTo = function (scrollTarget, additionalParameter) {
			if (_util.type.Number(scrollTarget)) { // excecute
				setScrollPos.call(_options.container, scrollTarget, additionalParameter);
			} else if (scrollTarget instanceof ScrollMagic.Scene) { // scroll to scene
				if (scrollTarget.controller() === Controller) { // check if the controller is associated with this scene
					Controller.scrollTo(scrollTarget.scrollOffset(), additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", scrollTarget);
				}
			} else if (_util.type.Function(scrollTarget)) { // assign new scroll function
				setScrollPos = scrollTarget;
			} else { // scroll to element
				var elem = _util.get.elements(scrollTarget)[0];
				if (elem) {
					// if parent is pin spacer, use spacer position instead so correct start position is returned for pinned elements.
					while (elem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
						elem = elem.parentNode;
					}

					var
					param = _options.vertical ? "top" : "left",
						// which param is of interest ?
						containerOffset = _util.get.offset(_options.container),
						// container position is needed because element offset is returned in relation to document, not in relation to container.
						elementOffset = _util.get.offset(elem);

					if (!_isDocument) { // container is not the document root, so substract scroll Position to get correct trigger element position relative to scrollcontent
						containerOffset[param] -= Controller.scrollPos();
					}

					Controller.scrollTo(elementOffset[param] - containerOffset[param], additionalParameter);
				} else {
					log(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", scrollTarget);
				}
			}
			return Controller;
		};

		/**
		 * **Get** the current scrollPosition or **Set** a new method to calculate it.  
		 * -> **GET**:
		 * When used as a getter this function will return the current scroll position.  
		 * To get a cached value use Controller.info("scrollPos"), which will be updated in the update cycle.  
		 * For vertical controllers it will return the top scroll offset and for horizontal applications it will return the left offset.
		 *
		 * -> **SET**:
		 * When used as a setter this method prodes a way to permanently overwrite the controller's scroll position calculation.  
		 * A typical usecase is when the scroll position is not reflected by the containers scrollTop or scrollLeft values, but for example by the inner offset of a child container.  
		 * Moving a child container inside a parent is a commonly used method for several scrolling frameworks, including iScroll.  
		 * By providing an alternate calculation function you can make sure ScrollMagic receives the correct scroll position.  
		 * Please also bear in mind that your function should return y values for vertical scrolls an x for horizontals.
		 *
		 * To change the current scroll position please use `Controller.scrollTo()`.
		 * @public
		 *
		 * @example
		 * // get the current scroll Position
		 * var scrollPos = controller.scrollPos();
		 *
		 * // set a new scroll position calculation method
		 * controller.scrollPos(function () {
		 *	return this.info("vertical") ? -mychildcontainer.y : -mychildcontainer.x
		 * });
		 *
		 * @param {function} [scrollPosMethod] - The function to be used for the scroll position calculation of the container.
		 * @returns {(number|Controller)} Current scroll position or parent object for chaining.
		 */
		this.scrollPos = function (scrollPosMethod) {
			if (!arguments.length) { // get
				return getScrollPos.call(Controller);
			} else { // set
				if (_util.type.Function(scrollPosMethod)) {
					getScrollPos = scrollPosMethod;
				} else {
					log(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'.");
				}
			}
			return Controller;
		};

		/**
		 * **Get** all infos or one in particular about the controller.
		 * @public
		 * @example
		 * // returns the current scroll position (number)
		 * var scrollPos = controller.info("scrollPos");
		 *
		 * // returns all infos as an object
		 * var infos = controller.info();
		 *
		 * @param {string} [about] - If passed only this info will be returned instead of an object containing all.  
		 Valid options are:
		 ** `"size"` => the current viewport size of the container
		 ** `"vertical"` => true if vertical scrolling, otherwise false
		 ** `"scrollPos"` => the current scroll position
		 ** `"scrollDirection"` => the last known direction of the scroll
		 ** `"container"` => the container element
		 ** `"isDocument"` => true if container element is the document.
		 * @returns {(mixed|object)} The requested info(s).
		 */
		this.info = function (about) {
			var values = {
				size: _viewPortSize,
				// contains height or width (in regard to orientation);
				vertical: _options.vertical,
				scrollPos: _scrollPos,
				scrollDirection: _scrollDirection,
				container: _options.container,
				isDocument: _isDocument
			};
			if (!arguments.length) { // get all as an object
				return values;
			} else if (values[about] !== undefined) {
				return values[about];
			} else {
				log(1, "ERROR: option \"" + about + "\" is not available");
				return;
			}
		};

		/**
		 * **Get** or **Set** the current loglevel option value.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var loglevel = controller.loglevel();
		 *
		 * // set a new value
		 * controller.loglevel(3);
		 *
		 * @param {number} [newLoglevel] - The new loglevel setting of the Controller. `[0-3]`
		 * @returns {(number|Controller)} Current loglevel or parent object for chaining.
		 */
		this.loglevel = function (newLoglevel) {
			if (!arguments.length) { // get
				return _options.loglevel;
			} else if (_options.loglevel != newLoglevel) { // set
				_options.loglevel = newLoglevel;
			}
			return Controller;
		};

		/**
		 * **Get** or **Set** the current enabled state of the controller.  
		 * This can be used to disable all Scenes connected to the controller without destroying or removing them.
		 * @public
		 *
		 * @example
		 * // get the current value
		 * var enabled = controller.enabled();
		 *
		 * // disable the controller
		 * controller.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the controller `true` or `false`.
		 * @returns {(boolean|Controller)} Current enabled state or parent object for chaining.
		 */
		this.enabled = function (newState) {
			if (!arguments.length) { // get
				return _enabled;
			} else if (_enabled != newState) { // set
				_enabled = !! newState;
				Controller.updateScene(_sceneObjects, true);
			}
			return Controller;
		};

		/**
		 * Destroy the Controller, all Scenes and everything.
		 * @public
		 *
		 * @example
		 * // without resetting the scenes
		 * controller = controller.destroy();
		 *
		 * // with scene reset
		 * controller = controller.destroy(true);
		 *
		 * @param {boolean} [resetScenes=false] - If `true` the pins and tweens (if existent) of all scenes will be reset.
		 * @returns {null} Null to unset handler variables.
		 */
		this.destroy = function (resetScenes) {
			window.clearTimeout(_refreshTimeout);
			var i = _sceneObjects.length;
			while (i--) {
				_sceneObjects[i].destroy(resetScenes);
			}
			_options.container.removeEventListener("resize", onChange);
			_options.container.removeEventListener("scroll", onChange);
			_util.cAF(_updateTimeout);
			log(3, "destroyed " + NAMESPACE + " (reset: " + (resetScenes ? "true" : "false") + ")");
			return null;
		};

		// INIT
		construct();
		return Controller;
	};

	// store pagewide controller options
	var CONTROLLER_OPTIONS = {
		defaults: {
			container: window,
			vertical: true,
			globalSceneOptions: {},
			loglevel: 2,
			refreshInterval: 100
		}
	};
/*
 * method used to add an option to ScrollMagic Scenes.
 */
	ScrollMagic.Controller.addOption = function (name, defaultValue) {
		CONTROLLER_OPTIONS.defaults[name] = defaultValue;
	};
	// instance extension function for plugins
	ScrollMagic.Controller.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Controller = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); // copy parent state
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Controller, oldClass); // copy properties
		ScrollMagic.Controller.prototype = oldClass.prototype; // copy prototype
		ScrollMagic.Controller.prototype.constructor = ScrollMagic.Controller; // restore constructor
	};


	/**
	 * A Scene defines where the controller should react and how.
	 *
	 * @class
	 *
	 * @example
	 * // create a standard scene and add it to a controller
	 * new ScrollMagic.Scene()
	 *		.addTo(controller);
	 *
	 * // create a scene with custom options and assign a handler to it.
	 * var scene = new ScrollMagic.Scene({
	 * 		duration: 100,
	 *		offset: 200,
	 *		triggerHook: "onEnter",
	 *		reverse: false
	 * });
	 *
	 * @param {object} [options] - Options for the Scene. The options can be updated at any time.  
	 Instead of setting the options for each scene individually you can also set them globally in the controller as the controllers `globalSceneOptions` option. The object accepts the same properties as the ones below.  
	 When a scene is added to the controller the options defined using the Scene constructor will be overwritten by those set in `globalSceneOptions`.
	 * @param {(number|function)} [options.duration=0] - The duration of the scene. 
	 If `0` tweens will auto-play when reaching the scene start point, pins will be pinned indefinetly starting at the start position.  
	 A function retuning the duration value is also supported. Please see `Scene.duration()` for details.
	 * @param {number} [options.offset=0] - Offset Value for the Trigger Position. If no triggerElement is defined this will be the scroll distance from the start of the page, after which the scene will start.
	 * @param {(string|object)} [options.triggerElement=null] - Selector or DOM object that defines the start of the scene. If undefined the scene will start right at the start of the page (unless an offset is set).
	 * @param {(number|string)} [options.triggerHook="onCenter"] - Can be a number between 0 and 1 defining the position of the trigger Hook in relation to the viewport.  
	 Can also be defined using a string:
	 ** `"onEnter"` => `1`
	 ** `"onCenter"` => `0.5`
	 ** `"onLeave"` => `0`
	 * @param {boolean} [options.reverse=true] - Should the scene reverse, when scrolling up?
	 * @param {number} [options.loglevel=2] - Loglevel for debugging. Note that logging is disabled in the minified version of ScrollMagic.
	 ** `0` => silent
	 ** `1` => errors
	 ** `2` => errors, warnings
	 ** `3` => errors, warnings, debuginfo
	 * 
	 */
	ScrollMagic.Scene = function (options) {

/*
	 * ----------------------------------------------------------------
	 * settings
	 * ----------------------------------------------------------------
	 */

		var
		NAMESPACE = 'ScrollMagic.Scene',
			SCENE_STATE_BEFORE = 'BEFORE',
			SCENE_STATE_DURING = 'DURING',
			SCENE_STATE_AFTER = 'AFTER',
			DEFAULT_OPTIONS = SCENE_OPTIONS.defaults;

/*
	 * ----------------------------------------------------------------
	 * private vars
	 * ----------------------------------------------------------------
	 */

		var
		Scene = this,
			_options = _util.extend({}, DEFAULT_OPTIONS, options),
			_state = SCENE_STATE_BEFORE,
			_progress = 0,
			_scrollOffset = {
				start: 0,
				end: 0
			},
			// reflects the controllers's scroll position for the start and end of the scene respectively
			_triggerPos = 0,
			_enabled = true,
			_durationUpdateMethod, _controller;

		/**
		 * Internal constructor function of the ScrollMagic Scene
		 * @private
		 */
		var construct = function () {
			for (var key in _options) { // check supplied options
				if (!DEFAULT_OPTIONS.hasOwnProperty(key)) {
					log(2, "WARNING: Unknown option \"" + key + "\"");
					delete _options[key];
				}
			}
			// add getters/setters for all possible options
			for (var optionName in DEFAULT_OPTIONS) {
				addSceneOption(optionName);
			}
			// validate all options
			validateOption();
		};

/*
 * ----------------------------------------------------------------
 * Event Management
 * ----------------------------------------------------------------
 */

		var _listeners = {};
		/**
		 * Scene start event.  
		 * Fires whenever the scroll position its the starting point of the scene.  
		 * It will also fire when scrolling back up going over the start position of the scene. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#start
		 *
		 * @example
		 * scene.on("start", function (event) {
		 * 	console.log("Hit start point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene end event.  
		 * Fires whenever the scroll position its the ending point of the scene.  
		 * It will also fire when scrolling back up from after the scene and going over its end position. If you want something to happen only when scrolling down/right, use the scrollDirection parameter passed to the callback.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#end
		 *
		 * @example
		 * scene.on("end", function (event) {
		 * 	console.log("Hit end point of scene.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene enter event.  
		 * Fires whenever the scene enters the "DURING" state.  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene enters its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#enter
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 * 	console.log("Scene entered.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene - always `"DURING"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene leave event.  
		 * Fires whenever the scene's state goes from "DURING" to either "BEFORE" or "AFTER".  
		 * Keep in mind that it doesn't matter if the scene plays forward or backward: This event always fires when the scene leaves its active scroll timeframe, regardless of the scroll-direction.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#leave
		 *
		 * @example
		 * scene.on("leave", function (event) {
		 * 	console.log("Scene left.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene update event.  
		 * Fires whenever the scene is updated (but not necessarily changes the progress).
		 *
		 * @event ScrollMagic.Scene#update
		 *
		 * @example
		 * scene.on("update", function (event) {
		 * 	console.log("Scene updated.");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.startPos - The starting position of the scene (in relation to the conainer)
		 * @property {number} event.endPos - The ending position of the scene (in relation to the conainer)
		 * @property {number} event.scrollPos - The current scroll position of the container
		 */
		/**
		 * Scene progress event.  
		 * Fires whenever the progress of the scene changes.
		 *
		 * For details on this event and the order in which it is fired, please review the {@link Scene.progress} method.
		 *
		 * @event ScrollMagic.Scene#progress
		 *
		 * @example
		 * scene.on("progress", function (event) {
		 * 	console.log("Scene progress changed to " + event.progress);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {number} event.progress - Reflects the current progress of the scene
		 * @property {string} event.state - The current state of the scene `"BEFORE"`, `"DURING"` or `"AFTER"`
		 * @property {string} event.scrollDirection - Indicates which way we are scrolling `"PAUSED"`, `"FORWARD"` or `"REVERSE"`
		 */
		/**
		 * Scene change event.  
		 * Fires whenvever a property of the scene is changed.
		 *
		 * @event ScrollMagic.Scene#change
		 *
		 * @example
		 * scene.on("change", function (event) {
		 * 	console.log("Scene Property \"" + event.what + "\" changed to " + event.newval);
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.what - Indicates what value has been changed
		 * @property {mixed} event.newval - The new value of the changed property
		 */
		/**
		 * Scene shift event.  
		 * Fires whenvever the start or end **scroll offset** of the scene change.
		 * This happens explicitely, when one of these values change: `offset`, `duration` or `triggerHook`.
		 * It will fire implicitly when the `triggerElement` changes, if the new element has a different position (most cases).
		 * It will also fire implicitly when the size of the container changes and the triggerHook is anything other than `onLeave`.
		 *
		 * @event ScrollMagic.Scene#shift
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("shift", function (event) {
		 * 	console.log("Scene moved, because the " + event.reason + " has changed.)");
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {string} event.reason - Indicates why the scene has shifted
		 */
		/**
		 * Scene destroy event.  
		 * Fires whenvever the scene is destroyed.
		 * This can be used to tidy up custom behaviour used in events.
		 *
		 * @event ScrollMagic.Scene#destroy
		 * @since 1.1.0
		 *
		 * @example
		 * scene.on("enter", function (event) {
		 *        // add custom action
		 *        $("#my-elem").left("200");
		 *      })
		 *      .on("destroy", function (event) {
		 *        // reset my element to start position
		 *        if (event.reset) {
		 *          $("#my-elem").left("0");
		 *        }
		 *      });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.reset - Indicates if the destroy method was called with reset `true` or `false`.
		 */
		/**
		 * Scene add event.  
		 * Fires when the scene is added to a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#add
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("add", function (event) {
		 * 	console.log('Scene was added to a new controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 * @property {boolean} event.controller - The controller object the scene was added to.
		 */
		/**
		 * Scene remove event.  
		 * Fires when the scene is removed from a controller.
		 * This is mostly used by plugins to know that change might be due.
		 *
		 * @event ScrollMagic.Scene#remove
		 * @since 2.0.0
		 *
		 * @example
		 * scene.on("remove", function (event) {
		 * 	console.log('Scene was removed from its controller.');
		 * });
		 *
		 * @property {object} event - The event Object passed to each callback
		 * @property {string} event.type - The name of the event
		 * @property {Scene} event.target - The Scene object that triggered this event
		 */

		/**
		 * Add one ore more event listener.  
		 * The callback function will be fired at the respective event, and an object containing relevant data will be passed to the callback.
		 * @method ScrollMagic.Scene#on
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update progress start end enter leave", callback);
		 *
		 * @param {string} names - The name or names of the event the callback should be attached to.
		 * @param {function} callback - A function that should be executed, when the event is dispatched. An event object will be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.on = function (names, callback) {
			if (_util.type.Function(callback)) {
				names = names.trim().split(' ');
				names.forEach(function (fullname) {
					var
					nameparts = fullname.split('.'),
						eventname = nameparts[0],
						namespace = nameparts[1];
					if (eventname != "*") { // disallow wildcards
						if (!_listeners[eventname]) {
							_listeners[eventname] = [];
						}
						_listeners[eventname].push({
							namespace: namespace || '',
							callback: callback
						});
					}
				});
			} else {
				log(1, "ERROR when calling '.on()': Supplied callback for '" + names + "' is not a valid function!");
			}
			return Scene;
		};

		/**
		 * Remove one or more event listener.
		 * @method ScrollMagic.Scene#off
		 *
		 * @example
		 * function callback (event) {
		 * 		console.log("Event fired! (" + event.type + ")");
		 * }
		 * // add listeners
		 * scene.on("change update", callback);
		 * // remove listeners
		 * scene.off("change update", callback);
		 *
		 * @param {string} names - The name or names of the event that should be removed.
		 * @param {function} [callback] - A specific callback function that should be removed. If none is passed all callbacks to the event listener will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.off = function (names, callback) {
			if (!names) {
				log(1, "ERROR: Invalid event name supplied.");
				return Scene;
			}
			names = names.trim().split(' ');
			names.forEach(function (fullname, key) {
				var
				nameparts = fullname.split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1] || '',
					removeList = eventname === '*' ? Object.keys(_listeners) : [eventname];
				removeList.forEach(function (remove) {
					var
					list = _listeners[remove] || [],
						i = list.length;
					while (i--) {
						var listener = list[i];
						if (listener && (namespace === listener.namespace || namespace === '*') && (!callback || callback == listener.callback)) {
							list.splice(i, 1);
						}
					}
					if (!list.length) {
						delete _listeners[remove];
					}
				});
			});
			return Scene;
		};

		/**
		 * Trigger an event.
		 * @method ScrollMagic.Scene#trigger
		 *
		 * @example
		 * this.trigger("change");
		 *
		 * @param {string} name - The name of the event that should be triggered.
		 * @param {object} [vars] - An object containing info that should be passed to the callback.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.trigger = function (name, vars) {
			if (name) {
				var
				nameparts = name.trim().split('.'),
					eventname = nameparts[0],
					namespace = nameparts[1],
					listeners = _listeners[eventname];
				log(3, 'event fired:', eventname, vars ? "->" : '', vars || '');
				if (listeners) {
					listeners.forEach(function (listener, key) {
						if (!namespace || namespace === listener.namespace) {
							listener.callback.call(Scene, new ScrollMagic.Event(eventname, listener.namespace, Scene, vars));
						}
					});
				}
			} else {
				log(1, "ERROR: Invalid event name supplied.");
			}
			return Scene;
		};

		// set event listeners
		Scene.on("change.internal", function (e) {
			if (e.what !== "loglevel" && e.what !== "tweenChanges") { // no need for a scene update scene with these options...
				if (e.what === "triggerElement") {
					updateTriggerElementPosition();
				} else if (e.what === "reverse") { // the only property left that may have an impact on the current scene state. Everything else is handled by the shift event.
					Scene.update();
				}
			}
		}).on("shift.internal", function (e) {
			updateScrollOffset();
			Scene.update(); // update scene to reflect new position
		});

		/**
		 * Send a debug message to the console.
		 * @private
		 * but provided publicly with _log for plugins
		 *
		 * @param {number} loglevel - The loglevel required to initiate output for the message.
		 * @param {...mixed} output - One or more variables that should be passed to the console.
		 */
		var log = this._log = function (loglevel, output) {
			if (_options.loglevel >= loglevel) {
				Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ") ->");
				_util.log.apply(window, arguments);
			}
		};

		/**
		 * Add the scene to a controller.  
		 * This is the equivalent to `Controller.addScene(scene)`.
		 * @method ScrollMagic.Scene#addTo
		 *
		 * @example
		 * // add a scene to a ScrollMagic Controller
		 * scene.addTo(controller);
		 *
		 * @param {ScrollMagic.Controller} controller - The controller to which the scene should be added.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.addTo = function (controller) {
			if (!(controller instanceof ScrollMagic.Controller)) {
				log(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller");
			} else if (_controller != controller) {
				// new controller
				if (_controller) { // was associated to a different controller before, so remove it...
					_controller.removeScene(Scene);
				}
				_controller = controller;
				validateOption();
				updateDuration(true);
				updateTriggerElementPosition(true);
				updateScrollOffset();
				_controller.info("container").addEventListener('resize', onContainerResize);
				controller.addScene(Scene);
				Scene.trigger("add", {
					controller: _controller
				});
				log(3, "added " + NAMESPACE + " to controller");
				Scene.update();
			}
			return Scene;
		};

		/**
		 * **Get** or **Set** the current enabled state of the scene.  
		 * This can be used to disable this scene without removing or destroying it.
		 * @method ScrollMagic.Scene#enabled
		 *
		 * @example
		 * // get the current value
		 * var enabled = scene.enabled();
		 *
		 * // disable the scene
		 * scene.enabled(false);
		 *
		 * @param {boolean} [newState] - The new enabled state of the scene `true` or `false`.
		 * @returns {(boolean|Scene)} Current enabled state or parent object for chaining.
		 */
		this.enabled = function (newState) {
			if (!arguments.length) { // get
				return _enabled;
			} else if (_enabled != newState) { // set
				_enabled = !! newState;
				Scene.update(true);
			}
			return Scene;
		};

		/**
		 * Remove the scene from the controller.  
		 * This is the equivalent to `Controller.removeScene(scene)`.
		 * The scene will not be updated anymore until you readd it to a controller.
		 * To remove the pin or the tween you need to call removeTween() or removePin() respectively.
		 * @method ScrollMagic.Scene#remove
		 * @example
		 * // remove the scene from its controller
		 * scene.remove();
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.remove = function () {
			if (_controller) {
				_controller.info("container").removeEventListener('resize', onContainerResize);
				var tmpParent = _controller;
				_controller = undefined;
				tmpParent.removeScene(Scene);
				Scene.trigger("remove");
				log(3, "removed " + NAMESPACE + " from controller");
			}
			return Scene;
		};

		/**
		 * Destroy the scene and everything.
		 * @method ScrollMagic.Scene#destroy
		 * @example
		 * // destroy the scene without resetting the pin and tween to their initial positions
		 * scene = scene.destroy();
		 *
		 * // destroy the scene and reset the pin and tween
		 * scene = scene.destroy(true);
		 *
		 * @param {boolean} [reset=false] - If `true` the pin and tween (if existent) will be reset.
		 * @returns {null} Null to unset handler variables.
		 */
		this.destroy = function (reset) {
			Scene.trigger("destroy", {
				reset: reset
			});
			Scene.remove();
			Scene.off("*.*");
			log(3, "destroyed " + NAMESPACE + " (reset: " + (reset ? "true" : "false") + ")");
			return null;
		};


		/**
		 * Updates the Scene to reflect the current state.  
		 * This is the equivalent to `Controller.updateScene(scene, immediately)`.  
		 * The update method calculates the scene's start and end position (based on the trigger element, trigger hook, duration and offset) and checks it against the current scroll position of the container.  
		 * It then updates the current scene state accordingly (or does nothing, if the state is already correct) – Pins will be set to their correct position and tweens will be updated to their correct progress.
		 * This means an update doesn't necessarily result in a progress change. The `progress` event will be fired if the progress has indeed changed between this update and the last.  
		 * _**NOTE:** This method gets called constantly whenever ScrollMagic detects a change. The only application for you is if you change something outside of the realm of ScrollMagic, like moving the trigger or changing tween parameters._
		 * @method ScrollMagic.Scene#update
		 * @example
		 * // update the scene on next tick
		 * scene.update();
		 *
		 * // update the scene immediately
		 * scene.update(true);
		 *
		 * @fires Scene.update
		 *
		 * @param {boolean} [immediately=false] - If `true` the update will be instant, if `false` it will wait until next update cycle (better performance).
		 * @returns {Scene} Parent object for chaining.
		 */
		this.update = function (immediately) {
			if (_controller) {
				if (immediately) {
					if (_controller.enabled() && _enabled) {
						var
						scrollPos = _controller.info("scrollPos"),
							newProgress;

						if (_options.duration > 0) {
							newProgress = (scrollPos - _scrollOffset.start) / (_scrollOffset.end - _scrollOffset.start);
						} else {
							newProgress = scrollPos >= _scrollOffset.start ? 1 : 0;
						}

						Scene.trigger("update", {
							startPos: _scrollOffset.start,
							endPos: _scrollOffset.end,
							scrollPos: scrollPos
						});

						Scene.progress(newProgress);
					} else if (_pin && _state === SCENE_STATE_DURING) {
						updatePinState(true); // unpin in position
					}
				} else {
					_controller.updateScene(Scene, false);
				}
			}
			return Scene;
		};

		/**
		 * Updates dynamic scene variables like the trigger element position or the duration.
		 * This method is automatically called in regular intervals from the controller. See {@link ScrollMagic.Controller} option `refreshInterval`.
		 * 
		 * You can call it to minimize lag, for example when you intentionally change the position of the triggerElement.
		 * If you don't it will simply be updated in the next refresh interval of the container, which is usually sufficient.
		 *
		 * @method ScrollMagic.Scene#refresh
		 * @since 1.1.0
		 * @example
		 * scene = new ScrollMagic.Scene({triggerElement: "#trigger"});
		 * 
		 * // change the position of the trigger
		 * $("#trigger").css("top", 500);
		 * // immediately let the scene know of this change
		 * scene.refresh();
		 *
		 * @fires {@link Scene.shift}, if the trigger element position or the duration changed
		 * @fires {@link Scene.change}, if the duration changed
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.refresh = function () {
			updateDuration();
			updateTriggerElementPosition();
			// update trigger element position
			return Scene;
		};

		/**
		 * **Get** or **Set** the scene's progress.  
		 * Usually it shouldn't be necessary to use this as a setter, as it is set automatically by scene.update().  
		 * The order in which the events are fired depends on the duration of the scene:
		 *  1. Scenes with `duration == 0`:  
		 *  Scenes that have no duration by definition have no ending. Thus the `end` event will never be fired.  
		 *  When the trigger position of the scene is passed the events are always fired in this order:  
		 *  `enter`, `start`, `progress` when scrolling forward  
		 *  and  
		 *  `progress`, `start`, `leave` when scrolling in reverse
		 *  2. Scenes with `duration > 0`:  
		 *  Scenes with a set duration have a defined start and end point.  
		 *  When scrolling past the start position of the scene it will fire these events in this order:  
		 *  `enter`, `start`, `progress`  
		 *  When continuing to scroll and passing the end point it will fire these events:  
		 *  `progress`, `end`, `leave`  
		 *  When reversing through the end point these events are fired:  
		 *  `enter`, `end`, `progress`  
		 *  And when continuing to scroll past the start position in reverse it will fire:  
		 *  `progress`, `start`, `leave`  
		 *  In between start and end the `progress` event will be called constantly, whenever the progress changes.
		 * 
		 * In short:  
		 * `enter` events will always trigger **before** the progress update and `leave` envents will trigger **after** the progress update.  
		 * `start` and `end` will always trigger at their respective position.
		 * 
		 * Please review the event descriptions for details on the events and the event object that is passed to the callback.
		 * 
		 * @method ScrollMagic.Scene#progress
		 * @example
		 * // get the current scene progress
		 * var progress = scene.progress();
		 *
		 * // set new scene progress
		 * scene.progress(0.3);
		 *
		 * @fires {@link Scene.enter}, when used as setter
		 * @fires {@link Scene.start}, when used as setter
		 * @fires {@link Scene.progress}, when used as setter
		 * @fires {@link Scene.end}, when used as setter
		 * @fires {@link Scene.leave}, when used as setter
		 *
		 * @param {number} [progress] - The new progress value of the scene `[0-1]`.
		 * @returns {number} `get` -  Current scene progress.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */
		this.progress = function (progress) {
			if (!arguments.length) { // get
				return _progress;
			} else { // set
				var
				doUpdate = false,
					oldState = _state,
					scrollDirection = _controller ? _controller.info("scrollDirection") : 'PAUSED',
					reverseOrForward = _options.reverse || progress >= _progress;
				if (_options.duration === 0) {
					// zero duration scenes
					doUpdate = _progress != progress;
					_progress = progress < 1 && reverseOrForward ? 0 : 1;
					_state = _progress === 0 ? SCENE_STATE_BEFORE : SCENE_STATE_DURING;
				} else {
					// scenes with start and end
					if (progress < 0 && _state !== SCENE_STATE_BEFORE && reverseOrForward) {
						// go back to initial state
						_progress = 0;
						_state = SCENE_STATE_BEFORE;
						doUpdate = true;
					} else if (progress >= 0 && progress < 1 && reverseOrForward) {
						_progress = progress;
						_state = SCENE_STATE_DURING;
						doUpdate = true;
					} else if (progress >= 1 && _state !== SCENE_STATE_AFTER) {
						_progress = 1;
						_state = SCENE_STATE_AFTER;
						doUpdate = true;
					} else if (_state === SCENE_STATE_DURING && !reverseOrForward) {
						updatePinState(); // in case we scrolled backwards mid-scene and reverse is disabled => update the pin position, so it doesn't move back as well.
					}
				}
				if (doUpdate) {
					// fire events
					var
					eventVars = {
						progress: _progress,
						state: _state,
						scrollDirection: scrollDirection
					},
						stateChanged = _state != oldState;

					var trigger = function (eventName) { // tmp helper to simplify code
						Scene.trigger(eventName, eventVars);
					};

					if (stateChanged) { // enter events
						if (oldState !== SCENE_STATE_DURING) {
							trigger("enter");
							trigger(oldState === SCENE_STATE_BEFORE ? "start" : "end");
						}
					}
					trigger("progress");
					if (stateChanged) { // leave events
						if (_state !== SCENE_STATE_DURING) {
							trigger(_state === SCENE_STATE_BEFORE ? "start" : "end");
							trigger("leave");
						}
					}
				}

				return Scene;
			}
		};


		/**
		 * Update the start and end scrollOffset of the container.
		 * The positions reflect what the controller's scroll position will be at the start and end respectively.
		 * Is called, when:
		 *   - Scene event "change" is called with: offset, triggerHook, duration 
		 *   - scroll container event "resize" is called
		 *   - the position of the triggerElement changes
		 *   - the controller changes -> addTo()
		 * @private
		 */
		var updateScrollOffset = function () {
			_scrollOffset = {
				start: _triggerPos + _options.offset
			};
			if (_controller && _options.triggerElement) {
				// take away triggerHook portion to get relative to top
				_scrollOffset.start -= _controller.info("size") * _options.triggerHook;
			}
			_scrollOffset.end = _scrollOffset.start + _options.duration;
		};

		/**
		 * Updates the duration if set to a dynamic function.
		 * This method is called when the scene is added to a controller and in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.change}, if the duration changed
		 * @fires {@link Scene.shift}, if the duration changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */
		var updateDuration = function (suppressEvents) {
			// update duration
			if (_durationUpdateMethod) {
				var varname = "duration";
				if (changeOption(varname, _durationUpdateMethod.call(Scene)) && !suppressEvents) { // set
					Scene.trigger("change", {
						what: varname,
						newval: _options[varname]
					});
					Scene.trigger("shift", {
						reason: varname
					});
				}
			}
		};

		/**
		 * Updates the position of the triggerElement, if present.
		 * This method is called ...
		 *  - ... when the triggerElement is changed
		 *  - ... when the scene is added to a (new) controller
		 *  - ... in regular intervals from the controller through scene.refresh().
		 * 
		 * @fires {@link Scene.shift}, if the position changed
		 *
		 * @param {boolean} [suppressEvents=false] - If true the shift event will be suppressed.
		 * @private
		 */
		var updateTriggerElementPosition = function (suppressEvents) {
			var
			elementPos = 0,
				telem = _options.triggerElement;
			if (_controller && (telem || _triggerPos > 0)) { // either an element exists or was removed and the triggerPos is still > 0
				if (telem) { // there currently a triggerElement set
					if (telem.parentNode) { // check if element is still attached to DOM
						var
						controllerInfo = _controller.info(),
							containerOffset = _util.get.offset(controllerInfo.container),
							// container position is needed because element offset is returned in relation to document, not in relation to container.
							param = controllerInfo.vertical ? "top" : "left"; // which param is of interest ?
						// if parent is spacer, use spacer position instead so correct start position is returned for pinned elements.
						while (telem.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) {
							telem = telem.parentNode;
						}

						var elementOffset = _util.get.offset(telem);

						if (!controllerInfo.isDocument) { // container is not the document root, so substract scroll Position to get correct trigger element position relative to scrollcontent
							containerOffset[param] -= _controller.scrollPos();
						}

						elementPos = elementOffset[param] - containerOffset[param];

					} else { // there was an element, but it was removed from DOM
						log(2, "WARNING: triggerElement was removed from DOM and will be reset to", undefined);
						Scene.triggerElement(undefined); // unset, so a change event is triggered
					}
				}

				var changed = elementPos != _triggerPos;
				_triggerPos = elementPos;
				if (changed && !suppressEvents) {
					Scene.trigger("shift", {
						reason: "triggerElementPosition"
					});
				}
			}
		};

		/**
		 * Trigger a shift event, when the container is resized and the triggerHook is > 1.
		 * @private
		 */
		var onContainerResize = function (e) {
			if (_options.triggerHook > 0) {
				Scene.trigger("shift", {
					reason: "containerResize"
				});
			}
		};


		var _validate = _util.extend(SCENE_OPTIONS.validate, {
			// validation for duration handled internally for reference to private var _durationMethod
			duration: function (val) {
				if (_util.type.String(val) && val.match(/^(\.|\d)*\d+%$/)) {
					// percentage value
					var perc = parseFloat(val) / 100;
					val = function () {
						return _controller ? _controller.info("size") * perc : 0;
					};
				}
				if (_util.type.Function(val)) {
					// function
					_durationUpdateMethod = val;
					try {
						val = parseFloat(_durationUpdateMethod());
					} catch (e) {
						val = -1; // will cause error below
					}
				}
				// val has to be float
				val = parseFloat(val);
				if (!_util.type.Number(val) || val < 0) {
					if (_durationUpdateMethod) {
						_durationUpdateMethod = undefined;
						throw ["Invalid return value of supplied function for option \"duration\":", val];
					} else {
						throw ["Invalid value for option \"duration\":", val];
					}
				}
				return val;
			}
		});

		/**
		 * Checks the validity of a specific or all options and reset to default if neccessary.
		 * @private
		 */
		var validateOption = function (check) {
			check = arguments.length ? [check] : Object.keys(_validate);
			check.forEach(function (optionName, key) {
				var value;
				if (_validate[optionName]) { // there is a validation method for this option
					try { // validate value
						value = _validate[optionName](_options[optionName]);
					} catch (e) { // validation failed -> reset to default
						value = DEFAULT_OPTIONS[optionName];
						var logMSG = _util.type.String(e) ? [e] : e;
						if (_util.type.Array(logMSG)) {
							logMSG[0] = "ERROR: " + logMSG[0];
							logMSG.unshift(1); // loglevel 1 for error msg
							log.apply(this, logMSG);
						} else {
							log(1, "ERROR: Problem executing validation callback for option '" + optionName + "':", e.message);
						}
					} finally {
						_options[optionName] = value;
					}
				}
			});
		};

		/**
		 * Helper used by the setter/getters for scene options
		 * @private
		 */
		var changeOption = function (varname, newval) {
			var
			changed = false,
				oldval = _options[varname];
			if (_options[varname] != newval) {
				_options[varname] = newval;
				validateOption(varname); // resets to default if necessary
				changed = oldval != _options[varname];
			}
			return changed;
		};

		// generate getters/setters for all options
		var addSceneOption = function (optionName) {
			if (!Scene[optionName]) {
				Scene[optionName] = function (newVal) {
					if (!arguments.length) { // get
						return _options[optionName];
					} else {
						if (optionName === "duration") { // new duration is set, so any previously set function must be unset
							_durationUpdateMethod = undefined;
						}
						if (changeOption(optionName, newVal)) { // set
							Scene.trigger("change", {
								what: optionName,
								newval: _options[optionName]
							});
							if (SCENE_OPTIONS.shifts.indexOf(optionName) > -1) {
								Scene.trigger("shift", {
									reason: optionName
								});
							}
						}
					}
					return Scene;
				};
			}
		};

		/**
		 * **Get** or **Set** the duration option value.
		 * As a setter it also accepts a function returning a numeric value.  
		 * This is particularly useful for responsive setups.
		 *
		 * The duration is updated using the supplied function every time `Scene.refresh()` is called, which happens periodically from the controller (see ScrollMagic.Controller option `refreshInterval`).  
		 * _**NOTE:** Be aware that it's an easy way to kill performance, if you supply a function that has high CPU demand.  
		 * Even for size and position calculations it is recommended to use a variable to cache the value. (see example)  
		 * This counts double if you use the same function for multiple scenes._
		 *
		 * @method ScrollMagic.Scene#duration
		 * @example
		 * // get the current duration value
		 * var duration = scene.duration();
		 *
		 * // set a new duration
		 * scene.duration(300);
		 *
		 * // use a function to automatically adjust the duration to the window height.
		 * var durationValueCache;
		 * function getDuration () {
		 *   return durationValueCache;
		 * }
		 * function updateDuration (e) {
		 *   durationValueCache = window.innerHeight;
		 * }
		 * $(window).on("resize", updateDuration); // update the duration when the window size changes
		 * $(window).triggerHandler("resize"); // set to initial value
		 * scene.duration(getDuration); // supply duration method
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|function)} [newDuration] - The new duration of the scene.
		 * @returns {number} `get` -  Current scene duration.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the offset option value.
		 * @method ScrollMagic.Scene#offset
		 * @example
		 * // get the current offset
		 * var offset = scene.offset();
		 *
		 * // set a new offset
		 * scene.offset(100);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {number} [newOffset] - The new offset of the scene.
		 * @returns {number} `get` -  Current scene offset.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the triggerElement option value.
		 * Does **not** fire `Scene.shift`, because changing the trigger Element doesn't necessarily mean the start position changes. This will be determined in `Scene.refresh()`, which is automatically triggered.
		 * @method ScrollMagic.Scene#triggerElement
		 * @example
		 * // get the current triggerElement
		 * var triggerElement = scene.triggerElement();
		 *
		 * // set a new triggerElement using a selector
		 * scene.triggerElement("#trigger");
		 * // set a new triggerElement using a DOM object
		 * scene.triggerElement(document.getElementById("trigger"));
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {(string|object)} [newTriggerElement] - The new trigger element for the scene.
		 * @returns {(string|object)} `get` -  Current triggerElement.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the triggerHook option value.
		 * @method ScrollMagic.Scene#triggerHook
		 * @example
		 * // get the current triggerHook value
		 * var triggerHook = scene.triggerHook();
		 *
		 * // set a new triggerHook using a string
		 * scene.triggerHook("onLeave");
		 * // set a new triggerHook using a number
		 * scene.triggerHook(0.7);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @fires {@link Scene.shift}, when used as setter
		 * @param {(number|string)} [newTriggerHook] - The new triggerHook of the scene. See {@link Scene} parameter description for value options.
		 * @returns {number} `get` -  Current triggerHook (ALWAYS numerical).
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the reverse option value.
		 * @method ScrollMagic.Scene#reverse
		 * @example
		 * // get the current reverse option
		 * var reverse = scene.reverse();
		 *
		 * // set new reverse option
		 * scene.reverse(false);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {boolean} [newReverse] - The new reverse setting of the scene.
		 * @returns {boolean} `get` -  Current reverse option value.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** or **Set** the loglevel option value.
		 * @method ScrollMagic.Scene#loglevel
		 * @example
		 * // get the current loglevel
		 * var loglevel = scene.loglevel();
		 *
		 * // set new loglevel
		 * scene.loglevel(3);
		 *
		 * @fires {@link Scene.change}, when used as setter
		 * @param {number} [newLoglevel] - The new loglevel setting of the scene. `[0-3]`
		 * @returns {number} `get` -  Current loglevel.
		 * @returns {Scene} `set` -  Parent object for chaining.
		 */

		/**
		 * **Get** the associated controller.
		 * @method ScrollMagic.Scene#controller
		 * @example
		 * // get the controller of a scene
		 * var controller = scene.controller();
		 *
		 * @returns {ScrollMagic.Controller} Parent controller or `undefined`
		 */
		this.controller = function () {
			return _controller;
		};

		/**
		 * **Get** the current state.
		 * @method ScrollMagic.Scene#state
		 * @example
		 * // get the current state
		 * var state = scene.state();
		 *
		 * @returns {string} `"BEFORE"`, `"DURING"` or `"AFTER"`
		 */
		this.state = function () {
			return _state;
		};

		/**
		 * **Get** the current scroll offset for the start of the scene.  
		 * Mind, that the scrollOffset is related to the size of the container, if `triggerHook` is bigger than `0` (or `"onLeave"`).  
		 * This means, that resizing the container or changing the `triggerHook` will influence the scene's start offset.
		 * @method ScrollMagic.Scene#scrollOffset
		 * @example
		 * // get the current scroll offset for the start and end of the scene.
		 * var start = scene.scrollOffset();
		 * var end = scene.scrollOffset() + scene.duration();
		 * console.log("the scene starts at", start, "and ends at", end);
		 *
		 * @returns {number} The scroll offset (of the container) at which the scene will trigger. Y value for vertical and X value for horizontal scrolls.
		 */
		this.scrollOffset = function () {
			return _scrollOffset.start;
		};

		/**
		 * **Get** the trigger position of the scene (including the value of the `offset` option).  
		 * @method ScrollMagic.Scene#triggerPosition
		 * @example
		 * // get the scene's trigger position
		 * var triggerPosition = scene.triggerPosition();
		 *
		 * @returns {number} Start position of the scene. Top position value for vertical and left position value for horizontal scrolls.
		 */
		this.triggerPosition = function () {
			var pos = _options.offset; // the offset is the basis
			if (_controller) {
				// get the trigger position
				if (_options.triggerElement) {
					// Element as trigger
					pos += _triggerPos;
				} else {
					// return the height of the triggerHook to start at the beginning
					pos += _controller.info("size") * Scene.triggerHook();
				}
			}
			return pos;
		};

		var
		_pin, _pinOptions;

		Scene.on("shift.internal", function (e) {
			var durationChanged = e.reason === "duration";
			if ((_state === SCENE_STATE_AFTER && durationChanged) || (_state === SCENE_STATE_DURING && _options.duration === 0)) {
				// if [duration changed after a scene (inside scene progress updates pin position)] or [duration is 0, we are in pin phase and some other value changed].
				updatePinState();
			}
			if (durationChanged) {
				updatePinDimensions();
			}
		}).on("progress.internal", function (e) {
			updatePinState();
		}).on("add.internal", function (e) {
			updatePinDimensions();
		}).on("destroy.internal", function (e) {
			Scene.removePin(e.reset);
		});
		/**
		 * Update the pin state.
		 * @private
		 */
		var updatePinState = function (forceUnpin) {
			if (_pin && _controller) {
				var
				containerInfo = _controller.info(),
					pinTarget = _pinOptions.spacer.firstChild; // may be pin element or another spacer, if cascading pins
				if (!forceUnpin && _state === SCENE_STATE_DURING) { // during scene or if duration is 0 and we are past the trigger
					// pinned state
					if (_util.css(pinTarget, "position") != "fixed") {
						// change state before updating pin spacer (position changes due to fixed collapsing might occur.)
						_util.css(pinTarget, {
							"position": "fixed"
						});
						// update pin spacer
						updatePinDimensions();
					}

					var
					fixedPos = _util.get.offset(_pinOptions.spacer, true),
						// get viewport position of spacer
						scrollDistance = _options.reverse || _options.duration === 0 ? containerInfo.scrollPos - _scrollOffset.start // quicker
						: Math.round(_progress * _options.duration * 10) / 10; // if no reverse and during pin the position needs to be recalculated using the progress
					// add scrollDistance
					fixedPos[containerInfo.vertical ? "top" : "left"] += scrollDistance;

					// set new values
					_util.css(_pinOptions.spacer.firstChild, {
						top: fixedPos.top,
						left: fixedPos.left
					});
				} else {
					// unpinned state
					var
					newCSS = {
						position: _pinOptions.inFlow ? "relative" : "absolute",
						top: 0,
						left: 0
					},
						change = _util.css(pinTarget, "position") != newCSS.position;

					if (!_pinOptions.pushFollowers) {
						newCSS[containerInfo.vertical ? "top" : "left"] = _options.duration * _progress;
					} else if (_options.duration > 0) { // only concerns scenes with duration
						if (_state === SCENE_STATE_AFTER && parseFloat(_util.css(_pinOptions.spacer, "padding-top")) === 0) {
							change = true; // if in after state but havent updated spacer yet (jumped past pin)
						} else if (_state === SCENE_STATE_BEFORE && parseFloat(_util.css(_pinOptions.spacer, "padding-bottom")) === 0) { // before
							change = true; // jumped past fixed state upward direction
						}
					}
					// set new values
					_util.css(pinTarget, newCSS);
					if (change) {
						// update pin spacer if state changed
						updatePinDimensions();
					}
				}
			}
		};

		/**
		 * Update the pin spacer and/or element size.
		 * The size of the spacer needs to be updated whenever the duration of the scene changes, if it is to push down following elements.
		 * @private
		 */
		var updatePinDimensions = function () {
			if (_pin && _controller && _pinOptions.inFlow) { // no spacerresize, if original position is absolute
				var
				after = (_state === SCENE_STATE_AFTER),
					before = (_state === SCENE_STATE_BEFORE),
					during = (_state === SCENE_STATE_DURING),
					vertical = _controller.info("vertical"),
					pinTarget = _pinOptions.spacer.firstChild,
					// usually the pined element but can also be another spacer (cascaded pins)
					marginCollapse = _util.isMarginCollapseType(_util.css(_pinOptions.spacer, "display")),
					css = {};

				// set new size
				// if relsize: spacer -> pin | else: pin -> spacer
				if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
					if (during) {
						_util.css(_pin, {
							"width": _util.get.width(_pinOptions.spacer)
						});
					} else {
						_util.css(_pin, {
							"width": "100%"
						});
					}
				} else {
					// minwidth is needed for cascaded pins.
					css["min-width"] = _util.get.width(vertical ? _pin : pinTarget, true, true);
					css.width = during ? css["min-width"] : "auto";
				}
				if (_pinOptions.relSize.height) {
					if (during) {
						// the only padding the spacer should ever include is the duration (if pushFollowers = true), so we need to substract that.
						_util.css(_pin, {
							"height": _util.get.height(_pinOptions.spacer) - (_pinOptions.pushFollowers ? _options.duration : 0)
						});
					} else {
						_util.css(_pin, {
							"height": "100%"
						});
					}
				} else {
					// margin is only included if it's a cascaded pin to resolve an IE9 bug
					css["min-height"] = _util.get.height(vertical ? pinTarget : _pin, true, !marginCollapse); // needed for cascading pins
					css.height = during ? css["min-height"] : "auto";
				}

				// add space for duration if pushFollowers is true
				if (_pinOptions.pushFollowers) {
					css["padding" + (vertical ? "Top" : "Left")] = _options.duration * _progress;
					css["padding" + (vertical ? "Bottom" : "Right")] = _options.duration * (1 - _progress);
				}
				_util.css(_pinOptions.spacer, css);
			}
		};

		/**
		 * Updates the Pin state (in certain scenarios)
		 * If the controller container is not the document and we are mid-pin-phase scrolling or resizing the main document can result to wrong pin positions.
		 * So this function is called on resize and scroll of the document.
		 * @private
		 */
		var updatePinInContainer = function () {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) {
				updatePinState();
			}
		};

		/**
		 * Updates the Pin spacer size state (in certain scenarios)
		 * If container is resized during pin and relatively sized the size of the pin might need to be updated...
		 * So this function is called on resize of the container.
		 * @private
		 */
		var updateRelativePinSpacer = function () {
			if (_controller && _pin && // well, duh
			_state === SCENE_STATE_DURING && // element in pinned state?
			( // is width or height relatively sized, but not in relation to body? then we need to recalc.
			((_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) && _util.get.width(window) != _util.get.width(_pinOptions.spacer.parentNode)) || (_pinOptions.relSize.height && _util.get.height(window) != _util.get.height(_pinOptions.spacer.parentNode)))) {
				updatePinDimensions();
			}
		};

		/**
		 * Is called, when the mousewhel is used while over a pinned element inside a div container.
		 * If the scene is in fixed state scroll events would be counted towards the body. This forwards the event to the scroll container.
		 * @private
		 */
		var onMousewheelOverPin = function (e) {
			if (_controller && _pin && _state === SCENE_STATE_DURING && !_controller.info("isDocument")) { // in pin state
				e.preventDefault();
				_controller._setScrollPos(_controller.info("scrollPos") - ((e.wheelDelta || e[_controller.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || -e.detail * 30));
			}
		};

		/**
		 * Pin an element for the duration of the tween.  
		 * If the scene duration is 0 the element will only be unpinned, if the user scrolls back past the start position.  
		 * Make sure only one pin is applied to an element at the same time.
		 * An element can be pinned multiple times, but only successively.
		 * _**NOTE:** The option `pushFollowers` has no effect, when the scene duration is 0._
		 * @method ScrollMagic.Scene#setPin
		 * @example
		 * // pin element and push all following elements down by the amount of the pin duration.
		 * scene.setPin("#pin");
		 *
		 * // pin element and keeping all following elements in their place. The pinned element will move past them.
		 * scene.setPin("#pin", {pushFollowers: false});
		 *
		 * @param {(string|object)} element - A Selector targeting an element or a DOM object that is supposed to be pinned.
		 * @param {object} [settings] - settings for the pin
		 * @param {boolean} [settings.pushFollowers=true] - If `true` following elements will be "pushed" down for the duration of the pin, if `false` the pinned element will just scroll past them.  
		 Ignored, when duration is `0`.
		 * @param {string} [settings.spacerClass="scrollmagic-pin-spacer"] - Classname of the pin spacer element, which is used to replace the element.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.setPin = function (element, settings) {
			var
			defaultSettings = {
				pushFollowers: true,
				spacerClass: "scrollmagic-pin-spacer"
			};
			settings = _util.extend({}, defaultSettings, settings);

			// validate Element
			element = _util.get.elements(element)[0];
			if (!element) {
				log(1, "ERROR calling method 'setPin()': Invalid pin element supplied.");
				return Scene; // cancel
			} else if (_util.css(element, "position") === "fixed") {
				log(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'.");
				return Scene; // cancel
			}

			if (_pin) { // preexisting pin?
				if (_pin === element) {
					// same pin we already have -> do nothing
					return Scene; // cancel
				} else {
					// kill old pin
					Scene.removePin();
				}

			}
			_pin = element;

			var
			parentDisplay = _pin.parentNode.style.display,
				boundsParams = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];

			_pin.parentNode.style.display = 'none'; // hack start to force css to return stylesheet values instead of calculated px values.
			var
			inFlow = _util.css(_pin, "position") != "absolute",
				pinCSS = _util.css(_pin, boundsParams.concat(["display"])),
				sizeCSS = _util.css(_pin, ["width", "height"]);
			_pin.parentNode.style.display = parentDisplay; // hack end.
			if (!inFlow && settings.pushFollowers) {
				log(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled.");
				settings.pushFollowers = false;
			}
			window.setTimeout(function () { // wait until all finished, because with responsive duration it will only be set after scene is added to controller
				if (_pin && _options.duration === 0 && settings.pushFollowers) {
					log(2, "WARNING: pushFollowers =", true, "has no effect, when scene duration is 0.");
				}
			}, 0);

			// create spacer and insert
			var
			spacer = _pin.parentNode.insertBefore(document.createElement('div'), _pin),
				spacerCSS = _util.extend(pinCSS, {
					position: inFlow ? "relative" : "absolute",
					boxSizing: "content-box",
					mozBoxSizing: "content-box",
					webkitBoxSizing: "content-box"
				});

			if (!inFlow) { // copy size if positioned absolutely, to work for bottom/right positioned elements.
				_util.extend(spacerCSS, _util.css(_pin, ["width", "height"]));
			}

			_util.css(spacer, spacerCSS);
			spacer.setAttribute(PIN_SPACER_ATTRIBUTE, "");
			_util.addClass(spacer, settings.spacerClass);

			// set the pin Options
			_pinOptions = {
				spacer: spacer,
				relSize: { // save if size is defined using % values. if so, handle spacer resize differently...
					width: sizeCSS.width.slice(-1) === "%",
					height: sizeCSS.height.slice(-1) === "%",
					autoFullWidth: sizeCSS.width === "auto" && inFlow && _util.isMarginCollapseType(pinCSS.display)
				},
				pushFollowers: settings.pushFollowers,
				inFlow: inFlow,
				// stores if the element takes up space in the document flow
			};

			if (!_pin.___origStyle) {
				_pin.___origStyle = {};
				var
				pinInlineCSS = _pin.style,
					copyStyles = boundsParams.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]);
				copyStyles.forEach(function (val) {
					_pin.___origStyle[val] = pinInlineCSS[val] || "";
				});
			}

			// if relative size, transfer it to spacer and make pin calculate it...
			if (_pinOptions.relSize.width) {
				_util.css(spacer, {
					width: sizeCSS.width
				});
			}
			if (_pinOptions.relSize.height) {
				_util.css(spacer, {
					height: sizeCSS.height
				});
			}

			// now place the pin element inside the spacer	
			spacer.appendChild(_pin);
			// and set new css
			_util.css(_pin, {
				position: inFlow ? "relative" : "absolute",
				margin: "auto",
				top: "auto",
				left: "auto",
				bottom: "auto",
				right: "auto"
			});

			if (_pinOptions.relSize.width || _pinOptions.relSize.autoFullWidth) {
				_util.css(_pin, {
					boxSizing: "border-box",
					mozBoxSizing: "border-box",
					webkitBoxSizing: "border-box"
				});
			}

			// add listener to document to update pin position in case controller is not the document.
			window.addEventListener('scroll', updatePinInContainer);
			window.addEventListener('resize', updatePinInContainer);
			window.addEventListener('resize', updateRelativePinSpacer);
			// add mousewheel listener to catch scrolls over fixed elements
			_pin.addEventListener("mousewheel", onMousewheelOverPin);
			_pin.addEventListener("DOMMouseScroll", onMousewheelOverPin);

			log(3, "added pin");

			// finally update the pin to init
			updatePinState();

			return Scene;
		};

		/**
		 * Remove the pin from the scene.
		 * @method ScrollMagic.Scene#removePin
		 * @example
		 * // remove the pin from the scene without resetting it (the spacer is not removed)
		 * scene.removePin();
		 *
		 * // remove the pin from the scene and reset the pin element to its initial position (spacer is removed)
		 * scene.removePin(true);
		 *
		 * @param {boolean} [reset=false] - If `false` the spacer will not be removed and the element's position will not be reset.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.removePin = function (reset) {
			if (_pin) {
				if (_state === SCENE_STATE_DURING) {
					updatePinState(true); // force unpin at position
				}
				if (reset || !_controller) { // if there's no controller no progress was made anyway...
					var pinTarget = _pinOptions.spacer.firstChild; // usually the pin element, but may be another spacer (cascaded pins)...
					if (pinTarget.hasAttribute(PIN_SPACER_ATTRIBUTE)) { // copy margins to child spacer
						var
						style = _pinOptions.spacer.style,
							values = ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"],
							margins = {};
						values.forEach(function (val) {
							margins[val] = style[val] || "";
						});
						_util.css(pinTarget, margins);
					}
					_pinOptions.spacer.parentNode.insertBefore(pinTarget, _pinOptions.spacer);
					_pinOptions.spacer.parentNode.removeChild(_pinOptions.spacer);
					if (!_pin.parentNode.hasAttribute(PIN_SPACER_ATTRIBUTE)) { // if it's the last pin for this element -> restore inline styles
						// TODO: only correctly set for first pin (when cascading) - how to fix?
						_util.css(_pin, _pin.___origStyle);
						delete _pin.___origStyle;
					}
				}
				window.removeEventListener('scroll', updatePinInContainer);
				window.removeEventListener('resize', updatePinInContainer);
				window.removeEventListener('resize', updateRelativePinSpacer);
				_pin.removeEventListener("mousewheel", onMousewheelOverPin);
				_pin.removeEventListener("DOMMouseScroll", onMousewheelOverPin);
				_pin = undefined;
				log(3, "removed pin (reset: " + (reset ? "true" : "false") + ")");
			}
			return Scene;
		};


		var
		_cssClasses, _cssClassElems = [];

		Scene.on("destroy.internal", function (e) {
			Scene.removeClassToggle(e.reset);
		});
		/**
		 * Define a css class modification while the scene is active.  
		 * When the scene triggers the classes will be added to the supplied element and removed, when the scene is over.
		 * If the scene duration is 0 the classes will only be removed if the user scrolls back past the start position.
		 * @method ScrollMagic.Scene#setClassToggle
		 * @example
		 * // add the class 'myclass' to the element with the id 'my-elem' for the duration of the scene
		 * scene.setClassToggle("#my-elem", "myclass");
		 *
		 * // add multiple classes to multiple elements defined by the selector '.classChange'
		 * scene.setClassToggle(".classChange", "class1 class2 class3");
		 *
		 * @param {(string|object)} element - A Selector targeting one or more elements or a DOM object that is supposed to be modified.
		 * @param {string} classes - One or more Classnames (separated by space) that should be added to the element during the scene.
		 *
		 * @returns {Scene} Parent object for chaining.
		 */
		this.setClassToggle = function (element, classes) {
			var elems = _util.get.elements(element);
			if (elems.length === 0 || !_util.type.String(classes)) {
				log(1, "ERROR calling method 'setClassToggle()': Invalid " + (elems.length === 0 ? "element" : "classes") + " supplied.");
				return Scene;
			}
			if (_cssClassElems.length > 0) {
				// remove old ones
				Scene.removeClassToggle();
			}
			_cssClasses = classes;
			_cssClassElems = elems;
			Scene.on("enter.internal_class leave.internal_class", function (e) {
				var toggle = e.type === "enter" ? _util.addClass : _util.removeClass;
				_cssClassElems.forEach(function (elem, key) {
					toggle(elem, _cssClasses);
				});
			});
			return Scene;
		};

		/**
		 * Remove the class binding from the scene.
		 * @method ScrollMagic.Scene#removeClassToggle
		 * @example
		 * // remove class binding from the scene without reset
		 * scene.removeClassToggle();
		 *
		 * // remove class binding and remove the changes it caused
		 * scene.removeClassToggle(true);
		 *
		 * @param {boolean} [reset=false] - If `false` and the classes are currently active, they will remain on the element. If `true` they will be removed.
		 * @returns {Scene} Parent object for chaining.
		 */
		this.removeClassToggle = function (reset) {
			if (reset) {
				_cssClassElems.forEach(function (elem, key) {
					_util.removeClass(elem, _cssClasses);
				});
			}
			Scene.off("start.internal_class end.internal_class");
			_cssClasses = undefined;
			_cssClassElems = [];
			return Scene;
		};

		// INIT
		construct();
		return Scene;
	};

	// store pagewide scene options
	var SCENE_OPTIONS = {
		defaults: {
			duration: 0,
			offset: 0,
			triggerElement: undefined,
			triggerHook: 0.5,
			reverse: true,
			loglevel: 2
		},
		validate: {
			offset: function (val) {
				val = parseFloat(val);
				if (!_util.type.Number(val)) {
					throw ["Invalid value for option \"offset\":", val];
				}
				return val;
			},
			triggerElement: function (val) {
				val = val || undefined;
				if (val) {
					var elem = _util.get.elements(val)[0];
					if (elem && elem.parentNode) {
						val = elem;
					} else {
						throw ["Element defined in option \"triggerElement\" was not found:", val];
					}
				}
				return val;
			},
			triggerHook: function (val) {
				var translate = {
					"onCenter": 0.5,
					"onEnter": 1,
					"onLeave": 0
				};
				if (_util.type.Number(val)) {
					val = Math.max(0, Math.min(parseFloat(val), 1)); //  make sure its betweeen 0 and 1
				} else if (val in translate) {
					val = translate[val];
				} else {
					throw ["Invalid value for option \"triggerHook\": ", val];
				}
				return val;
			},
			reverse: function (val) {
				return !!val; // force boolean
			},
			loglevel: function (val) {
				val = parseInt(val);
				if (!_util.type.Number(val) || val < 0 || val > 3) {
					throw ["Invalid value for option \"loglevel\":", val];
				}
				return val;
			}
		},
		// holder for  validation methods. duration validation is handled in 'getters-setters.js'
		shifts: ["duration", "offset", "triggerHook"],
		// list of options that trigger a `shift` event
	};
/*
 * method used to add an option to ScrollMagic Scenes.
 * TODO: DOC (private for dev)
 */
	ScrollMagic.Scene.addOption = function (name, defaultValue, validationCallback, shifts) {
		if (!(name in SCENE_OPTIONS.defaults)) {
			SCENE_OPTIONS.defaults[name] = defaultValue;
			SCENE_OPTIONS.validate[name] = validationCallback;
			if (shifts) {
				SCENE_OPTIONS.shifts.push(name);
			}
		} else {
			ScrollMagic._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + name + "', because it already exists.");
		}
	};
	// instance extension function for plugins
	// TODO: DOC (private for dev)
	ScrollMagic.Scene.extend = function (extension) {
		var oldClass = this;
		ScrollMagic.Scene = function () {
			oldClass.apply(this, arguments);
			this.$super = _util.extend({}, this); // copy parent state
			return extension.apply(this, arguments) || this;
		};
		_util.extend(ScrollMagic.Scene, oldClass); // copy properties
		ScrollMagic.Scene.prototype = oldClass.prototype; // copy prototype
		ScrollMagic.Scene.prototype.constructor = ScrollMagic.Scene; // restore constructor
	};



	/**
	 * TODO: DOCS (private for dev)
	 * @class
	 * @private
	 */

	ScrollMagic.Event = function (type, namespace, target, vars) {
		vars = vars || {};
		for (var key in vars) {
			this[key] = vars[key];
		}
		this.type = type;
		this.target = this.currentTarget = target;
		this.namespace = namespace || '';
		this.timeStamp = this.timestamp = Date.now();
		return this;
	};

/*
 * TODO: DOCS (private for dev)
 */

	var _util = ScrollMagic._util = (function (window) {
		var U = {},
			i;

		/**
		 * ------------------------------
		 * internal helpers
		 * ------------------------------
		 */

		// parse float and fall back to 0.
		var floatval = function (number) {
			return parseFloat(number) || 0;
		};
		// get current style IE safe (otherwise IE would return calculated values for 'auto')
		var _getComputedStyle = function (elem) {
			return elem.currentStyle ? elem.currentStyle : window.getComputedStyle(elem);
		};

		// get element dimension (width or height)
		var _dimension = function (which, elem, outer, includeMargin) {
			elem = (elem === document) ? window : elem;
			if (elem === window) {
				includeMargin = false;
			} else if (!_type.DomElement(elem)) {
				return 0;
			}
			which = which.charAt(0).toUpperCase() + which.substr(1).toLowerCase();
			var dimension = (outer ? elem['offset' + which] || elem['outer' + which] : elem['client' + which] || elem['inner' + which]) || 0;
			if (outer && includeMargin) {
				var style = _getComputedStyle(elem);
				dimension += which === 'Height' ? floatval(style.marginTop) + floatval(style.marginBottom) : floatval(style.marginLeft) + floatval(style.marginRight);
			}
			return dimension;
		};
		// converts 'margin-top' into 'marginTop'
		var _camelCase = function (str) {
			return str.replace(/^[^a-z]+([a-z])/g, '$1').replace(/-([a-z])/g, function (g) {
				return g[1].toUpperCase();
			});
		};

		/**
		 * ------------------------------
		 * external helpers
		 * ------------------------------
		 */

		// extend obj – same as jQuery.extend({}, objA, objB)
		U.extend = function (obj) {
			obj = obj || {};
			for (i = 1; i < arguments.length; i++) {
				if (!arguments[i]) {
					continue;
				}
				for (var key in arguments[i]) {
					if (arguments[i].hasOwnProperty(key)) {
						obj[key] = arguments[i][key];
					}
				}
			}
			return obj;
		};

		// check if a css display type results in margin-collapse or not
		U.isMarginCollapseType = function (str) {
			return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(str) > -1;
		};

		// implementation of requestAnimationFrame
		// based on https://gist.github.com/paulirish/1579671
		var
		lastTime = 0,
			vendors = ['ms', 'moz', 'webkit', 'o'];
		var _requestAnimationFrame = window.requestAnimationFrame;
		var _cancelAnimationFrame = window.cancelAnimationFrame;
		// try vendor prefixes if the above doesn't work
		for (i = 0; !_requestAnimationFrame && i < vendors.length; ++i) {
			_requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
			_cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
		}

		// fallbacks
		if (!_requestAnimationFrame) {
			_requestAnimationFrame = function (callback) {
				var
				currTime = new Date().getTime(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}
		if (!_cancelAnimationFrame) {
			_cancelAnimationFrame = function (id) {
				window.clearTimeout(id);
			};
		}
		U.rAF = _requestAnimationFrame.bind(window);
		U.cAF = _cancelAnimationFrame.bind(window);

		var
		loglevels = ["error", "warn", "log"],
			console = window.console || {};

		console.log = console.log ||
		function () {}; // no console log, well - do nothing then...
		// make sure methods for all levels exist.
		for (i = 0; i < loglevels.length; i++) {
			var method = loglevels[i];
			if (!console[method]) {
				console[method] = console.log; // prefer .log over nothing
			}
		}
		U.log = function (loglevel) {
			if (loglevel > loglevels.length || loglevel <= 0) loglevel = loglevels.length;
			var now = new Date(),
				time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2) + ":" + ("00" + now.getMilliseconds()).slice(-3),
				method = loglevels[loglevel - 1],
				args = Array.prototype.splice.call(arguments, 1),
				func = Function.prototype.bind.call(console[method], console);
			args.unshift(time);
			func.apply(console, args);
		};

		/**
		 * ------------------------------
		 * type testing
		 * ------------------------------
		 */

		var _type = U.type = function (v) {
			return Object.prototype.toString.call(v).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
		};
		_type.String = function (v) {
			return _type(v) === 'string';
		};
		_type.Function = function (v) {
			return _type(v) === 'function';
		};
		_type.Array = function (v) {
			return Array.isArray(v);
		};
		_type.Number = function (v) {
			return !_type.Array(v) && (v - parseFloat(v) + 1) >= 0;
		};
		_type.DomElement = function (o) {
			return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string");
		};

		/**
		 * ------------------------------
		 * DOM Element info
		 * ------------------------------
		 */
		// always returns a list of matching DOM elements, from a selector, a DOM element or an list of elements or even an array of selectors
		var _get = U.get = {};
		_get.elements = function (selector) {
			var arr = [];
			if (_type.String(selector)) {
				try {
					selector = document.querySelectorAll(selector);
				} catch (e) { // invalid selector
					return arr;
				}
			}
			if (_type(selector) === 'nodelist' || _type.Array(selector)) {
				for (var i = 0, ref = arr.length = selector.length; i < ref; i++) { // list of elements
					var elem = selector[i];
					arr[i] = _type.DomElement(elem) ? elem : _get.elements(elem); // if not an element, try to resolve recursively
				}
			} else if (_type.DomElement(selector) || selector === document || selector === window) {
				arr = [selector]; // only the element
			}
			return arr;
		};
		// get scroll top value
		_get.scrollTop = function (elem) {
			return (elem && typeof elem.scrollTop === 'number') ? elem.scrollTop : window.pageYOffset || 0;
		};
		// get scroll left value
		_get.scrollLeft = function (elem) {
			return (elem && typeof elem.scrollLeft === 'number') ? elem.scrollLeft : window.pageXOffset || 0;
		};
		// get element height
		_get.width = function (elem, outer, includeMargin) {
			return _dimension('width', elem, outer, includeMargin);
		};
		// get element width
		_get.height = function (elem, outer, includeMargin) {
			return _dimension('height', elem, outer, includeMargin);
		};

		// get element position (optionally relative to viewport)
		_get.offset = function (elem, relativeToViewport) {
			var offset = {
				top: 0,
				left: 0
			};
			if (elem && elem.getBoundingClientRect) { // check if available
				var rect = elem.getBoundingClientRect();
				offset.top = rect.top;
				offset.left = rect.left;
				if (!relativeToViewport) { // clientRect is by default relative to viewport...
					offset.top += _get.scrollTop();
					offset.left += _get.scrollLeft();
				}
			}
			return offset;
		};

		/**
		 * ------------------------------
		 * DOM Element manipulation
		 * ------------------------------
		 */

		U.addClass = function (elem, classname) {
			if (classname) {
				if (elem.classList) elem.classList.add(classname);
				else elem.className += ' ' + classname;
			}
		};
		U.removeClass = function (elem, classname) {
			if (classname) {
				if (elem.classList) elem.classList.remove(classname);
				else elem.className = elem.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		};
		// if options is string -> returns css value
		// if options is array -> returns object with css value pairs
		// if options is object -> set new css values
		U.css = function (elem, options) {
			if (_type.String(options)) {
				return _getComputedStyle(elem)[_camelCase(options)];
			} else if (_type.Array(options)) {
				var
				obj = {},
					style = _getComputedStyle(elem);
				options.forEach(function (option, key) {
					obj[option] = style[_camelCase(option)];
				});
				return obj;
			} else {
				for (var option in options) {
					var val = options[option];
					if (val == parseFloat(val)) { // assume pixel for seemingly numerical values
						val += 'px';
					}
					elem.style[_camelCase(option)] = val;
				}
			}
		};

		return U;
	}(window || {}));

	ScrollMagic.Scene.prototype.addIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeIndicators = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin \'debug.addIndicators\'. Please make sure to include plugins/debug.addIndicators.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeTween = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin \'animation.gsap\'. Please make sure to include plugins/animation.gsap.js');
		return this;
	}
	ScrollMagic.Scene.prototype.setVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}
	ScrollMagic.Scene.prototype.removeVelocity = function () {
		ScrollMagic._util.log(1, '(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin \'animation.velocity\'. Please make sure to include plugins/animation.velocity.js');
		return this;
	}

	return ScrollMagic;
}));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Version: 3.6.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Based on http://github.com/ertdfgcvb/Sequencer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _webglUtils = __webpack_require__(3);

var _webglUtils2 = _interopRequireDefault(_webglUtils);

var _m = __webpack_require__(2);

var _m2 = _interopRequireDefault(_m);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

String.prototype.repeat = String.prototype.repeat || function (n) {
    return n <= 1 ? this : this + this.repeat(n - 1);
};

function padLeft(str, char, length) {
    return char.repeat(Math.max(0, length - str.length)) + str;
}

var Sequencer = function () {
    function Sequencer(opts, scene) {
        var _this = this;

        _classCallCheck(this, Sequencer);

        var defaults = {
            canvas: null,
            canvasContext: 'auto', // can be: auto, webgl, 2d
            from: '',
            to: '',
            asyncLoader: false,
            scaleMode: 'cover', // can be: auto, cover, contain
            framePosition: 'center center', // default: center center
            hiDPI: true,
            initFrameDraw: true,
            totalLoadCallback: null,
            imageLoadCallback: null
        };

        this.scene = scene;
        this._config = Object.assign({}, defaults, opts);

        // backwards compatibility: .retina field is assigned to .hiDPI (Retina is an Apple trademark)
        if (opts.hasOwnProperty('retina')) this._config.hiDPI = opts.retina;

        if (this._config.from == '' && this._config.to == '') {
            console.error('Missing filenames.');
            return false;
        }

        if (!this._config.canvas) {
            console.error('Missing canvas node.');
            return false;
        }

        this._stoped = false;
        this._loadedImages = 0;
        this._totalLoaded = false;

        this._images = [];

        this._isWebGL = true;
        this._canvasInit();

        var sequenceParser = this._parseSequence(this._config.from, this._config.to);
        this._fileList = this._buildFileList(sequenceParser);

        var init = function init(_ref) {
            var progress = _ref.progress;

            _this._sceneProgressInit(progress);
            _this.scene.off('progress', init);
        };

        this.scene.on('progress', init);
    }

    _createClass(Sequencer, [{
        key: '_webglInit',
        value: function _webglInit() {
            var _this2 = this;

            var program = _webglUtils2.default.createProgramFromScripts(this._ctx, [{
                src: 'attribute vec4 a_position;attribute vec2 a_texcoord;uniform mat4 u_matrix;uniform mat4 u_textureMatrix;varying vec2 v_texcoord;void main() {gl_Position = u_matrix * a_position;v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;}',
                type: 'x-shader/x-vertex'
            }, {
                src: 'precision mediump float;varying vec2 v_texcoord;uniform sampler2D u_texture;void main() {gl_FragColor = texture2D(u_texture, v_texcoord);}',
                type: 'x-shader/x-fragment'
            }]);

            var positionLocation = this._ctx.getAttribLocation(program, 'a_position');
            var texcoordLocation = this._ctx.getAttribLocation(program, 'a_texcoord');
            var matrixLocation = this._ctx.getUniformLocation(program, 'u_matrix');
            var textureMatrixLocation = this._ctx.getUniformLocation(program, 'u_textureMatrix');
            var textureLocation = this._ctx.getUniformLocation(program, 'u_texture');

            var positionBuffer = this._ctx.createBuffer();

            this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, positionBuffer);

            var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];

            this._ctx.bufferData(this._ctx.ARRAY_BUFFER, new Float32Array(positions), this._ctx.STATIC_DRAW);

            var texcoordBuffer = this._ctx.createBuffer();

            this._ctx.bindBuffer(this._ctx.ARRAY_BUFFER, texcoordBuffer);

            var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];

            this._ctx.bufferData(this._ctx.ARRAY_BUFFER, new Float32Array(texcoords), this._ctx.STATIC_DRAW);

            this._ctx.drawImage = function (tex, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight) {
                _this2._ctx.bindTexture(_this2._ctx.TEXTURE_2D, tex);
                _this2._ctx.useProgram(program);
                _this2._ctx.bindBuffer(_this2._ctx.ARRAY_BUFFER, positionBuffer);
                _this2._ctx.enableVertexAttribArray(positionLocation);
                _this2._ctx.vertexAttribPointer(positionLocation, 2, _this2._ctx.FLOAT, false, 0, 0);
                _this2._ctx.bindBuffer(_this2._ctx.ARRAY_BUFFER, texcoordBuffer);
                _this2._ctx.enableVertexAttribArray(texcoordLocation);
                _this2._ctx.vertexAttribPointer(texcoordLocation, 2, _this2._ctx.FLOAT, false, 0, 0);

                var matrix = _m2.default.orthographic(0, _this2._ctx.canvas.width, _this2._ctx.canvas.height, 0, -1, 1);

                matrix = _m2.default.translate(matrix, dstX, dstY, 0);
                matrix = _m2.default.scale(matrix, dstWidth, dstHeight, 1);

                _this2._ctx.uniformMatrix4fv(matrixLocation, false, matrix);

                var texMatrix = _m2.default.translation(srcX / srcWidth, srcY / srcHeight, 0);

                texMatrix = _m2.default.scale(texMatrix, 1, 1, 1);

                _this2._ctx.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);
                _this2._ctx.uniform1i(textureLocation, 0);
                _this2._ctx.drawArrays(_this2._ctx.TRIANGLES, 0, 6);
            };
        }
    }, {
        key: '_canvasInit',
        value: function _canvasInit() {
            var tagName = this._config.canvas.tagName;


            if (tagName === 'CANVAS') {
                if (this._config.canvasContext === 'auto') {
                    this._ctx = this._config.canvas.getContext('webgl');

                    if (!this._ctx) {
                        this._isWebGL = false;

                        this._ctx = this._config.canvas.getContext('2d');
                        console.info('Scrollmagic sequencer use 2d context');
                    } else {
                        console.info('Scrollmagic sequencer use WebGL context');
                        this._webglInit();
                    }
                } else {
                    this._ctx = this._config.canvas.getContext(this._config.canvasContext);

                    if (this._config.canvasContext === '2d') {
                        this._isWebGL = false;
                        console.info('Scrollmagic sequencer use 2d context');
                    } else {
                        console.info('Scrollmagic sequencer use WebGL context');
                    }
                }

                this._size(this._ctx.canvas.width, this._ctx.canvas.height);
            } else if (tagName === 'IMG') {
                this._imgMode = true;
            } else {
                console.error('Wrong canvas node.');
            }
        }
    }, {
        key: '_sceneProgressInit',
        value: function _sceneProgressInit(progress) {
            this._currentFrame = Math.round(progress * (this._fileList.length - 1));
            this._preloader();

            this.scene.on('progress', this._progressor.bind(this));
        }
    }, {
        key: '_frameLoader',
        value: function _frameLoader(targetFrame) {
            var _this3 = this;

            if (this._images[targetFrame]) return;

            var img = new Image();

            img.onload = function () {
                img.loaded = true;

                _this3._loadedImages++;

                if (!_this3._config.asyncLoader) {
                    if (_this3._loadedImages < _this3._fileList.length) {
                        _this3._frameLoader(_this3._loadedImages);
                    }
                } else {
                    var asyncFrameLength = parseInt(_this3._config.asyncLoader);

                    if (asyncFrameLength && (targetFrame + 1) % asyncFrameLength === 0) {
                        var start = targetFrame + 1;

                        var end = targetFrame + asyncFrameLength + 1;
                        end = end < _this3._fileList.length ? end : _this3._fileList.length;

                        for (var iter = start; iter < end; iter++) {
                            _this3._frameLoader(iter);
                        }
                    }
                }

                if (_this3._config.initFrameDraw && targetFrame === _this3._currentFrame) {
                    !_this3._imgMode && _this3._canvasDraw();
                    _this3._imgMode && _this3._imageDraw();
                }

                _this3._config.imageLoadCallback && _this3._config.imageLoadCallback({ img: img, frame: targetFrame });

                if (_this3._loadedImages === _this3._fileList.length) {
                    _this3._loadedImagesCallback();
                }
            };

            img.onerror = function () {
                console.error('Error with image-id: ' + targetFrame);
            };

            this._images[targetFrame] = img;

            img.src = this._fileList[targetFrame];
        }
    }, {
        key: '_preloader',
        value: function _preloader() {
            this._frameLoader(this._currentFrame);

            if (this._config.asyncLoader) {
                var asyncFrameLength = parseInt(this._config.asyncLoader);

                asyncFrameLength = asyncFrameLength || this._fileList.length;

                for (var iter = 0; iter < asyncFrameLength; iter++) {
                    this._frameLoader(iter);
                }
            }
        }
    }, {
        key: '_loadedImagesCallback',
        value: function _loadedImagesCallback() {
            this._totalLoaded = true;
            this._config.totalLoadCallback && this._config.totalLoadCallback();
        }
    }, {
        key: '_progressor',
        value: function _progressor(_ref2) {
            var progress = _ref2.progress;

            if (this._stoped) return;

            this._currentFrame = Math.round(progress * (this._fileList.length - 1));
            this._drawFrame();
        }
    }, {
        key: '_drawFrame',
        value: function _drawFrame() {
            !this._imgMode && requestAnimationFrame(this._canvasDraw.bind(this));
            this._imgMode && requestAnimationFrame(this._imageDraw.bind(this));
        }
    }, {
        key: '_canvasDraw',
        value: function _canvasDraw() {
            var img = this._images[this._currentFrame];

            if (!img || !img.loaded) return;

            var r = this._config.hiDPI ? window.devicePixelRatio : 1;
            var cw = this._ctx.canvas.width / r;
            var ch = this._ctx.canvas.height / r;
            var ca = cw / ch;
            var ia = img.width / img.height;
            var iw = void 0,
                ih = void 0;

            var ox = null,
                oy = null;

            if (this._config.scaleMode == 'cover') {
                if (ca > ia) {
                    iw = cw;
                    ih = iw / ia;
                } else {
                    ih = ch;
                    iw = ih * ia;
                }

                var position = this._config.framePosition.split(' ');

                ox = position[0] === 'center' ? cw / 2 - iw / 2 : position[0] === 'left' ? 0 : cw - iw;
                oy = position[1] === 'center' ? ch / 2 - ih / 2 : position[1] === 'top' ? 0 : ch - ih;
            } else if (this._config.scaleMode == 'contain') {
                if (ca < ia) {
                    iw = cw;
                    ih = iw / ia;
                } else {
                    ih = ch;
                    iw = ih * ia;
                }
            } else {
                //this._config.scaleMode == 'auto'
                iw = img.width;
                ih = img.height;
            }

            ox = ox === null ? cw / 2 - iw / 2 : ox;
            oy = oy === null ? ch / 2 - ih / 2 : oy;

            if (this._isWebGL) {
                this._ctx.viewport(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);

                this._ctx.clear(this._ctx.COLOR_BUFFER_BIT);

                var tex = this._ctx.createTexture();

                this._ctx.bindTexture(this._ctx.TEXTURE_2D, tex);
                this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, 1, 1, 0, this._ctx.RGBA, this._ctx.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

                this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_S, this._ctx.CLAMP_TO_EDGE);
                this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_T, this._ctx.CLAMP_TO_EDGE);
                this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MIN_FILTER, this._ctx.LINEAR);

                this._ctx.bindTexture(this._ctx.TEXTURE_2D, tex);
                this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, this._ctx.RGBA, this._ctx.UNSIGNED_BYTE, img);

                this._ctx.drawImage(tex, 0, 0, img.width, img.height, ~~ox, ~~oy, ~~iw, ~~ih);
            } else {
                this._ctx.save();
                this._ctx.scale(r, r);
                this._ctx.clearRect(0, 0, cw, ch); // support for images with alpha
                this._ctx.drawImage(img, 0, 0, img.width, img.height, ~~ox, ~~oy, ~~iw, ~~ih);
                this._ctx.restore();
            }
            this._currentDrawFrame = this._currentFrame;
        }
    }, {
        key: '_imageDraw',
        value: function _imageDraw() {
            var img = this._images[this._currentFrame];

            if (!img || !img.loaded) return;

            this._config.canvas.src = img.src;
        }
    }, {
        key: '_size',
        value: function _size(w, h) {
            var r = this._config.hiDPI ? window.devicePixelRatio : 1;
            var c = this._ctx.canvas;
            c.width = w * r;
            c.height = h * r;
            c.style.width = w + 'px';
            c.style.height = h + 'px';
        }
    }, {
        key: '_parseSequence',
        value: function _parseSequence(from, to) {
            var l = Math.min(from.length, to.length);
            var i = Math.max(0, from.lastIndexOf('/'));

            while (from.charAt(i) == to.charAt(i) && !/[1-9]/.test(from.charAt(i)) && i < l) {
                i++;
            }var a = from.slice(i, from.lastIndexOf('.')); // from, may contain leading zeros
            var b = to.slice(i, to.lastIndexOf('.')); // to
            var ia = parseInt(a);
            var ib = parseInt(b);

            return {
                from: ia,
                to: ib,
                base: from.substr(0, i),
                ext: from.substr(from.lastIndexOf('.')),
                zeroes: a.length == b.length && Math.floor(log10(ia)) < Math.floor(log10(ib)) ? a.length : 0,
                length: Math.abs(ib - ia) + 1
            };

            function log10(x) {
                return Math.log(x) / Math.LN10;
            }
        }
    }, {
        key: '_buildFileList',
        value: function _buildFileList(sequenceObj) {
            var q = [];
            var dir = sequenceObj.from > sequenceObj.to ? -1 : 1;
            for (var i = 0; i < sequenceObj.length; i++) {
                var n = (sequenceObj.from + i * dir).toString();
                var num = padLeft(n, '0', sequenceObj.zeroes);
                q.push(sequenceObj.base + num + sequenceObj.ext);
            }
            return q;
        }
    }, {
        key: 'resumeDrawing',
        value: function resumeDrawing() {
            this._stoped = false;
        }
    }, {
        key: 'stopDrawing',
        value: function stopDrawing() {
            this._stoped = true;
        }
    }, {
        key: 'resize',
        value: function resize(width, height) {
            if (!width || !height) {
                return console.error('resize "width" or "height" missed');
            }

            this._size(width, height);
            this._drawFrame();
        }
    }]);

    return Sequencer;
}();

(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // CommonJS
        factory(require('scrollmagic'));
    } else {
        // no browser global export needed, just execute
        factory(root.ScrollMagic || root.jQuery && root.jQuery.ScrollMagic);
    }
})(undefined, function (ScrollMagic) {
    // 'window' change to 'this'
    ScrollMagic.Scene.prototype.addImageSequencer = function (opt) {
        return new Sequencer(opt, this);
    };
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Various 3d math functions.
 *
 * @module webgl-3d-math
 */
(function (root, factory) {  // eslint-disable-line
    if ( true ) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
    }
    else {
        // Browser globals
        root.m4 = factory()
    }
}(this, function () {
    'use strict'

    /**
     * An array or typed array with 3 values.
     * @typedef {number[]|TypedArray} Vector3
     * @memberOf module:webgl-3d-math
     */

    /**
     * An array or typed array with 4 values.
     * @typedef {number[]|TypedArray} Vector4
     * @memberOf module:webgl-3d-math
     */

    /**
     * An array or typed array with 16 values.
     * @typedef {number[]|TypedArray} Matrix4
     * @memberOf module:webgl-3d-math
     */

    /**
     * Takes two 4-by-4 matrices, a and b, and computes the product in the order
     * that pre-composes b with a.  In other words, the matrix returned will
     * transform by b first and then a.  Note this is subtly different from just
     * multiplying the matrices together.  For given a and b, this function returns
     * the same object in both row-major and column-major mode.
     * @param {Matrix4} a A matrix.
     * @param {Matrix4} b A matrix.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     */
    function multiply(a, b, dst) {
        dst       = dst || new Float32Array(16)
        var b00   = b[ 0 * 4 + 0 ]
        var b01   = b[ 0 * 4 + 1 ]
        var b02   = b[ 0 * 4 + 2 ]
        var b03   = b[ 0 * 4 + 3 ]
        var b10   = b[ 1 * 4 + 0 ]
        var b11   = b[ 1 * 4 + 1 ]
        var b12   = b[ 1 * 4 + 2 ]
        var b13   = b[ 1 * 4 + 3 ]
        var b20   = b[ 2 * 4 + 0 ]
        var b21   = b[ 2 * 4 + 1 ]
        var b22   = b[ 2 * 4 + 2 ]
        var b23   = b[ 2 * 4 + 3 ]
        var b30   = b[ 3 * 4 + 0 ]
        var b31   = b[ 3 * 4 + 1 ]
        var b32   = b[ 3 * 4 + 2 ]
        var b33   = b[ 3 * 4 + 3 ]
        var a00   = a[ 0 * 4 + 0 ]
        var a01   = a[ 0 * 4 + 1 ]
        var a02   = a[ 0 * 4 + 2 ]
        var a03   = a[ 0 * 4 + 3 ]
        var a10   = a[ 1 * 4 + 0 ]
        var a11   = a[ 1 * 4 + 1 ]
        var a12   = a[ 1 * 4 + 2 ]
        var a13   = a[ 1 * 4 + 3 ]
        var a20   = a[ 2 * 4 + 0 ]
        var a21   = a[ 2 * 4 + 1 ]
        var a22   = a[ 2 * 4 + 2 ]
        var a23   = a[ 2 * 4 + 3 ]
        var a30   = a[ 3 * 4 + 0 ]
        var a31   = a[ 3 * 4 + 1 ]
        var a32   = a[ 3 * 4 + 2 ]
        var a33   = a[ 3 * 4 + 3 ]
        dst[ 0 ]  = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
        dst[ 1 ]  = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
        dst[ 2 ]  = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
        dst[ 3 ]  = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
        dst[ 4 ]  = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
        dst[ 5 ]  = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
        dst[ 6 ]  = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
        dst[ 7 ]  = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
        dst[ 8 ]  = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
        dst[ 9 ]  = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
        dst[ 10 ] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
        dst[ 11 ] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
        dst[ 12 ] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
        dst[ 13 ] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
        dst[ 14 ] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
        dst[ 15 ] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
        return dst
    }

    /**
     * adds 2 vectors3s
     * @param {Vector3} a a
     * @param {Vector3} b b
     * @param {Vector3} dst optional vector3 to store result
     * @return {Vector3} dst or new Vector3 if not provided
     * @memberOf module:webgl-3d-math
     */
    function addVectors(a, b, dst) {
        dst      = dst || new Float32Array(3)
        dst[ 0 ] = a[ 0 ] + b[ 0 ]
        dst[ 1 ] = a[ 1 ] + b[ 1 ]
        dst[ 2 ] = a[ 2 ] + b[ 2 ]
        return dst
    }

    /**
     * subtracts 2 vectors3s
     * @param {Vector3} a a
     * @param {Vector3} b b
     * @param {Vector3} dst optional vector3 to store result
     * @return {Vector3} dst or new Vector3 if not provided
     * @memberOf module:webgl-3d-math
     */
    function subtractVectors(a, b, dst) {
        dst      = dst || new Float32Array(3)
        dst[ 0 ] = a[ 0 ] - b[ 0 ]
        dst[ 1 ] = a[ 1 ] - b[ 1 ]
        dst[ 2 ] = a[ 2 ] - b[ 2 ]
        return dst
    }

    /**
     * normalizes a vector.
     * @param {Vector3} v vector to normalzie
     * @param {Vector3} dst optional vector3 to store result
     * @return {Vector3} dst or new Vector3 if not provided
     * @memberOf module:webgl-3d-math
     */
    function normalize(v, dst) {
        dst        = dst || new Float32Array(3)
        var length = Math.sqrt(v[ 0 ] * v[ 0 ] + v[ 1 ] * v[ 1 ] + v[ 2 ] * v[ 2 ])
        // make sure we don't divide by 0.
        if ( length > 0.00001 ) {
            dst[ 0 ] = v[ 0 ] / length
            dst[ 1 ] = v[ 1 ] / length
            dst[ 2 ] = v[ 2 ] / length
        }
        return dst
    }

    /**
     * Computes the cross product of 2 vectors3s
     * @param {Vector3} a a
     * @param {Vector3} b b
     * @param {Vector3} dst optional vector3 to store result
     * @return {Vector3} dst or new Vector3 if not provided
     * @memberOf module:webgl-3d-math
     */
    function cross(a, b, dst) {
        dst      = dst || new Float32Array(3)
        dst[ 0 ] = a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ]
        dst[ 1 ] = a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ]
        dst[ 2 ] = a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ]
        return dst
    }

    /**
     * Computes the dot product of two vectors; assumes both vectors have
     * three entries.
     * @param {Vector3} a Operand vector.
     * @param {Vector3} b Operand vector.
     * @return {number} dot product
     * @memberOf module:webgl-3d-math
     */
    function dot(a, b) {
        return (a[ 0 ] * b[ 0 ]) + (a[ 1 ] * b[ 1 ]) + (a[ 2 ] * b[ 2 ])
    }

    /**
     * Computes the distance squared between 2 points
     * @param {Vector3} a
     * @param {Vector3} b
     * @return {nubmer} distance squared between a and b
     */
    function distanceSq(a, b) {
        const dx = a[ 0 ] - b[ 0 ]
        const dy = a[ 1 ] - b[ 1 ]
        const dz = a[ 2 ] - b[ 2 ]
        return dx * dx + dy * dy + dz * dz
    }

    /**
     * Computes the distance between 2 points
     * @param {Vector3} a
     * @param {Vector3} b
     * @return {nubmer} distance between a and b
     */
    function distance(a, b) {
        return Math.sqrt(distanceSq(a, b))
    }

    /**
     * Makes an identity matrix.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function identity(dst) {
        dst = dst || new Float32Array(16)

        dst[ 0 ]  = 1
        dst[ 1 ]  = 0
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = 1
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = 0
        dst[ 9 ]  = 0
        dst[ 10 ] = 1
        dst[ 11 ] = 0
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = 0
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Transposes a matrix.
     * @param {Matrix4} m matrix to transpose.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function transpose(m, dst) {
        dst = dst || new Float32Array(16)

        dst[ 0 ]  = m[ 0 ]
        dst[ 1 ]  = m[ 4 ]
        dst[ 2 ]  = m[ 8 ]
        dst[ 3 ]  = m[ 12 ]
        dst[ 4 ]  = m[ 1 ]
        dst[ 5 ]  = m[ 5 ]
        dst[ 6 ]  = m[ 9 ]
        dst[ 7 ]  = m[ 13 ]
        dst[ 8 ]  = m[ 2 ]
        dst[ 9 ]  = m[ 6 ]
        dst[ 10 ] = m[ 10 ]
        dst[ 11 ] = m[ 14 ]
        dst[ 12 ] = m[ 3 ]
        dst[ 13 ] = m[ 7 ]
        dst[ 14 ] = m[ 11 ]
        dst[ 15 ] = m[ 15 ]

        return dst
    }

    /**
     * Creates a lookAt matrix.
     * This is a world matrix for a camera. In other words it will transform
     * from the origin to a place and orientation in the world. For a view
     * matrix take the inverse of this.
     * @param {Vector3} cameraPosition position of the camera
     * @param {Vector3} target position of the target
     * @param {Vector3} up direction
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function lookAt(cameraPosition, target, up, dst) {
        dst       = dst || new Float32Array(16)
        var zAxis = normalize(
            subtractVectors(cameraPosition, target))
        var xAxis = normalize(cross(up, zAxis))
        var yAxis = normalize(cross(zAxis, xAxis))

        dst[ 0 ]  = xAxis[ 0 ]
        dst[ 1 ]  = xAxis[ 1 ]
        dst[ 2 ]  = xAxis[ 2 ]
        dst[ 3 ]  = 0
        dst[ 4 ]  = yAxis[ 0 ]
        dst[ 5 ]  = yAxis[ 1 ]
        dst[ 6 ]  = yAxis[ 2 ]
        dst[ 7 ]  = 0
        dst[ 8 ]  = zAxis[ 0 ]
        dst[ 9 ]  = zAxis[ 1 ]
        dst[ 10 ] = zAxis[ 2 ]
        dst[ 11 ] = 0
        dst[ 12 ] = cameraPosition[ 0 ]
        dst[ 13 ] = cameraPosition[ 1 ]
        dst[ 14 ] = cameraPosition[ 2 ]
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Computes a 4-by-4 perspective transformation matrix given the angular height
     * of the frustum, the aspect ratio, and the near and far clipping planes.  The
     * arguments define a frustum extending in the negative z direction.  The given
     * angle is the vertical angle of the frustum, and the horizontal angle is
     * determined to produce the given aspect ratio.  The arguments near and far are
     * the distances to the near and far clipping planes.  Note that near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  The matrix generated sends the viewing frustum to the unit box.
     * We assume a unit box extending from -1 to 1 in the x and y dimensions and
     * from -1 to 1 in the z dimension.
     * @param {number} fieldOfViewInRadians field of view in y axis.
     * @param {number} aspect aspect of viewport (width / height)
     * @param {number} near near Z clipping plane
     * @param {number} far far Z clipping plane
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function perspective(fieldOfViewInRadians, aspect, near, far, dst) {
        dst          = dst || new Float32Array(16)
        var f        = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians)
        var rangeInv = 1.0 / (near - far)

        dst[ 0 ]  = f / aspect
        dst[ 1 ]  = 0
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = f
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = 0
        dst[ 9 ]  = 0
        dst[ 10 ] = (near + far) * rangeInv
        dst[ 11 ] = -1
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = near * far * rangeInv * 2
        dst[ 15 ] = 0

        return dst
    }

    /**
     * Computes a 4-by-4 orthographic projection matrix given the coordinates of the
     * planes defining the axis-aligned, box-shaped viewing volume.  The matrix
     * generated sends that box to the unit box.  Note that although left and right
     * are x coordinates and bottom and top are y coordinates, near and far
     * are not z coordinates, but rather they are distances along the negative
     * z-axis.  We assume a unit box extending from -1 to 1 in the x and y
     * dimensions and from -1 to 1 in the z dimension.
     * @param {number} left The x coordinate of the left plane of the box.
     * @param {number} right The x coordinate of the right plane of the box.
     * @param {number} bottom The y coordinate of the bottom plane of the box.
     * @param {number} top The y coordinate of the right plane of the box.
     * @param {number} near The negative z coordinate of the near plane of the box.
     * @param {number} far The negative z coordinate of the far plane of the box.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function orthographic(left, right, bottom, top, near, far, dst) {
        dst = dst || new Float32Array(16)

        dst[ 0 ]  = 2 / (right - left)
        dst[ 1 ]  = 0
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = 2 / (top - bottom)
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = 0
        dst[ 9 ]  = 0
        dst[ 10 ] = 2 / (near - far)
        dst[ 11 ] = 0
        dst[ 12 ] = (left + right) / (left - right)
        dst[ 13 ] = (bottom + top) / (bottom - top)
        dst[ 14 ] = (near + far) / (near - far)
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Computes a 4-by-4 perspective transformation matrix given the left, right,
     * top, bottom, near and far clipping planes. The arguments define a frustum
     * extending in the negative z direction. The arguments near and far are the
     * distances to the near and far clipping planes. Note that near and far are not
     * z coordinates, but rather they are distances along the negative z-axis. The
     * matrix generated sends the viewing frustum to the unit box. We assume a unit
     * box extending from -1 to 1 in the x and y dimensions and from -1 to 1 in the z
     * dimension.
     * @param {number} left The x coordinate of the left plane of the box.
     * @param {number} right The x coordinate of the right plane of the box.
     * @param {number} bottom The y coordinate of the bottom plane of the box.
     * @param {number} top The y coordinate of the right plane of the box.
     * @param {number} near The negative z coordinate of the near plane of the box.
     * @param {number} far The negative z coordinate of the far plane of the box.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function frustum(left, right, bottom, top, near, far) {
        var dx = right - left
        var dy = top - bottom
        var dz = far - near

        dst[ 0 ]  = 2 * near / dx
        dst[ 1 ]  = 0
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = 2 * near / dy
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = (left + right) / dx
        dst[ 9 ]  = (top + bottom) / dy
        dst[ 10 ] = -(far + near) / dz
        dst[ 11 ] = -1
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = -2 * near * far / dz
        dst[ 15 ] = 0

        return dst
    }

    /**
     * Makes a translation matrix
     * @param {number} tx x translation.
     * @param {number} ty y translation.
     * @param {number} tz z translation.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function translation(tx, ty, tz, dst) {
        dst = dst || new Float32Array(16)

        dst[ 0 ]  = 1
        dst[ 1 ]  = 0
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = 1
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = 0
        dst[ 9 ]  = 0
        dst[ 10 ] = 1
        dst[ 11 ] = 0
        dst[ 12 ] = tx
        dst[ 13 ] = ty
        dst[ 14 ] = tz
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Mutliply by translation matrix.
     * @param {Matrix4} m matrix to multiply
     * @param {number} tx x translation.
     * @param {number} ty y translation.
     * @param {number} tz z translation.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function translate(m, tx, ty, tz, dst) {
        // This is the optimized version of
        // return multiply(m, translation(tx, ty, tz), dst);
        dst = dst || new Float32Array(16)

        var m00 = m[ 0 ]
        var m01 = m[ 1 ]
        var m02 = m[ 2 ]
        var m03 = m[ 3 ]
        var m10 = m[ 1 * 4 + 0 ]
        var m11 = m[ 1 * 4 + 1 ]
        var m12 = m[ 1 * 4 + 2 ]
        var m13 = m[ 1 * 4 + 3 ]
        var m20 = m[ 2 * 4 + 0 ]
        var m21 = m[ 2 * 4 + 1 ]
        var m22 = m[ 2 * 4 + 2 ]
        var m23 = m[ 2 * 4 + 3 ]
        var m30 = m[ 3 * 4 + 0 ]
        var m31 = m[ 3 * 4 + 1 ]
        var m32 = m[ 3 * 4 + 2 ]
        var m33 = m[ 3 * 4 + 3 ]

        if ( m !== dst ) {
            dst[ 0 ]  = m00
            dst[ 1 ]  = m01
            dst[ 2 ]  = m02
            dst[ 3 ]  = m03
            dst[ 4 ]  = m10
            dst[ 5 ]  = m11
            dst[ 6 ]  = m12
            dst[ 7 ]  = m13
            dst[ 8 ]  = m20
            dst[ 9 ]  = m21
            dst[ 10 ] = m22
            dst[ 11 ] = m23
        }

        dst[ 12 ] = m00 * tx + m10 * ty + m20 * tz + m30
        dst[ 13 ] = m01 * tx + m11 * ty + m21 * tz + m31
        dst[ 14 ] = m02 * tx + m12 * ty + m22 * tz + m32
        dst[ 15 ] = m03 * tx + m13 * ty + m23 * tz + m33

        return dst
    }

    /**
     * Makes an x rotation matrix
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function xRotation(angleInRadians, dst) {
        dst   = dst || new Float32Array(16)
        var c = Math.cos(angleInRadians)
        var s = Math.sin(angleInRadians)

        dst[ 0 ]  = 1
        dst[ 1 ]  = 0
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = c
        dst[ 6 ]  = s
        dst[ 7 ]  = 0
        dst[ 8 ]  = 0
        dst[ 9 ]  = -s
        dst[ 10 ] = c
        dst[ 11 ] = 0
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = 0
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Multiply by an x rotation matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function xRotate(m, angleInRadians, dst) {
        // this is the optimized version of
        // return multiply(m, xRotation(angleInRadians), dst);
        dst = dst || new Float32Array(16)

        var m10 = m[ 4 ]
        var m11 = m[ 5 ]
        var m12 = m[ 6 ]
        var m13 = m[ 7 ]
        var m20 = m[ 8 ]
        var m21 = m[ 9 ]
        var m22 = m[ 10 ]
        var m23 = m[ 11 ]
        var c   = Math.cos(angleInRadians)
        var s   = Math.sin(angleInRadians)

        dst[ 4 ]  = c * m10 + s * m20
        dst[ 5 ]  = c * m11 + s * m21
        dst[ 6 ]  = c * m12 + s * m22
        dst[ 7 ]  = c * m13 + s * m23
        dst[ 8 ]  = c * m20 - s * m10
        dst[ 9 ]  = c * m21 - s * m11
        dst[ 10 ] = c * m22 - s * m12
        dst[ 11 ] = c * m23 - s * m13

        if ( m !== dst ) {
            dst[ 0 ]  = m[ 0 ]
            dst[ 1 ]  = m[ 1 ]
            dst[ 2 ]  = m[ 2 ]
            dst[ 3 ]  = m[ 3 ]
            dst[ 12 ] = m[ 12 ]
            dst[ 13 ] = m[ 13 ]
            dst[ 14 ] = m[ 14 ]
            dst[ 15 ] = m[ 15 ]
        }

        return dst
    }

    /**
     * Makes an y rotation matrix
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function yRotation(angleInRadians, dst) {
        dst   = dst || new Float32Array(16)
        var c = Math.cos(angleInRadians)
        var s = Math.sin(angleInRadians)

        dst[ 0 ]  = c
        dst[ 1 ]  = 0
        dst[ 2 ]  = -s
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = 1
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = s
        dst[ 9 ]  = 0
        dst[ 10 ] = c
        dst[ 11 ] = 0
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = 0
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Multiply by an y rotation matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function yRotate(m, angleInRadians, dst) {
        // this is the optimized verison of
        // return multiply(m, yRotation(angleInRadians), dst);
        dst = dst || new Float32Array(16)

        var m00 = m[ 0 * 4 + 0 ]
        var m01 = m[ 0 * 4 + 1 ]
        var m02 = m[ 0 * 4 + 2 ]
        var m03 = m[ 0 * 4 + 3 ]
        var m20 = m[ 2 * 4 + 0 ]
        var m21 = m[ 2 * 4 + 1 ]
        var m22 = m[ 2 * 4 + 2 ]
        var m23 = m[ 2 * 4 + 3 ]
        var c   = Math.cos(angleInRadians)
        var s   = Math.sin(angleInRadians)

        dst[ 0 ]  = c * m00 - s * m20
        dst[ 1 ]  = c * m01 - s * m21
        dst[ 2 ]  = c * m02 - s * m22
        dst[ 3 ]  = c * m03 - s * m23
        dst[ 8 ]  = c * m20 + s * m00
        dst[ 9 ]  = c * m21 + s * m01
        dst[ 10 ] = c * m22 + s * m02
        dst[ 11 ] = c * m23 + s * m03

        if ( m !== dst ) {
            dst[ 4 ]  = m[ 4 ]
            dst[ 5 ]  = m[ 5 ]
            dst[ 6 ]  = m[ 6 ]
            dst[ 7 ]  = m[ 7 ]
            dst[ 12 ] = m[ 12 ]
            dst[ 13 ] = m[ 13 ]
            dst[ 14 ] = m[ 14 ]
            dst[ 15 ] = m[ 15 ]
        }

        return dst
    }

    /**
     * Makes an z rotation matrix
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function zRotation(angleInRadians, dst) {
        dst   = dst || new Float32Array(16)
        var c = Math.cos(angleInRadians)
        var s = Math.sin(angleInRadians)

        dst[ 0 ]  = c
        dst[ 1 ]  = s
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = -s
        dst[ 5 ]  = c
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = 0
        dst[ 9 ]  = 0
        dst[ 10 ] = 1
        dst[ 11 ] = 0
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = 0
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Multiply by an z rotation matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function zRotate(m, angleInRadians, dst) {
        // This is the optimized verison of
        // return multiply(m, zRotation(angleInRadians), dst);
        dst = dst || new Float32Array(16)

        var m00 = m[ 0 * 4 + 0 ]
        var m01 = m[ 0 * 4 + 1 ]
        var m02 = m[ 0 * 4 + 2 ]
        var m03 = m[ 0 * 4 + 3 ]
        var m10 = m[ 1 * 4 + 0 ]
        var m11 = m[ 1 * 4 + 1 ]
        var m12 = m[ 1 * 4 + 2 ]
        var m13 = m[ 1 * 4 + 3 ]
        var c   = Math.cos(angleInRadians)
        var s   = Math.sin(angleInRadians)

        dst[ 0 ] = c * m00 + s * m10
        dst[ 1 ] = c * m01 + s * m11
        dst[ 2 ] = c * m02 + s * m12
        dst[ 3 ] = c * m03 + s * m13
        dst[ 4 ] = c * m10 - s * m00
        dst[ 5 ] = c * m11 - s * m01
        dst[ 6 ] = c * m12 - s * m02
        dst[ 7 ] = c * m13 - s * m03

        if ( m !== dst ) {
            dst[ 8 ]  = m[ 8 ]
            dst[ 9 ]  = m[ 9 ]
            dst[ 10 ] = m[ 10 ]
            dst[ 11 ] = m[ 11 ]
            dst[ 12 ] = m[ 12 ]
            dst[ 13 ] = m[ 13 ]
            dst[ 14 ] = m[ 14 ]
            dst[ 15 ] = m[ 15 ]
        }

        return dst
    }

    /**
     * Makes an rotation matrix around an arbitrary axis
     * @param {Vector3} axis axis to rotate around
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function axisRotation(axis, angleInRadians, dst) {
        dst = dst || new Float32Array(16)

        var x              = axis[ 0 ]
        var y              = axis[ 1 ]
        var z              = axis[ 2 ]
        var n              = Math.sqrt(x * x + y * y + z * z)
        x /= n
        y /= n
        z /= n
        var xx             = x * x
        var yy             = y * y
        var zz             = z * z
        var c              = Math.cos(angleInRadians)
        var s              = Math.sin(angleInRadians)
        var oneMinusCosine = 1 - c

        dst[ 0 ]  = xx + (1 - xx) * c
        dst[ 1 ]  = x * y * oneMinusCosine + z * s
        dst[ 2 ]  = x * z * oneMinusCosine - y * s
        dst[ 3 ]  = 0
        dst[ 4 ]  = x * y * oneMinusCosine - z * s
        dst[ 5 ]  = yy + (1 - yy) * c
        dst[ 6 ]  = y * z * oneMinusCosine + x * s
        dst[ 7 ]  = 0
        dst[ 8 ]  = x * z * oneMinusCosine + y * s
        dst[ 9 ]  = y * z * oneMinusCosine - x * s
        dst[ 10 ] = zz + (1 - zz) * c
        dst[ 11 ] = 0
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = 0
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Multiply by an axis rotation matrix
     * @param {Matrix4} m matrix to multiply
     * @param {Vector3} axis axis to rotate around
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function axisRotate(m, axis, angleInRadians, dst) {
        // This is the optimized verison of
        // return multiply(m, axisRotation(axis, angleInRadians), dst);
        dst = dst || new Float32Array(16)

        var x              = axis[ 0 ]
        var y              = axis[ 1 ]
        var z              = axis[ 2 ]
        var n              = Math.sqrt(x * x + y * y + z * z)
        x /= n
        y /= n
        z /= n
        var xx             = x * x
        var yy             = y * y
        var zz             = z * z
        var c              = Math.cos(angleInRadians)
        var s              = Math.sin(angleInRadians)
        var oneMinusCosine = 1 - c

        var r00 = xx + (1 - xx) * c
        var r01 = x * y * oneMinusCosine + z * s
        var r02 = x * z * oneMinusCosine - y * s
        var r10 = x * y * oneMinusCosine - z * s
        var r11 = yy + (1 - yy) * c
        var r12 = y * z * oneMinusCosine + x * s
        var r20 = x * z * oneMinusCosine + y * s
        var r21 = y * z * oneMinusCosine - x * s
        var r22 = zz + (1 - zz) * c

        var m00 = m[ 0 ]
        var m01 = m[ 1 ]
        var m02 = m[ 2 ]
        var m03 = m[ 3 ]
        var m10 = m[ 4 ]
        var m11 = m[ 5 ]
        var m12 = m[ 6 ]
        var m13 = m[ 7 ]
        var m20 = m[ 8 ]
        var m21 = m[ 9 ]
        var m22 = m[ 10 ]
        var m23 = m[ 11 ]

        dst[ 0 ]  = r00 * m00 + r01 * m10 + r02 * m20
        dst[ 1 ]  = r00 * m01 + r01 * m11 + r02 * m21
        dst[ 2 ]  = r00 * m02 + r01 * m12 + r02 * m22
        dst[ 3 ]  = r00 * m03 + r01 * m13 + r02 * m23
        dst[ 4 ]  = r10 * m00 + r11 * m10 + r12 * m20
        dst[ 5 ]  = r10 * m01 + r11 * m11 + r12 * m21
        dst[ 6 ]  = r10 * m02 + r11 * m12 + r12 * m22
        dst[ 7 ]  = r10 * m03 + r11 * m13 + r12 * m23
        dst[ 8 ]  = r20 * m00 + r21 * m10 + r22 * m20
        dst[ 9 ]  = r20 * m01 + r21 * m11 + r22 * m21
        dst[ 10 ] = r20 * m02 + r21 * m12 + r22 * m22
        dst[ 11 ] = r20 * m03 + r21 * m13 + r22 * m23

        if ( m !== dst ) {
            dst[ 12 ] = m[ 12 ]
            dst[ 13 ] = m[ 13 ]
            dst[ 14 ] = m[ 14 ]
            dst[ 15 ] = m[ 15 ]
        }

        return dst
    }

    /**
     * Makes a scale matrix
     * @param {number} sx x scale.
     * @param {number} sy y scale.
     * @param {number} sz z scale.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function scaling(sx, sy, sz, dst) {
        dst = dst || new Float32Array(16)

        dst[ 0 ]  = sx
        dst[ 1 ]  = 0
        dst[ 2 ]  = 0
        dst[ 3 ]  = 0
        dst[ 4 ]  = 0
        dst[ 5 ]  = sy
        dst[ 6 ]  = 0
        dst[ 7 ]  = 0
        dst[ 8 ]  = 0
        dst[ 9 ]  = 0
        dst[ 10 ] = sz
        dst[ 11 ] = 0
        dst[ 12 ] = 0
        dst[ 13 ] = 0
        dst[ 14 ] = 0
        dst[ 15 ] = 1

        return dst
    }

    /**
     * Multiply by a scaling matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} sx x scale.
     * @param {number} sy y scale.
     * @param {number} sz z scale.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function scale(m, sx, sy, sz, dst) {
        // This is the optimized verison of
        // return multiply(m, scaling(sx, sy, sz), dst);
        dst = dst || new Float32Array(16)

        dst[ 0 ]  = sx * m[ 0 * 4 + 0 ]
        dst[ 1 ]  = sx * m[ 0 * 4 + 1 ]
        dst[ 2 ]  = sx * m[ 0 * 4 + 2 ]
        dst[ 3 ]  = sx * m[ 0 * 4 + 3 ]
        dst[ 4 ]  = sy * m[ 1 * 4 + 0 ]
        dst[ 5 ]  = sy * m[ 1 * 4 + 1 ]
        dst[ 6 ]  = sy * m[ 1 * 4 + 2 ]
        dst[ 7 ]  = sy * m[ 1 * 4 + 3 ]
        dst[ 8 ]  = sz * m[ 2 * 4 + 0 ]
        dst[ 9 ]  = sz * m[ 2 * 4 + 1 ]
        dst[ 10 ] = sz * m[ 2 * 4 + 2 ]
        dst[ 11 ] = sz * m[ 2 * 4 + 3 ]

        if ( m !== dst ) {
            dst[ 12 ] = m[ 12 ]
            dst[ 13 ] = m[ 13 ]
            dst[ 14 ] = m[ 14 ]
            dst[ 15 ] = m[ 15 ]
        }

        return dst
    }

    /**
     * Computes the inverse of a matrix.
     * @param {Matrix4} m matrix to compute inverse of
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    function inverse(m, dst) {
        dst        = dst || new Float32Array(16)
        var m00    = m[ 0 * 4 + 0 ]
        var m01    = m[ 0 * 4 + 1 ]
        var m02    = m[ 0 * 4 + 2 ]
        var m03    = m[ 0 * 4 + 3 ]
        var m10    = m[ 1 * 4 + 0 ]
        var m11    = m[ 1 * 4 + 1 ]
        var m12    = m[ 1 * 4 + 2 ]
        var m13    = m[ 1 * 4 + 3 ]
        var m20    = m[ 2 * 4 + 0 ]
        var m21    = m[ 2 * 4 + 1 ]
        var m22    = m[ 2 * 4 + 2 ]
        var m23    = m[ 2 * 4 + 3 ]
        var m30    = m[ 3 * 4 + 0 ]
        var m31    = m[ 3 * 4 + 1 ]
        var m32    = m[ 3 * 4 + 2 ]
        var m33    = m[ 3 * 4 + 3 ]
        var tmp_0  = m22 * m33
        var tmp_1  = m32 * m23
        var tmp_2  = m12 * m33
        var tmp_3  = m32 * m13
        var tmp_4  = m12 * m23
        var tmp_5  = m22 * m13
        var tmp_6  = m02 * m33
        var tmp_7  = m32 * m03
        var tmp_8  = m02 * m23
        var tmp_9  = m22 * m03
        var tmp_10 = m02 * m13
        var tmp_11 = m12 * m03
        var tmp_12 = m20 * m31
        var tmp_13 = m30 * m21
        var tmp_14 = m10 * m31
        var tmp_15 = m30 * m11
        var tmp_16 = m10 * m21
        var tmp_17 = m20 * m11
        var tmp_18 = m00 * m31
        var tmp_19 = m30 * m01
        var tmp_20 = m00 * m21
        var tmp_21 = m20 * m01
        var tmp_22 = m00 * m11
        var tmp_23 = m10 * m01

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

        dst[ 0 ]  = d * t0
        dst[ 1 ]  = d * t1
        dst[ 2 ]  = d * t2
        dst[ 3 ]  = d * t3
        dst[ 4 ]  = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30))
        dst[ 5 ]  = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30))
        dst[ 6 ]  = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30))
        dst[ 7 ]  = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20))
        dst[ 8 ]  = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33))
        dst[ 9 ]  = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33))
        dst[ 10 ] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33))
        dst[ 11 ] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23))
        dst[ 12 ] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22))
        dst[ 13 ] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02))
        dst[ 14 ] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12))
        dst[ 15 ] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))

        return dst
    }

    /**
     * Takes a  matrix and a vector with 4 entries, transforms that vector by
     * the matrix, and returns the result as a vector with 4 entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector4} v The point in homogenous coordinates.
     * @param {Vector4} dst optional vector4 to store result
     * @return {Vector4} dst or new Vector4 if not provided
     * @memberOf module:webgl-3d-math
     */
    function transformVector(m, v, dst) {
        dst = dst || new Float32Array(4)
        for ( var i = 0; i < 4; ++i ) {
            dst[ i ] = 0.0
            for ( var j = 0; j < 4; ++j ) {
                dst[ i ] += v[ j ] * m[ j * 4 + i ]
            }
        }
        return dst
    }

    /**
     * Takes a 4-by-4 matrix and a vector with 3 entries,
     * interprets the vector as a point, transforms that point by the matrix, and
     * returns the result as a vector with 3 entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector3} v The point.
     * @param {Vector4} dst optional vector4 to store result
     * @return {Vector4} dst or new Vector4 if not provided
     * @memberOf module:webgl-3d-math
     */
    function transformPoint(m, v, dst) {
        dst    = dst || new Float32Array(3)
        var v0 = v[ 0 ]
        var v1 = v[ 1 ]
        var v2 = v[ 2 ]
        var d  = v0 * m[ 0 * 4 + 3 ] + v1 * m[ 1 * 4 + 3 ] + v2 * m[ 2 * 4 + 3 ] + m[ 3 * 4 + 3 ]

        dst[ 0 ] = (v0 * m[ 0 * 4 + 0 ] + v1 * m[ 1 * 4 + 0 ] + v2 * m[ 2 * 4 + 0 ] + m[ 3 * 4 + 0 ]) / d
        dst[ 1 ] = (v0 * m[ 0 * 4 + 1 ] + v1 * m[ 1 * 4 + 1 ] + v2 * m[ 2 * 4 + 1 ] + m[ 3 * 4 + 1 ]) / d
        dst[ 2 ] = (v0 * m[ 0 * 4 + 2 ] + v1 * m[ 1 * 4 + 2 ] + v2 * m[ 2 * 4 + 2 ] + m[ 3 * 4 + 2 ]) / d

        return dst
    }

    /**
     * Takes a 4-by-4 matrix and a vector with 3 entries, interprets the vector as a
     * direction, transforms that direction by the matrix, and returns the result;
     * assumes the transformation of 3-dimensional space represented by the matrix
     * is parallel-preserving, i.e. any combination of rotation, scaling and
     * translation, but not a perspective distortion. Returns a vector with 3
     * entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector3} v The direction.
     * @param {Vector4} dst optional vector4 to store result
     * @return {Vector4} dst or new Vector4 if not provided
     * @memberOf module:webgl-3d-math
     */
    function transformDirection(m, v, dst) {
        dst = dst || new Float32Array(3)

        var v0 = v[ 0 ]
        var v1 = v[ 1 ]
        var v2 = v[ 2 ]

        dst[ 0 ] = v0 * m[ 0 * 4 + 0 ] + v1 * m[ 1 * 4 + 0 ] + v2 * m[ 2 * 4 + 0 ]
        dst[ 1 ] = v0 * m[ 0 * 4 + 1 ] + v1 * m[ 1 * 4 + 1 ] + v2 * m[ 2 * 4 + 1 ]
        dst[ 2 ] = v0 * m[ 0 * 4 + 2 ] + v1 * m[ 1 * 4 + 2 ] + v2 * m[ 2 * 4 + 2 ]

        return dst
    }

    /**
     * Takes a 4-by-4 matrix m and a vector v with 3 entries, interprets the vector
     * as a normal to a surface, and computes a vector which is normal upon
     * transforming that surface by the matrix. The effect of this function is the
     * same as transforming v (as a direction) by the inverse-transpose of m.  This
     * function assumes the transformation of 3-dimensional space represented by the
     * matrix is parallel-preserving, i.e. any combination of rotation, scaling and
     * translation, but not a perspective distortion.  Returns a vector with 3
     * entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector3} v The normal.
     * @param {Vector3} [dst] The direction.
     * @return {Vector3} The transformed direction.
     * @memberOf module:webgl-3d-math
     */
    function transformNormal(m, v, dst) {
        dst    = dst || new Float32Array(3)
        var mi = inverse(m)
        var v0 = v[ 0 ]
        var v1 = v[ 1 ]
        var v2 = v[ 2 ]

        dst[ 0 ] = v0 * mi[ 0 * 4 + 0 ] + v1 * mi[ 0 * 4 + 1 ] + v2 * mi[ 0 * 4 + 2 ]
        dst[ 1 ] = v0 * mi[ 1 * 4 + 0 ] + v1 * mi[ 1 * 4 + 1 ] + v2 * mi[ 1 * 4 + 2 ]
        dst[ 2 ] = v0 * mi[ 2 * 4 + 0 ] + v1 * mi[ 2 * 4 + 1 ] + v2 * mi[ 2 * 4 + 2 ]

        return dst
    }

    function copy(src, dst) {
        dst = dst || new Float32Array(16)

        dst[ 0 ]  = src[ 0 ]
        dst[ 1 ]  = src[ 1 ]
        dst[ 2 ]  = src[ 2 ]
        dst[ 3 ]  = src[ 3 ]
        dst[ 4 ]  = src[ 4 ]
        dst[ 5 ]  = src[ 5 ]
        dst[ 6 ]  = src[ 6 ]
        dst[ 7 ]  = src[ 7 ]
        dst[ 8 ]  = src[ 8 ]
        dst[ 9 ]  = src[ 9 ]
        dst[ 10 ] = src[ 10 ]
        dst[ 11 ] = src[ 11 ]
        dst[ 12 ] = src[ 12 ]
        dst[ 13 ] = src[ 13 ]
        dst[ 14 ] = src[ 14 ]
        dst[ 15 ] = src[ 15 ]

        return dst
    }

    return {
        copy: copy,
        lookAt: lookAt,
        addVectors: addVectors,
        subtractVectors: subtractVectors,
        distance: distance,
        distanceSq: distanceSq,
        normalize: normalize,
        cross: cross,
        dot: dot,
        identity: identity,
        transpose: transpose,
        orthographic: orthographic,
        frustum: frustum,
        perspective: perspective,
        translation: translation,
        translate: translate,
        xRotation: xRotation,
        yRotation: yRotation,
        zRotation: zRotation,
        xRotate: xRotate,
        yRotate: yRotate,
        zRotate: zRotate,
        axisRotation: axisRotation,
        axisRotate: axisRotate,
        scaling: scaling,
        scale: scale,
        multiply: multiply,
        inverse: inverse,
        transformVector: transformVector,
        transformPoint: transformPoint,
        transformDirection: transformDirection,
        transformNormal: transformNormal
    }

}))



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * Copyright 2012, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

(function (root, factory) {  // eslint-disable-line
    if ( true ) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return factory.call(root)
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
    }
    else {
        // Browser globals
        root.webglUtils = factory.call(root)
    }
}(this, function () {
    'use strict'

    var topWindow = this

    /** @module webgl-utils */

    /**
     * Wrapped logging function.
     * @param {string} msg The message to log.
     */
    function error(msg) {
        if ( topWindow.console ) {
            if ( topWindow.console.error ) {
                topWindow.console.error(msg)
            }
            else if ( topWindow.console.log ) {
                topWindow.console.log(msg)
            }
        }
    }

    /**
     * Error Callback
     * @callback ErrorCallback
     * @param {string} msg error message.
     * @memberOf module:webgl-utils
     */

    /**
     * Loads a shader.
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {string} shaderSource The shader source.
     * @param {number} shaderType The type of shader.
     * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.
     * @return {WebGLShader} The created shader.
     */
    function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
        var errFn  = opt_errorCallback || error
        // Create the shader object
        var shader = gl.createShader(shaderType)

        // Load the shader source
        gl.shaderSource(shader, shaderSource)

        // Compile the shader
        gl.compileShader(shader)

        // Check the compile status
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if ( !compiled ) {
            // Something went wrong during compilation; get the error
            var lastError = gl.getShaderInfoLog(shader)
            errFn('*** Error compiling shader \'' + shader + '\':' + lastError)
            gl.deleteShader(shader)
            return null
        }

        return shader
    }

    /**
     * Creates a program, attaches shaders, binds attrib locations, links the
     * program and calls useProgram.
     * @param {WebGLShader[]} shaders The shaders to attach
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
     *        on error. If you want something else pass an callback. It's passed an error message.
     * @memberOf module:webgl-utils
     */
    function createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
        var errFn   = opt_errorCallback || error
        var program = gl.createProgram()
        shaders.forEach(function (shader) {
            gl.attachShader(program, shader)
        })
        if ( opt_attribs ) {
            opt_attribs.forEach(function (attrib, ndx) {
                gl.bindAttribLocation(
                    program,
                    opt_locations ? opt_locations[ ndx ] : ndx,
                    attrib)
            })
        }
        gl.linkProgram(program)

        // Check the link status
        var linked = gl.getProgramParameter(program, gl.LINK_STATUS)
        if ( !linked ) {
            // something went wrong with the link
            var lastError = gl.getProgramInfoLog(program)
            errFn('Error in program linking:' + lastError)

            gl.deleteProgram(program)
            return null
        }
        return program
    }

    /**
     * Loads a shader from a script tag.
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
     * @param {object} shaderObj The id of the script tag.
     * @param {number} opt_shaderType The type of shader. If not passed in it will
     *     be derived from the type of the script tag.
     * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors.
     * @return {WebGLShader} The created shader.
     */
    function createShaderFromScript(gl, shaderObj, opt_shaderType, opt_errorCallback) {
        var shaderSource = ''
        var shaderType

        shaderSource = shaderObj.src

        if ( !opt_shaderType ) {
            if ( shaderObj.type === 'x-shader/x-vertex' ) {
                shaderType = gl.VERTEX_SHADER
            }
            else if ( shaderObj.type === 'x-shader/x-fragment' ) {
                shaderType = gl.FRAGMENT_SHADER
            }
            else if ( shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER ) {
                throw ('*** Error: unknown shader type')
            }
        }

        return loadShader(
            gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
            opt_errorCallback)
    }

    var defaultShaderType = [
        'VERTEX_SHADER',
        'FRAGMENT_SHADER'
    ]

    /**
     * Creates a program from 2 script tags.
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {string[]} shaderScriptObjs Array of ids of the script
     *        tags for the shaders. The first is assumed to be the
     *        vertex shader, the second the fragment shader.
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
     *        on error. If you want something else pass an callback. It's passed an error message.
     * @return {WebGLProgram} The created program.
     * @memberOf module:webgl-utils
     */
    function createProgramFromScripts(gl, shaderScriptObjs, opt_attribs, opt_locations, opt_errorCallback) {
        var shaders = []
        for ( var ii = 0; ii < shaderScriptObjs.length; ++ii ) {
            shaders.push(createShaderFromScript(
                gl, shaderScriptObjs[ ii ], gl[ defaultShaderType[ ii ] ], opt_errorCallback))
        }
        return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback)
    }

    /**
     * Creates a program from 2 sources.
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {string[]} shaderSourcess Array of sources for the
     *        shaders. The first is assumed to be the vertex shader,
     *        the second the fragment shader.
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
     *        on error. If you want something else pass an callback. It's passed an error message.
     * @return {WebGLProgram} The created program.
     * @memberOf module:webgl-utils
     */
    function createProgramFromSources(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
        var shaders = []
        for ( var ii = 0; ii < shaderSources.length; ++ii ) {
            shaders.push(loadShader(
                gl, shaderSources[ ii ], gl[ defaultShaderType[ ii ] ], opt_errorCallback))
        }
        return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback)
    }

    /**
     * Returns the corresponding bind point for a given sampler type
     */
    function getBindPointForSamplerType(gl, type) {
        if ( type === gl.SAMPLER_2D )   return gl.TEXTURE_2D        // eslint-disable-line
        if ( type === gl.SAMPLER_CUBE ) return gl.TEXTURE_CUBE_MAP  // eslint-disable-line
        return undefined
    }

    /**
     * @typedef {Object.<string, function>} Setters
     */

    /**
     * Creates setter functions for all uniforms of a shader
     * program.
     *
     * @see {@link module:webgl-utils.setUniforms}
     *
     * @param {WebGLProgram} program the program to create setters for.
     * @returns {Object.<string, function>} an object with a setter by name for each uniform
     * @memberOf module:webgl-utils
     */
    function createUniformSetters(gl, program) {
        var textureUnit = 0

        /**
         * Creates a setter for a uniform of the given program with it's
         * location embedded in the setter.
         * @param {WebGLProgram} program
         * @param {WebGLUniformInfo} uniformInfo
         * @returns {function} the created setter.
         */
        function createUniformSetter(program, uniformInfo) {
            var location = gl.getUniformLocation(program, uniformInfo.name)
            var type     = uniformInfo.type
            // Check if this uniform is an array
            var isArray  = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]')
            if ( type === gl.FLOAT && isArray ) {
                return function (v) {
                    gl.uniform1fv(location, v)
                }
            }
            if ( type === gl.FLOAT ) {
                return function (v) {
                    gl.uniform1f(location, v)
                }
            }
            if ( type === gl.FLOAT_VEC2 ) {
                return function (v) {
                    gl.uniform2fv(location, v)
                }
            }
            if ( type === gl.FLOAT_VEC3 ) {
                return function (v) {
                    gl.uniform3fv(location, v)
                }
            }
            if ( type === gl.FLOAT_VEC4 ) {
                return function (v) {
                    gl.uniform4fv(location, v)
                }
            }
            if ( type === gl.INT && isArray ) {
                return function (v) {
                    gl.uniform1iv(location, v)
                }
            }
            if ( type === gl.INT ) {
                return function (v) {
                    gl.uniform1i(location, v)
                }
            }
            if ( type === gl.INT_VEC2 ) {
                return function (v) {
                    gl.uniform2iv(location, v)
                }
            }
            if ( type === gl.INT_VEC3 ) {
                return function (v) {
                    gl.uniform3iv(location, v)
                }
            }
            if ( type === gl.INT_VEC4 ) {
                return function (v) {
                    gl.uniform4iv(location, v)
                }
            }
            if ( type === gl.BOOL ) {
                return function (v) {
                    gl.uniform1iv(location, v)
                }
            }
            if ( type === gl.BOOL_VEC2 ) {
                return function (v) {
                    gl.uniform2iv(location, v)
                }
            }
            if ( type === gl.BOOL_VEC3 ) {
                return function (v) {
                    gl.uniform3iv(location, v)
                }
            }
            if ( type === gl.BOOL_VEC4 ) {
                return function (v) {
                    gl.uniform4iv(location, v)
                }
            }
            if ( type === gl.FLOAT_MAT2 ) {
                return function (v) {
                    gl.uniformMatrix2fv(location, false, v)
                }
            }
            if ( type === gl.FLOAT_MAT3 ) {
                return function (v) {
                    gl.uniformMatrix3fv(location, false, v)
                }
            }
            if ( type === gl.FLOAT_MAT4 ) {
                return function (v) {
                    gl.uniformMatrix4fv(location, false, v)
                }
            }
            if ( (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray ) {
                var units = []
                for ( var ii = 0; ii < info.size; ++ii ) {
                    units.push(textureUnit++)
                }
                return function (bindPoint, units) {
                    return function (textures) {
                        gl.uniform1iv(location, units)
                        textures.forEach(function (texture, index) {
                            gl.activeTexture(gl.TEXTURE0 + units[ index ])
                            gl.bindTexture(bindPoint, texture)
                        })
                    }
                }(getBindPointForSamplerType(gl, type), units)
            }
            if ( type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE ) {
                return function (bindPoint, unit) {
                    return function (texture) {
                        gl.uniform1i(location, unit)
                        gl.activeTexture(gl.TEXTURE0 + unit)
                        gl.bindTexture(bindPoint, texture)
                    }
                }(getBindPointForSamplerType(gl, type), textureUnit++)
            }
            throw ('unknown type: 0x' + type.toString(16)) // we should never get here.
        }

        var uniformSetters = {}
        var numUniforms    = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

        for ( var ii = 0; ii < numUniforms; ++ii ) {
            var uniformInfo = gl.getActiveUniform(program, ii)
            if ( !uniformInfo ) {
                break
            }
            var name = uniformInfo.name
            // remove the array suffix.
            if ( name.substr(-3) === '[0]' ) {
                name = name.substr(0, name.length - 3)
            }
            var setter             = createUniformSetter(program, uniformInfo)
            uniformSetters[ name ] = setter
        }
        return uniformSetters
    }

    /**
     * Set uniforms and binds related textures.
     *
     * example:
     *
     *     var programInfo = createProgramInfo(
     *         gl, ["some-vs", "some-fs");
     *
     *     var tex1 = gl.createTexture();
     *     var tex2 = gl.createTexture();
     *
     *     ... assume we setup the textures with data ...
     *
     *     var uniforms = {
   *       u_someSampler: tex1,
   *       u_someOtherSampler: tex2,
   *       u_someColor: [1,0,0,1],
   *       u_somePosition: [0,1,1],
   *       u_someMatrix: [
   *         1,0,0,0,
   *         0,1,0,0,
   *         0,0,1,0,
   *         0,0,0,0,
   *       ],
   *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the textures AND set the
     * uniforms.
     *
     *     setUniforms(programInfo.uniformSetters, uniforms);
     *
     * For the example above it is equivalent to
     *
     *     var texUnit = 0;
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex1);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.activeTexture(gl.TEXTURE0 + texUnit);
     *     gl.bindTexture(gl.TEXTURE_2D, tex2);
     *     gl.uniform1i(u_someSamplerLocation, texUnit++);
     *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
     *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
     *     gl.uniformMatrix4fv(u_someMatrix, false, [
     *         1,0,0,0,
     *         0,1,0,0,
     *         0,0,1,0,
     *         0,0,0,0,
     *       ]);
     *
     * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
     *
     *     var uniforms = {
   *       u_someSampler: tex1,
   *       u_someOtherSampler: tex2,
   *     };
     *
     *     var moreUniforms {
   *       u_someColor: [1,0,0,1],
   *       u_somePosition: [0,1,1],
   *       u_someMatrix: [
   *         1,0,0,0,
   *         0,1,0,0,
   *         0,0,1,0,
   *         0,0,0,0,
   *       ],
   *     };
     *
     *     setUniforms(programInfo.uniformSetters, uniforms);
     *     setUniforms(programInfo.uniformSetters, moreUniforms);
     *
     * @param {Object.<string, function>|module:webgl-utils.ProgramInfo} setters the setters returned from
     *        `createUniformSetters` or a ProgramInfo from {@link module:webgl-utils.createProgramInfo}.
     * @param {Object.<string, value>} an object with values for the
     *        uniforms.
     * @memberOf module:webgl-utils
     */
    function setUniforms(setters, values) {
        setters = setters.uniformSetters || setters
        Object.keys(values).forEach(function (name) {
            var setter = setters[ name ]
            if ( setter ) {
                setter(values[ name ])
            }
        })
    }

    /**
     * Creates setter functions for all attributes of a shader
     * program. You can pass this to {@link module:webgl-utils.setBuffersAndAttributes} to set all your buffers and attributes.
     *
     * @see {@link module:webgl-utils.setAttributes} for example
     * @param {WebGLProgram} program the program to create setters for.
     * @return {Object.<string, function>} an object with a setter for each attribute by name.
     * @memberOf module:webgl-utils
     */
    function createAttributeSetters(gl, program) {
        var attribSetters = {}

        function createAttribSetter(index) {
            return function (b) {
                gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer)
                gl.enableVertexAttribArray(index)
                gl.vertexAttribPointer(
                    index, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0)
            }
        }

        var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
        for ( var ii = 0; ii < numAttribs; ++ii ) {
            var attribInfo = gl.getActiveAttrib(program, ii)
            if ( !attribInfo ) {
                break
            }
            var index                        = gl.getAttribLocation(program, attribInfo.name)
            attribSetters[ attribInfo.name ] = createAttribSetter(index)
        }

        return attribSetters
    }

    /**
     * Sets attributes and binds buffers (deprecated... use {@link module:webgl-utils.setBuffersAndAttributes})
     *
     * Example:
     *
     *     var program = createProgramFromScripts(
     *         gl, ["some-vs", "some-fs");
     *
     *     var attribSetters = createAttributeSetters(program);
     *
     *     var positionBuffer = gl.createBuffer();
     *     var texcoordBuffer = gl.createBuffer();
     *
     *     var attribs = {
   *       a_position: {buffer: positionBuffer, numComponents: 3},
   *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
   *     };
     *
     *     gl.useProgram(program);
     *
     * This will automatically bind the buffers AND set the
     * attributes.
     *
     *     setAttributes(attribSetters, attribs);
     *
     * Properties of attribs. For each attrib you can add
     * properties:
     *
     * *   type: the type of data in the buffer. Default = gl.FLOAT
     * *   normalize: whether or not to normalize the data. Default = false
     * *   stride: the stride. Default = 0
     * *   offset: offset into the buffer. Default = 0
     *
     * For example if you had 3 value float positions, 2 value
     * float texcoord and 4 value uint8 colors you'd setup your
     * attribs like this
     *
     *     var attribs = {
   *       a_position: {buffer: positionBuffer, numComponents: 3},
   *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
   *       a_color: {
   *         buffer: colorBuffer,
   *         numComponents: 4,
   *         type: gl.UNSIGNED_BYTE,
   *         normalize: true,
   *       },
   *     };
     *
     * @param {Object.<string, function>|model:webgl-utils.ProgramInfo} setters Attribute setters as returned from createAttributeSetters or a ProgramInfo as returned {@link module:webgl-utils.createProgramInfo}
     * @param {Object.<string, module:webgl-utils.AttribInfo>} attribs AttribInfos mapped by attribute name.
     * @memberOf module:webgl-utils
     * @deprecated use {@link module:webgl-utils.setBuffersAndAttributes}
     */
    function setAttributes(setters, attribs) {
        setters = setters.attribSetters || setters
        Object.keys(attribs).forEach(function (name) {
            var setter = setters[ name ]
            if ( setter ) {
                setter(attribs[ name ])
            }
        })
    }

    /**
     * Creates a vertex array object and then sets the attributes
     * on it
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {Object.<string, function>} setters Attribute setters as returned from createAttributeSetters
     * @param {Object.<string, module:webgl-utils.AttribInfo>} attribs AttribInfos mapped by attribute name.
     * @param {WebGLBuffer} [indices] an optional ELEMENT_ARRAY_BUFFER of indices
     */
    function createVAOAndSetAttributes(gl, setters, attribs, indices) {
        var vao = gl.createVertexArray()
        gl.bindVertexArray(vao)
        setAttributes(setters, attribs)
        if ( indices ) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices)
        }
        // We unbind this because otherwise any change to ELEMENT_ARRAY_BUFFER
        // like when creating buffers for other stuff will mess up this VAO's binding
        gl.bindVertexArray(null)
        return vao
    }

    /**
     * Creates a vertex array object and then sets the attributes
     * on it
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {Object.<string, function>| module:webgl-utils.ProgramInfo} programInfo as returned from createProgramInfo or Attribute setters as returned from createAttributeSetters
     * @param {module:webgl-utils:BufferInfo} bufferInfo BufferInfo as returned from createBufferInfoFromArrays etc...
     * @param {WebGLBuffer} [indices] an optional ELEMENT_ARRAY_BUFFER of indices
     */
    function createVAOFromBufferInfo(gl, programInfo, bufferInfo) {
        return createVAOAndSetAttributes(gl, programInfo.attribSetters || programInfo, bufferInfo.attribs, bufferInfo.indices)
    }

    /**
     * @typedef {Object} ProgramInfo
     * @property {WebGLProgram} program A shader program
     * @property {Object<string, function>} uniformSetters: object of setters as returned from createUniformSetters,
     * @property {Object<string, function>} attribSetters: object of setters as returned from createAttribSetters,
     * @memberOf module:webgl-utils
     */

    /**
     * Creates a ProgramInfo from 2 sources.
     *
     * A ProgramInfo contains
     *
     *     programInfo = {
   *        program: WebGLProgram,
   *        uniformSetters: object of setters as returned from createUniformSetters,
   *        attribSetters: object of setters as returned from createAttribSetters,
   *     }
     *
     * @param {WebGLRenderingContext} gl The WebGLRenderingContext
     *        to use.
     * @param {string[]} shaderSourcess Array of sources for the
     *        shaders or ids. The first is assumed to be the vertex shader,
     *        the second the fragment shader.
     * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
     * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
     * @param {module:webgl-utils.ErrorCallback} opt_errorCallback callback for errors. By default it just prints an error to the console
     *        on error. If you want something else pass an callback. It's passed an error message.
     * @return {module:webgl-utils.ProgramInfo} The created program.
     * @memberOf module:webgl-utils
     */
    function createProgramInfo(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
        shaderSources = shaderSources.map(function (source) {
            var script = document.getElementById(source)
            return script ? script.text : source
        })
        var program   = webglUtils.createProgramFromSources(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback)
        if ( !program ) {
            return null
        }
        var uniformSetters = createUniformSetters(gl, program)
        var attribSetters  = createAttributeSetters(gl, program)
        return {
            program: program,
            uniformSetters: uniformSetters,
            attribSetters: attribSetters
        }
    }

    /**
     * Sets attributes and buffers including the `ELEMENT_ARRAY_BUFFER` if appropriate
     *
     * Example:
     *
     *     var programInfo = createProgramInfo(
     *         gl, ["some-vs", "some-fs");
     *
     *     var arrays = {
   *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
   *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
   *     };
     *
     *     var bufferInfo = createBufferInfoFromArrays(gl, arrays);
     *
     *     gl.useProgram(programInfo.program);
     *
     * This will automatically bind the buffers AND set the
     * attributes.
     *
     *     setBuffersAndAttributes(programInfo.attribSetters, bufferInfo);
     *
     * For the example above it is equivilent to
     *
     *     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
     *     gl.enableVertexAttribArray(a_positionLocation);
     *     gl.vertexAttribPointer(a_positionLocation, 3, gl.FLOAT, false, 0, 0);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
     *     gl.enableVertexAttribArray(a_texcoordLocation);
     *     gl.vertexAttribPointer(a_texcoordLocation, 4, gl.FLOAT, false, 0, 0);
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
     * @param {Object.<string, function>} setters Attribute setters as returned from `createAttributeSetters`
     * @param {module:webgl-utils.BufferInfo} buffers a BufferInfo as returned from `createBufferInfoFromArrays`.
     * @memberOf module:webgl-utils
     */
    function setBuffersAndAttributes(gl, setters, buffers) {
        setAttributes(setters, buffers.attribs)
        if ( buffers.indices ) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)
        }
    }

    // Add your prefix here.
    var browserPrefixes = [
        '',
        'MOZ_',
        'OP_',
        'WEBKIT_'
    ]

    /**
     * Given an extension name like WEBGL_compressed_texture_s3tc
     * returns the supported version extension, like
     * WEBKIT_WEBGL_compressed_teture_s3tc
     * @param {string} name Name of extension to look for
     * @return {WebGLExtension} The extension or undefined if not
     *     found.
     * @memberOf module:webgl-utils
     */
    function getExtensionWithKnownPrefixes(gl, name) {
        for ( var ii = 0; ii < browserPrefixes.length; ++ii ) {
            var prefixedName = browserPrefixes[ ii ] + name
            var ext          = gl.getExtension(prefixedName)
            if ( ext ) {
                return ext
            }
        }
        return undefined
    }

    /**
     * Resize a canvas to match the size its displayed.
     * @param {HTMLCanvasElement} canvas The canvas to resize.
     * @param {number} [multiplier] amount to multiply by.
     *    Pass in window.devicePixelRatio for native pixels.
     * @return {boolean} true if the canvas was resized.
     * @memberOf module:webgl-utils
     */
    function resizeCanvasToDisplaySize(canvas, multiplier) {
        multiplier = multiplier || 1
        var width  = canvas.clientWidth * multiplier | 0
        var height = canvas.clientHeight * multiplier | 0
        if ( canvas.width !== width || canvas.height !== height ) {
            canvas.width  = width
            canvas.height = height
            return true
        }
        return false
    }

    // Add `push` to a typed array. It just keeps a 'cursor'
    // and allows use to `push` values into the array so we
    // don't have to manually compute offsets
    function augmentTypedArray(typedArray, numComponents) {
        var cursor               = 0
        typedArray.push          = function () {
            for ( var ii = 0; ii < arguments.length; ++ii ) {
                var value = arguments[ ii ]
                if ( value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer) ) {
                    for ( var jj = 0; jj < value.length; ++jj ) {
                        typedArray[ cursor++ ] = value[ jj ]
                    }
                }
                else {
                    typedArray[ cursor++ ] = value
                }
            }
        }
        typedArray.reset         = function (opt_index) {
            cursor = opt_index || 0
        }
        typedArray.numComponents = numComponents
        Object.defineProperty(typedArray, 'numElements', {
            get: function () {
                return this.length / this.numComponents | 0
            }
        })
        return typedArray
    }

    /**
     * creates a typed array with a `push` function attached
     * so that you can easily *push* values.
     *
     * `push` can take multiple arguments. If an argument is an array each element
     * of the array will be added to the typed array.
     *
     * Example:
     *
     *     var array = createAugmentedTypedArray(3, 2);  // creates a Float32Array with 6 values
     *     array.push(1, 2, 3);
     *     array.push([4, 5, 6]);
     *     // array now contains [1, 2, 3, 4, 5, 6]
     *
     * Also has `numComponents` and `numElements` properties.
     *
     * @param {number} numComponents number of components
     * @param {number} numElements number of elements. The total size of the array will be `numComponents * numElements`.
     * @param {constructor} opt_type A constructor for the type. Default = `Float32Array`.
     * @return {ArrayBuffer} A typed array.
     * @memberOf module:webgl-utils
     */
    function createAugmentedTypedArray(numComponents, numElements, opt_type) {
        var Type = opt_type || Float32Array
        return augmentTypedArray(new Type(numComponents * numElements), numComponents)
    }

    function createBufferFromTypedArray(gl, array, type, drawType) {
        type       = type || gl.ARRAY_BUFFER
        var buffer = gl.createBuffer()
        gl.bindBuffer(type, buffer)
        gl.bufferData(type, array, drawType || gl.STATIC_DRAW)
        return buffer
    }

    function allButIndices(name) {
        return name !== 'indices'
    }

    function createMapping(obj) {
        var mapping = {}
        Object.keys(obj).filter(allButIndices).forEach(function (key) {
            mapping[ 'a_' + key ] = key
        })
        return mapping
    }

    function getGLTypeForTypedArray(gl, typedArray) {
        if ( typedArray instanceof Int8Array ) { return gl.BYTE }            // eslint-disable-line
        if ( typedArray instanceof Uint8Array ) { return gl.UNSIGNED_BYTE }   // eslint-disable-line
        if ( typedArray instanceof Int16Array ) { return gl.SHORT }           // eslint-disable-line
        if ( typedArray instanceof Uint16Array ) { return gl.UNSIGNED_SHORT }  // eslint-disable-line
        if ( typedArray instanceof Int32Array ) { return gl.INT }             // eslint-disable-line
        if ( typedArray instanceof Uint32Array ) { return gl.UNSIGNED_INT }    // eslint-disable-line
        if ( typedArray instanceof Float32Array ) { return gl.FLOAT }           // eslint-disable-line
        throw 'unsupported typed array type'
    }

    // This is really just a guess. Though I can't really imagine using
    // anything else? Maybe for some compression?
    function getNormalizationForTypedArray(typedArray) {
        if ( typedArray instanceof Int8Array ) { return true }  // eslint-disable-line
        if ( typedArray instanceof Uint8Array ) { return true }  // eslint-disable-line
        return false
    }

    function isArrayBuffer(a) {
        return a.buffer && a.buffer instanceof ArrayBuffer
    }

    function guessNumComponentsFromName(name, length) {
        var numComponents
        if ( name.indexOf('coord') >= 0 ) {
            numComponents = 2
        }
        else if ( name.indexOf('color') >= 0 ) {
            numComponents = 4
        }
        else {
            numComponents = 3  // position, normals, indices ...
        }

        if ( length % numComponents > 0 ) {
            throw 'can not guess numComponents. You should specify it.'
        }

        return numComponents
    }

    function makeTypedArray(array, name) {
        if ( isArrayBuffer(array) ) {
            return array
        }

        if ( Array.isArray(array) ) {
            array = {
                data: array
            }
        }

        if ( !array.numComponents ) {
            array.numComponents = guessNumComponentsFromName(name, array.length)
        }

        var type = array.type
        if ( !type ) {
            if ( name === 'indices' ) {
                type = Uint16Array
            }
        }
        var typedArray = createAugmentedTypedArray(array.numComponents, array.data.length / array.numComponents | 0, type)
        typedArray.push(array.data)
        return typedArray
    }

    /**
     * @typedef {Object} AttribInfo
     * @property {number} [numComponents] the number of components for this attribute.
     * @property {number} [size] the number of components for this attribute.
     * @property {number} [type] the type of the attribute (eg. `gl.FLOAT`, `gl.UNSIGNED_BYTE`, etc...) Default = `gl.FLOAT`
     * @property {boolean} [normalized] whether or not to normalize the data. Default = false
     * @property {number} [offset] offset into buffer in bytes. Default = 0
     * @property {number} [stride] the stride in bytes per element. Default = 0
     * @property {WebGLBuffer} buffer the buffer that contains the data for this attribute
     * @memberOf module:webgl-utils
     */

    /**
     * Creates a set of attribute data and WebGLBuffers from set of arrays
     *
     * Given
     *
     *      var arrays = {
   *        position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
   *        texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
   *        normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
   *        color:    { numComponents: 4, data: [255, 255, 255, 255, 255, 0, 0, 255, 0, 0, 255, 255], type: Uint8Array, },
   *        indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
   *      };
     *
     * returns something like
     *
     *      var attribs = {
   *        a_position: { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
   *        a_texcoord: { numComponents: 2, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
   *        a_normal:   { numComponents: 3, type: gl.FLOAT,         normalize: false, buffer: WebGLBuffer, },
   *        a_color:    { numComponents: 4, type: gl.UNSIGNED_BYTE, normalize: true,  buffer: WebGLBuffer, },
   *      };
     *
     * @param {WebGLRenderingContext} gl The webgl rendering context.
     * @param {Object.<string, array|typedarray>} arrays The arrays
     * @param {Object.<string, string>} [opt_mapping] mapping from attribute name to array name.
     *     if not specified defaults to "a_name" -> "name".
     * @return {Object.<string, module:webgl-utils.AttribInfo>} the attribs
     * @memberOf module:webgl-utils
     */
    function createAttribsFromArrays(gl, arrays, opt_mapping) {
        var mapping = opt_mapping || createMapping(arrays)
        var attribs = {}
        Object.keys(mapping).forEach(function (attribName) {
            var bufferName        = mapping[ attribName ]
            var array             = makeTypedArray(arrays[ bufferName ], bufferName)
            attribs[ attribName ] = {
                buffer: createBufferFromTypedArray(gl, array),
                numComponents: array.numComponents || guessNumComponentsFromName(bufferName),
                type: getGLTypeForTypedArray(gl, array),
                normalize: getNormalizationForTypedArray(array)
            }
        })
        return attribs
    }

    /**
     * tries to get the number of elements from a set of arrays.
     */
    function getNumElementsFromNonIndexedArrays(arrays) {
        var key   = Object.keys(arrays)[ 0 ]
        var array = arrays[ key ]
        if ( isArrayBuffer(array) ) {
            return array.numElements
        }
        else {
            return array.data.length / array.numComponents
        }
    }

    /**
     * @typedef {Object} BufferInfo
     * @property {number} numElements The number of elements to pass to `gl.drawArrays` or `gl.drawElements`.
     * @property {WebGLBuffer} [indices] The indices `ELEMENT_ARRAY_BUFFER` if any indices exist.
     * @property {Object.<string, module:webgl-utils.AttribInfo>} attribs The attribs approriate to call `setAttributes`
     * @memberOf module:webgl-utils
     */

    /**
     * Creates a BufferInfo from an object of arrays.
     *
     * This can be passed to {@link module:webgl-utils.setBuffersAndAttributes} and to
     * {@link module:webgl-utils:drawBufferInfo}.
     *
     * Given an object like
     *
     *     var arrays = {
   *       position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
   *       texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
   *       normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
   *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
   *     };
     *
     *  Creates an BufferInfo like this
     *
     *     bufferInfo = {
   *       numElements: 4,        // or whatever the number of elements is
   *       indices: WebGLBuffer,  // this property will not exist if there are no indices
   *       attribs: {
   *         a_position: { buffer: WebGLBuffer, numComponents: 3, },
   *         a_normal:   { buffer: WebGLBuffer, numComponents: 3, },
   *         a_texcoord: { buffer: WebGLBuffer, numComponents: 2, },
   *       },
   *     };
     *
     *  The properties of arrays can be JavaScript arrays in which case the number of components
     *  will be guessed.
     *
     *     var arrays = {
   *        position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
   *        texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
   *        normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
   *        indices:  [0, 1, 2, 1, 2, 3],
   *     };
     *
     *  They can also by TypedArrays
     *
     *     var arrays = {
   *        position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
   *        texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
   *        normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
   *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
   *     };
     *
     *  Or augmentedTypedArrays
     *
     *     var positions = createAugmentedTypedArray(3, 4);
     *     var texcoords = createAugmentedTypedArray(2, 4);
     *     var normals   = createAugmentedTypedArray(3, 4);
     *     var indices   = createAugmentedTypedArray(3, 2, Uint16Array);
     *
     *     positions.push([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]);
     *     texcoords.push([0, 0, 0, 1, 1, 0, 1, 1]);
     *     normals.push([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
     *     indices.push([0, 1, 2, 1, 2, 3]);
     *
     *     var arrays = {
   *        position: positions,
   *        texcoord: texcoords,
   *        normal:   normals,
   *        indices:  indices,
   *     };
     *
     * For the last example it is equivalent to
     *
     *     var bufferInfo = {
   *       attribs: {
   *         a_position: { numComponents: 3, buffer: gl.createBuffer(), },
   *         a_texcoods: { numComponents: 2, buffer: gl.createBuffer(), },
   *         a_normals: { numComponents: 3, buffer: gl.createBuffer(), },
   *       },
   *       indices: gl.createBuffer(),
   *       numElements: 6,
   *     };
     *
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_position.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.position, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_texcoord.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.texcoord, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_normal.buffer);
     *     gl.bufferData(gl.ARRAY_BUFFER, arrays.normal, gl.STATIC_DRAW);
     *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
     *     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indices, gl.STATIC_DRAW);
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @param {Object.<string, array|object|typedarray>} arrays Your data
     * @param {Object.<string, string>} [opt_mapping] an optional mapping of attribute to array name.
     *    If not passed in it's assumed the array names will be mapped to an attibute
     *    of the same name with "a_" prefixed to it. An other words.
     *
     *        var arrays = {
   *           position: ...,
   *           texcoord: ...,
   *           normal:   ...,
   *           indices:  ...,
   *        };
     *
     *        bufferInfo = createBufferInfoFromArrays(gl, arrays);
     *
     *    Is the same as
     *
     *        var arrays = {
   *           position: ...,
   *           texcoord: ...,
   *           normal:   ...,
   *           indices:  ...,
   *        };
     *
     *        var mapping = {
   *          a_position: "position",
   *          a_texcoord: "texcoord",
   *          a_normal:   "normal",
   *        };
     *
     *        bufferInfo = createBufferInfoFromArrays(gl, arrays, mapping);
     *
     * @return {module:webgl-utils.BufferInfo} A BufferInfo
     * @memberOf module:webgl-utils
     */
    function createBufferInfoFromArrays(gl, arrays, opt_mapping) {
        var bufferInfo = {
            attribs: createAttribsFromArrays(gl, arrays, opt_mapping)
        }
        var indices    = arrays.indices
        if ( indices ) {
            indices                = makeTypedArray(indices, 'indices')
            bufferInfo.indices     = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER)
            bufferInfo.numElements = indices.length
        }
        else {
            bufferInfo.numElements = getNumElementsFromNonIndexedArrays(arrays)
        }

        return bufferInfo
    }

    /**
     * Creates buffers from typed arrays
     *
     * Given something like this
     *
     *     var arrays = {
   *        positions: [1, 2, 3],
   *        normals: [0, 0, 1],
   *     }
     *
     * returns something like
     *
     *     buffers = {
   *       positions: WebGLBuffer,
   *       normals: WebGLBuffer,
   *     }
     *
     * If the buffer is named 'indices' it will be made an ELEMENT_ARRAY_BUFFER.
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext.
     * @param {Object<string, array|typedarray>} arrays
     * @return {Object<string, WebGLBuffer>} returns an object with one WebGLBuffer per array
     * @memberOf module:webgl-utils
     */
    function createBuffersFromArrays(gl, arrays) {
        var buffers = {}
        Object.keys(arrays).forEach(function (key) {
            var type       = key === 'indices' ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
            var array      = makeTypedArray(arrays[ key ], name)
            buffers[ key ] = createBufferFromTypedArray(gl, array, type)
        })

        // hrm
        if ( arrays.indices ) {
            buffers.numElements = arrays.indices.length
        }
        else if ( arrays.position ) {
            buffers.numElements = arrays.position.length / 3
        }

        return buffers
    }

    /**
     * Calls `gl.drawElements` or `gl.drawArrays`, whichever is appropriate
     *
     * normally you'd call `gl.drawElements` or `gl.drawArrays` yourself
     * but calling this means if you switch from indexed data to non-indexed
     * data you don't have to remember to update your draw call.
     *
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @param {module:webgl-utils.BufferInfo} bufferInfo as returned from createBufferInfoFromArrays
     * @param {enum} [primitiveType] eg (gl.TRIANGLES, gl.LINES, gl.POINTS, gl.TRIANGLE_STRIP, ...)
     * @param {number} [count] An optional count. Defaults to bufferInfo.numElements
     * @param {number} [offset] An optional offset. Defaults to 0.
     * @memberOf module:webgl-utils
     */
    function drawBufferInfo(gl, bufferInfo, primitiveType, count, offset) {
        var indices     = bufferInfo.indices
        primitiveType   = primitiveType === undefined ? gl.TRIANGLES : primitiveType
        var numElements = count === undefined ? bufferInfo.numElements : count
        offset          = offset === undefined ? offset : 0
        if ( indices ) {
            gl.drawElements(primitiveType, numElements, gl.UNSIGNED_SHORT, offset)
        }
        else {
            gl.drawArrays(primitiveType, offset, numElements)
        }
    }

    /**
     * @typedef {Object} DrawObject
     * @property {module:webgl-utils.ProgramInfo} programInfo A ProgramInfo as returned from createProgramInfo
     * @property {module:webgl-utils.BufferInfo} bufferInfo A BufferInfo as returned from createBufferInfoFromArrays
     * @property {Object<string, ?>} uniforms The values for the uniforms
     * @memberOf module:webgl-utils
     */

    /**
     * Draws a list of objects
     * @param {WebGLRenderingContext} gl A WebGLRenderingContext
     * @param {DrawObject[]} objectsToDraw an array of objects to draw.
     * @memberOf module:webgl-utils
     */
    function drawObjectList(gl, objectsToDraw) {
        var lastUsedProgramInfo = null
        var lastUsedBufferInfo  = null

        objectsToDraw.forEach(function (object) {
            var programInfo = object.programInfo
            var bufferInfo  = object.bufferInfo
            var bindBuffers = false

            if ( programInfo !== lastUsedProgramInfo ) {
                lastUsedProgramInfo = programInfo
                gl.useProgram(programInfo.program)
                bindBuffers = true
            }

            // Setup all the needed attributes.
            if ( bindBuffers || bufferInfo !== lastUsedBufferInfo ) {
                lastUsedBufferInfo = bufferInfo
                setBuffersAndAttributes(gl, programInfo.attribSetters, bufferInfo)
            }

            // Set the uniforms.
            setUniforms(programInfo.uniformSetters, object.uniforms)

            // Draw
            drawBufferInfo(gl, bufferInfo)
        })
    }

    var isIE   = /*@cc_on!@*/false || !!document.documentMode
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia
    if ( isEdge ) {
        // Hack for Edge. Edge's WebGL implmentation is crap still and so they
        // only respond to "experimental-webgl". I don't want to clutter the
        // examples with that so his hack works around it
        HTMLCanvasElement.prototype.getContext = function (origFn) {
            return function () {
                var args = arguments
                var type = args[ 0 ]
                if ( type === 'webgl' ) {
                    args      = [].slice.call(arguments)
                    args[ 0 ] = 'experimental-webgl'
                }
                return origFn.apply(this, args)
            }
        }(HTMLCanvasElement.prototype.getContext)
    }

    return {
        createAugmentedTypedArray: createAugmentedTypedArray,
        createAttribsFromArrays: createAttribsFromArrays,
        createBuffersFromArrays: createBuffersFromArrays,
        createBufferInfoFromArrays: createBufferInfoFromArrays,
        createAttributeSetters: createAttributeSetters,
        createProgram: createProgram,
        createProgramFromScripts: createProgramFromScripts,
        createProgramFromSources: createProgramFromSources,
        createProgramInfo: createProgramInfo,
        createUniformSetters: createUniformSetters,
        createVAOAndSetAttributes: createVAOAndSetAttributes,
        createVAOFromBufferInfo: createVAOFromBufferInfo,
        drawBufferInfo: drawBufferInfo,
        drawObjectList: drawObjectList,
        getExtensionWithKnownPrefixes: getExtensionWithKnownPrefixes,
        resizeCanvasToDisplaySize: resizeCanvasToDisplaySize,
        setAttributes: setAttributes,
        setBuffersAndAttributes: setBuffersAndAttributes,
        setUniforms: setUniforms
    }

}))


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ScrollMagic__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ScrollMagic___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ScrollMagic__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_min__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__index_min__);



let controller  = new __WEBPACK_IMPORTED_MODULE_0_ScrollMagic___default.a.Controller()
let sceneCanvas = new __WEBPACK_IMPORTED_MODULE_0_ScrollMagic___default.a.Scene({
    duration: '500%',
    triggerHook: 1
})

let sceneImage = new __WEBPACK_IMPORTED_MODULE_0_ScrollMagic___default.a.Scene({
    duration: '500%',
    triggerHook: 1
})

document.querySelector('canvas').width  = innerWidth / 2
document.querySelector('canvas').height = innerHeight / 2

sceneCanvas.addImageSequencer({
    canvas: document.querySelector('canvas'),
    from: './images/Aaron_Kyro_001.jpg',
    to: './images/Aaron_Kyro_503.jpg',
    asyncLoader: 10
})

sceneImage.addImageSequencer({
    canvas: document.querySelector('img'),
    from: './images/Aaron_Kyro_001.jpg',
    to: './images/Aaron_Kyro_503.jpg'
})

sceneCanvas.addTo(controller)
sceneImage.addTo(controller)


/***/ })
/******/ ]);