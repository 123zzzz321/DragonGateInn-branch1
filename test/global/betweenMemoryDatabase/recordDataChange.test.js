const {recordDataChange,recordDataChangeManager }=require('../../../global/betweenMemoryDatabase/RecordDataChange/recordDataChange');
const customerAccount=require('../../../account/customerAccount');
const branchAccount=require('../../../account/branchAccount');
describe('recordDataChange',()=>{
    it('should create a recordDataChange object', async ()=>{
        // 使用时间戳作为唯一ID
        const uniqueId = 'test_12222' ;
        
        const changeData=new customerAccount(uniqueId,'123456','43432434');
        const changeData1=new customerAccount(uniqueId,'123456','21313131');

        const changeDatabase=new recordDataChangeManager();
        changeDatabase.addChange(new recordDataChange('insert',changeData));
        changeDatabase.addChange(new recordDataChange('update',changeData1));

        //await changeDatabase.changeDatabase();

    })

    it('should create table',async ()=>{
        const newBranchAccount=new branchAccount('branch2','123456');

        const changeDatabase=new recordDataChangeManager();
        changeDatabase.addChange(new recordDataChange('createBranchResourceTable',newBranchAccount));
        await changeDatabase.changeDatabase();
    })
})