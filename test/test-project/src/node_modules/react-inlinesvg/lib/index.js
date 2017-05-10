'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _once = require('once');

var _once2 = _interopRequireDefault(_once);

var _httpplease = require('httpplease');

var _httpplease2 = _interopRequireDefault(_httpplease);

var _oldiexdomain = require('httpplease/plugins/oldiexdomain');

var _oldiexdomain2 = _interopRequireDefault(_oldiexdomain);

var _shouldComponentUpdate = require('./shouldComponentUpdate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = _httpplease2.default.use(_oldiexdomain2.default);

var Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
  UNSUPPORTED: 'unsupported'
};

var getRequestsByUrl = {};
var loadedIcons = {};

var createGetOrUseCacheForUrl = function createGetOrUseCacheForUrl(url, callback) {
  if (loadedIcons[url]) {
    (function () {
      var params = loadedIcons[url];

      setTimeout(function () {
        return callback(params[0], params[1]);
      }, 0);
    })();
  }

  if (!getRequestsByUrl[url]) {
    getRequestsByUrl[url] = [];

    http.get(url, function (err, res) {
      getRequestsByUrl[url].forEach(function (cb) {
        loadedIcons[url] = [err, res];
        cb(err, res);
      });
    });
  }

  getRequestsByUrl[url].push(callback);
};

var supportsInlineSVG = (0, _once2.default)(function () {
  if (!document) {
    return false;
  }

  var div = document.createElement('div');
  div.innerHTML = '<svg />';
  return div.firstChild && div.firstChild.namespaceURI === 'http://www.w3.org/2000/svg';
});

var isSupportedEnvironment = (0, _once2.default)(function () {
  return ((typeof window !== 'undefined' && window !== null ? window.XMLHttpRequest : false) || (typeof window !== 'undefined' && window !== null ? window.XDomainRequest : false)) && supportsInlineSVG();
});

var uniquifyIDs = function () {
  var mkAttributePattern = function mkAttributePattern(attr) {
    return '(?:(?:\\s|\\:)' + attr + ')';
  };

  var idPattern = new RegExp('(?:(' + mkAttributePattern('id') + ')="([^"]+)")|(?:(' + mkAttributePattern('href') + '|' + mkAttributePattern('role') + '|' + mkAttributePattern('arcrole') + ')="\\#([^"]+)")|(?:="url\\(\\#([^\\)]+)\\)")', 'g');

  return function (svgText, svgID) {
    var uniquifyID = function uniquifyID(id) {
      return id + '___' + svgID;
    };

    return svgText.replace(idPattern, function (m, p1, p2, p3, p4, p5) {
      //eslint-disable-line consistent-return
      if (p2) {
        return p1 + '="' + uniquifyID(p2) + '"';
      } else if (p4) {
        return p3 + '="#' + uniquifyID(p4) + '"';
      } else if (p5) {
        return '="url(#' + uniquifyID(p5) + ')"';
      }
    });
  };
}();

var getHash = function getHash(str) {
  var chr = void 0;
  var hash = 0;
  var i = void 0;
  var j = void 0;
  var ref = void 0;

  if (!str) {
    return hash;
  }

  for (i = j = 0, ref = str.length; ref >= 0 ? j < ref : j > ref; i = ref >= 0 ? ++j : --j) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash &= hash;
  }

  return hash;
};

var InlineSVGError = function (_Error) {
  _inherits(InlineSVGError, _Error);

  function InlineSVGError(message) {
    var _ret2;

    _classCallCheck(this, InlineSVGError);

    var _this = _possibleConstructorReturn(this, (InlineSVGError.__proto__ || Object.getPrototypeOf(InlineSVGError)).call(this));

    _this.name = 'InlineSVGError';
    _this.isSupportedBrowser = true;
    _this.isConfigurationError = false;
    _this.isUnsupportedBrowserError = false;
    _this.message = message;

    return _ret2 = _this, _possibleConstructorReturn(_this, _ret2);
  }

  return InlineSVGError;
}(Error);

var createError = function createError(message, attrs) {
  var err = new InlineSVGError(message);

  Object.keys(attrs).forEach(function (k) {
    err[k] = attrs[k];
  });

  return err;
};

var unsupportedBrowserError = function unsupportedBrowserError(message) {
  var newMessage = message;

  if (newMessage === null) {
    newMessage = 'Unsupported Browser';
  }

  return createError(newMessage, {
    isSupportedBrowser: false,
    isUnsupportedBrowserError: true
  });
};

