'use strict';

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

var IconSource = /*#__PURE__*/(0, _createClass2.default)(function IconSource(props) {
  var _this = this;

  (0, _classCallCheck2.default)(this, IconSource);
  (0, _defineProperty2.default)(this, "props", null);
  (0, _defineProperty2.default)(this, "icon", '✷');
  (0, _defineProperty2.default)(this, "isCompatible", function () {
    return true;
  });
  (0, _defineProperty2.default)(this, "get", function (setState) {
    var _this$props = _this.props,
        color = _this$props.color,
        colors = _this$props.colors;
    setState({
      sourceName: 'icon',
      value: _this.icon,
      color: color || (0, _utils.getRandomColor)(_this.icon, colors)
    });
  });
  this.props = props;
});
exports.default = IconSource;
(0, _defineProperty2.default)(IconSource, "propTypes", {
  color: _propTypes.default.string
});