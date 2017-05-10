'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactableTable = require('./reactable/table');

var _reactableTr = require('./reactable/tr');

var _reactableTd = require('./reactable/td');

var _reactableTh = require('./reactable/th');

var _reactableTfoot = require('./reactable/tfoot');

var _reactableThead = require('./reactable/thead');

var _reactableSort = require('./reactable/sort');

var _reactableUnsafe = require('./reactable/unsafe');

_react2['default'].Children.children = function (children) {
    return _react2['default'].Children.map(children, function (x) {
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
module.exports = exports['default'];
