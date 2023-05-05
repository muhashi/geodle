import { React, useState } from 'react';

// MUI imports
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import { ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import ConfettiExplosion from 'react-confetti-explosion';

// Internal imports
import './App.css';
import {
  correctContinent,
  correctCountry,
  correctGovernment,
  correctLandlocked,
  correctPopulation,
  correctReligion,
  correctTemperatureCelsius,
  dayNumber,
  getData,
} from './country';
import CountryForm from './CountryForm';
import {
  StyledButton, StyledLink,
  StyledTableHeaderTypography,
  StyledTypography,
  theme,
} from './StyledComponents';

import svgDownwardsArrow from './img/square-caret-down.svg';
import svgUpwardsArrow from './img/square-caret-up.svg';
import svgSquareGreen from './img/square-green.svg';
import svgSquareRed from './img/square-red.svg';

const squareRedImg = <img src={svgSquareRed} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Red Square" />;
const squareGreenImg = <img src={svgSquareGreen} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Green Square" />;
const upwardsArrowImg = <img src={svgUpwardsArrow} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Upwards Arrow" />;
const downwardsArrowImg = <img src={svgDownwardsArrow} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Downwards Arrow" />;

// TODO: Add better hints visualisation like - these continents not ruled out
// TODO: Add cookie to save game result after refresh
// TODO: Make sure all countries in wordlist have all data required for the game

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', margin: '5vh 0',
        }}
        >
          <Header />
          <br />
          <Main />
        </Box>
      </div>
    </ThemeProvider>
  );
}

function Header() {
  return (
    <header className="App-header">
      <StyledTypography
        variant="h2"
        align="center"
        sx={{
          fontWeight: 900, userSelect: 'none', color: '#408080',
        }}
      >
        Geodle
      </StyledTypography>
      <StyledTypography variant="h6" align="center" sx={{ fontWeight: 500 }}>
        A daily Wordle-ish geography game by&nbsp;
        <StyledLink href="https://muhashi.github.io">Muhashi</StyledLink>
      </StyledTypography>
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
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', gap: '3rem 0',
      }}
      >
        <StyledTypography variant="h5" sx={{ fontWeight: 600 }}>
          Guess which country I&apos;m thinking of! You have&nbsp;
          <span style={{ fontWeight: 900 }}>
            { guessesLeft }
          </span>
          &nbsp;guess
          { guessesLeft === 1 ? '' : 'es' }
          &nbsp;left.
        </StyledTypography>
        { !isWon
          && !isLost
          && (
            <CountryForm onSubmit={onSubmit} />
          )}
        { isWon && <WonMessage guessesData={guessesData} /> }
        { isLost && <LostMessage guessesData={guessesData} /> }
        <Results guessesData={guessesData} />
      </Box>
    </main>
  );
}

const getHeaders = () => ['Continent', 'Population', 'Landlocked', 'Religion', 'Avg. Temp.', 'Gov.'];

function Results({ guessesData }) {
  const tips = [
    'Continent matches the correct country',
    'Population within 10% of correct country',
    'A landlocked country does not have territory connected to an ocean',
    'Most common religion matches the correct country',
    'Temperature within 10% of correct country',
    'Government type matches the correct country',
  ];

  const headers = getHeaders();

  return (
    guessesData.length > 0 && (
      <Box sx={{ overflow: 'auto', margin: '0 10%' }}>
        <Box sx={{
          width: '100%', maxWidth: '97w', marginBottom: '10vh', display: 'table', tableLayout: 'fixed',
        }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ borderBottom: '2px solid #4d4d4d' }}>
                <TableRow>
                  <TableCell />
                  { headers.map((header, i) => (
                    <Tooltip title={tips[i]} key={header} align="center" sx={{ cursor: 'pointer' }}>
                      <TableCell align="center">
                        <StyledTableHeaderTypography
                          variant="body1"
                          sx={{
                            textDecoration: 'underline dotted', textDecorationThickness: '2px', margin: '0 auto', whiteSpace: 'nowrap',
                          }}
                        >
                          { header }
                        </StyledTableHeaderTypography>
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
        </Box>
      </Box>
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

  switch (textEmoji) {
    case '🟥':
      return squareRedImg;
    case '🟩':
      return squareGreenImg;
    case '🔼':
      return upwardsArrowImg;
    case '🔽':
      return downwardsArrowImg;
    default:
      return squareRedImg;
  }
}

const getTooltipText = ({
  population, landlocked, religion, temperatureCelsius, continent, government,
}) => {
  const temperatureTip = temperatureCelsius === 0 ? 'N/A' : `${Math.round(temperatureCelsius)}°C / ${Math.round(tempFahrenheit(temperatureCelsius))}°F`;
  const landlockedTip = landlocked ? 'Landlocked' : 'Coastal';
  const populationTip = formatPopulation(population);
  const tips = [continent, populationTip, landlockedTip, religion, temperatureTip, government];
  return tips;
};

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

  const data = [continent, population, landlocked, religion, temperatureCelsius, government];

  const dataCorrect = [
    correctContinent,
    correctPopulation,
    correctLandlocked,
    correctReligion,
    correctTemperatureCelsius,
    correctGovernment,
  ];
  const tips = getTooltipText(guessData);
  const headers = getHeaders();
  const tooltipText = <div style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>{headers.map((header, i) => `${header}: ${tips[i]}`).join('\n')}</div>;

  return (
    <TableRow>
      <TableCell component="th" scope="row" sx={{ minWidth: '2rem', overflow: 'auto' }}>
        <Tooltip title={tooltipText} align="center">
          <StyledTableHeaderTypography sx={{ width: '100%', textDecoration: 'underline dotted', textDecorationThickness: '2px' }}>
            { country }
          </StyledTableHeaderTypography>
        </Tooltip>
      </TableCell>
      {tips.map((tip, i) => (
        <TableCell key={tip} align="center" sx={{ cursor: 'pointer' }}>
          <Tooltip title={tip}>{ getEmojiHintImage(dataCorrect[i], data[i]) }</Tooltip>
        </TableCell>
      ))}
    </TableRow>
  );
}

function WonMessage({ guessesData }) {
  return (
    <>
      <StyledTypography variant="body">
        You win! The secret country was&nbsp;
        <strong>{ correctCountry }</strong>
        !
      </StyledTypography>
      <ConfettiExplosion
        style={{
          position: 'absolute', top: '50vh', left: '50vw',
        }}
        duration={3000}
        force={0.6}
      />
      <Share guessesData={guessesData} />
    </>
  );
}

function LostMessage({ guessesData }) {
  return (
    <>
      <StyledTypography variant="body">
        You ran out of guesses! The secret country was&nbsp;
        <strong>{ correctCountry }</strong>
        !
      </StyledTypography>
      <Share guessesData={guessesData} />
    </>
  );
}

function Share({ guessesData }) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const popoverOpen = Boolean(popoverAnchorEl);

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

  const onClick = (event) => {
    const copyText = `${title}\n${emojis}`;
    navigator.clipboard.writeText(copyText);
    setPopoverAnchorEl(event.currentTarget);
  };

  return (
    <>
      <StyledButton variant="contained" onClick={onClick} type="button">
        Share 📋
      </StyledButton>
      <Popover
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={() => setPopoverAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <StyledTypography
          variant="body1"
          sx={{
            padding: '0.5rem', border: '1px solid #4d4d4d', borderRadius: '4px', userSelect: 'none',
          }}
        >
          Copied results to clipboard
        </StyledTypography>
      </Popover>
    </>
  );
}

export default App;
