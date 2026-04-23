const assert = require('assert');

//标记一个数据是否是启用状态
class activeState{
    constructor(activeBool){
        assert(typeof activeBool==='boolean');
        this.activeBool=activeBool;
    }

    getActiveBool(){
        return this.activeBool;
    }

    setEnable(){
        this.activeBool=true;
    }

    setDisable(){
        this.activeBool=false;
    }
}

module.exports=activeState;