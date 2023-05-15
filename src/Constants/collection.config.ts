/* eslint-disable import/no-anonymous-default-export */
import CollectionAbi from '../Abis/WhoIsWho.json';

export default {
  defaultNetwork: 'testnet',
  sepolia: {
    address: '0x309368DcEf184Cca595980d7006cE3380891752e',
  },
  localhost: {
    address: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  },
  goerli: {
    address: '',
  },
  testnet: {
    address: '0x23401fc7d27b85965D01C16499a6533ee1b16C65',
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
  maxMint: {
    PRESALE_OG: 3,
    PRESALE_WL: 2,
    PUBLIC_SALE: 5,
  },
};
