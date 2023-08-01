const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');
require('dotenv').config();

// TO DO: Place the address of your proxy here!
const proxyAddress = hre.network.config.proxyAddress;

async function main() {
  console.log(`upgrading proxy at ${proxyAddress}, network: ${hre.network.name}`);
  const signers = await ethers.getSigners();
  const deployer = signers[0];

  const VendingMachineV2 = await ethers.getContractFactory('VendingMachineV2', deployer);
  const upgraded = await upgrades.upgradeProxy(proxyAddress, VendingMachineV2);

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

  console.log("The current contract owner is: " + upgraded.owner());
  console.log('Implementation contract address: ' + implementationAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });
