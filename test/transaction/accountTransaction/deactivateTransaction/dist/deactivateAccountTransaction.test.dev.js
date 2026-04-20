"use strict";

var transaction = require('../../../../transaction/transaction');

var branchRegisterTransaction = require('../../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

var customerRegisterTransaction = require('../../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');

var deactivateBranchTransaction = require('../../../../transaction/accountTransaction/deactivateTransaction/deactivateBranchTranaction');

var deactivateCustomerTransaction = require('../../../../transaction/accountTransaction/deactivateTransaction/deactivateCustomerTransaction');

var branchAccountManager = require('../../../../accountManager/branchAccountManager');

var customerAccountManager = require('../../../../accountManager/customerAccountManager');

describe('停用账号事务', function () {
  it('停用分点账号', function () {
    var curBranchRegisterTransaction = new branchRegisterTransaction();
    var branchAccount = curBranchRegisterTransaction.execute().resultContent;
    var curDeactivateAccountTransaction = new deactivateBranchTransaction();
    curDeactivateAccountTransaction.execute(branchAccount.getID());
    expect(transaction.getManager(branchAccountManager).getActiveAccountList().includes(branchAccount)).toBe(false);
  });
  it('停用客户账号', function () {
    var curCustomerRegisterTransaction = new customerRegisterTransaction();
    curCustomerRegisterTransaction.execute('13801234517', '123456');
    var customerAccount = transaction.getManager(customerAccountManager).getCustomAccountByPhoneString('13801234517');
    var curDeactivateAccountTransaction = new deactivateCustomerTransaction();
    curDeactivateAccountTransaction.execute(customerAccount.getID());
    expect(transaction.getManager(customerAccountManager).getActiveAccountList().includes(customerAccount)).toBe(false);
  });
});