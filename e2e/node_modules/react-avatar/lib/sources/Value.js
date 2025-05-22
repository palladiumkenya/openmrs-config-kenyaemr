'use strict';

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _utils = require("../utils");

var ValueSource = /*#__PURE__*/function () {
  function ValueSource(props) {
    var _this = this;

    (0, _classCallCheck2.default)(this, ValueSource);
    (0, _defineProperty2.default)(this, "props", null);
    (0, _defineProperty2.default)(this, "isCompatible", function () {
      return !!(_this.props.name || _this.props.value || _this.props.email);
    });
    (0, _defineProperty2.default)(this, "get", function (setState) {
      var value = _this.getValue();

      if (!value) return setState(null);
      setState({
        sourceName: 'text',
        value: value,
        color: _this.getColor()
      });
    });
    this.props = props;
  }

  (0, _createClass2.default)(ValueSource, [{
    key: "getInitials",
    value: function getInitials() {
      var _this$props = this.props,
          name = _this$props.name,
          initials = _this$props.initials;
      if (typeof initials === 'string') return initials;
      if (typeof initials === 'function') return initials(name, this.props);
      return (0, _utils.defaultInitials)(name, this.props);
    }
  }, {
    key: "getValue",
    value: function getValue() {
      if (this.props.name) return this.getInitials();
      if (this.props.value) return this.props.value;
      return null;
    }
  }, {
    key: "getColor",
    value: function getColor() {
      var _this$props2 = this.props,
          color = _this$props2.color,
          colors = _this$props2.colors,
          name = _this$props2.name,
          email = _this$props2.email,
          value = _this$props2.value;
      var colorValue = name || email || value;
      return color || (0, _utils.getRandomColor)(colorValue, colors);
    }
  }]);
  return ValueSource;
}();

exports.default = ValueSource;
(0, _defineProperty2.default)(ValueSource, "propTypes", {
  color: _propTypes.default.string,
  name: _propTypes.default.string,
  value: _propTypes.default.string,
  email: _propTypes.default.string,
  maxInitials: _propTypes.default.number,
  initials: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func])
});