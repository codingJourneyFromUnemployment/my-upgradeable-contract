const { ethers, upgrades } = require('hardhat');
require('dotenv').config();

async function main() {
    console.log('deploying...');
    const signers = await ethers.getSigners();
    const deployer = signers[0];

    if(hre.network.name === "localhost"){
        console.log('network: localhost');
    } else {
        console.log(`network: ${hre.network.name}`)
    }
    const VendingMachineV1 = await ethers.getContractFactory('VendingMachineV1', deployer);
    const proxy = await upgrades.deployProxy(VendingMachineV1, [100]);

    const proxyAddress = await proxy.getAddress();
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(
      proxyAddress
    );

    console.log('Proxy contract address: ' + proxyAddress);

    console.log('Implementation contract address: ' + implementationAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });