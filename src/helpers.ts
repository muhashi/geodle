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

// Rounds population to 3 significant figures and adds locale specific thousand seperators
// (e.g. 131225219 => 131,000,000 or 131.000.000)
function formatPopulation(population: number) {
  // TODO: Format population in a more readable way (e.g. 906 thousand, 220 million)
  const SIG_FIGS = 3;
  return parseFloat((population).toPrecision(SIG_FIGS)).toLocaleString();
}

export {
  isApproxEqual, getEmojiHintText, tempFahrenheit, formatPopulation,
};
