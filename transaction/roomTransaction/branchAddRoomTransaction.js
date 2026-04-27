const assert=require('assert'); 

const branchRoomTransaction=require('./branchRoomTranaction');
const allRoomManager=require('../../branchResource/room/allRoomManager');
const { room } = require('../../branchResource/room/room');

/**
 * 分店添加房间事务
 */
class branchAddRoomTransaction extends branchRoomTransaction{
    constructor(){
        super();
    }
    
    /**
     * 第一个参数：分店id
     * 第二个参数：房间信息
     */
    execute(...args){
        super.execute(...args); 

        //检查分店参数是否符合要求
        assert(this.checkBranchArg(args));

        if(!this.checkBranchExist(args[0])){
            return this.packageResult(false,null,"分店不存在");
        }
        
        //检查添加的变量是否是房间实例
        assert(args.every((item,index) => {
            if(index>0){return item instanceof room}
            return true;
        }));

        args.forEach((item,index)=>{
            if(index>0){
                this.getNeedChangeBranchRoomManager(args[0])
                    .addRoom(item);
            }
        });

        args.forEach((item,index)=>{
            if(index>0){
                this.changeDatabase('insert',item);
            }
        });

        return this.packageResult(true,null,"房间添加成功");
    }
}

module.exports=branchAddRoomTransaction;