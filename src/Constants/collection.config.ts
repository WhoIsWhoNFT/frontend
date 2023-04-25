/* eslint-disable import/no-anonymous-default-export */
import CollectionAbi from '../Abis/WhoIsWho.json';

export default {
  defaultNetwork: 'localhost',
  sepolia: {
    address: '0xf74CB7aa272E0480F32d37896C640C287FfcF52B',
  },
  localhost: {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  },
  goerli: {
    address: '',
  },
  mainnet: {
    address: '',
  },
  abi: CollectionAbi.abi,
  stageEnum: {
    0: 'IDLE',
    1: 'PRESALE_OG',
    2: 'PRESALE_WL',
    3: 'PUBLIC_SALE',
  },
};
