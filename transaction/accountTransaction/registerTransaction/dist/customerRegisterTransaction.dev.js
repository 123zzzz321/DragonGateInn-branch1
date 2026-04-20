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

var transaction = require('../../transaction');

var customerAccount = require('../../../account/customerAccount');

var customerAccountManager = require('../../../accountManager/customerAccountManager');

var accountApplication = require('../../../accountManager/accountApplication');
/**
 * 客户注册事务
 * @extends transaction
 */


var customerRegisterTransaction =
/*#__PURE__*/
function (_transaction) {
  _inherits(customerRegisterTransaction, _transaction);

  function customerRegisterTransaction() {
    _classCallCheck(this, customerRegisterTransaction);

    return _possibleConstructorReturn(this, _getPrototypeOf(customerRegisterTransaction).call(this));
  }
  /**
   * 执行注册事务
   * @param {...string} args 注册事务的参数，包括顾客的手机号和密码
   * @param {...string} args[0] 顾客的手机号
   * @param {...string} args[1] 顾客的密码
   */


  _createClass(customerRegisterTransaction, [{
    key: "execute",
    value: function execute() {
      var _get2;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_get2 = _get(_getPrototypeOf(customerRegisterTransaction.prototype), "execute", this)).call.apply(_get2, [this].concat(args));

      assert(args.length === 2);
      assert(args[0] !== null && typeof args[0] === 'string');
      assert(args[1] !== null && typeof args[1] === 'string');
      var phoneString = args[0],
          password = args[1];

      if (transaction.getManager(customerAccountManager).getCustomAccountByPhoneString(phoneString) !== undefined) {
        throw new Error('注册顾客账户时，使用的手机号已存在');
      }

      var newCustomerAccount = new customerAccount(transaction.getManager(accountApplication).getRandomAccount(), password, phoneString);
      transaction.getManager(customerAccountManager).addOneNewAccount(newCustomerAccount);
      return this.packageResult(true, newCustomerAccount, "注册成功");
    }
  }]);

  return customerRegisterTransaction;
}(transaction);

module.exports = customerRegisterTransaction;