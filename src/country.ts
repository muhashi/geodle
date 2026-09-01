import continentData from './data/country-by-continent.json';
import landlockedData from './data/country-by-landlocked.json';
import populationData from './data/country-by-population.json';
import religionData from './data/country-by-religion.json';
import surfaceAreaData from './data/country-by-surface-area.json';
import temperatureCelsiusData from './data/country-by-yearly-average-temperature.json';
import wordlist from './wordlist';

// Get the country of the day
const epoch = new Date(2022, 4, 9); // Created on 9th May 2022!
const today = new Date();
today.setHours(0, 0, 0);
const msPerDay = 1000 * 60 * 60 * 24;
const dayNumber = Math.round((today.getTime() - epoch.getTime()) / msPerDay);
const COUNTRY_OFFSET = 134; // Offset to make sure daily country stays consistent when new countries are added
const dayIndex = (dayNumber + COUNTRY_OFFSET) % wordlist.length;
const correctCountry = wordlist[dayIndex];

if (import.meta.env.DEV) {
  console.log(`Country #${dayNumber}: ${correctCountry}`);
}

// Get the data for country
function getData(countryName: string) {
  const countrySearch = countryName.toLowerCase().trim();
  const populationRaw = populationData
    .find((x) => x.country.toLowerCase().trim() === countrySearch)?.population;
  const population = populationRaw ?? 0;
  const landlocked = landlockedData.find((x) => x.country.toLowerCase().trim() === countrySearch)?.landlocked === '1' || false;
  const religion = religionData.find((x) => x.country.toLowerCase().trim() === countrySearch)?.religion || 'N/A';

  const temperatureCelsius = Number(
    temperatureCelsiusData.find(
      (x) => x.country.toLowerCase().trim() === countrySearch,
    )?.temperature ?? 0,
  ); // Default of 0, because no country has 0.00 C, we can use 0 as a `null`

  const continent = continentData.find((x) => x.country.toLowerCase().trim() === countrySearch)?.continent ?? '';
  const surfaceArea = surfaceAreaData.find((x) => x.country.toLowerCase().trim() === countrySearch)?.area ?? 0;

  return {
    population,
    landlocked,
    religion,
    temperatureCelsius,
    continent,
    surfaceArea,
    country: countryName,
  };
}

const {
  population, landlocked, religion, temperatureCelsius, continent, surfaceArea,
} = getData(correctCountry);

const synonyms = {
  Australia: ['Kangarooland'],
  'Czech Republic': ['Czechia'],
  'Dominican Republic': ['DR'],
  'Russian Federation': ['Russia'],
  'United Kingdom': ['Great Britain', 'UK', 'Scotland', 'Wales', 'England', 'Northern Ireland'],
  Japan: ['Nippon'],
  Netherlands: ['Holland'],
  'Papua New Guinea': ['PNG'],
  'Mauritius': ['Maritius'],
  'Mauritania': ['Maritania'],
  'Saint Lucia': ['St Lucia'],
  'Saint Vincent and the Grenadines': ['St Vincent and the Grenadines'],
  'Saint Kitts and Nevis': ['St Kitts and Nevis'],
  Myanmar: ['Burma'],
  Zimbabwe: ['Rhodesia'],
  'United Arab Emirates': ['UAE'],
  'Ivory Coast': ['Cote dlvoire'],
  Germany: ['Deutschland'],
  'United States': ['America', 'USA'],
  China: ['PRC', 'Peoples Republic of China'],
  'The Democratic Republic of Congo': ['DRC'],
  'Türkiye': ['Turkiye', 'Turkey'],
  Taiwan: ['Republic of China', 'China', 'ROC'],
  'Timor-Leste': ['East Timor', 'TimorLeste', 'Timor Leste'],
  'Federated States of Micronesia': ['FSM'],
  Liechtenstein: ['Lichtenstein'],
  'Guinea-Bissau': ['GuineaBissau', 'Guinea Bissau'],
};

const [
  correctPopulation,
  correctLandlocked,
  correctReligion,
  correctTemperatureCelsius,
  correctContinent,
  correctSurfaceArea,
] = [population, landlocked, religion, temperatureCelsius, continent, surfaceArea];

export {
  correctContinent, correctCountry, correctLandlocked, correctPopulation, correctReligion, correctSurfaceArea, correctTemperatureCelsius, dayNumber, getData,
  synonyms
};
