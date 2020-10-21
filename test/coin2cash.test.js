const {ether, expectRevert} = require('@openzeppelin/test-helpers');
const {accounts, contract} = require('@openzeppelin/test-environment');

const Coin2Cash = contract.fromArtifact('Coin2Cash');

const {expect} = require('chai');

describe('Coin2Cash', function () {
    const [buyer1, seller1, randyRandom, deployer, ...otherAccounts] = accounts;

    before(async function () {
        this.coin2cash = await Coin2Cash.new({ from: deployer});
        var numSellers = await this.coin2cash.numSellers();
        expect(`${numSellers}`).to.equal('0');
        
    });


    it('allows creating a seller', async function() {
        await this.coin2cash.addSeller(
            "42.1234565",
            "-78.123456",
            "meet me at the corner of monroe and rand",
            "I'm selling coins!",
            "buffalo,NY",
            0, {from: seller1});
    });
    it('allows creating a buyer', async function() {
        await this.coin2cash.addBuyer(
            "42.1234567",
           "-78.1234567",
            "meet me at the corner of monroe and rand",
            "I'm selling coins!",
            "buffalo,NY",
            0, {from: buyer1});
    });

    it('allows reading a created buyer', async function() {
        var res = await this.coin2cash.addBuyer(
            "42.1234567",
            "-78.1234567",
            "meet me at the corner of monroe and ISHMAEL",
            "I'm selling coins!",
            "buffalo,NY",
            0, {from: buyer1});
            var id = parseInt(res.receipt.logs[0].args['0']);
            var buyer = await this.coin2cash.getBuyer(id);
            expect(buyer['latitude']).to.equal('42.1234567');
    });

    it('allows reading a created seller', async function() {
        var res = await this.coin2cash.addSeller(
            "42.1234565",
            "-78.1234567",
            "meet me at the corner of monroe and ISHMAEL",
            "I'm selling coins!",
            "buffalo,NY",
            0, {from: seller1});
            var id = parseInt(res.receipt.logs[0].args['0']);
            var seller = await this.coin2cash.getSeller(id);
            expect(seller['latitude']).to.equal('42.1234565');
    });

    it('allows reading all sellers', async function() {
        var res = await this.coin2cash.numSellers();
        console.log(res);
        for (var i = 1; i <= res; i++) {
            var seller = await this.coin2cash.getSeller(i);
            console.log(seller['latitude']);
            expect(seller['latitude']).to.equal('42.1234565');
        }
    });
    it('allows reading all buyers', async function() {
        var res = await this.coin2cash.numBuyers();
        console.log(res);
        for (var i = 1; i <= res; i++) {
            var buyer = await this.coin2cash.getBuyer(i);
            console.log(buyer['latitude']);
            expect(buyer['latitude']).to.equal('42.1234567');
        }
    });
});