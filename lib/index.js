'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var walkVars = require('./visitors/vars');
var walkNode = require('./visitors/node');
var utils = require('./utils');

var transformRefs = function transformRefs(refs) {
  var output = {};
  var keys = ['scrollProgress', 'size', 'position'];
  Object.keys(refs).forEach(function (ref) {
    var val = refs[ref];
    keys.forEach(function (key) {
      if (val === null || val === undefined) {
        return;
      }
      var results = utils.flattenObject(key, val[key]);
      Object.keys(results).forEach(function (result) {
        output['_idyllRefs' + ref + result] = results[result];
      });
    });
  });
  return output;
};

var InteractiveDocument = function (_React$PureComponent) {
  _inherits(InteractiveDocument, _React$PureComponent);

  function InteractiveDocument(props) {
    _classCallCheck(this, InteractiveDocument);

    var _this = _possibleConstructorReturn(this, (InteractiveDocument.__proto__ || Object.getPrototypeOf(InteractiveDocument)).call(this, props));

    _this.handleUpdateProps = _this.handleUpdateProps.bind(_this);

    // Walk the tree, creating the proper components for evererything.
    _this.bindings = {};
    _this._idyllRefs = {};
    _this.derivedVars = {};
    _this.initialState = {};
    _this.updateFuncCache = {};

    props.ast.map(walkVars(_this, props.datasets));

    _this.state = _this.initialState;

    var nodeWalker = walkNode(_this, props.componentClasses);
    _this.getChildren = function () {
      return props.ast.map(nodeWalker());
    };
    return _this;
  }

  _createClass(InteractiveDocument, [{
    key: 'handleUpdateProps',
    value: function handleUpdateProps(nodeID) {
      var _this2 = this;

      if (!this.updateFuncCache[nodeID]) {
        this.updateFuncCache[nodeID] = function (props) {
          if (_this2.bindings[nodeID]) {
            var newState = {};
            Object.keys(props).forEach(function (propName) {
              var val = props[propName];
              if (_this2.bindings[nodeID][propName]) {
                newState[_this2.bindings[nodeID][propName]] = val;
              }
            });
            _this2.setStateAndDerived(newState);
          }
        };
      }

      return this.updateFuncCache[nodeID];
    }
  }, {
    key: 'setStateAndDerived',
    value: function setStateAndDerived(newState) {
      var _this3 = this;

      Object.keys(this.derivedVars).forEach(function (dv) {
        _this3.derivedVars[dv].update(newState);
      });
      this.setState(newState);
    }
  }, {
    key: 'getDerivedVars',
    value: function getDerivedVars() {
      var _this4 = this;

      var dvs = {};
      Object.keys(this.derivedVars).forEach(function (dv) {
        dvs[dv] = _this4.derivedVars[dv].value;
      });
      return dvs;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this5 = this;

      Object.keys(this._idyllRefs).forEach(function (name) {
        var ref = _this5._idyllRefs[name];
        var rect = ref.domNode().getBoundingClientRect();
        _this5._idyllRefs[name]._node = ref.domNode();
        _this5._idyllRefs[name].size = {
          x: rect.width,
          y: rect.height
        };

        _this5._idyllRefs[name].position = {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom
        };

        _this5._idyllRefs[name].absolutePosition = {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          right: rect.right + window.scrollX,
          bottom: rect.bottom + window.scrollY
        };
      });
      this.setState(transformRefs(this._idyllRefs));

      window.addEventListener('scroll', function (e) {
        // calculate current position based on scroll position
        var body = document.body;
        var html = document.documentElement;
        var documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
        var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var scrollX = window.scrollX;
        var scrollY = window.scrollY;

        var newRefs = {};
        Object.keys(_this5._idyllRefs).forEach(function (ref) {
          var _idyllRefs$ref = _this5._idyllRefs[ref],
              size = _idyllRefs$ref.size,
              absolutePosition = _idyllRefs$ref.absolutePosition,
              _node = _idyllRefs$ref._node;

          // 0 percent === top of the div is over the bottom of the window

          var minY = Math.max(0, absolutePosition.top - windowHeight);
          // 100 percent === bottom of div is at top of window
          var maxY = Math.min(documentHeight - windowHeight, absolutePosition.bottom);

          var minX = Math.max(0, absolutePosition.left - windowWidth);
          var maxX = Math.min(documentWidth - windowWidth, absolutePosition.right);

          var rect = _node.getBoundingClientRect();
          newRefs[ref] = {
            scrollProgress: {
              x: minX === maxX ? 1 : Math.max(0, Math.min(1, (scrollX - minX) / (maxX - minX))),
              y: minY === maxY ? 1 : Math.max(0, Math.min(1, (scrollY - minY) / (maxY - minY)))
            },
            position: {
              top: rect.top,
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom
            }
          };
          _this5._idyllRefs[ref] = Object.assign({}, _this5._idyllRefs[ref], newRefs[ref]);
        });

        _this5.setState(transformRefs(newRefs));
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', { className: 'idyll-root' }, this.getChildren());
    }
  }]);

  return InteractiveDocument;
}(React.PureComponent);

module.exports = InteractiveDocument;