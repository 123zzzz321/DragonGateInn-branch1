"use strict";

var SingletonFactory = require('../../../util/SingletonFactory');

var customerReservateTransaction = require('../../../transaction/reservationTransaction/customerReservateTransaction');

var cancelReservationTransaction = require('../../../transaction/reservationTransaction/cancelReservationTransaction');

var confirmReservationTransaction = require('../../../transaction/reservationTransaction/confirmReservationTransaction');

var customerRegisterTransaction = require('../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');

var branchRegisterTransaction = require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

var allReservationManager = require('../../../branchResource/reservation/allReservationManager');

var _require = require('../../../branchResource/reservation/reservation'),
    reservationState = _require.reservationState;

describe('顾客的预订房间事务', function () {
  it('顾客的预订房间事务的执行', function () {
    var newCustomerRegisterTransaction = new customerRegisterTransaction();
    var customerId = newCustomerRegisterTransaction.execute('138000000000', '123456').resultContent.getID();
    var newBranchRegisterTransaction = new branchRegisterTransaction();
    var branchId = newBranchRegisterTransaction.execute().resultContent.getID();
    var newCustomerReservateTransaction = new customerReservateTransaction();
    var reservation = newCustomerReservateTransaction.execute(customerId, branchId, {
      area: 100,
      windowBool: true,
      bedType: {
        typeString: 'double',
        numId: 1
      }
    }).resultContent;
    expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList()).toContain(reservation);
  });
  it('顾客的取消房间事务的执行', function () {
    // 注册顾客和分店
    var newCustomerRegisterTransaction = new customerRegisterTransaction();
    var customerId = newCustomerRegisterTransaction.execute('138100000000', '123456').resultContent.getID();
    var newBranchRegisterTransaction = new branchRegisterTransaction();
    var branchId = newBranchRegisterTransaction.execute().resultContent.getID(); //创建预约订单

    var newCustomerReservateTransaction = new customerReservateTransaction();
    var reservation = newCustomerReservateTransaction.execute(customerId, branchId, {
      area: 100,
      windowBool: true,
      bedType: {
        typeString: 'double',
        numId: 1
      }
    }).resultContent;
    var newCustomerCancelTransaction = new cancelReservationTransaction();
    newCustomerCancelTransaction.execute(reservation.getID());
    expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList().find(function (object) {
      return object.getID() == reservation.getID();
    }).getState()).toBe(reservationState.state.canceled);
  });
  it('确认预约订单事务的执行', function () {
    // 注册顾客和分店
    var newCustomerRegisterTransaction = new customerRegisterTransaction();
    var customerId = newCustomerRegisterTransaction.execute('138200000000', '123456').resultContent.getID();
    var newBranchRegisterTransaction = new branchRegisterTransaction();
    var branchId = newBranchRegisterTransaction.execute().resultContent.getID(); //创建预约订单

    var newCustomerReservateTransaction = new customerReservateTransaction();
    var reservation = newCustomerReservateTransaction.execute(customerId, branchId, {
      area: 100,
      windowBool: true,
      bedType: {
        typeString: 'double',
        numId: 1
      }
    }).resultContent;
    var newCustomerConfirmTransaction = new confirmReservationTransaction();
    newCustomerConfirmTransaction.execute(reservation.getID());
    expect(SingletonFactory.getInstance(allReservationManager).getAllObjectList().find(function (object) {
      return object.getID() == reservation.getID();
    }).getState()).toBe(reservationState.state.confirmed);
  });
});