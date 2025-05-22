"use strict";

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var InternalState = /*#__PURE__*/function () {
  function InternalState() {
    (0, _classCallCheck2.default)(this, InternalState);
    this.sourcePointer = 0;
    this.active = true;
    this.fetch = null;
  }

  (0, _createClass2.default)(InternalState, [{
    key: "isActive",
    value: function isActive() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // Internal state has been reset => we received new props
      if (state.internal !== this) return false;
      if (!this.fetch) return false;
      if (this.active !== true) return false;
      return true;
    }
  }]);
  return InternalState;
}();

exports.default = InternalState;