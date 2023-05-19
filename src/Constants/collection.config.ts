/* eslint-disable import/no-anonymous-default-export */
import CollectionAbi from '../Abis/WhoIsWho.json';

export default {
  defaultNetwork: 'mainnet',
  sepolia: {
    address: '',
  },
  localhost: {
    address: '',
  },
  goerli: {
    address: '',
  },
  testnet: {
    address: '',
  },
  mainnet: {
    address: '0x8F07AB2B4fEA713c110E820CFA5d8fE02dAa3D74',
  },
  abi: CollectionAbi.abi,
  stageEnum: {
    0: 'IDLE',
    1: 'PRESALE_OG',
    2: 'PRESALE_WL',
    3: 'PUBLIC_SALE',
  },
  maxMint: {
    PRESALE_OG: 3,
    PRESALE_WL: 2,
    PUBLIC_SALE: 5,
    IDLE: 0,
  },
};
