const StarNotaryV1 = artifacts.require('./StarNotaryV1.sol');

let accounts;
var owner;

contract('StarNotaryV1', async (accs) => {
    accounts = accs;
    owner = accounts[0]
});

it('has correct name', async () => {
    let instance = await StarNotaryV1.deployed(); // Making sure the Smart Contract is deployed and getting the instance.
    let starName = await instance.starName.call(); // Calling the starName property
    assert.equal(starName, 'Awesome Udacity Star');
});

it('a star can be claimed', async () => {
    let instance = await StarNotaryV1.deployed();
    await instance.claimStar({
        from: owner
    });
    let starOwner = await instance.starOwner.call();
    assert.equal(starOwner, owner);
});

it('can star ownership change', async () => {
    let instance = await StarNotaryV1.deployed();
    await instance.claimStar({
        from: owner
    });
    assert.equal(await instance.starOwner.call(), owner);

    let secondUser = accounts[1];
    await instance.claimStar({
        from: secondUser
    });
    assert.equal(await instance.starOwner.call(), secondUser);
});