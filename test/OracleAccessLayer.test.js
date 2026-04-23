const OracleAccessLayer = require('../db/OracleAccessLayer');

describe('OracleAccessLayer', () => {
    it('should connect to Oracle database', async () => {
        const accessLayer = new OracleAccessLayer({
            user: 'system',
            password: '123456',
            connectString: 'localhost:1521/hellooracle'
        });
        await accessLayer.connect();
        expect(accessLayer.connection).toBeDefined();
    });
});