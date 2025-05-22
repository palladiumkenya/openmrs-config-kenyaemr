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

var _md = _interopRequireDefault(require("md5"));

var _utils = require("../utils");

var GravatarSource = /*#__PURE__*/(0, _createClass2.default)(function GravatarSource(_props) {
  var _this = this;

  (0, _classCallCheck2.default)(this, GravatarSource);
  (0, _defineProperty2.default)(this, "props", null);
  (0, _defineProperty2.default)(this, "isCompatible", function () {
    return !!_this.props.email || !!_this.props.md5Email;
  });
  (0, _defineProperty2.default)(this, "get", function (setState) {
    var props = _this.props;
    var email = props.md5Email || (0, _md.default)(props.email);
    var size = (0, _utils.getImageSize)(props.size);
    var url = "https://secure.gravatar.com/avatar/".concat(email, "?d=404");
    if (size) url += "&s=".concat(size);
    setState({
      sourceName: 'gravatar',
      src: url
    });
  });
  this.props = _props;
});
exports.default = GravatarSource;
(0, _defineProperty2.default)(GravatarSource, "propTypes", {
  email: _propTypes.default.string,
  md5Email: _propTypes.default.string
});