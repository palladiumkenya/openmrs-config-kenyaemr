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

var SkypeSource = /*#__PURE__*/(0, _createClass2.default)(function SkypeSource(props) {
  var _this = this;

  (0, _classCallCheck2.default)(this, SkypeSource);
  (0, _defineProperty2.default)(this, "props", null);
  (0, _defineProperty2.default)(this, "isCompatible", function () {
    return !!_this.props.skypeId;
  });
  (0, _defineProperty2.default)(this, "get", function (setState) {
    var skypeId = _this.props.skypeId;
    var url = "https://api.skype.com/users/".concat(skypeId, "/profile/avatar");
    setState({
      sourceName: 'skype',
      src: url
    });
  });
  this.props = props;
});
exports.default = SkypeSource;
(0, _defineProperty2.default)(SkypeSource, "propTypes", {
  skypeId: _propTypes.default.string
});