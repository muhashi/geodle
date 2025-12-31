import continentData from './data/country-by-continent.json';
import governmentData from './data/country-by-government-type.json';
import landlockedData from './data/country-by-landlocked.json';
import populationData from './data/country-by-population.json'; // TODO: Round to 1 sig fig
import religionData from './data/country-by-religion.json';
import temperatureCelsiusData from './data/country-by-yearly-average-temperature.json';
import wordlist from './wordlist';

// Get the country of the day
const epoch = new Date(2022, 4, 9); // Created on 9th May 2022!
const today = new Date();
today.setHours(0, 0, 0); // Make sure both dates are on same time of 00:00:00
const msPerDay = 1000 * 60 * 60 * 24;
const dayNumber = Math.round((today.getTime() - epoch.getTime()) / msPerDay);
const COUNTRY_OFFSET = 42; // Offset to make sure daily country stays consistent when new countries are added
const dayIndex = (dayNumber + COUNTRY_OFFSET) % wordlist.length;
const correctCountry = wordlist[dayIndex];
// console.log(`Country #${dayNumber}: ${correctCountry}`);

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
  ); // Default of 0, because no country has an average of 0.00 C, we can use 0 as a `null`

  const continent = continentData.find((x) => x.country.toLowerCase().trim() === countrySearch)?.continent ?? '';
  const government = governmentData.find((x) => x.country.toLowerCase().trim() === countrySearch)?.government ?? 'N/A';
  return {
    population,
    landlocked,
    religion,
    temperatureCelsius,
    continent,
    government,
    country: countryName,
  };
}

// Returns a string of description for the country
// Used to provide some information when searching for the country
// (i.e. "Kenya" => "Africa, 55,000,000, Republic")
function generateDescription(countryName: string) {
  const { population, continent, government } = getData(countryName);
  return `${continent}, ${population.toLocaleString()}, ${government}`;
}

// Store all description strings for countries in an object
const descriptions = wordlist.reduce((obj, countryName) => (
  { ...obj, [countryName]: generateDescription(countryName) }), {});

const {
  population, landlocked, religion, temperatureCelsius, continent, government,
} = getData(correctCountry);

const synonyms = {
  Australia: ['Kangarooland'],
  'Czech Republic': ['Czechia'],
  'Russian Federation': ['Russia'],
  'United Kingdom': ['Great Britain', 'UK', 'Scotland', 'Wales', 'England', 'Northern Ireland'],
  Japan: ['Nippon'],
  Netherlands: ['Holland'],
  'Papua New Guinea': ['PNG'],
  'Mauritius': ['Maritius'],
  'Mauritania': ['Maritania'],
  'Saint Lucia': ['St Lucia'],
  'Saint Vincent and the Grenadines': ['St Vincent and the Grenadines'],
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
  'Federated States of Micronesia': ['FSM'],
  Liechtenstein: ['Lichtenstein'],
};

const [
  correctPopulation,
  correctLandlocked,
  correctReligion,
  correctTemperatureCelsius,
  correctContinent,
  correctGovernment,
] = [population, landlocked, religion, temperatureCelsius, continent, government];

export {
  correctCountry,
  dayNumber,
  getData,
  synonyms,
  descriptions,
  correctPopulation,
  correctLandlocked,
  correctReligion,
  correctTemperatureCelsius,
  correctContinent,
  correctGovernment,
};
