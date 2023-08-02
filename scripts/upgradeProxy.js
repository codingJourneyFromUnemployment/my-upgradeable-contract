const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');
require('dotenv').config();

const proxyAddress = hre.network.config.proxyAddress[0];

async function main() {
	console.log(`upgrading proxy at ${proxyAddress}, network: ${hre.network.name}`);
	const signers = await ethers.getSigners();
	const deployer = signers[0];

	const VendingMachineV2 = await ethers.getContractFactory('VendingMachineV2', deployer);
	const vendingMachineV2 = await upgrades.upgradeProxy(proxyAddress, VendingMachineV2);

	console.log('Waiting for deployment transaction...');
	await vendingMachineV2.waitForDeployment()
	await new Promise(resolve => setTimeout(resolve, 10000));

	const implementationAddress = await upgrades.erc1967.getImplementationAddress(
		proxyAddress
	);
	const owner = await vendingMachineV2.owner();
	console.log("The current contract owner is: " + owner);
	console.log('Implementation contract address: ' + implementationAddress);
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
