'use strict';

var _typeof = require("@babel/runtime/helpers/typeof");

var _WeakMap = require("core-js-pure/stable/weak-map/index.js");

var _Object$defineProperty = require("core-js-pure/stable/object/define-property.js");

var _Object$getOwnPropertyDescriptor = require("core-js-pure/stable/object/get-own-property-descriptor.js");

var _Object$keys = require("core-js-pure/stable/object/keys.js");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

var _exportNames = {
  createAvatarComponent: true,
  GravatarSource: true,
  FacebookSource: true,
  GithubSource: true,
  SkypeSource: true,
  ValueSource: true,
  SrcSource: true,
  IconSource: true,
  TwitterSource: true,
  VKontakteSource: true,
  InstagramSource: true,
  GoogleSource: true,
  createAvatarDataProvider: true,
  RedirectSource: true
};

_Object$defineProperty(exports, "FacebookSource", {
  enumerable: true,
  get: function get() {
    return _Facebook.default;
  }
});

_Object$defineProperty(exports, "GithubSource", {
  enumerable: true,
  get: function get() {
    return _Github.default;
  }
});

_Object$defineProperty(exports, "GoogleSource", {
  enumerable: true,
  get: function get() {
    return _Google.default;
  }
});

_Object$defineProperty(exports, "GravatarSource", {
  enumerable: true,
  get: function get() {
    return _Gravatar.default;
  }
});

_Object$defineProperty(exports, "IconSource", {
  enumerable: true,
  get: function get() {
    return _Icon.default;
  }
});

_Object$defineProperty(exports, "InstagramSource", {
  enumerable: true,
  get: function get() {
    return _Instagram.default;
  }
});

_Object$defineProperty(exports, "RedirectSource", {
  enumerable: true,
  get: function get() {
    return _AvatarRedirect.default;
  }
});

_Object$defineProperty(exports, "SkypeSource", {
  enumerable: true,
  get: function get() {
    return _Skype.default;
  }
});

_Object$defineProperty(exports, "SrcSource", {
  enumerable: true,
  get: function get() {
    return _Src.default;
  }
});

_Object$defineProperty(exports, "TwitterSource", {
  enumerable: true,
  get: function get() {
    return _Twitter.default;
  }
});

_Object$defineProperty(exports, "VKontakteSource", {
  enumerable: true,
  get: function get() {
    return _VKontakte.default;
  }
});

_Object$defineProperty(exports, "ValueSource", {
  enumerable: true,
  get: function get() {
    return _Value.default;
  }
});

_Object$defineProperty(exports, "createAvatarComponent", {
  enumerable: true,
  get: function get() {
    return _avatar.default;
  }
});

_Object$defineProperty(exports, "createAvatarDataProvider", {
  enumerable: true,
  get: function get() {
    return _dataProvider.default;
  }
});

exports.default = void 0;

var _avatar = _interopRequireWildcard(require("./avatar"));

_Object$keys(_avatar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _avatar[key]) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _avatar[key];
    }
  });
});

var _Gravatar = _interopRequireDefault(require("./sources/Gravatar"));

var _Facebook = _interopRequireDefault(require("./sources/Facebook"));

var _Github = _interopRequireDefault(require("./sources/Github"));

var _Skype = _interopRequireDefault(require("./sources/Skype"));

var _Value = _interopRequireDefault(require("./sources/Value"));

var _Src = _interopRequireDefault(require("./sources/Src"));

var _Icon = _interopRequireDefault(require("./sources/Icon"));

var _Twitter = _interopRequireDefault(require("./sources/Twitter"));

var _VKontakte = _interopRequireDefault(require("./sources/VKontakte"));

var _Instagram = _interopRequireDefault(require("./sources/Instagram"));

var _Google = _interopRequireDefault(require("./sources/Google"));

var _dataProvider = _interopRequireDefault(require("./data-provider"));

var _AvatarRedirect = _interopRequireDefault(require("./sources/AvatarRedirect"));

function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Avatar Redirect
var SOURCES = [_Facebook.default, _Google.default, _Github.default, _Twitter.default, _Instagram.default, _VKontakte.default, _Skype.default, _Gravatar.default, _Src.default, _Value.default, _Icon.default];

var _default = (0, _avatar.default)({
  sources: SOURCES
});

exports.default = _default;