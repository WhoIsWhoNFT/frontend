import keccak256 from 'keccak256';
import useMerkleTree from './useMerkleTree';
import { useAccount } from 'wagmi';

function useWhitelists() {
  const oglistsMerkle = useMerkleTree({ leaf: 'oglists' });
  const whitelistsMerkle = useMerkleTree({ leaf: 'whitelists' });
  const { address } = useAccount();

  if (!(oglistsMerkle?.tree && whitelistsMerkle?.tree && address)) {
    return '';
  }

  const leaf = keccak256(address.trim().toLowerCase());
  const oglistsProof = oglistsMerkle.tree.getHexProof(leaf);
  const whitelistsProof = whitelistsMerkle.tree.getHexProof(leaf);
  const isOg = oglistsMerkle.tree.verify(oglistsProof, leaf, oglistsMerkle.root);
  const isWhitelist = whitelistsMerkle.tree.verify(
    whitelistsProof,
    leaf,
    whitelistsMerkle.root,
  );

  return isOg ? 'OG' : isWhitelist ? 'WL' : '';
}

export default useWhitelists;
