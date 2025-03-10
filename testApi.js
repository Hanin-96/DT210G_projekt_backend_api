import { readFile } from 'node:fs/promises';

try {
  const data = JSON.parse(await readFile('harryPotterApi.json', 'utf8'));
  console.log(data); //Elon Musk's data
} catch (err) {
  console.error(`Error reading JSON file: ${err}`);
}