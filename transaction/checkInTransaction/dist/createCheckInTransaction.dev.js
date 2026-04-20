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

var _require = require('../../branchResource/checkIn/checkIn'),
    checkInFactory = _require.checkInFactory,
    person = _require.person;

var branchManager = require('../../accountManager/branchAccountManager');

var allRoomManager = require('../../branchResource/room/allRoomManager');

var branchAccountManager = require('../../accountManager/branchAccountManager');

var createCheckInTransaction =
/*#__PURE__*/
function (_transaction) {
  _inherits(createCheckInTransaction, _transaction);

  function createCheckInTransaction() {
    _classCallCheck(this, createCheckInTransaction);

    return _possibleConstructorReturn(this, _getPrototypeOf(createCheckInTransaction).call(this));
  }
  /**
   * 检查分店是否存在
   * @param {string} branchId 分店的编号
   * @returns {boolean} 分店是否存在
   */


  _createClass(createCheckInTransaction, [{
    key: "isBranchExist",
    value: function isBranchExist(branchId) {
      return transaction.getManager(branchAccountManager).getOneAccountByID(branchId) != null;
    }
    /**
     * 检查房间是否存在
     * @param {string} branchId 分店的编号
     * @param {string} roomId 房间的编号
     * @returns {boolean} 房间是否存在
     */

  }, {
    key: "isRoomExist",
    value: function isRoomExist(branchId, roomId) {
      return transaction.getManager(allRoomManager).getOneManagerByBranchId(branchId).getOneRoomById(roomId) != null;
    }
    /**
     * 检查入住人员数组类型是否正确
     * @param {string} branchId 分店的编号
     * @param {string} roomId 房间的编号
     * @param {person[]} persons 入住人员的数组
     * @returns {boolean} 入住人员数组类型是否正确
     */

  }, {
    key: "checkPersonArg",
    value: function checkPersonArg(persons) {
      return persons.every(function (item, _) {
        return item instanceof person;
      });
    }
  }, {
    key: "execute",
    value: function execute() {
      var _get2;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_get2 = _get(_getPrototypeOf(createCheckInTransaction.prototype), "execute", this)).call.apply(_get2, [this].concat(args));

      assert(args.length >= 3, 'args.length less than 3');
      var branchId = args[0];
      var roomId = args[1];
      var persons = args[2];
      var connectReservationId = null;

      if (args.length >= 4) {
        connectReservationId = args[3];
      }

      if (!this.isBranchExist(branchId)) {
        return this.packageResult(false, null, 'branchId is not exist');
      }

      if (!this.isRoomExist(branchId, roomId)) {
        return this.packageResult(false, null, 'roomId is not exist');
      }

      if (!this.checkPersonArg(persons)) {
        return this.packageResult(false, null, 'person is not a person array');
      } //TODO:检查预约是否存在，现在还没想好怎么实现，在哪里实现


      var newCheckIn = checkInFactory(branchId, roomId, persons, connectReservationId);
      transaction.getManager(allCheckInManager).getOneManagerByBranchId(branchId).addNewCheckIn(newCheckIn);
      return this.packageResult(true, newCheckIn, 'success');
    }
  }]);

  return createCheckInTransaction;
}(transaction);

module.exports = createCheckInTransaction;