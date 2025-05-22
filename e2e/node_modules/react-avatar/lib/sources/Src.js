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

var SrcSource = /*#__PURE__*/(0, _createClass2.default)(function SrcSource(props) {
  var _this = this;

  (0, _classCallCheck2.default)(this, SrcSource);
  (0, _defineProperty2.default)(this, "props", null);
  (0, _defineProperty2.default)(this, "isCompatible", function () {
    return !!_this.props.src;
  });
  (0, _defineProperty2.default)(this, "get", function (setState) {
    setState({
      sourceName: 'src',
      src: _this.props.src
    });
  });
  this.props = props;
});
exports.default = SrcSource;
(0, _defineProperty2.default)(SrcSource, "propTypes", {
  src: _propTypes.default.string
});