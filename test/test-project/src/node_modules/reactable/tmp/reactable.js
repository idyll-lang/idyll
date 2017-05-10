(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'react', './reactable/table', './reactable/tr', './reactable/td', './reactable/th', './reactable/tfoot', './reactable/thead', './reactable/sort', './reactable/unsafe'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('react'), require('./reactable/table'), require('./reactable/tr'), require('./reactable/td'), require('./reactable/th'), require('./reactable/tfoot'), require('./reactable/thead'), require('./reactable/sort'), require('./reactable/unsafe'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.React, global.table, global.tr, global.td, global.th, global.tfoot, global.thead, global.sort, global.unsafe);
        global.reactable = mod.exports;
    }
})(this, function (exports, _react, _reactableTable, _reactableTr, _reactableTd, _reactableTh, _reactableTfoot, _reactableThead, _reactableSort, _reactableUnsafe) {
    'use strict';

    _react['default'].Children.children = function (children) {
        return _react['default'].Children.map(children, function (x) {
            return x;
        }) || [];
    };

    // Array.prototype.find polyfill - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function value(predicate) {
                if (this === null) {
                    throw new TypeError('Array.prototype.find called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;
                for (var i = 0; i < length; i++) {
                    if (i in list) {
                        value = list[i];
                        if (predicate.call(thisArg, value, i, list)) {
                            return value;
                        }
                    }
                }
                return undefined;
            }
        });
    }

    var Reactable = { Table: _reactableTable.Table, Tr: _reactableTr.Tr, Td: _reactableTd.Td, Th: _reactableTh.Th, Tfoot: _reactableTfoot.Tfoot, Thead: _reactableThead.Thead, Sort: _reactableSort.Sort, unsafe: _reactableUnsafe.unsafe };

    exports['default'] = Reactable;

    if (typeof window !== 'undefined') {
        window.Reactable = Reactable;
    }
});
