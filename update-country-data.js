import fs from 'fs';
import path from 'path';

const datasets = [
  'country-by-continent.json',
  'country-by-government-type.json',
  'country-by-landlocked.json',
  'country-by-name.json',
  'country-by-population.json',
  'country-by-religion.json',
  'country-by-yearly-average-temperature.json',
];

const sourceDir = path.join('node_modules', 'country-json', 'src');
const destinationDir = path.join('src', 'data');

datasets.forEach((filename) => {
  const sourcePath = path.join(sourceDir, filename);
  const destinationPath = path.join(destinationDir, filename);

  fs.copyFileSync(sourcePath, destinationPath);
});
