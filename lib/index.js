'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactHookx = function ReactHookx(options) {
  var _this = this;

  _classCallCheck(this, ReactHookx);

  this.initState = function () {
    var storageState = void 0;

    switch (_this.storage.mode) {
      case 'session':
        storageState = JSON.parse(window.sessionStorage.getItem('hookx')) || {};
        break;
      case 'local':
        storageState = JSON.parse(window.localStorage.getItem('hookx')) || {};
        break;
      default:
        break;
    }
    return _extends({}, _this.state, storageState);
  };

  this.storageState = function (state) {
    if (_this.storage.reducer && typeof _this.storage.reducer != 'function') {
      throw Error('storage.reducer must be a function');
    }
    switch (_this.storage.mode) {
      case 'session':
        window.sessionStorage.setItem('hookx', JSON.stringify(_this.storage.reducer(state)));
        break;
      case 'local':
        window.localStorage.setItem('hookx', JSON.stringify(_this.storage.reducer(state)));
        break;
      default:
        break;
    }
  };

  this.StoreProvider = function (props) {
    var _useState = (0, _react.useState)(_this.initState()),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        _setState = _useState2[1];

    var dispatch = function dispatch(action, data) {
      var fn = _this.action[action]({
        state: state,
        setState: function setState(data) {
          var nextState = _extends({}, state, data);
          _setState(nextState);
          return nextState;
        }
      }, data);

      if (fn instanceof Promise) {
        return new Promise(function (resolve, reject) {
          fn.then(function (res) {
            resolve(res);
          }).catch(function (err) {
            reject(err);
          });
        });
      }
    };

    var getState = function getState() {
      return state;
    };

    _this.storageState(state);

    var Provider = _this.Context.Provider;

    return _react2.default.createElement(
      Provider,
      { value: { dispatch: dispatch, getState: getState } },
      props.children
    );
  };

  this.useDispatch = function () {
    var store = (0, _react.useContext)(_this.Context);
    return store.dispatch;
  };

  this.useStoreState = function () {
    var store = (0, _react.useContext)(_this.Context);
    return store.getState();
  };

  this.state = options.state || {};
  this.action = options.action || {};
  this.storage = options.storage || {};
  this.Context = (0, _react.createContext)(null);
};

exports.default = ReactHookx;
