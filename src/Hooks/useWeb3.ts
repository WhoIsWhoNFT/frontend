import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { create } from 'zustand';
import { Networks } from '../Components/Functions/type';
import networkConfig from '../Constants/network.config';
import collectionConfig from '../Constants/collection.config';
import relayerConfig from '../Constants/relayer.config';

const useWeb3 = create(set => ({
  provider: null,
  signer: null,
  account: null,
  ethBalance: 0,
  relayer: null,
  collection: null,
  connect: async () => {
    if (typeof window.ethereum === 'undefined') {
      toast('Please install metamask', { type: 'error' });
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const { defaultNetwork } = networkConfig as { defaultNetwork: Networks };
    const chainId = networkConfig[defaultNetwork].chainId;

    if (chainId === '0x1') {
      await window.ethereum.request?.({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    }

    try {
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const ethBalance = await provider.getBalance(account);
      localStorage.setItem('whoiswho.isConnected', 'true');

      // Connect contracts
      const collection = new ethers.Contract(
        collectionConfig[defaultNetwork].address,
        collectionConfig.abi,
        signer,
      );

      const relayer = new ethers.Contract(
        relayerConfig[defaultNetwork].address,
        relayerConfig.abi,
        signer,
      );

      set({ provider, signer, account, collection, relayer, ethBalance });
    } catch (error: any) {
      let errorMessage = 'Error connecting with metamask';
      switch (error?.code) {
        case 4001:
          errorMessage = 'User rejected the request';
          break;
        default:
          break;
      }

      toast(errorMessage, { type: 'error' });
    }
  },
  disconnect: () => {
    set({ provider: null, signer: null, account: null });
    localStorage.removeItem('whoiswho.isConnected');
  },
}));

export default useWeb3;
