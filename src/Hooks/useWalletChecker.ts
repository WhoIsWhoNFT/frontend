import MerkleTree from 'merkletreejs';
import useWeb3 from '../Store/useWeb3';
import { useEffect, useState } from 'react';
import { SHA256 } from 'crypto-js';

const useWalletChecker = () => {
  const signer = useWeb3(state => state.signer);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    (async function () {
      if (!signer?.address) {
        setIsWhitelisted(false);
        return;
      }
      const response = await fetch('/leaves.json').then(res => res.json());
      const tree = new MerkleTree(response.leaves, SHA256);
      const leaf = SHA256(signer.address.toLowerCase()).toString();
      const proof = tree.getProof(leaf);
      setIsWhitelisted(tree.verify(proof, leaf, response.root));
    })();
  });

  return isWhitelisted;
};

export default useWalletChecker;
