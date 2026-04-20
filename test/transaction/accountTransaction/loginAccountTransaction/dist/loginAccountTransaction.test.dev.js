"use strict";

var loginAccountTransaction = require('../../../../transaction/accountTransaction/loginTransaction/loginCustomerTransaction');

var customerRegisterTransaction = require('../../../../transaction/accountTransaction/registerTransaction/customerRegisterTransaction');

var customerAccount = require('../../../../account/customerAccount');

var loginBranchTransaction = require('../../../../transaction/accountTransaction/loginTransaction/loginBranchTransaction');

var branchRegisterTransaction = require('../../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

var branchAccount = require('../../../../account/branchAccount');

var loginHeadquarterTransaction = require('../../../../transaction/accountTransaction/loginTransaction/loginHeadquarterTransaction');

var headquarterRegisterTransaction = require('../../../../transaction/accountTransaction/registerTransaction/headquarterRegisterTransaction');

var headquarterAccount = require('../../../../account/headquarterAccount');

var loginCustomerByPhoneTransaction = require('../../../../transaction/accountTransaction/loginTransaction/loginCustomerByPhoneTransaction');

describe('客户登录事务', function () {
  it('登录客户', function () {
    var registerTransaction = new customerRegisterTransaction();
    var account = registerTransaction.execute('138000000000', '123456').resultContent;
    var curTransaction = new loginAccountTransaction();
    expect(curTransaction.execute(account.getID(), account.getPassword()).successBool).toBe(true);
  });
  it('登录客户通过手机号', function () {
    var registerTransaction = new customerRegisterTransaction();
    var account = registerTransaction.execute('138000000001', '123456').resultContent;
    var curTransaction = new loginCustomerByPhoneTransaction();
    expect(curTransaction.execute(account.getPhoneString(), account.getPassword()).successBool).toBe(true);
  });
  it('登录分店', function () {
    var registerTransaction = new branchRegisterTransaction();
    var account = registerTransaction.execute().resultContent;
    var curTransaction = new loginBranchTransaction();
    expect(curTransaction.execute(account.getID(), account.getPassword()).successBool).toBe(true);
  });
  it('登录总部账号', function () {
    var registerTransaction = new headquarterRegisterTransaction();
    var account = registerTransaction.execute('100000000000', '123456').resultContent;
    var curTransaction = new loginHeadquarterTransaction();
    expect(curTransaction.execute(account.getID(), account.getPassword()).successBool).toBe(true);
  });
});