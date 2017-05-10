'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldComponentUpdate = shouldComponentUpdate;
exports.shouldComponentUpdateContext = shouldComponentUpdateContext;

var _shallowEqual = require('fbjs/lib/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *  @module PureRender
 */

/**
 * shouldComponentUpdate without context.
 *
 * @requires shallowEqual
 *
 * @param {Object} nextProps
 * @param {Object} nextState
 *
 * @returns {boolean}
 */
function shouldComponentUpdate(nextProps, nextState) {
  return !(0, _shallowEqual2.default)(this.props, nextProps) || !(0, _shallowEqual2.default)(this.state, nextState);
}

/**
 * shouldComponentUpdate with context.
 *
 * @requires shallowEqual
 *
 * @param {Object} nextProps
 * @param {Object} nextState
 * @param {Object} nextContext
 *
 * @returns {boolean}
 */
function shouldComponentUpdateContext(nextProps, nextState, nextContext) {
  return !(0, _shallowEqual2.default)(this.props, nextProps) || !(0, _shallowEqual2.default)(this.state, nextState) || !(0, _shallowEqual2.default)(this.context, nextContext);
}

exports.default = { shouldComponentUpdate: shouldComponentUpdate, shouldComponentUpdateContext: shouldComponentUpdateContext };