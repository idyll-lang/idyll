(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './stringable'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./stringable'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.stringable);
        global.extract_data_from = mod.exports;
    }
})(this, function (exports, _stringable) {
    'use strict';

    exports.extractDataFrom = extractDataFrom;

    function extractDataFrom(key, column) {
        var value;
        if (typeof key !== 'undefined' && key !== null && key.__reactableMeta === true) {
            value = key.data[column];
        } else {
            value = key[column];
        }

        if (typeof value !== 'undefined' && value !== null && value.__reactableMeta === true) {
            value = typeof value.props.value !== 'undefined' && value.props.value !== null ? value.props.value : value.value;
        }

        return (0, _stringable.stringable)(value) ? value : '';
    }
});
