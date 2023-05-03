/* eslint-disable import/no-anonymous-default-export */
import CollectionAbi from '../Abis/WhoIsWho.json';

export default {
  defaultNetwork: 'testnet',
  sepolia: {
    address: '0x309368DcEf184Cca595980d7006cE3380891752e',
  },
  localhost: {
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  },
  goerli: {
    address: '',
  },
  testnet: {
    address: '0xd7Fb47bA27407bBBB616ece682f0Fc759F824cDa',
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
