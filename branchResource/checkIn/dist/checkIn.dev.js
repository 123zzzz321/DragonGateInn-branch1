"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('assert');

var randomGenerator = require('../../util/randomIdGenerator');
/**
 * 入住人员
 */


var person = function person(name, identityCard) {
  _classCallCheck(this, person);

  /**
   * 真实姓名
   */
  this.name = name;
  /**
   * 身份证号
   */

  this.identityCard = identityCard;
};
/**
 * 入住类
 */


var checkIn =
/*#__PURE__*/
function () {
  function checkIn(checkInId) {
    _classCallCheck(this, checkIn);

    this.Id = checkInId;
    /**
     * 入住订单的编号,可以为空，表示这个顾客没有预约直接到酒店里入住
     */

    this.reservationId = null;
    /**
     * 入住订单所属的店的编号
     */

    this.branchId = null;
    /**
     * 入住的日期
     */

    this.checkInDate = new Date();
    /**
     * 退房的日期（如果日期还没定义，那么说明这个顾客还没有退房）
     */

    this.checkOutDate = null;
    /**
     * 入住房间的的编号
     */

    this.roomId = null;
    /**
     * 入住人员的真实信息
     */

    this.personList = [];
    /**
     * 入住人员总消费金额
     */

    this.consumeNumber = 0;
  }

  _createClass(checkIn, [{
    key: "getID",
    value: function getID() {
      return this.Id;
    }
    /**
     * 设置入住订单的房间编号和入住人员的真实信息
     * @param {string} roomId 入住房间的编号
     * @param {person} person 入住人员的真实信息
     */

  }, {
    key: "setCheckInData",
    value: function setCheckInData(branchId, roomId, persons) {
      var connectReservationId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      this.branchId = branchId;
      this.roomId = roomId;
      this.personList = persons;
      this.reservationId = connectReservationId;
    }
  }, {
    key: "getBranchId",
    value: function getBranchId() {
      return this.branchId;
    }
  }, {
    key: "setRoomId",
    value: function setRoomId(roomId) {
      this.roomId = roomId;
    }
  }, {
    key: "getRoomId",
    value: function getRoomId() {
      return this.roomId;
    }
  }, {
    key: "setPerson",
    value: function setPerson(person) {
      this.personList = person;
    }
  }, {
    key: "getPerson",
    value: function getPerson() {
      return this.personList;
    }
  }, {
    key: "getReservationId",
    value: function getReservationId() {
      return this.reservationId;
    }
    /**
     * 入住人员的消费记录在其入住记录上
     */

  }, {
    key: "addConsumeNumber",
    value: function addConsumeNumber(consumeNumber) {
      this.consumeNumber += consumeNumber;
    }
  }, {
    key: "getConsumeNumber",
    value: function getConsumeNumber() {
      return this.consumeNumber;
    }
  }, {
    key: "getCheckInDate",
    value: function getCheckInDate() {
      return this.checkInDate;
    }
  }, {
    key: "getCheckOutDate",
    value: function getCheckOutDate() {
      return this.checkOutDate;
    }
    /**
     * 设置退房日期为当前日期
     */

  }, {
    key: "setCheckOutDateAsNow",
    value: function setCheckOutDateAsNow() {
      this.checkOutDate = new Date();
    }
  }, {
    key: "getIsCheckedOut",
    value: function getIsCheckedOut() {
      return this.checkOutDate !== null;
    }
  }]);

  return checkIn;
}();

var randomCheckInIdGenerator = new randomGenerator();
/**
 * 入住订单的工厂函数
 * @param {string} roomId 入住房间的编号
 * @param {person} person 入住人员的真实信息
 * @param {string} connectReservationId 入住订单的编号,可以为空，表示这个顾客没有预约直接到酒店里入住
 * @returns {checkIn} 入住订单对象
 */

function checkInFactory(branchId, roomId, persons) {
  var connectReservationId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  assert(branchId !== null, 'branchId is null');
  assert(roomId !== null, 'roomId is null');
  assert(persons instanceof Array, 'person is not a person array');
  persons.forEach(function (item) {
    assert(item instanceof person, 'person is not a person');
  });
  var newCheckIn = new checkIn(randomCheckInIdGenerator.generateId());
  newCheckIn.setCheckInData(branchId, roomId, persons, connectReservationId);
  return newCheckIn;
}

module.exports = {
  person: person,
  checkIn: checkIn,
  checkInFactory: checkInFactory
};