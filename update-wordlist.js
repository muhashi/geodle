import fs from 'fs';
import path from 'path';

const NUMBER_OF_COUNTRIES = 150;

const EXCLUDED_COUNTRIES = [
  'England',
  'Wales',
  'Scotland',
  'Northern Ireland',
];

const datasets = [
  'country-by-continent.json',
  'country-by-government-type.json',
  'country-by-landlocked.json',
  'country-by-population.json',
  'country-by-religion.json',
  'country-by-yearly-average-temperature.json',
];

const dir = path.join('src', 'data');

// Get the NUMBER_OF_COUNTRIES most populous countries
const populationData = JSON.parse(fs.readFileSync(path.join(dir, 'country-by-population.json'), 'utf8'));

populationData.sort((a, b) => b.population - a.population);

const countryList = populationData.slice(0, NUMBER_OF_COUNTRIES + EXCLUDED_COUNTRIES.length).map(({ country }) => country)
  .filter((country) => !EXCLUDED_COUNTRIES.includes(country));

const countrySet = new Set(...[countryList]);

let missingDataCount = 0;

// Check if all picked countries have data in all datasets
datasets.forEach((filename) => {
  const sourcePath = path.join(dir, filename);
  const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  for (const countryName of countrySet) {
    const countryData = data.find(({ country }) => countryName === country);
    const dataKey = countryData ? Object.keys(countryData).find((key) => key !== 'country') : null;

    if (!countryData || !countryData[dataKey]) {
      console.log(`Missing data for ${countryName} in ${filename}`);
      missingDataCount++;
    }
  }
});

if (missingDataCount > 0) {
  console.log(`Missing ${missingDataCount} data points. Exiting...`);
  process.exit(1);
}

shuffle(countryList);

// Generate wordlist.js
const output = `// Wordlist consists of ${NUMBER_OF_COUNTRIES} most populous countries listed in a randomized order
// NOTE: Wordlist and game doesn't consider England or other British Isles seperately from UK to prevent confusion,
// but the data DOES consider them seperately

const wordlist = [
${countryList.map((country) => `  '${country}',`).join('\n')}
];

export default wordlist;
`;

const outDir = path.join('src', 'wordlist.js');

fs.writeFileSync(outDir, output);

console.log("Wordlist updated successfully!");

// src: https://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
