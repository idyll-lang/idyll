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
        global.stringable = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    exports.stringable = stringable;

    function stringable(thing) {
        return thing !== null && typeof thing !== 'undefined' && typeof (thing.toString === 'function');
    }
});
