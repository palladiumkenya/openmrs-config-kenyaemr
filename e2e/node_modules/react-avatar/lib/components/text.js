"use strict";

var _Reflect$construct = require("core-js-pure/stable/reflect/construct.js");

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _concat = _interopRequireDefault(require("core-js-pure/stable/instance/concat.js"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _wrapper = _interopRequireDefault(require("./wrapper"));

var _utils = require("../utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = _Reflect$construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_Reflect$construct) return false; if (_Reflect$construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_Reflect$construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AvatarText = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(AvatarText, _React$PureComponent);

  var _super = _createSuper(AvatarText);

  function AvatarText() {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, AvatarText);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, (0, _concat.default)(_context = [this]).call(_context, args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_scaleTextNode", function (node) {
      var retryTTL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
      var _this$props = _this.props,
          unstyled = _this$props.unstyled,
          textSizeRatio = _this$props.textSizeRatio,
          textMarginRatio = _this$props.textMarginRatio,
          avatar = _this$props.avatar;
      _this._node = node;
      if (!node || !node.parentNode || unstyled || avatar.src || !_this._mounted) return;
      var spanNode = node.parentNode;
      var tableNode = spanNode.parentNode;

      var _spanNode$getBounding = spanNode.getBoundingClientRect(),
          containerWidth = _spanNode$getBounding.width,
          containerHeight = _spanNode$getBounding.height; // Whenever the avatar element is not visible due to some CSS
      // (such as display: none) on any parent component we will check
      // whether the component has become visible.
      //
      // The time between checks grows up to half a second in an attempt
      // to reduce flicker / performance issues.


      if (containerWidth == 0 && containerHeight == 0) {
        var ttl = Math.min(retryTTL * 1.5, 500);
        (0, _utils.setGroupedTimeout)(function () {
          return _this._scaleTextNode(node, ttl);
        }, ttl);
        return;
      } // If the tableNode (outer-container) does not have its fontSize set yet,
      // we'll set it according to "textSizeRatio"


      if (!tableNode.style.fontSize) {
        var baseFontSize = containerHeight / textSizeRatio;
        tableNode.style.fontSize = "".concat(baseFontSize, "px");
      } // Reset font-size such that scaling works correctly (#133)


      spanNode.style.fontSize = null; // Measure the actual width of the text after setting the container size

      var _node$getBoundingClie = node.getBoundingClientRect(),
          textWidth = _node$getBoundingClie.width;

      if (textWidth < 0) return; // Calculate the maximum width for the text based on "textMarginRatio"

      var maxTextWidth = containerWidth * (1 - 2 * textMarginRatio); // If the text is too wide, scale it down by (maxWidth / actualWidth)

      if (textWidth > maxTextWidth) spanNode.style.fontSize = "calc(1em * ".concat(maxTextWidth / textWidth, ")");
    });
    return _this;
  }

  (0, _createClass2.default)(AvatarText, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._mounted = true;

      this._scaleTextNode(this._node);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._mounted = false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          round = _this$props2.round,
          unstyled = _this$props2.unstyled,
          title = _this$props2.title,
          name = _this$props2.name,
          value = _this$props2.value,
          avatar = _this$props2.avatar;
      var size = (0, _utils.parseSize)(this.props.size);
      var initialsStyle = unstyled ? null : {
        width: size.str,
        height: size.str,
        lineHeight: 'initial',
        textAlign: 'center',
        color: this.props.fgColor,
        background: avatar.color,
        borderRadius: (0, _utils.calculateBorderRadius)(round)
      };
      var tableStyle = unstyled ? null : {
        display: 'table',
        tableLayout: 'fixed',
        width: '100%',
        height: '100%'
      };
      var spanStyle = unstyled ? null : {
        display: 'table-cell',
        verticalAlign: 'middle',
        fontSize: '100%',
        whiteSpace: 'nowrap'
      }; // Ensure the text node is updated and scaled when any of these
      // values changed by calling the `_scaleTextNode` method using
      // the correct `ref`.

      var key = [avatar.value, this.props.size].join('');
      return /*#__PURE__*/_react.default.createElement(_wrapper.default, this.props, /*#__PURE__*/_react.default.createElement("div", {
        className: className + ' sb-avatar__text',
        style: initialsStyle,
        title: (0, _utils.getNullableText)(title, name || value)
      }, /*#__PURE__*/_react.default.createElement("div", {
        style: tableStyle
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: spanStyle
      }, /*#__PURE__*/_react.default.createElement("span", {
        ref: this._scaleTextNode,
        key: key
      }, avatar.value)))));
    }
  }]);
  return AvatarText;
}(_react.default.PureComponent);

exports.default = AvatarText;
(0, _defineProperty2.default)(AvatarText, "propTypes", {
  name: _propTypes.default.string,
  value: _propTypes.default.string,
  avatar: _propTypes.default.object,
  title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.bool]),
  className: _propTypes.default.string,
  unstyled: _propTypes.default.bool,
  fgColor: _propTypes.default.string,
  textSizeRatio: _propTypes.default.number,
  textMarginRatio: _propTypes.default.number,
  round: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.string, _propTypes.default.number]),
  size: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
});
(0, _defineProperty2.default)(AvatarText, "defaultProps", {
  className: '',
  fgColor: '#FFF',
  round: false,
  size: 100,
  textSizeRatio: 3,
  textMarginRatio: .15,
  unstyled: false
});