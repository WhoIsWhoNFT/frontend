import fs from 'fs';
import { MerkleTree } from 'merkletreejs';
import { SHA256 } from 'crypto-js';

async function main() {
  fs.readFile('whitelists.txt', 'utf8', function (err: unknown, data: string) {
    if (err) {
      console.log(err);
    }
    const addresses = data.split('\n');
    const leaves = addresses
      .filter(x => x.trim() !== '')
      .map(x => SHA256(x.trim().toLowerCase()).toString());
    const tree = new MerkleTree(leaves, SHA256);
    const root = tree.getRoot().toString('hex');
    fs.writeFile('public/leaves.json', JSON.stringify({ leaves, root }), err => {
      console.log(err);
    });
  });
}

main().catch(error => console.log(error));
