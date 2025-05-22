'use strict';

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

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

exports.default = createAvatarComponent;

_Object$defineProperty(exports, "getRandomColor", {
  enumerable: true,
  get: function get() {
    return _utils.getRandomColor;
  }
});

var _assign = _interopRequireDefault(require("core-js-pure/stable/object/assign.js"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _cache = require("./cache");

var _context = require("./context");

var _dataProvider = _interopRequireDefault(require("./data-provider"));

var _utils = require("./utils");

var _image = _interopRequireDefault(require("./components/image"));

var _text = _interopRequireDefault(require("./components/text"));

function createAvatarComponent(options) {
  var DataProvider = (0, _dataProvider.default)(options);
  var Component = (0, _context.withConfig)(
  /*#__PURE__*/
  // eslint-disable-next-line react/display-name
  _react.default.forwardRef(function (props, ref) {
    return /*#__PURE__*/_react.default.createElement(DataProvider, (0, _extends2.default)({}, props, {
      propertyName: "avatar"
    }), function (avatar) {
      var Avatar = avatar.src ? _image.default : _text.default;
      return /*#__PURE__*/_react.default.createElement(Avatar, (0, _extends2.default)({}, props, {
        avatar: avatar,
        ref: ref
      }));
    });
  }));
  return (0, _assign.default)(Component, {
    getRandomColor: _utils.getRandomColor,
    ConfigProvider: _context.ConfigProvider,
    Cache: _cache.Cache
  });
}