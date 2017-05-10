(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ScrollWatch = factory();
  }
}(this, function() {
'use strict';

// Give each instance on the page a unique ID.
var instanceId = 0;

// Store instance data privately so it can't be accessed/modified.
var instanceData = {};

var config = {
	// The default container is window, but we need the actual
	// documentElement to determine positioning.
	container: window.document.documentElement,
	watch: '[data-scroll-watch]',
	watchOnce: true,
	inViewClass: 'scroll-watch-in-view',
	ignoreClass: 'scroll-watch-ignore',
	debounce: false,
	debounceTriggerLeading: false,
	scrollDebounce: 250,
	resizeDebounce: 250,
	scrollThrottle: 250,
	resizeThrottle: 250,
	watchOffset: 0,
	infiniteScroll: false,
	infiniteOffset: 0,
	onElementInView: function(){},
	onElementOutOfView: function(){},
	onInfiniteXInView: function(){},
	onInfiniteYInView: function(){}
};

var initEvent = 'scrollwatchinit';

var extend = function(retObj) {

	var len = arguments.length;
	var i;
	var key;
	var obj;

	retObj = retObj || {};

	for (i = 1; i < len; i++) {

		obj = arguments[i];

		if (!obj) {

			continue;

		}

		for (key in obj) {

			if (obj.hasOwnProperty(key)) {

				retObj[key] = obj[key];

			}

		}
	}

	return retObj;

};

var throttle = function (fn, threshhold, scope) {

	var last;
	var deferTimer;

	threshhold = threshhold || 250;

	return function () {

		var context = scope || this;
		var now = +new Date();
		var args = arguments;

		if (last && now < last + threshhold) {

			window.clearTimeout(deferTimer);

			deferTimer = setTimeout(function () {

				last = now;

				fn.apply(context, args);

			}, threshhold);

		} else {

			last = now;

			fn.apply(context, args);

		}

	};

};

// http://underscorejs.org/#debounce
var debounce = function(func, wait, immediate) {

	var timeout;
	var args;
	var context;
	var timestamp;
	var result;

	var later = function() {

		var last = new Date().getTime() - timestamp;

		if (last < wait && last >= 0) {

			timeout = setTimeout(later, wait - last);

		} else {

			timeout = null;

			if (!immediate) {

				result = func.apply(context, args);

				if (!timeout) {

					context = args = null;

				}

			}

		}

	};

	return function() {

		var callNow = immediate && !timeout;

		context = this;
		args = arguments;
		timestamp = new Date().getTime();

		if (!timeout) {

			timeout = setTimeout(later, wait);

		}

		if (callNow) {

			result = func.apply(context, args);
			context = args = null;

		}

		return result;

	};

};

// Get the scrolling container element to watch if it's not the default window/documentElement.
var saveContainerElement = function() {

	if (!isContainerWindow.call(this)) {

		instanceData[this._id].config.container = document.querySelector(instanceData[this._id].config.container);

	}

};

// Save all elements to watch into an array.
var saveElements = function() {

	instanceData[this._id].elements = Array.prototype.slice.call(document.querySelectorAll(instanceData[this._id].config.watch + ':not(.' + instanceData[this._id].config.ignoreClass + ')'));

};

// Save the scroll position of the scrolling container so we can
// perform comparison checks.
var saveScrollPosition = function() {

	instanceData[this._id].lastScrollPosition = getScrollPosition.call(this);

};

var checkViewport = function(eventType) {

	checkElements.call(this, eventType);
	checkInfinite.call(this, eventType);

	// Chrome does not return 0,0 for scroll position when reloading a page
	// that was previously scrolled. To combat this, we will leave the scroll
	// position at the default 0,0 when a page is first loaded.
	if (eventType !== initEvent) {

		saveScrollPosition.call(this);

	}

};

// Determine if the watched elements are viewable within the
// scrolling container.
var checkElements = function(eventType) {

	// console.log('checkElements eventType: ' + eventType);

	var data = instanceData[this._id];
	var len = data.elements.length;
	var config = data.config;
	var inViewClass = config.inViewClass;
	var responseData = {
		eventType: eventType
	};
	var el;
	var i;

	for (i = 0; i < len; i++) {

		el = data.elements[i];

		// Prepare the data to pass to the callback.
		responseData.el = el;

		if (eventType === 'scroll') {

			responseData.direction = getScrolledDirection.call(this, getScrolledAxis.call(this));

		}

		if (isElementInView.call(this, el)) {

			if (!el.classList.contains(inViewClass)) {

				// Add a class hook and fire a callback for every
				// element that just came into view.

				el.classList.add(inViewClass);
				config.onElementInView.call(this, responseData);

				if (config.watchOnce) {

					// Remove this element so we don't check it again
					// next time.

					data.elements.splice(i, 1);
					len--;
					i--;

					// Flag this element with the ignore class so we
					// don't store it again if a refresh happens.

					el.classList.add(config.ignoreClass);

				}

			}

		} else {

			if (el.classList.contains(inViewClass)) {

				// Remove the class hook and fire a callback for every
				// element that just went out of view.

				el.classList.remove(inViewClass);
				config.onElementOutOfView.call(this, responseData);

			}

		}

	}

};

// Determine if the infinite scroll zone is in view. This could come into
// view by scrolling or resizing. Initial load must also be accounted
// for.
var checkInfinite = function(eventType) {

	var data = instanceData[this._id];
	var config = data.config;
	var i;
	var axis;
	var container;
	var viewableRange;
	var scrollSize;
	var callback;
	var responseData;

	if (config.infiniteScroll && !data.isInfiniteScrollPaused) {

		axis = ['x', 'y'];
		callback = ['onInfiniteXInView', 'onInfiniteYInView'];
		container = config.container;
		viewableRange = getViewableRange.call(this);
		scrollSize = [container.scrollWidth, container.scrollHeight];
		responseData = {};

		for (i = 0; i < 2; i++) {

			// If a scroll event triggered this check, verify the scroll
			// position actually changed for each axis. This stops
			// horizontal scrolls from triggering infiniteY callbacks
			// and vice versa. In other words, only trigger an infinite
			// callback if that axis was actually scrolled.

			if ((eventType === 'scroll' && hasScrollPositionChanged.call(this, axis[i]) || eventType === 'resize'|| eventType === 'refresh' || eventType === initEvent) && viewableRange[axis[i]].end + config.infiniteOffset >= scrollSize[i]) {

				// We've scrolled/resized all the way to the right/bottom.

				responseData.eventType = eventType;

				if (eventType === 'scroll') {

					responseData.direction = getScrolledDirection.call(this, axis[i]);

				}

				config[callback[i]].call(this, responseData);

			}

		}

	}

};

// Add listeners to the scrolling container for each instance.
var addListeners = function() {

	var data = instanceData[this._id];
	var scrollingElement = getScrollingElement.call(this);

	scrollingElement.addEventListener('scroll', data.scrollHandler, false);
	scrollingElement.addEventListener('resize', data.resizeHandler, false);

};

var removeListeners = function() {

	var data = instanceData[this._id];
	var scrollingElement = getScrollingElement.call(this);

	scrollingElement.removeEventListener('scroll', data.scrollHandler);
	scrollingElement.removeEventListener('resize', data.resizeHandler);

};

var getScrollingElement = function() {

	return isContainerWindow.call(this) ? window : instanceData[this._id].config.container;

};

// Get the width and height of viewport/scrolling container.
var getViewportSize = function() {

	var size = {
		w: instanceData[this._id].config.container.clientWidth,
		h: instanceData[this._id].config.container.clientHeight
	};

	return size;

};

// Get the scrollbar position of the scrolling container.
var getScrollPosition = function() {

	var pos = {};
	var container;

	if (isContainerWindow.call(this)) {

		pos.left = window.pageXOffset;
		pos.top = window.pageYOffset;


	} else {

		container = instanceData[this._id].config.container;

		pos.left = container.scrollLeft;
		pos.top = container.scrollTop;

	}

	return pos;

};

// Get the pixel range currently viewable within the
// scrolling container.
var getViewableRange = function() {

	var range = {
		x: {},
		y: {}
	};
	var scrollPos = getScrollPosition.call(this);
	var viewportSize = getViewportSize.call(this);

	range.x.start = scrollPos.left;
	range.x.end =  range.x.start + viewportSize.w;
	range.x.size = range.x.end - range.x.start;

	range.y.start = scrollPos.top;
	range.y.end = range.y.start + viewportSize.h;
	range.y.size = range.y.end - range.y.start;

	return range;

};

// Get the pixel range of where this element falls within the
// scrolling container.
var getElementRange = function(el) {

	var range = {
		x: {},
		y: {}
	};
	var viewableRange = getViewableRange.call(this);
	var coords = el.getBoundingClientRect();
	var containerCoords;

	if (isContainerWindow.call(this)) {

		range.x.start = coords.left + viewableRange.x.start;
		range.x.end = coords.right + viewableRange.x.start;


		range.y.start = coords.top + viewableRange.y.start;
		range.y.end = coords.bottom + viewableRange.y.start;

	} else {

		containerCoords = instanceData[this._id].config.container.getBoundingClientRect();

		range.x.start = (coords.left - containerCoords.left) + viewableRange.x.start;
		range.x.end = range.x.start + coords.width;

		range.y.start = (coords.top - containerCoords.top) + viewableRange.y.start;
		range.y.end = range.y.start + coords.height;

	}

	range.x.size = range.x.end - range.x.start;
	range.y.size = range.y.end - range.y.start;

	return range;

};

// Determines which axis was just scrolled (x/horizontal or y/vertical).
var getScrolledAxis = function() {

	if (hasScrollPositionChanged.call(this, 'x')) {

		return 'x';

	}

	if (hasScrollPositionChanged.call(this, 'y')) {

		return 'y';

	}

};

var getScrolledDirection = function(axis) {

	var scrollDir = {x: ['right', 'left'], y: ['down', 'up']};
	var position = {x: 'left', y: 'top'};
	var lastScrollPosition = instanceData[this._id].lastScrollPosition;
	var curScrollPosition = getScrollPosition.call(this);

	return curScrollPosition[position[axis]] > lastScrollPosition[position[axis]] ? scrollDir[axis][0] : scrollDir[axis][1];

};

var hasScrollPositionChanged = function(axis) {

	var position = {x: 'left', y: 'top'};
	var lastScrollPosition = instanceData[this._id].lastScrollPosition;
	var curScrollPosition = getScrollPosition.call(this);

	return curScrollPosition[position[axis]] !== lastScrollPosition[position[axis]];

};

var isElementInView = function(el) {

	var viewableRange = getViewableRange.call(this);
	var elRange = getElementRange.call(this, el);
	var offset = instanceData[this._id].config.watchOffset;

	return isElementInVerticalView(elRange, viewableRange, offset) && isElementInHorizontalView(elRange, viewableRange, offset);

};

var isElementInVerticalView = function(elRange, viewableRange, offset) {

	return elRange.y.start < viewableRange.y.end + offset && elRange.y.end > viewableRange.y.start - offset;

};

var isElementInHorizontalView = function(elRange, viewableRange, offset) {

	return elRange.x.start < viewableRange.x.end + offset && elRange.x.end > viewableRange.x.start - offset;

};

var isContainerWindow = function() {

	return instanceData[this._id].config.container === window.document.documentElement;

};

var mergeOptions = function(opts) {

	extend(instanceData[this._id].config, config, opts);

};

var handler = function(e) {

	var eventType = e.type;

	// For scroll events, only check the viewport if something
	// has changed. Fixes issues when using gestures on a page
	// that doesn't need to scroll. An event would still fire,
	// but the position didn't change  because the
	// window/container "bounced" back into place.
	if (eventType === 'resize' || hasScrollPositionChanged.call(this, 'x') || hasScrollPositionChanged.call(this, 'y')) {

		checkViewport.call(this, eventType);

	}

};

var ScrollWatch = function(opts) {

	// Protect against missing new keyword.
	if (this instanceof ScrollWatch) {

		var data;

		Object.defineProperty(this, '_id', {value: instanceId++});

		// Keep all instance data private, except for the '_id', which will
		// be the key to get the private data for a specific instance.

		data = instanceData[this._id] = {

			config: {},
			// The elements to watch for this instance.
			elements: [],
			lastScrollPosition: {top: 0, left: 0},
			isInfiniteScrollPaused: false

		};

		mergeOptions.call(this, opts);

		// In order to remove listeners later and keep a correct reference
		// to 'this', give each instance it's own event handler.
		if (data.config.debounce) {

			data.scrollHandler = debounce(handler.bind(this), data.config.scrollDebounce, data.config.debounceTriggerLeading);
			data.resizeHandler = debounce(handler.bind(this), data.config.resizeDebounce, data.config.debounceTriggerLeading);

		} else {

			data.scrollHandler = throttle(handler.bind(this), data.config.scrollThrottle, this);
			data.resizeHandler = throttle(handler.bind(this), data.config.resizeThrottle, this);

		}

		saveContainerElement.call(this);
		addListeners.call(this);
		saveElements.call(this);
		checkViewport.call(this, initEvent);

	} else {

		return new ScrollWatch(opts);

	}

};

ScrollWatch.prototype = {

	// Should be manually called by user after loading in new content.
	refresh: function() {

		saveElements.call(this);
		checkViewport.call(this, 'refresh');

	},

	destroy: function() {

		removeListeners.call(this);
		delete instanceData[this._id];

	},

	pauseInfiniteScroll: function() {

		instanceData[this._id].isInfiniteScrollPaused = true;

	},

	resumeInfiniteScroll: function() {

		instanceData[this._id].isInfiniteScrollPaused = false;

	}

};

return ScrollWatch;
}));
