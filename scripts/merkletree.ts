import fs from 'fs';
import { MerkleTree } from 'merkletreejs';
import { SHA256 } from 'crypto-js';

async function main() {
  fs.readFile('whitelists.txt', 'utf8', function (wlErr: unknown, wlData: string) {
    let whitelists: string[] = [];
    let oglists: string[] = [];
    let whitelistsRoot = '';
    let oglistsRoot = '';

    if (wlErr) {
      console.log(wlErr);
    }
    const addresses = wlData.split('\n');
    whitelists = addresses
      .filter(x => x.trim() !== '')
      .map(x => SHA256(x.trim().toLowerCase()).toString());

    const tree = new MerkleTree(whitelists, SHA256);
    whitelistsRoot = tree.getRoot().toString('hex');

    fs.readFile('oglists.txt', 'utf8', function (ogErr: unknown, ogData: string) {
      if (ogErr) {
        console.log(ogErr);
      }
      const addresses = ogData.split('\n');
      oglists = addresses
        .filter(x => x.trim() !== '')
        .map(x => SHA256(x.trim().toLowerCase()).toString());

      const tree = new MerkleTree(oglists, SHA256);
      oglistsRoot = tree.getRoot().toString('hex');

      fs.writeFile(
        'public/leaves.json',
        JSON.stringify({ whitelists, oglists, whitelistsRoot, oglistsRoot }),
        err => {
          console.log(err);
        },
      );
    });
  });
}

main().catch(error => console.log(error));
