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

var branchManager = require('../../../accountManager/branchAccountManager');

var branchAccount = require('../../../account/branchAccount');

var transaction = require('../../transaction');

var accountApplication = require('../../../accountManager/accountApplication');

var allRoomManager = require('../../../branchResource/room/allRoomManager');

var allReservationManager = require('../../../branchResource/reservation/allReservationManager');

var allCheckInManager = require('../../../branchResource/checkIn/allCheckInManager');
/**
 * 进行注册分店账号的事务
 * @extends transaction
 */


var branchRegisterTransaction =
/*#__PURE__*/
function (_transaction) {
  _inherits(branchRegisterTransaction, _transaction);

  function branchRegisterTransaction() {
    _classCallCheck(this, branchRegisterTransaction);

    return _possibleConstructorReturn(this, _getPrototypeOf(branchRegisterTransaction).call(this));
  }
  /**
   * 获取一个分店账号
   * @param {...string} args 
   */


  _createClass(branchRegisterTransaction, [{
    key: "execute",
    value: function execute() {
      var _get2;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_get2 = _get(_getPrototypeOf(branchRegisterTransaction.prototype), "execute", this)).call.apply(_get2, [this].concat(args));

      assert(args.length === 0); //添加这个分店的账户 到分店账号管理器

      var newBranchAccount = new branchAccount(transaction.getManager(accountApplication).getRandomAccount(), transaction.getManager(accountApplication).getInitPassword());
      transaction.getManager(branchManager).addOneNewAccount(newBranchAccount); //为这个分点增加一个房间管理器

      transaction.getManager(allRoomManager).addNewBranchManager(newBranchAccount.getID()); //为这个分点增加一个预约管理器

      transaction.getManager(allReservationManager).addNewBranchManager(newBranchAccount.getID()); //为这个分点增加一个入住登记管理器

      transaction.getManager(allCheckInManager).addNewBranchManager(newBranchAccount.getID()); // 返回新申请的分店账号

      return this.packageResult(true, newBranchAccount, "注册成功");
    }
  }]);

  return branchRegisterTransaction;
}(transaction);

module.exports = branchRegisterTransaction;