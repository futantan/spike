const { expect } = require('chai'); // Require the assertion library
const { ethers } = require('hardhat');
const { Container } = require('postcss');

describe('TipJar', function () {
	//describe the main test
	let contract;
	this.beforeAll(async () => {
		// Deploy the contract once for every test case
		const contractFactory = await ethers.getContractFactory('TipJar'); //Create an abstraction of the contract used to deploy the TipJar
		contract = await contractFactory.deploy(); // Start the deployment process, resolves to a Contract object
		await contract.deployed();
	});
	it('Should deploy the contract and return 0 as totalTips', async function () {
		expect(await contract.getTotalTips()).to.equal(0); // Retrieve the total number of tips
	});

	it('Should allow to send a tip and increase the number of total tips', async function () {
		const [owner, sender] = await ethers.getSigners(); // Get two addresses, the owner and the sender
		const senderBalance = await sender.getBalance();

		/*
		 * perform the send transaction
		 * You pass the message and the name as arguments and the value as an object that is then
		 * used as the global `msg` object in the contract
		 * to define the amount of ETH use the parseEther utility
		 */
		const tx = await contract
			.connect(sender)
			.sendTip('message', 'name', { value: ethers.utils.parseEther('0.001') });
		await tx.wait();

		const newSenderBalance = await sender.getBalance();
		expect(tx).changeEtherBalance(contract, ethers.utils.parseEther('0.001'));
		expect(newSenderBalance).to.be.below(senderBalance);
		expect(await contract.getTotalTips()).to.equal(1); // Get the total number of tips
	});

	it('should react to the tip event', async function () {
		const [, sender] = await ethers.getSigners();
		const amount = ethers.utils.parseEther('0.1');
		const tx = await contract.connect(sender).sendTip('event message', 'event', { value: amount });
		await tx.wait();
		expect(tx)
			.to.emit(contract, 'NewTip')
			.withArgs(sender.address, 'event message', 'event', amount);
	});

	it('should allow the owner to withdraw the whole balance', async function() {
		const [owner] = await ethers.getSigners();
		const ownerBalance = await owner.getBalance();
		const contractBalance = await ethers.provider.getBalance(contract.address);
		const tips = await contract.getAllTips();
		const sumTips = tips.reduce((acc, tip) => acc.add(tip.amount), ethers.BigNumber.from(0));
		expect(sumTips).to.be.equal(contractBalance);

		const tx = await contract.connect(owner).withdraw();
		await tx.wait();
		expect(tx).changeEtherBalance(contract, contractBalance.mul(-1));
		expect(tx).changeEtherBalance(owner, contractBalance);
		const newOwnerBalance = await owner.getBalance();
		expect(newOwnerBalance).to.be.above(ownerBalance);

		expect(tx)
		.to.emit(contract, 'NewWithdraw')
		.withArgs(contractBalance);
	})

	it('should reject withdrawal from another address than the owner', async function() {
		const [, otherUser] = await ethers.getSigners();
		const tx = contract.connect(otherUser).withdraw();
		expect(tx).to.be.revertedWith("Withdraw failed");
	})
});
