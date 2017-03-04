'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var ScrollWatch = require('scrollwatch');

//http://stackoverflow.com/questions/4588119/get-elements-css-selector-when-it-doesnt-have-an-id
function fullPath(el) {
  var names = [];
  while (el.parentNode) {
    if (el.id) {
      names.unshift('#' + el.id);
      break;
    } else {
      if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);else {
        for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++) {}
        names.unshift(el.tagName + ":nth-child(" + c + ")");
      }
      el = el.parentNode;
    }
  }
  return names.join(" > ");
}

var IdyllComponent = function (_React$Component) {
  _inherits(IdyllComponent, _React$Component);

  function IdyllComponent(props) {
    _classCallCheck(this, IdyllComponent);

    var _this = _possibleConstructorReturn(this, (IdyllComponent.__proto__ || Object.getPrototypeOf(IdyllComponent)).call(this, props));

    if (props.onEnteredView) {
      _this.componentDidMount = function () {
        var dom = ReactDOM.findDOMNode(_this);
        var sw = new ScrollWatch({
          watch: fullPath(dom),
          onElementInView: _this.props.onEnteredView,
          watchOnce: false
        });
      };
    }
    return _this;
  }

  _createClass(IdyllComponent, [{
    key: 'updateProps',
    value: function updateProps(newProps) {
      this.props.__handleUpdateProps(newProps);
    }
  }]);

  return IdyllComponent;
}(React.Component);

module.exports = IdyllComponent;
