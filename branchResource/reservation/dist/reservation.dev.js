"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var assert = require('assert');

var _require = require('../room/room'),
    RoomLayout = _require.RoomLayout;

var randomGenerator = require('../../util/randomIdGenerator');
/**
 * 预约订单的状态类
 */


var reservationState =
/*#__PURE__*/
function () {
  function reservationState() {
    _classCallCheck(this, reservationState);

    /**
     * 预约订单的状态
     */
    this.state = reservationState.state.pending;
  }
  /**
   * 返回预约订单的状态
   * @returns {string} 预约订单的状态
   */


  _createClass(reservationState, [{
    key: "getState",
    value: function getState() {
      return this.state;
    }
    /**
     * 改变预约订单的状态为已取消
     */

  }, {
    key: "changeToCanceled",
    value: function changeToCanceled() {
      this.state = reservationState.state.canceled;
    }
    /**
     * 改变预约订单的状态为已确认
     */

  }, {
    key: "changeToConfirmed",
    value: function changeToConfirmed() {
      this.state = reservationState.state.confirmed;
    }
  }]);

  return reservationState;
}(); //预约订单的状态


reservationState.state = {
  //顾客发起了提交，但是没有主动取消，也没有到酒店入住
  pending: 'pending',
  //顾客到酒店分店入住，也就是分店接受了顾客的预约
  confirmed: 'confirmed',
  //顾客或者酒店分店取消了预约
  canceled: 'canceled'
};
/**
 * 预约订单类
 */

var reservation =
/*#__PURE__*/
function () {
  function reservation(reservationIdString) {
    _classCallCheck(this, reservation);

    /**
     * 预约订单的编号
     */
    this.reservationIdString = reservationIdString;
    this.createReservationDate = new Date();
    /**
     * 预约订单的状态,创建预约之后，默认就是pending
     */

    this.state = new reservationState();
    /**
     * 预约订单的顾客的编号
     */

    this.customerIdString = '';
    /**
     * 预约订单的分店的编号
     */

    this.branchIdString = '';
    /**
     * 预约订单的房间布局
     */

    this.roomLayout = null;
  }
  /**
   * 返回预约订单的编号
   * @returns {string} 预约订单的编号
   */


  _createClass(reservation, [{
    key: "getID",
    value: function getID() {
      return this.reservationIdString;
    }
    /**
     * 返回预约订单的状态
     * @returns {string} 预约订单的状态
     */

  }, {
    key: "getState",
    value: function getState() {
      return this.state.getState();
    }
    /**
     * 返回预约订单的顾客的编号
     * @returns {string} 预约订单的顾客的编号
     */

  }, {
    key: "getCustomerId",
    value: function getCustomerId() {
      return this.customerIdString;
    }
    /**
     * 返回预约订单的分店的编号
     * @returns {string} 预约订单的分店的编号
     */

  }, {
    key: "getBranchId",
    value: function getBranchId() {
      return this.branchIdString;
    }
    /**
     * 返回预约订单的房间布局
     * @returns {Array} 预约订单的房间布局
     */

  }, {
    key: "getRoomLayout",
    value: function getRoomLayout() {
      return this.roomLayout;
    }
  }, {
    key: "getcreateReservationDate",
    value: function getcreateReservationDate() {
      return this.createReservationDate;
    }
    /**
     * 设置预约订单的顾客的编号，分店的编号，房间布局
     * @param {string} customerIdString 预约订单的顾客的编号
     * @param {string} branchIdString 预约订单的分店的编号
     * @param {Array} roomLayout 预约订单的房间布局
     */

  }, {
    key: "setReservationData",
    value: function setReservationData(customerIdString, branchIdString, roomLayout) {
      assert(typeof customerIdString === 'string');
      assert(typeof branchIdString === 'string');
      assert(roomLayout instanceof RoomLayout);
      this.customerIdString = customerIdString;
      this.branchIdString = branchIdString;
      this.roomLayout = roomLayout;
    }
    /**
     * 确认预约订单
     */

  }, {
    key: "confirm",
    value: function confirm() {
      this.state.changeToConfirmed();
    }
    /**
     * 取消预约订单
     */

  }, {
    key: "cancel",
    value: function cancel() {
      this.state.changeToCanceled();
    }
  }]);

  return reservation;
}();

var randomReservationIdGenerator = new randomGenerator();
/**
 * 预约订单的工厂函数   
 * @param {string} customerIdString 预约订单的顾客的编号
 * @param {string} branchIdString 预约订单的分店的编号
 * @param {RoomLayout} roomLayout 预约订单的房间布局
 * @returns {reservation} 预约订单对象
 */

function reservationFactory(customerIdString, branchIdString, roomLayout) {
  var newReservation = new reservation(randomReservationIdGenerator.generateId());
  newReservation.setReservationData(customerIdString, branchIdString, roomLayout);
  return newReservation;
}

module.exports.reservationState = reservationState;
module.exports.reservation = reservation;
module.exports.reservationFactory = reservationFactory;