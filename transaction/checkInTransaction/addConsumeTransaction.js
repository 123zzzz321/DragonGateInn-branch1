const assert=require('assert');

const transaction=require('../transaction');
const allCheckInManager=require('../../branchResource/checkIn/allCheckInManager');

class addConsumeTransaction extends transaction{
    constructor(){
        super();
    }

     /**
     * 执行添加消费
     * @param {string} checkInId 入住订单的编号
     * @returns {object} 包含是否成功、入住订单、提示信息的对象
     */
    execute(...args){
        super.execute(...args);
        assert(args.length==2,"参数数量错误");
        const checkInId=args[0];
        const consume=args[1];
        
        const curCheckIn= transaction.getManager(allCheckInManager).getOneObjectById(checkInId);
        if(curCheckIn==undefined){
            return this.packageResult(false,null,"入住订单不存在");
        }
       
        if(curCheckIn.getIsCheckedOut()==true){
            return this.packageResult(false,null,"入住订单已退房");
        }
       
        // 添加消费金额
        curCheckIn.addConsumeNumber(consume);
             
       
        return this.packageResult(true,curCheckIn,"添加消费成功");
    }
}
module.exports=addConsumeTransaction;
