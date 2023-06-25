import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { SxProps, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

// Internal imports
import './App.css';
import CountryForm from './CountryForm.tsx';
import Results from './CountryResults.tsx';
import Share from './Share.tsx';
import { StyledLink, StyledTypography, theme } from './StyledComponents.tsx';
import { correctCountry, dayNumber, getData } from './country.ts';

// TODO: Add better hints visualisation like - these continents not ruled out
// TODO: Make sure all countries in wordlist have all data required for the game

type CountryData = {
  continent: string,
  population: number,
  landlocked: boolean,
  religion: string,
  temperatureCelsius: number,
  government: string,
  country: string,
};

function WonMessage({ guessesData }: { guessesData: CountryData[] }) {
  return (
    <>
      <StyledTypography variant="body1">
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

function LostMessage({ guessesData }: { guessesData: CountryData[] }) {
  return (
    <>
      <StyledTypography variant="body1">
        You ran out of guesses! The secret country was&nbsp;
        <strong>{ correctCountry }</strong>
        !
      </StyledTypography>
      <Share guessesData={guessesData} />
    </>
  );
}

function Main() {
  const [guessesData, setGuessesData] = useState<CountryData[]>([]);
  const [isWon, setIsWon] = useState(false);
  const TOTAL_GUESSES = 7;
  const guessesLeft = TOTAL_GUESSES - guessesData.length;
  const isLost = !isWon && guessesLeft <= 0;

  const lastAttemptNumber = Cookies.get('lastAttempt');
  const lastAttemptData = Cookies.get('lastAttemptData');

  useEffect(() => {
    if (lastAttemptNumber && parseInt(lastAttemptNumber, 10) === dayNumber && lastAttemptData) {
      const data: CountryData[] = JSON.parse(lastAttemptData);
      setGuessesData(data);
      setIsWon(
        data.some((d: CountryData) => (
          d.country.toLowerCase().trim() === correctCountry.toLowerCase().trim())),
      );
    }
  }, []);

  useEffect(() => {
    if (isWon || isLost) {
      Cookies.set('lastAttempt', dayNumber.toString(), { expires: 1 });
      Cookies.set('lastAttemptData', JSON.stringify(guessesData), { expires: 1 });
    }
  }, [isWon, isLost]);

  // Add submitted guess to list of guesses, check for win
  const onSubmit = (guess: string) => {
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
          {(isWon || isLost) ? (
            <>Come back tomorrow for a new country!</>
          ) : (
            <>
              Guess which country I&apos;m thinking of! You have&nbsp;
              <span style={{ fontWeight: 900 }}>
                { guessesLeft }
              </span>
              &nbsp;guess
              { guessesLeft === 1 ? '' : 'es' }
              &nbsp;left.
            </>
          )}
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

function Contact({ sx = {} }: { sx?: SxProps }) {
  return (
    <Link href={`mailto:${atob('aGVsbG9AZ2VvZGxlLm1l')}`} sx={sx}>
      <MailIcon />
    </Link>
  );
}

function Header() {
  return (
    <header className="App-header" style={{ width: '100%' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', alignItems: 'center', margin: '0 5vw',
      }}
      >
        {/* Hidden contact for symettrical layout */}
        <Contact sx={{ visibility: 'hidden' }} />
        <StyledTypography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 900,
            userSelect: 'none',
            color: '#408080',
            flexGrow: 1,
            background: 'linear-gradient(to right, #02AAB0, #00CDAC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Geodle
        </StyledTypography>
        <Contact />
      </Box>
      <StyledTypography variant="h6" align="center" sx={{ fontWeight: 500 }}>
        A daily Wordle-ish geography game by&nbsp;
        <StyledLink href="https://muhashi.github.io">Muhashi</StyledLink>
      </StyledTypography>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', margin: '5vh 0',
        }}
        >
          <Header />
          <Main />
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
