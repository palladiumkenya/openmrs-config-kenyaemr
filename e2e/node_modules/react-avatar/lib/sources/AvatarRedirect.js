'use strict';

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = createRedirectSource;

var _concat = _interopRequireDefault(require("core-js-pure/stable/instance/concat.js"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

function createRedirectSource(network, property) {
  var _class;

  return _class = /*#__PURE__*/(0, _createClass2.default)(function AvatarRedirectSource(props) {
    var _this = this;

    (0, _classCallCheck2.default)(this, AvatarRedirectSource);
    (0, _defineProperty3.default)(this, "props", null);
    (0, _defineProperty3.default)(this, "isCompatible", function () {
      return !!_this.props.avatarRedirectUrl && !!_this.props[property];
    });
    (0, _defineProperty3.default)(this, "get", function (setState) {
      var _context, _context2, _context3;

      var avatarRedirectUrl = _this.props.avatarRedirectUrl;
      var size = (0, _utils.getImageSize)(_this.props.size);
      var baseUrl = avatarRedirectUrl.replace(/\/*$/, '/');
      var id = _this.props[property];
      var query = size ? "size=".concat(size) : '';
      var src = (0, _concat.default)(_context = (0, _concat.default)(_context2 = (0, _concat.default)(_context3 = "".concat(baseUrl)).call(_context3, network, "/")).call(_context2, id, "?")).call(_context, query);
      setState({
        sourceName: network,
        src: src
      });
    });
    this.props = props;
  }), (0, _defineProperty3.default)(_class, "propTypes", (0, _defineProperty3.default)({}, property, _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]))), _class;
}