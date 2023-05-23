import keccak256 from 'keccak256';
import useMerkleTree from './useMerkleTree';
import useWeb3 from './useWeb3';
import { useEffect, useState } from 'react';

function useWhitelists(): 'OG' | 'WL' | '' {
  const oglistsMerkle = useMerkleTree({ leaf: 'oglists' });
  const whitelistsMerkle = useMerkleTree({ leaf: 'whitelists' });
  const account = useWeb3((state: any) => state.account);
  const [whitelistType, setWhitelistType] = useState<'OG' | 'WL' | ''>('');

  useEffect(() => {
    if (!(oglistsMerkle?.tree && whitelistsMerkle?.tree && account)) {
      setWhitelistType('');
      return;
    }

    const leaf = keccak256(account.trim().toLowerCase());
    const oglistsProof = oglistsMerkle.tree.getHexProof(leaf);
    const whitelistsProof = whitelistsMerkle.tree.getHexProof(leaf);
    const isOg = oglistsMerkle.tree.verify(oglistsProof, leaf, oglistsMerkle.root);
    const isWhitelist = whitelistsMerkle.tree.verify(
      whitelistsProof,
      leaf,
      whitelistsMerkle.root,
    );

    setWhitelistType(isOg ? 'OG' : isWhitelist ? 'WL' : '');
  }, [
    account,
    oglistsMerkle.root,
    oglistsMerkle.tree,
    whitelistsMerkle.root,
    whitelistsMerkle.tree,
  ]);

  return whitelistType;
}

export default useWhitelists;
