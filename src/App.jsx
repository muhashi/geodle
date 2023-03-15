// import './App.css';
import { useState, React } from 'react';

// MUI imports
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// Internal imports
import {
  correctCountry,
  dayNumber,
  getData,
  correctPopulation,
  correctLandlocked,
  correctReligion,
  correctTemperatureCelsius,
  correctContinent,
  correctGovernment,
} from './country';
import CountryForm from './CountryForm';

import svgSquareRed from './img/square-red.svg';
import svgSquareGreen from './img/square-green.svg';
import svgUpwardsArrow from './img/square-caret-up.svg';
import svgDownwardsArrow from './img/square-caret-down.svg';

// TODO: Add better hints visualisation like - these continents not ruled out
// TODO: Add cookie to save game result after refresh
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
      <Typography variant="h2">Geodle</Typography>
      <Typography variant="h4">
        A daily Wordle-ish geography game by&nbsp;
        <Link href="https://muhashi.github.io" underline="hover">Muhashi</Link>
      </Typography>
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
  const onSubmit = (guess) => {
    const cleanGuess = (guess || '').toLowerCase().trim();
    const previouslyGuessed = guessesData
      .some((data) => data.country.toLowerCase() === cleanGuess);

    if (cleanGuess && !previouslyGuessed) {
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
      <Typography variant="body">
        Guess which country I&apos;m thinking of! You have&nbsp;
        { guessesLeft }
        &nbsp;guess
        { guessesLeft === 1 ? '' : 'es' }
        &nbsp;left.
      </Typography>
      <Results guessesData={guessesData} />
      { !isWon
        && !isLost
        && (
          <CountryForm onSubmit={onSubmit} />
        )}
      { isWon && <WonMessage guessesData={guessesData} /> }
      { isLost && <LostMessage guessesData={guessesData} /> }
    </main>
  );
}

function Results({ guessesData }) {
  const tips = [
    'Continent matches the correct country',
    'Population within 10% of correct country',
    'A landlocked country does not have territory connected to an ocean',
    'Most common religion matches the correct country',
    'Temperature within 10% of correct country',
    'Government type matches the correct country',
  ];

  const headers = ['Continent', 'Population', 'Landlocked?', 'Religion', 'Avg. Temp.', 'Gov.'];

  return (
    guessesData.length > 0 && (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              { headers.map((header, i) => (
                <Tooltip title={tips[i]} key={header}>
                  <TableCell>
                    { header }
                  </TableCell>
                </Tooltip>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { guessesData.map((data) => <ResultRow guessData={data} key={data.country} />) }
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
}

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
  const landlockedTip = landlocked ? 'Landlocked' : 'Coastal';
  const populationTip = formatPopulation(population);
  const data = [continent, population, landlocked, religion, temperatureCelsius, government];
  const dataCorrect = [
    correctContinent,
    correctPopulation,
    correctLandlocked,
    correctReligion,
    correctTemperatureCelsius,
    correctGovernment,
  ];
  const tips = [continent, populationTip, landlockedTip, religion, temperatureTip, government];

  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">{ country }</TableCell>
      {tips.map((tip, i) => (
        <TableCell key={tip}>
          <Tooltip title={tip} arrow>{ getEmojiHintImage(dataCorrect[i], data[i]) }</Tooltip>
        </TableCell>
      ))}
    </TableRow>
  );
}

function WonMessage({ guessesData }) {
  return (
    <>
      <Typography variant="body">
        You win! The secret country was&nbsp;
        <strong>{ correctCountry }</strong>
        !
      </Typography>
      <Share guessesData={guessesData} />
    </>
  );
}

function LostMessage({ guessesData }) {
  return (
    <>
      <Typography variant="body">
        You ran out of guesses! The secret country was&nbsp;
        <strong>{ correctCountry }</strong>
        !
      </Typography>
      <Share guessesData={guessesData} />
    </>
  );
}

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

  const title = `geodle.me ${dayNumber} ${guessesData.length}/7`;

  const onClick = () => {
    const copyText = `${title}\n${emojis}`;
    navigator.clipboard.writeText(copyText);
    alert('Copied results to clipboard'); // TODO: Create custom alert
  };

  return (
    <Button variant="contained" onClick={onClick} type="button">
      Share 📋
    </Button>
  );
}

export default App;
