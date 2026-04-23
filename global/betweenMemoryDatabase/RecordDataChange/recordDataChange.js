const assert=require('assert');
const {accountClassTableConfigs,getBranchResourceTableConfig}=require('../classTableConfig');

const SingletonFactory=require('../../../util/SingletonFactory');

const globalDatabaseAccessLayer = require('../../DatabaseConnection/DatabaeseConnect');

const branchResourceManagers=require('../../branchResource/branchResourceManagers');

const createTableSQLConfig=require('./createTableSQLconfig');

const convertTypeToDBRow=require('../../../db/ConvertTypBetweenDBRow/convertTypeToDBRow');
const curConvertTypeToDBRow=new convertTypeToDBRow();

const account = require('../../../account/account');
/**
 * 数据变更记录类
 */
class recordDataChange{
    constructor(changeType,changeData){
        this.changeType=changeType;
        this.changeData=changeData;
    }

    /**
     * 获取变更记录是否为账号变更
     */
    getIsAccount()
    {
        return this.changeData instanceof account;
    }
    /**
     * 获取变更的类型对应的表配置
     */
    getConfig(){
        if(this.getIsAccount()){
            return accountClassTableConfigs.find(config=> this.changeData instanceof config.type);
        }
        return getBranchResourceTableConfig.find(config=> this.changeData instanceof config.type);
    }

    /**
     * 获取变更记录的数据库行数据
     */
    getChangeDatabase(){
        return curConvertTypeToDBRow.convert(this.changeData);
    }

    /**
     * 获取变更记录的条件
     */
    getCondition(){
        return { ID: this.changeData.getID() };
    }

}

/**
 * 数据变更记录管理器类
 */
class recordDataChangeManager{
    constructor(){
        this.changeList=[];
    }


    addChange(change){
        this.changeList.push(change);
    }

    async createBranchResourceTable(change){
        const configs = createTableSQLConfig(change.changeData.getID());
        for (const config of configs) {
            try {
                await globalDatabaseAccessLayer.createTableBySQL(config.sql);
            } catch (error) {
                console.error(`创建表 ${config.tableName} 失败:`, error.message);
            }
        }
    }

    /**
     * 执行数据变更
     */
    async changeDatabase(){
        for (const change of this.changeList) {
            if(change.changeType=='insert'){
                await globalDatabaseAccessLayer.insertData(
                    change.getConfig().tableName,
                    change.getChangeDatabase()
                );
            }else if(change.changeType=='update'){
                await globalDatabaseAccessLayer.updateData(
                    change.getConfig().tableName,
                    change.getChangeDatabase(),
                    change.getCondition()
                );
            }else if(change.changeType=='delete'){
                await globalDatabaseAccessLayer.deleteData(
                    change.getConfig().tableName,
                    change.getCondition()
                );
            }
            else if(change.changeType=='createBranchResourceTable'){
                await this.createBranchResourceTable(change);
            }
        }
        this.changeList=[];
    }
}

module.exports={
    recordDataChange,
    recordDataChangeManager
}