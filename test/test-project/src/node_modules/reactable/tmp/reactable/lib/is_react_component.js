(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.is_react_component = mod.exports;
    }
})(this, function (exports) {
    // this is a bit hacky - it'd be nice if React exposed an API for this
    'use strict';

    exports.isReactComponent = isReactComponent;

    function isReactComponent(thing) {
        return thing !== null && typeof thing === 'object' && typeof thing.props !== 'undefined';
    }
});
