"use strict";

var customerReservateTransaction = require('../../../transaction/reservationTransaction/customerReservateTransaction');

var customerRegisterTransaction = require('../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');

var SingletonFactory = require('../../../util/SingletonFactory');

var customerAccountManager = require('../../../accountManager/customerAccountManager');

var branchRegisterTransaction = require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

var branchAccountManager = require('../../../accountManager/branchAccountManager');

var branchReservationManager = require('../../../branchResource/reservation/branchReservationManager');

var allReservationManager = require('../../../branchResource/reservation/allReservationManager');

describe('顾客的预订房间事务', function () {
  it('顾客的预订房间事务的执行', function () {
    var newCustomerRegisterTransaction = new customerRegisterTransaction();
    var customerId = newCustomerRegisterTransaction.execute('138000000000', '123456').getID();
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
});