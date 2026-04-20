"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var assert = require('assert');

var transaction = require('../transaction');

var allCheckInManager = require('../../branchResource/checkIn/allCheckInManager');

var checkoutTransaction =
/*#__PURE__*/
function (_transaction) {
  _inherits(checkoutTransaction, _transaction);

  function checkoutTransaction() {
    _classCallCheck(this, checkoutTransaction);

    return _possibleConstructorReturn(this, _getPrototypeOf(checkoutTransaction).call(this));
  }
  /**
  * 执行入住订单确认
  * @param {string} checkInId 入住订单的编号
  * @returns {object} 包含是否成功、入住订单、提示信息的对象
  */


  _createClass(checkoutTransaction, [{
    key: "execute",
    value: function execute() {
      var _get2;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_get2 = _get(_getPrototypeOf(checkoutTransaction.prototype), "execute", this)).call.apply(_get2, [this].concat(args));

      assert(args.length == 1, "参数数量错误");
      var checkInId = args[0];
      var curCheckIn = transaction.getManager(allCheckInManager).getOneObjectById(checkInId);

      if (curCheckIn == undefined) {
        return this.packageResult(false, null, "入住订单不存在");
      }

      if (curCheckIn.getIsCheckedOut() == true) {
        return this.packageResult(false, null, "入住订单已退房");
      } // 设置退房日期为当前时间


      curCheckIn.setCheckOutDateAsNow();
      return this.packageResult(true, curCheckIn, "入住订单退房成功");
    }
  }]);

  return checkoutTransaction;
}(transaction);

module.exports = checkoutTransaction;