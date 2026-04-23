// 数据库访问抽象基类
class DatabaseAccessLayer {
    /**
     * 构造函数
     * @param {Object} config - 数据库连接配置
     */
    constructor(config) {
        this.config = config;
        this.connection = null;
    }

    /**
     * 连接数据库
     * @returns {Promise} 连接结果
     */
    async connect() {
        throw new Error('子类必须实现connect方法');
    }

    /**
     * 断开数据库连接
     * @returns {Promise} 断开结果
     */
    async disconnect() {
        throw new Error('子类必须实现disconnect方法');
    }

    /**
     * 从表中读取所有列的信息（包括列名和类型）
     * @param {string} tableName - 表名
     * @returns {Promise<Array>} 列信息数组
     */
    async getTableColumnInfos(tableName) {
        throw new Error('子类必须实现getTableAllColumnInfos方法');
    }

    /**
     * 从表中读取所有行数据
     * @param {string} tableName - 表名
     * @returns {Promise<Array>} 行数据数组
     */
    async getTableAllRows(tableName) {
        throw new Error('子类必须实现getTableAllRows方法');
    }

    /**
     * 向表中写入数据
     * @param {string} tableName - 表名
     * @param {Object} data - 要写入的数据
     * @returns {Promise<number>} 影响的行数
     */
    async insertData(tableName, data) {
        throw new Error('子类必须实现insertData方法');
    }

    /**
     * 修改表中的数据
     * @param {string} tableName - 表名
     * @param {Object} data - 要修改的数据
     * @param {Object} condition - 条件
     * @returns {Promise<number>} 影响的行数
     */
    async updateData(tableName, data, condition) {
        throw new Error('子类必须实现updateData方法');
    }

    /**
     * 删除表中的数据
     * @param {string} tableName - 表名
     * @param {Object} condition - 条件
     * @returns {Promise<number>} 影响的行数
     */
    async deleteData(tableName, condition) {
        throw new Error('子类必须实现deleteData方法');
    }

    /**
     * 创建表
     * @param {string} tableName - 表名
     * @param {Array} columns - 列信息数组
     * @returns {Promise} 创建结果
     */
    async createTable(tableName, columns) {
        throw new Error('子类必须实现createTable方法');
    }

    /**
     * 用SQL语句创建表
     * @param {string} sql - 创建表的SQL语句
     * @returns {Promise} 创建结果
     */
    async createTableBySQL(sql){
        throw new Error('子类必须实现createTableBySQL方法');
    }
}

module.exports = DatabaseAccessLayer;