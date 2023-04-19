import fs from 'fs';

// npx ts-node scripts/cleanWhitelists.ts
async function main() {
  const whitelists: string[] = [];

  fs.readFile('whitelists.txt', 'utf8', function (err: unknown, data: string) {
    if (err) {
      console.log(err);
    }

    const addresses = data.split('\n');

    addresses.forEach(address => {
      if (address.trim() !== '') {
        const cleanedAddress = address.trim().toLowerCase();
        const idx = whitelists.findIndex(item => item === cleanedAddress);
        if (idx === -1) {
          whitelists.push(cleanedAddress);
        }
      }
    });

    const text = whitelists.join('\n');
    fs.writeFile('whitelists.txt', text, err => {
      console.log(err);
    });
  });
}

main().catch(error => console.log(error));
