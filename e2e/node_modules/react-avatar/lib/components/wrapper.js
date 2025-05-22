"use strict";

var _Reflect$construct = require("core-js-pure/stable/reflect/construct.js");

var _Object$keys = require("core-js-pure/stable/object/keys.js");

var _Object$getOwnPropertySymbols = require("core-js-pure/stable/object/get-own-property-symbols.js");

var _filterInstanceProperty = require("core-js-pure/stable/instance/filter.js");

var _Object$getOwnPropertyDescriptor = require("core-js-pure/stable/object/get-own-property-descriptor.js");

var _Object$getOwnPropertyDescriptors = require("core-js-pure/stable/object/get-own-property-descriptors.js");

var _Object$defineProperties = require("core-js-pure/stable/object/define-properties.js");

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AvatarWrapper = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(AvatarWrapper, _React$PureComponent);

  var _super = _createSuper(AvatarWrapper);

  function AvatarWrapper() {
    (0, _classCallCheck2.default)(this, AvatarWrapper);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(AvatarWrapper, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          unstyled = _this$props.unstyled,
          round = _this$props.round,
          style = _this$props.style,
          avatar = _this$props.avatar,
          onClick = _this$props.onClick,
          children = _this$props.children;
      var sourceName = avatar.sourceName;
      var size = (0, _utils.parseSize)(this.props.size);
      var hostStyle = unstyled ? null : _objectSpread({
        display: 'inline-block',
        verticalAlign: 'middle',
        width: size.str,
        height: size.str,
        borderRadius: (0, _utils.calculateBorderRadius)(round),
        fontFamily: 'Helvetica, Arial, sans-serif'
      }, style);
      var classNames = [className, 'sb-avatar'];

      if (sourceName) {
        var source = sourceName.toLowerCase().replace(/[^a-z0-9-]+/g, '-') // only allow alphanumeric
        .replace(/^-+|-+$/g, ''); // trim `-`

        classNames.push('sb-avatar--' + source);
      }

      return /*#__PURE__*/_react.default.createElement("div", {
        className: classNames.join(' '),
        onClick: onClick,
        style: hostStyle
      }, children);
    }
  }]);
  return AvatarWrapper;
}(_react.default.PureComponent);

exports.default = AvatarWrapper;
(0, _defineProperty2.default)(AvatarWrapper, "propTypes", {
  className: _propTypes.default.string,
  round: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.string]),
  style: _propTypes.default.object,
  size: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  unstyled: _propTypes.default.bool,
  avatar: _propTypes.default.object,
  onClick: _propTypes.default.func,
  children: _propTypes.default.node
});