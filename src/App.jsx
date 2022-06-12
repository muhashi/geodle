import './App.css';
import { useState, React } from 'react';
import PropTypes from 'prop-types';
import {
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
} from './country';
import AutoCompleteForm from './AutoCompleteForm';
import wordlist from './wordlist';

// Images
import svgSquareRed from './img/square-red.svg';
import svgSquareGreen from './img/square-green.svg';
import svgUpwardsArrow from './img/square-caret-up.svg';
import svgDownwardsArrow from './img/square-caret-down.svg';

// TODO: Add better hints visualisation like - these continents not ruled out
// TODO: Make sure all countries in wordlist have all data required for the game

function App() {
  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}

function Header() {
  return (
    <header className="App-header">
      <h2>Geodle</h2>
      <h3>
        A Wordle-ish geography game by&nbsp;
        <a href="https://muhashi.github.io">Muhashi</a>
      </h3>
    </header>
  );
}

function Main() {
  const [guessesData, setGuessesData] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const TOTAL_GUESSES = 7;
  const guessesLeft = TOTAL_GUESSES - guessesData.length;
  const isLost = !isWon && guessesLeft <= 0;

  // Add submitted guess to list of guesses, check for win
  const handleSubmit = (guess) => {
    const cleanGuess = (guess || '').toLowerCase().trim();
    const previouslyGuessed = guessesData
      .some((data) => data.country.toLowerCase() === cleanGuess);

    if (guess && !previouslyGuessed) {
      const data = getData(guess);
      data.country = guess;
      setGuessesData(guessesData.concat(data));
      if (cleanGuess === correctCountry.toLowerCase().trim()) {
        setIsWon(true);
      }
    }
  };

  return (
    <main>
      <p>
        Guess which country I&apos;m thinking of! You have&nbsp;
        { guessesLeft }
        &nbsp;guess
        { guessesLeft === 1 ? '' : 'es' }
        &nbsp;left.
      </p>
      <Results guessesData={guessesData} />
      { !isWon
        && !isLost
        && (
          <AutoCompleteForm
            suggestions={wordlist.sort()}
            handleSubmit={handleSubmit}
            synonyms={synonyms}
            descriptions={descriptions}
          />
        )}
      { isWon && <WonMessage guessesData={guessesData} /> }
      { isLost && <LostMessage guessesData={guessesData} /> }
    </main>
  );
}

function Results({ guessesData }) {
  return guessesData.length > 0 ? (
    <table>
      <thead>
        <tr>
          <td />
          <th scope="col"><span className="table-header-innertext">Continent</span></th>
          <th scope="col">
            <ToolTip content="Population" tip="Population within 10% of correct country" />
          </th>
          <th scope="col">
            <ToolTip content="Landlocked?" tip="A landlocked country does not have territory connected to an ocean." />
          </th>
          <th scope="col">
            <ToolTip content="Religion" tip="Most common religion matches the correct country" />
          </th>
          <th scope="col">
            <ToolTip content="Avg. Temp." tip="Yearly average temperature within 10% of correct country" />
          </th>
          <th scope="col">
            <ToolTip content="Gov." tip="System of government used in the country" />
          </th>
        </tr>
      </thead>
      <tbody>
        { guessesData.map((data) => <ResultRow guessData={data} key={data.country} />) }
      </tbody>
    </table>
  ) : (null);
}

const guessDataPropType = PropTypes.exact({
  country: PropTypes.string,
  population: PropTypes.number,
  landlocked: PropTypes.bool,
  religion: PropTypes.string,
  temperatureCelsius: PropTypes.number,
  continent: PropTypes.string,
  government: PropTypes.string,
});

const guessesDataPropType = PropTypes.arrayOf(guessDataPropType);

Results.propTypes = {
  guessesData: guessesDataPropType.isRequired,
};

function tempFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Rounds population to 3 significant figures and adds locale specific thousand seperators
// (e.g. 131225219 => 131,000,000 or 131.000.000)
function formatPopulation(population) {
  // TODO: Format population in a more readable way (e.g. 906 thousand, 220 million)
  const SIG_FIGS = 3;
  return parseFloat((population).toPrecision(SIG_FIGS)).toLocaleString();
}

