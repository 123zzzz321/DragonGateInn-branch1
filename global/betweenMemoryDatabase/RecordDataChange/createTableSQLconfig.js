/**
 * 根据编号生成表结构配置
 * @param {string} branchId - 分店编号
 * @returns {Array} 表结构配置数组
 */
function getCreateTableSQLconfig(branchId) {
    return [
        {
            tableName: `ROOM`,
            sql: `  CREATE TABLE ROOM_${branchId} (
                    ID VARCHAR2(50) NOT NULL,        
                    BRANCHID VARCHAR2(50),              
                    ROOMLAYOUT_AREAREAL NUMBER(10, 2),    
                    ROOMLAYOUT_WINDOWBOOL NUMBER(1),      
                    ROOMLAYOUT_BEDTYPE_TYPESTRING VARCHAR2(100), 
                    ROOMLAYOUT_BEDTYPE_NUMINT NUMBER(10),
                    ACTIVESTATE NUMBER(1),                
                    ISEMPTYBOOL NUMBER(1),               
                    PRICEREAL NUMBER(12, 2),              
                    CONSTRAINT PK_ROOM_LAYOUT_${branchId} PRIMARY KEY (ID)
                )`
        },
        {
            tableName: `CHECKIN`,
            sql: `  CREATE TABLE CHECKIN_${branchId} (
                    ID VARCHAR2(50) NOT NULL,          
                    BRANCHID VARCHAR2(50),              
                    ROOMID VARCHAR2(50),                
                    PERSON VARCHAR2(1000),              
                    CHECKINDATE DATE,                   
                    CHECKOUTDATE DATE,                  
                    CONSUMENUMBER NUMBER(10),           
                    RESERVATIONID VARCHAR2(50),         
                    CONSTRAINT PK_ROOM_RESERVATION_${branchId} PRIMARY KEY (ID)
                )`
        },
        {
            tableName: `RESERVATION`,
            sql: `  CREATE TABLE RESERVATION_${branchId}  (
                    ID VARCHAR2(50) NOT NULL,              
                    CREATERESERVATIONDATE DATE,            
                    BRANCHID VARCHAR2(50),                 
                    CUSTOMERID VARCHAR2(50),               
                    ROOMLAYOUT_AREAREAL NUMBER(10, 2),    
                    ROOMLAYOUT_BEDTYPE_NUMINT NUMBER(10),  
                    ROOMLAYOUT_BEDTYPE_TYPESTRING VARCHAR2(100), 
                    ROOMLAYOUT_WINDOWBOOL NUMBER(1),       
                    RESERVATIONSTATE VARCHAR2(20),        
                    CONSTRAINT PK_RESERVATION_DETAIL_${branchId} PRIMARY KEY (ID)
                )`
        },
        {
            tableName: `DISPLAYROOM`,
            sql: `  CREATE TABLE DISPLAYROOM_${branchId}  (
                    ID VARCHAR2(50) NOT NULL,              
                    BRANCHID VARCHAR2(50),                 
                    ROOMLAYOUT_AREAREAL NUMBER(10, 2),    
                    ROOMLAYOUT_WINDOWBOOL NUMBER(1),       
                    ROOMLAYOUT_BEDTYPE_TYPESTRING VARCHAR2(100), 
                    ROOMLAYOUT_BEDTYPE_NUMINT NUMBER(10),  
                    APPRAISEPRICE NUMBER(12, 2),           
                    ACTIVESTATE NUMBER(1),                 
                    CONSTRAINT PK_DISPLAYROOM_${branchId} PRIMARY KEY (ID)
                )`
        }
    ];
}

module.exports = getCreateTableSQLconfig;
