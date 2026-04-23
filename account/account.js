const activeState = require('../util/activeState.js');

//用于登录的账户
class account{
    constructor(id,password){
        this.idString=id;
        this.passwordString=password;
        this.activeState=new activeState(true);
    }

    getID(){
        return this.idString;
    }

    getPassword(){
        return this.passwordString;
    }
    

    //-------------账户状态相关方法-------------
    getActiveState(){
        return this.activeState;
    }

    //查看账户被禁用的状态
    getActiveBool(){
        return this.activeState.getActiveBool();
    }

    //禁用账户，被禁用的账户的行为由管理器具体设定
    setDisable(){
        this.activeState.setDisable();
    }

    //启用账户
    setEnable(){
        this.activeState.setEnable();
    }
}

module.exports=account;