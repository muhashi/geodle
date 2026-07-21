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
function formatPopulation(num: number): string {
  if (num < 1e3) {
    return num.toString();
  }
  
  // Calculate the appropriate scale (6 for Millions, 9 for Billions)
  const exponent = Math.floor(Math.log10(num) / 3) * 3;
  const scaledNum = num / Math.pow(10, exponent);
  
  // toPrecision(3) gets the 3 most significant digits
  const suffix = ["", "k", "M", "B"][exponent / 3];
  
  // parseFloat strips out any unnecessary trailing zeros (e.g., 8.00M becomes 8M)
  return parseFloat(scaledNum.toPrecision(3)) + suffix;
}

export {
  isApproxEqual, getEmojiHintText, tempFahrenheit, formatPopulation,
};
