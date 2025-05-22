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

var GithubSource = /*#__PURE__*/(0, _createClass2.default)(function GithubSource(props) {
  var _this = this;

  (0, _classCallCheck2.default)(this, GithubSource);
  (0, _defineProperty2.default)(this, "props", null);
  (0, _defineProperty2.default)(this, "isCompatible", function () {
    return !!_this.props.githubHandle;
  });
  (0, _defineProperty2.default)(this, "get", function (setState) {
    var githubHandle = _this.props.githubHandle;
    var size = (0, _utils.getImageSize)(_this.props.size);
    var url = "https://avatars.githubusercontent.com/".concat(githubHandle, "?v=4");
    if (size) url += "&s=".concat(size);
    setState({
      sourceName: 'github',
      src: url
    });
  });
  this.props = props;
});
exports.default = GithubSource;
(0, _defineProperty2.default)(GithubSource, "propTypes", {
  githubHandle: _propTypes.default.string
});