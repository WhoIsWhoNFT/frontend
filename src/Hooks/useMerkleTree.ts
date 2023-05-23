import { useEffect, useState } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

function useMerkleTree({ leaf }: { leaf: 'oglists' | 'whitelists' }) {
  const [tree, setTree] = useState<MerkleTree | null>(null);
  const [root, setRoot] = useState('');

  useEffect(() => {
    (async function () {
      const response = await fetch('/leaves.json').then(res => res.json());
      const buffer = response[leaf].map((address: any) => new Uint8Array(address.data));
      const merkleTree = new MerkleTree(buffer, keccak256, { sortPairs: true });
      setTree(merkleTree);
      setRoot(response[`${leaf}Root`]);
    })();
  }, [leaf]);

  return { tree, root };
}

export default useMerkleTree;
