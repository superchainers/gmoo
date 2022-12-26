import chai, { expect } from 'chai';
import ChaiAsPromised from 'chai-as-promised';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { NftContractType } from '../lib/NftContractProvider';
import config from '../config/collection';

chai.use(ChaiAsPromised);


describe(config.contractName, function () {
  let owner!: SignerWithAddress;
  let externalUser!: SignerWithAddress;
  let contract!: NftContractType;

  before(async function () {
    [owner, externalUser] = await ethers.getSigners();
  });

  it('Contract deployment', async function () {
    const Contract = await ethers.getContractFactory(config.contractName);
    contract = await Contract.deploy() as NftContractType;
    await contract.deployed();
  });

  it('Check initial data', async function () {
    expect(await contract.name()).to.equal(config.tokenName);
    expect(await contract.symbol()).to.equal(config.tokenSymbol);
    expect(await contract.maxSupply()).to.equal(config.maxSupply);

    await expect(contract.tokenURI(30)).to.be.revertedWith('ERC721Metadata: URI query for nonexistent token');
  });

  it('Check balances', async function () {
    expect(await contract.balanceOf(externalUser.address)).to.equal(0);
    expect(await contract.balanceOf('0xF4cb3a8F9A2E54B4D32D7836da09A1a31832163b')).to.equal(1);
    expect(await contract.balanceOf('0x4be4bdE1976B8a31395e92d7da423DE311015B5F')).to.equal(8);
  });

  it('Owner only functions', async function () {
    await expect(contract.connect(externalUser).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Supply checks', async function () {
    expect(await contract.totalSupply()).to.equal(config.maxSupply);
  });

  it('Token URI generation', async function () {
    const uriPrefix = 'ipfs://QmXcZg9FFw875apVxZoFkbah973j9NZQU6tDNwS5gZFQ2h/';
    const uriSuffix = '.json';
    const totalSupply = await contract.totalSupply();

    await expect(contract.tokenURI(0)).to.be.revertedWith('ERC721Metadata: URI query for nonexistent token');
    expect(await contract.tokenURI(1)).to.equal(`${uriPrefix}1${uriSuffix}`);
    expect(await contract.tokenURI(2)).to.equal(`${uriPrefix}2${uriSuffix}`);
    expect(await contract.tokenURI(3)).to.equal(`${uriPrefix}3${uriSuffix}`);
    expect(await contract.tokenURI(totalSupply)).to.equal(`${uriPrefix}${totalSupply}${uriSuffix}`);
  });

  it('Should support the ERC721 and ERC2198 standards', async () => {
    const ERC721InterfaceId = '0x80ac58cd';
    const ERC2981InterfaceId = '0x2a55205a';
    const isERC721 = await contract.supportsInterface(ERC721InterfaceId);
    const isER2981 = await contract.supportsInterface(ERC2981InterfaceId);
    expect(isERC721).to.equal(true, 'Is not an ERC721');
    expect(isER2981).to.equal(true, 'Is not an ERC2981');
  });

  it('Should return the correct royalty info', async () => {
    const [address, royalty] = await contract.royaltyInfo(1, 1000);

    expect(address).to.eq(await owner.getAddress(), 'Default receiver is not the owner');
    expect(royalty.toNumber()).to.eq(100, 'Royalty fee is 10');
  });
});
