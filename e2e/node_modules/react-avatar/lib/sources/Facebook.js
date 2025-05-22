'use strict';

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _concat = _interopRequireDefault(require("core-js-pure/stable/instance/concat.js"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

var FacebookSource = /*#__PURE__*/(0, _createClass2.default)(function FacebookSource(props) {
  var _this = this;

  (0, _classCallCheck2.default)(this, FacebookSource);
  (0, _defineProperty2.default)(this, "props", null);
  (0, _defineProperty2.default)(this, "isCompatible", function () {
    return !!_this.props.facebookId;
  });
  (0, _defineProperty2.default)(this, "get", function (setState) {
    var _context;

    var facebookId = _this.props.facebookId;
    var size = (0, _utils.getImageSize)(_this.props.size);
    var url = "https://graph.facebook.com/".concat(facebookId, "/picture");
    if (size) url += (0, _concat.default)(_context = "?width=".concat(size, "&height=")).call(_context, size);
    setState({
      sourceName: 'facebook',
      src: url
    });
  });
  this.props = props;
});
exports.default = FacebookSource;
(0, _defineProperty2.default)(FacebookSource, "propTypes", {
  facebookId: _propTypes.default.string
});