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

    let implementationAddress;
    console.log('Waiting for implementation address...');
    for(let attempts = 0; attempts < 100; attempts++){
        try {
            implementationAddress = await upgrades.erc1967.getImplementationAddress(
                proxyAddress
            );
            break;
        } catch (e) {
            console.log('This is attempt #' + attempts);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('Proxy contract address: ' + proxyAddress);

    console.log('Implementation contract address: ' + implementationAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });