const assert=require('assert'); 

const branchDisplayRoomTransaction=require('./branchDisplayRoomTransaction');

/**
 * 分店重新上架展示房间事务
 */
class branchEnableDisplayRoomTransaction extends branchDisplayRoomTransaction{
    constructor(){
        super();
    }
    
    /**
     * 第一个参数：分店id
     * 第二个参数及以后：展示房间ID
     */
    execute(...args){
        super.execute(...args); 

        //检查分店参数是否符合要求
        assert(this.checkBranchArg(args));

        if(!this.checkBranchExist(args[0])){
            return this.packageResult(false,null,"分店不存在");
        }
        
        //检查展示房间ID参数是否符合要求
        assert(args.every((item,index) => {
            if(index>0){return typeof item === 'string'}
            return true;
        }));

        const displayRoomManager = this.getNeedChangeBranchDisplayRoomManager(args[0]);
        
        args.forEach((item,index)=>{
            if(index>0){
                displayRoomManager.setOneDisplayRoomEnable(item);
                // 获取展示房间实例并更新数据库
                const displayRoomInstance = displayRoomManager.getOneDisplayRoomById(item);
                if (displayRoomInstance) {
                    this.changeDatabase('update',displayRoomInstance);
                }
            }
        });

        return this.packageResult(true,null,"展示房间重新上架成功");
    }
}

module.exports=branchEnableDisplayRoomTransaction;