import { Contract, Provider, ethers } from 'ethers';
import { create } from 'zustand';

interface Web3Actions {
  connectWeb3: () => void;
}

interface Web3States {
  signer: ethers.JsonRpcSigner | null;
  collection: Contract | null;
  provider: Provider | null;
}

const initialStates: Web3States = {
  signer: null,
  collection: null,
  provider: null,
};

const useWeb3 = create<Web3States & Web3Actions>()((set, get) => ({
  ...initialStates,
  connectWeb3: async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('Please install MetaMask or another Ethereum wallet.');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    set({ provider, signer });
  },
}));

export default useWeb3;
