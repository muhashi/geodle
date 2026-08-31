// If numeric value of `a` is within `(100 * MAX_DIFF_PERCENT)`% of `b`,
// then they're considered approx. equal values
function isApproxEqual(a: number, b: number) {
  const MAX_DIFF_PERCENT = 0.1;
  const avg = (a + b) / 2;
  const percentDiff = (Math.abs(a - b) / avg);
  return percentDiff <= MAX_DIFF_PERCENT;
}

type DemographicDataType = number | string | boolean;

function getEmojiHintText(correct: DemographicDataType, guess: DemographicDataType) {
  const isCorrect = correct === guess
    || (typeof guess === 'string' && typeof correct === 'string' && guess.toLowerCase() === correct.toLowerCase())
    || (typeof guess === 'number' && typeof correct === 'number' && isApproxEqual(guess, correct));
  const higher = !isCorrect && typeof guess === 'number' && (correct as number) > (guess as number);
  const lower = !isCorrect && typeof guess === 'number' && (correct as number) < (guess as number);

  if (isCorrect) {
    return '🟩';
  }
  if (higher) {
    return '🔼';
  }
  if (lower) {
    return '🔽';
  }
  return '🟥';
}

function tempFahrenheit(celsius: number) {
  return (celsius * 9) / 5 + 32;
}

// Rounds population to 3 sig figs
function formatPopulation(num: number): string {
  if (num < 1e3) {
    return num.toString();
  }
  
  const exponent = Math.floor(Math.log10(num) / 3) * 3;
  const scaledNum = num / Math.pow(10, exponent);
  
  const suffix = ["", "k", "M", "B"][exponent / 3];
  
  return parseFloat(scaledNum.toPrecision(3)) + suffix;
}

function km2ToMi2(km2: number): number {
  return km2 / 2.59;
}

const COUNTRY_ABBREVIATIONS: Record<string, string> = {
  'The Democratic Republic of Congo': 'DR Congo',
  'Saint Vincent and the Grenadines': 'St Vincent & Grenadines',
  'Federated States of Micronesia': 'Micronesia',
  'Central African Republic': 'Central African Rep.',
  'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'Sao Tome and Principe': 'Sao Tome & Principe',
  'Saint Kitts and Nevis': 'St Kitts & Nevis',
  'United Arab Emirates': 'UAE',
  'Antigua and Barbuda': 'Antigua & Barbuda',
  'Trinidad and Tobago': 'Trinidad & Tobago',
};

function shortenCountryName(name: string): string {
  return COUNTRY_ABBREVIATIONS[name] ?? name;
}

export {
  isApproxEqual, getEmojiHintText, tempFahrenheit, formatPopulation, km2ToMi2, shortenCountryName,
};