function ResultRow({ guessData }) {
  const {
    country,
    population,
    landlocked,
    religion,
    temperatureCelsius,
    continent,
    government,
  } = guessData;
  const temperatureTip = temperatureCelsius === 0 ? 'N/A' : `${Math.round(temperatureCelsius)}°C / ${Math.round(tempFahrenheit(temperatureCelsius))}°F`;
  const landlockedTip = landlocked ? 'Landlocked' : 'Not landlocked';
  const populationTip = formatPopulation(population);

  return (
    <tr>
      <th scope="row"><span className="table-header-innertext">{ country }</span></th>
      <td>
        <ResultHint correct={correctContinent} guess={continent} tip={continent} />
      </td>
      <td>
        <ResultHint correct={correctPopulation} guess={population} tip={populationTip} />
      </td>
      <td>
        <ResultHint correct={correctLandlocked} guess={landlocked} tip={landlockedTip} />
      </td>
      <td>
        <ResultHint correct={correctReligion} guess={religion} tip={religion} />
      </td>
      <td>
        <ResultHint
          correct={correctTemperatureCelsius}
          guess={temperatureCelsius}
          tip={temperatureTip}
        />
      </td>
      <td>
        <ResultHint correct={correctGovernment} guess={government} tip={government} />
      </td>
    </tr>
  );
}

ResultRow.propTypes = {
  guessData: guessDataPropType.isRequired,
};

// If numeric value of `a` is within `(100 * MAX_DIFF_PERCENT)`% of `b`,
// then they're considered approx. equal values
function isApproxEqual(a, b) {
  const MAX_DIFF_PERCENT = 0.1;
  const avg = (a + b) / 2;
  const percentDiff = (Math.abs(a - b) / avg);
  return percentDiff <= MAX_DIFF_PERCENT;
}

function getEmojiHintText(correct, guess) {
  const isCorrect = correct === guess || (typeof guess === 'number' && typeof correct === 'number' && isApproxEqual(guess, correct));
  const higher = !isCorrect && typeof guess === 'number' && correct > guess;
  const lower = !isCorrect && typeof guess === 'number' && correct < guess;

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

function getEmojiHintImage(correct, guess) {
  const textEmoji = getEmojiHintText(correct, guess);

  if (textEmoji === '🟩') {
    return (<img src={svgSquareGreen} className="emoji-icon" alt="Green Square" />);
  }
  if (textEmoji === '🔼') {
    return (<img src={svgUpwardsArrow} className="emoji-icon" alt="Upwards Arrow" />);
  }
  if (textEmoji === '🔽') {
    return (<img src={svgDownwardsArrow} className="emoji-icon" alt="Downwards Arrow" />);
  }
  return (<img src={svgSquareRed} className="emoji-icon" alt="Red Square" />);
}

function ResultHint({ correct, guess, tip }) {
  return (
    <ToolTip
      content={getEmojiHintImage(correct, guess)}
      tip={tip}
    />
  );
}

ResultHint.propTypes = {
  correct: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]).isRequired,
  guess: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]).isRequired,
  tip: PropTypes.string.isRequired,
};

function ToolTip({ content, tip }) {
  return (
    <div className="tooltip">
      { content }
      <span className="tooltiptext">{ tip }</span>
    </div>
  );
}

ToolTip.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  tip: PropTypes.string.isRequired,
};

function WonMessage({ guessesData }) {
  return (
    <>
      <p>
        You win! The secret country was&nbsp;
        <strong>{ correctCountry }</strong>
        !
      </p>
      <Share guessesData={guessesData} />
    </>
  );
}

WonMessage.propTypes = {
  guessesData: guessesDataPropType.isRequired,
};

function LostMessage({ guessesData }) {
  return (
    <>
      <p>
        You ran out of guesses! The secret country was&nbsp;
        <strong>{ correctCountry }</strong>
        !
      </p>
      <Share guessesData={guessesData} />
    </>
  );
}

LostMessage.propTypes = {
  guessesData: guessesDataPropType.isRequired,
};

function Share({ guessesData }) {
  const emojis = guessesData
    .map(({
      population, landlocked, religion, temperatureCelsius, continent, government,
    }) => [[correctContinent, continent],
      [correctPopulation, population],
      [correctLandlocked, landlocked],
      [correctReligion, religion],
      [correctTemperatureCelsius, temperatureCelsius],
      [correctGovernment, government]])
    .map((data) => data.map(([correct, guess]) => getEmojiHintText(correct, guess)).join(''))
    .join('\n');

  const title = `Geodle ${dayNumber} ${guessesData.length}/7`;

  const onClick = () => {
    const copyText = `${title}\n${emojis}`;
    navigator.clipboard.writeText(copyText);
    alert('Copied results to clipboard'); // TODO: Create custom alert
  };

  return (
    <button className="Share-button" onClick={onClick} type="button">
      Share 📋
    </button>
  );
}

Share.propTypes = {
  guessesData: guessesDataPropType.isRequired,
};

export default App;
