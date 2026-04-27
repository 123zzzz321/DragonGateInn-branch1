const {recordDataChange,recordDataChangeManager }=require('../../../global/betweenMemoryDatabase/RecordDataChange/recordDataChange');
const customerAccount=require('../../../account/customerAccount');
const branchAccount=require('../../../account/branchAccount');

const {checkInFactory,person}=require('../../../branchResource/checkIn/checkIn');
const branchRegisterTransaction=require('../../../transaction/accountTransaction/registerTransaction/branchRegisterTransaction');

const changeDatabase=new recordDataChangeManager();

describe('recordDataChange',()=>{
    it('should create a recordDataChange object', async ()=>{
        // 使用时间戳作为唯一ID
        // const uniqueId = 'test_12222' ;
        
        // const changeData=new customerAccount(uniqueId,'123456','43432434');
        // const changeData1=new customerAccount(uniqueId,'123456','21313131');

        // changeDatabase.addChange(new recordDataChange('insert',changeData));
        // changeDatabase.addChange(new recordDataChange('update',changeData1));

        //await changeDatabase.changeDatabase();

    })

    it('should create table',async ()=>{
        // const newBranchAccount=new branchAccount('branch2','123456');

        // changeDatabase.addChange(new recordDataChange('createBranchResourceTable',newBranchAccount));
        //await changeDatabase.changeDatabase();
    })

    it('should change branch resource table',async ()=>{
        let transaction=new branchRegisterTransaction();
        const newBranchAccount=transaction.execute().resultContent;

        changeDatabase.addChange(new recordDataChange('createBranchResourceTable',newBranchAccount));
        const newCheckIn = checkInFactory(newBranchAccount.getID(),'roomId1',[new person('name1','id1')]);
        
        changeDatabase.addChange(new recordDataChange('insert',newCheckIn));
        //await changeDatabase.changeDatabase();
    })
})