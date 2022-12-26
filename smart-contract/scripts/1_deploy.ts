import { ethers } from 'hardhat';
import CollectionConfig from '../config/collection';
import { NftContractType } from '../lib/NftContractProvider';

async function main() {
  console.log('Deploying contract...');
  const Contract = await ethers.getContractFactory(CollectionConfig.contractName);
  const contract = await Contract.deploy() as NftContractType;
  await contract.deployed();
  console.log('Contract deployed to:', contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
