'use strict';

var _typeof = require("@babel/runtime/helpers/typeof");

var _Reflect$construct = require("core-js-pure/stable/reflect/construct.js");

var _Object$keys = require("core-js-pure/stable/object/keys.js");

var _Object$getOwnPropertySymbols = require("core-js-pure/stable/object/get-own-property-symbols.js");

var _filterInstanceProperty = require("core-js-pure/stable/instance/filter.js");

var _Object$getOwnPropertyDescriptor = require("core-js-pure/stable/object/get-own-property-descriptor.js");

var _Object$getOwnPropertyDescriptors = require("core-js-pure/stable/object/get-own-property-descriptors.js");

var _Object$defineProperties = require("core-js-pure/stable/object/define-properties.js");

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _WeakMap = require("core-js-pure/stable/weak-map/index.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "Cache", {
  enumerable: true,
  get: function get() {
    return _cache.Cache;
  }
});

_Object$defineProperty(exports, "ConfigProvider", {
  enumerable: true,
  get: function get() {
    return _context.ConfigProvider;
  }
});

exports.default = createAvatarDataProvider;

_Object$defineProperty(exports, "getRandomColor", {
  enumerable: true,
  get: function get() {
    return _utils.getRandomColor;
  }
});

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reduce = _interopRequireDefault(require("core-js-pure/stable/instance/reduce.js"));

var _assign = _interopRequireDefault(require("core-js-pure/stable/object/assign.js"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cache = require("./cache");

var _context = require("./context");

var _internalState = _interopRequireDefault(require("./internal-state"));

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function matchSource(Source, props, cb) {
  var cache = props.cache;
  var instance = new Source(props);
  if (!instance.isCompatible(props)) return cb();
  instance.get(function (state) {
    var failedBefore = state && state.src && cache.hasSourceFailedBefore(state.src);

    if (!failedBefore && state) {
      cb(state);
    } else {
      cb();
    }
  });
}

function createAvatarDataProvider(_ref) {
  var _ref$sources = _ref.sources,
      sources = _ref$sources === void 0 ? [] : _ref$sources;
  // Collect propTypes for each individual source
  var sourcePropTypes = (0, _reduce.default)(sources).call(sources, function (r, s) {
    return (0, _assign.default)(r, s.propTypes);
  }, {});

  var AvatarDataProvider = /*#__PURE__*/function (_PureComponent) {
    (0, _inherits2.default)(AvatarDataProvider, _PureComponent);

    var _super = _createSuper(AvatarDataProvider);

    function AvatarDataProvider(props) {
      var _this;

      (0, _classCallCheck2.default)(this, AvatarDataProvider);
      _this = _super.call(this, props);
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_createFetcher", function (internal) {
        return function (errEvent) {
          var cache = _this.props.cache;
          if (!internal.isActive(_this.state)) return; // Mark img source as failed for future reference

          if (errEvent && errEvent.type === 'error') cache.sourceFailed(errEvent.target.src);
          var pointer = internal.sourcePointer;
          if (sources.length === pointer) return;
          var source = sources[pointer];
          internal.sourcePointer++;
          matchSource(source, _this.props, function (nextState) {
            if (!nextState) return setTimeout(internal.fetch, 0);
            if (!internal.isActive(_this.state)) return; // Reset other values to prevent them from sticking (#51)

            nextState = _objectSpread({
              src: null,
              value: null,
              color: null
            }, nextState);

            _this.setState(function (state) {
              // Internal state has been reset => we received new props
              return internal.isActive(state) ? nextState : {};
            });
          });
        };
      });
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "fetch", function () {
        var internal = new _internalState.default();
        internal.fetch = _this._createFetcher(internal);

        _this.setState({
          internal: internal
        }, internal.fetch);
      });
      _this.state = {
        internal: null,
        src: null,
        value: null,
        color: props.color
      };
      return _this;
    }

    (0, _createClass2.default)(AvatarDataProvider, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.fetch();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var needsUpdate = false; // This seems redundant
        //
        // Props that need to be in `state` are
        // `value`, `src` and `color`

        for (var prop in sourcePropTypes) {
          needsUpdate = needsUpdate || prevProps[prop] !== this.props[prop];
        }

        if (needsUpdate) setTimeout(this.fetch, 0);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.state.internal) {
          this.state.internal.active = false;
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            children = _this$props.children,
            propertyName = _this$props.propertyName;
        var _this$state = this.state,
            src = _this$state.src,
            value = _this$state.value,
            color = _this$state.color,
            sourceName = _this$state.sourceName,
            internal = _this$state.internal;
        var avatarData = {
          src: src,
          value: value,
          color: color,
          sourceName: sourceName,
          onRenderFailed: function onRenderFailed() {
            return internal && internal.fetch();
          } // eslint-disable-line

        };
        if (typeof children === 'function') return children(avatarData);

        var child = _react.default.Children.only(children);

        return /*#__PURE__*/_react.default.cloneElement(child, (0, _defineProperty2.default)({}, propertyName, avatarData));
      }
    }]);
    return AvatarDataProvider;
  }(_react.PureComponent);

  (0, _defineProperty2.default)(AvatarDataProvider, "displayName", 'AvatarDataProvider');
  (0, _defineProperty2.default)(AvatarDataProvider, "propTypes", _objectSpread(_objectSpread({}, sourcePropTypes), {}, {
    cache: _propTypes.default.object,
    propertyName: _propTypes.default.string
  }));
  (0, _defineProperty2.default)(AvatarDataProvider, "defaultProps", {
    propertyName: 'avatar'
  });
  (0, _defineProperty2.default)(AvatarDataProvider, "Cache", _cache.Cache);
  (0, _defineProperty2.default)(AvatarDataProvider, "ConfigProvider", _context.ConfigProvider);
  return (0, _assign.default)((0, _context.withConfig)(AvatarDataProvider), {
    ConfigProvider: _context.ConfigProvider,
    Cache: _cache.Cache
  });
}