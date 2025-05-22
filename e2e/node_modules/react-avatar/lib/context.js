"use strict";

var _Reflect$construct = require("core-js-pure/stable/reflect/construct.js");

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.withConfig = exports.ConfigProvider = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _keys = _interopRequireDefault(require("core-js-pure/stable/object/keys.js"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cache = _interopRequireDefault(require("./cache"));

var _utils = require("./utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var defaults = {
  cache: _cache.default,
  colors: _utils.defaultColors,
  initials: _utils.defaultInitials,
  avatarRedirectUrl: null
};
var contextKeys = (0, _keys.default)(defaults);
/**
 * withConfig and ConfigProvider provide a compatibility layer for different
 * versions of React equiped with different versions of the Context API.
 *
 * If the new Context API is available it will be used, otherwise we will
 * fall back to the legacy context api.
 */

var ConfigContext = _react.default.createContext && /*#__PURE__*/_react.default.createContext();

var isLegacyContext = !ConfigContext;
var ConfigConsumer = isLegacyContext ? null : ConfigContext.Consumer;
/**
 * This was introduced in React 16.3.0 we need this to
 * prevent errors in newer versions. But we will just forward the
 * component for any version lower than 16.3.0
 *
 * https://github.com/Sitebase/react-avatar/issues/201
 * https://github.com/facebook/react/blob/master/CHANGELOG.md#1630-march-29-2018
 */

var forwardRef = _react.default.forwardRef || function (C) {
  return C;
};

var ConfigProvider = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ConfigProvider, _React$Component);

  var _super = _createSuper(ConfigProvider);

  function ConfigProvider() {
    (0, _classCallCheck2.default)(this, ConfigProvider);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ConfigProvider, [{
    key: "_getContext",
    value: function _getContext() {
      var _this = this;

      var context = {};
      contextKeys.forEach(function (key) {
        if (typeof _this.props[key] !== 'undefined') context[key] = _this.props[key];
      });
      return context;
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      if (isLegacyContext) return _react.default.Children.only(children);
      return /*#__PURE__*/_react.default.createElement(ConfigContext.Provider, {
        value: this._getContext()
      }, _react.default.Children.only(children));
    }
  }]);
  return ConfigProvider;
}(_react.default.Component);

exports.ConfigProvider = ConfigProvider;
(0, _defineProperty2.default)(ConfigProvider, "displayName", 'ConfigProvider');
(0, _defineProperty2.default)(ConfigProvider, "propTypes", {
  cache: _propTypes.default.object,
  colors: _propTypes.default.arrayOf(_propTypes.default.string),
  initials: _propTypes.default.func,
  avatarRedirectUrl: _propTypes.default.string,
  children: _propTypes.default.node
});

var withConfig = function withConfig(Component) {
  function withAvatarConfig(props, refOrContext) {
    // If legacy context is enabled, there is no support for forwardedRefs either
    if (isLegacyContext) {
      var ctx = refOrContext && refOrContext.reactAvatar;
      return /*#__PURE__*/_react.default.createElement(Component, (0, _extends2.default)({}, defaults, ctx, props));
    }
    /* eslint-disable react/display-name */


    return /*#__PURE__*/_react.default.createElement(ConfigConsumer, null, function (config) {
      return /*#__PURE__*/_react.default.createElement(Component, (0, _extends2.default)({
        ref: refOrContext
      }, defaults, config, props));
    });
    /* eslint-enable react/display-name */
  } // Legacy support, only set when legacy is detected


  withAvatarConfig.contextTypes = ConfigProvider.childContextTypes;
  return forwardRef(withAvatarConfig);
};

exports.withConfig = withConfig;

if (isLegacyContext) {
  ConfigProvider.childContextTypes = {
    reactAvatar: _propTypes.default.object
  };

  ConfigProvider.prototype.getChildContext = function () {
    return {
      reactAvatar: this._getContext()
    };
  };
}