var configurationError = function configurationError(message) {
  return createError(message, {
    isConfigurationError: true
  });
};

var InlineSVG = function (_React$Component) {
  _inherits(InlineSVG, _React$Component);

  function InlineSVG(props) {
    _classCallCheck(this, InlineSVG);

    var _this2 = _possibleConstructorReturn(this, (InlineSVG.__proto__ || Object.getPrototypeOf(InlineSVG)).call(this, props));

    _this2.shouldComponentUpdate = _shouldComponentUpdate.shouldComponentUpdate;


    _this2.state = {
      status: Status.PENDING
    };

    _this2.handleLoad = _this2.handleLoad.bind(_this2);
    _this2.isActive = false;
    return _this2;
  }

  _createClass(InlineSVG, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.isActive = true;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.status === Status.PENDING) {
        if (this.props.supportTest()) {
          if (this.props.src) {
            this.startLoad();
          } else {
            this.fail(configurationError('Missing source'));
          }
        } else {
          this.fail(unsupportedBrowserError());
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.isActive = false;
    }
  }, {
    key: 'fail',
    value: function fail(error) {
      var _this3 = this;

      var status = error.isUnsupportedBrowserError ? Status.UNSUPPORTED : Status.FAILED;

      if (this.isActive) {
        this.setState({ status: status }, function () {
          if (typeof _this3.props.onError === 'function') {
            _this3.props.onError(error);
          }
        });
      }
    }
  }, {
    key: 'handleLoad',
    value: function handleLoad(err, res) {
      var _this4 = this;

      if (err) {
        this.fail(err);
        return;
      }

      if (this.isActive) {
        this.setState({
          loadedText: res.text,
          status: Status.LOADED
        }, function () {
          return typeof _this4.props.onLoad === 'function' ? _this4.props.onLoad() : null;
        });
      }
    }
  }, {
    key: 'startLoad',
    value: function startLoad() {
      if (this.isActive) {
        this.setState({
          status: Status.LOADING
        }, this.load);
      }
    }
  }, {
    key: 'load',
    value: function load() {
      var match = this.props.src.match(/data:image\/svg[^,]*?(;base64)?,(.*)/);
      if (match) {
        return this.handleLoad(null, {
          text: match[1] ? atob(match[2]) : decodeURIComponent(match[2])
        });
      }
      if (this.props.cacheGetRequests) {
        return createGetOrUseCacheForUrl(this.props.src, this.handleLoad);
      }

      return http.get(this.props.src, this.handleLoad);
    }
  }, {
    key: 'getClassName',
    value: function getClassName() {
      var className = 'isvg ' + this.state.status;

      if (this.props.className) {
        className += ' ' + this.props.className;
      }

      return className;
    }
  }, {
    key: 'processSVG',
    value: function processSVG(svgText) {
      if (this.props.uniquifyIDs) {
        return uniquifyIDs(svgText, getHash(this.props.src));
      }

      return svgText;
    }
  }, {
    key: 'renderContents',
    value: function renderContents() {
      switch (this.state.status) {
        case Status.UNSUPPORTED:
        case Status.FAILED:
          return this.props.children;
        default:
          return this.props.preloader;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.wrapper({
        className: this.getClassName(),
        dangerouslySetInnerHTML: this.state.loadedText ? {
          __html: this.processSVG(this.state.loadedText)
        } : undefined
      }, this.renderContents());
    }
  }]);

  return InlineSVG;
}(_react2.default.Component);

InlineSVG.propTypes = {
  cacheGetRequests: _react2.default.PropTypes.bool,
  children: _react2.default.PropTypes.node,
  className: _react2.default.PropTypes.string,
  onError: _react2.default.PropTypes.func,
  onLoad: _react2.default.PropTypes.func,
  preloader: _react2.default.PropTypes.func,
  src: _react2.default.PropTypes.string.isRequired,
  supportTest: _react2.default.PropTypes.func,
  uniquifyIDs: _react2.default.PropTypes.bool,
  wrapper: _react2.default.PropTypes.func
};
InlineSVG.defaultProps = {
  wrapper: _react2.default.DOM.span,
  supportTest: isSupportedEnvironment,
  uniquifyIDs: true,
  cacheGetRequests: false
};
exports.default = InlineSVG;
module.exports = exports['default'];