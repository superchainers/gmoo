import * as Networks from '../lib/Networks';
import * as Marketplaces from '../lib/Marketplaces';

const config = {
  testnet: Networks.ethereumTestnet,
  mainnet: Networks.ethereumMainnet,
  contractName: 'GenesisMOO',
  tokenName: 'Genesis MOO',
  tokenSymbol: 'GMOO',
  maxSupply: 29,
  royalty: 1000,
  contractAddress: '0xcA4de9600e8A6AbB7aCfdd6323d7a9dCA79b7f04',
  marketplaceIdentifier: 'gmoo',
  marketplaceConfig: Marketplaces.openSea,
  hiddenMetadataUri: '',
};

export default config;
