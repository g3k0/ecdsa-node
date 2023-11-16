const crypto = require('./crypto').main;

describe('cypto script', () => {
    
    it('should create a set of credentials', () => {
        const credentials = crypto;

        expect(credentials.result).toBe(true)

        expect(credentials.data.privateKey.length).toBeGreaterThan(0)
        expect(credentials.data.publicKeyHash.length).toBeGreaterThan(0)
        expect(credentials.data.address.length).toBeGreaterThan(0)
        expect(credentials.data.signature.length).toBeGreaterThan(0)
        expect(credentials.data.recoveryId).toBeGreaterThan(-1)
    })
})