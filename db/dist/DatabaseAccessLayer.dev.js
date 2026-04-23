"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 数据库访问抽象基类
var DatabaseAccessLayer =
/*#__PURE__*/
function () {
  /**
   * 构造函数
   * @param {Object} config - 数据库连接配置
   */
  function DatabaseAccessLayer(config) {
    _classCallCheck(this, DatabaseAccessLayer);

    this.config = config;
    this.connection = null;
  }
  /**
   * 连接数据库
   * @returns {Promise} 连接结果
   */


  _createClass(DatabaseAccessLayer, [{
    key: "connect",
    value: function connect() {
      return regeneratorRuntime.async(function connect$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              throw new Error('子类必须实现connect方法');

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
    /**
     * 断开数据库连接
     * @returns {Promise} 断开结果
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      return regeneratorRuntime.async(function disconnect$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              throw new Error('子类必须实现disconnect方法');

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
    /**
     * 从表中读取所有列的信息（包括列名和类型）
     * @param {string} tableName - 表名
     * @returns {Promise<Array>} 列信息数组
     */

  }, {
    key: "getTableColumnInfos",
    value: function getTableColumnInfos(tableName) {
      return regeneratorRuntime.async(function getTableColumnInfos$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              throw new Error('子类必须实现getTableAllColumnInfos方法');

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
    /**
     * 从表中读取所有行数据
     * @param {string} tableName - 表名
     * @returns {Promise<Array>} 行数据数组
     */

  }, {
    key: "getTableAllRows",
    value: function getTableAllRows(tableName) {
      return regeneratorRuntime.async(function getTableAllRows$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              throw new Error('子类必须实现getTableAllRows方法');

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
    /**
     * 向表中写入数据
     * @param {string} tableName - 表名
     * @param {Object} data - 要写入的数据
     * @returns {Promise<number>} 影响的行数
     */

  }, {
    key: "insertData",
    value: function insertData(tableName, data) {
      return regeneratorRuntime.async(function insertData$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              throw new Error('子类必须实现insertData方法');

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
    /**
     * 修改表中的数据
     * @param {string} tableName - 表名
     * @param {Object} data - 要修改的数据
     * @param {Object} condition - 条件
     * @returns {Promise<number>} 影响的行数
     */

  }, {
    key: "updateData",
    value: function updateData(tableName, data, condition) {
      return regeneratorRuntime.async(function updateData$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              throw new Error('子类必须实现updateData方法');

            case 1:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
    /**
     * 删除表中的数据
     * @param {string} tableName - 表名
     * @param {Object} condition - 条件
     * @returns {Promise<number>} 影响的行数
     */

  }, {
    key: "deleteData",
    value: function deleteData(tableName, condition) {
      return regeneratorRuntime.async(function deleteData$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              throw new Error('子类必须实现deleteData方法');

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
    /**
     * 创建表
     * @param {string} tableName - 表名
     * @param {Array} columns - 列信息数组
     * @returns {Promise} 创建结果
     */

  }, {
    key: "createTable",
    value: function createTable(tableName, columns) {
      return regeneratorRuntime.async(function createTable$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              throw new Error('子类必须实现createTable方法');

            case 1:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  }]);

  return DatabaseAccessLayer;
}();

module.exports = DatabaseAccessLayer;