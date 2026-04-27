const assert=require('assert'); 

const branchRoomTransaction=require('./branchRoomTranaction');
const allRoomManager=require('../../branchResource/room/allRoomManager');



/**
 * 分店占据房间的事务
 */
class branchOccupiedRoomTransaction extends branchRoomTransaction{
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
        
        //检查添加的变量是否是房间id(是否是string类型，是否在管理器中存在)
        assert(this.checkRoomIdArg(args));

        args.forEach((item,index)=>{
            if(index>0){
                this.getNeedChangeBranchRoomManager(args[0])
                    .setOneRoomOccupied(item);
            }
        });

        args.forEach((item,index)=>{
            if(index>0){
                this.changeDatabase('update',this.getNeedChangeBranchRoomManager(args[0])
                    .getOneRoomById(item));
            }
        });
        
        return this.packageResult(true,null,"房间占据成功");
    }
}

module.exports=branchOccupiedRoomTransaction;
