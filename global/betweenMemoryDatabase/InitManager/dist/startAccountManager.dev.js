"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var branchAccount = require('../../account/branchAccount');

var customerAccount = require('../../account/customerAccount');

var headquarterAccount = require('../../account/headquarterAccount');

var branchAccountManager = require('../../accountManager/branchAccountManager');

var customerAccountManager = require('../../accountManager/customerAccountManager');

var headquarterAccountManager = require('../../accountManager/headquarterAccountManager');

var SingletonFactory = require('../../util/SingletonFactory');

var OracleAccessLayer = require('../../db/OracleAccessLayer'); // 数据库连接配置


var dbConfig = {
  user: 'system',
  password: '123456',
  connectString: 'localhost:1521/hellooracle'
};
var curAccessLayer = SingletonFactory.getInstance(OracleAccessLayer, dbConfig); // 建立表名、账户类型和管理器的映射关系

var accountConfig = {
  'BRANCH_ACCOUNT': {
    type: branchAccount,
    manager: branchAccountManager
  },
  'CUSTOMER_ACCOUNT': {
    type: customerAccount,
    manager: customerAccountManager
  },
  'HEADQUARTER_ACCOUNT': {
    type: headquarterAccount,
    manager: headquarterAccountManager
  }
};
/**
 * 从数据库中读取账户数据
 * @param {string} accountTableName - 账户表名
 * @returns {Promise<Array>} 包含所有账户数据的数组
 */

function readAccountDataFromDB(accountTableName) {
  return regeneratorRuntime.async(function readAccountDataFromDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(curAccessLayer.getTableAllRows(accountTableName));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}
/**
 * 将账户数据写入账户管理器
 * @param {string} accountTableName - 账户表名
 * @param {Array} accountDatas - 包含所有账户数据的数组
 */


function writeAccountDataFromDBToManager(accountType, accountManager, accountDatas) {
  accountDatas.forEach(function (accountData) {
    accountManager.addOneNewAccount(new accountType(accountData.ID, accountData.PASSWORD));
  });
}
/**
 * 初始化所有账户管理器（从数据库中读取账户数据并写入账户管理器）
 */


function initAllAccountManager() {
  var _i, _Object$entries, _Object$entries$_i, tableName, config, accountDatas, manager;

  return regeneratorRuntime.async(function initAllAccountManager$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log('开始初始化账户管理器...');
          _i = 0, _Object$entries = Object.entries(accountConfig);

        case 3:
          if (!(_i < _Object$entries.length)) {
            _context2.next = 22;
            break;
          }

          _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), tableName = _Object$entries$_i[0], config = _Object$entries$_i[1];
          _context2.prev = 5;
          console.log("\u5904\u7406\u8868".concat(tableName, "...")); // 读取账户数据

          _context2.next = 9;
          return regeneratorRuntime.awrap(readAccountDataFromDB(tableName));

        case 9:
          accountDatas = _context2.sent;
          // 获取账户管理器
          manager = SingletonFactory.getInstance(config.manager); // 写入账户数据到管理器

          writeAccountDataFromDBToManager(config.type, manager, accountDatas);
          console.log("\u8868".concat(tableName, "\u6570\u636E\u52A0\u8F7D\u5B8C\u6210"));
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](5);
          console.warn("\u5904\u7406\u8868".concat(tableName, "\u65F6\u51FA\u9519:"), _context2.t0.message);
          console.warn('将使用内存模式运行，数据不会持久化'); // 继续处理下一个表

        case 19:
          _i++;
          _context2.next = 3;
          break;

        case 22:
          console.log('账户管理器初始化完成');
          _context2.next = 29;
          break;

        case 25:
          _context2.prev = 25;
          _context2.t1 = _context2["catch"](0);
          console.error('初始化账户管理器失败:', _context2.t1);
          console.warn('系统将在无数据库模式下运行');

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 25], [5, 15]]);
}

module.exports = {
  initAllAccountManager: initAllAccountManager
};