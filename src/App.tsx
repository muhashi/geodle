import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

// Internal imports
import './App.css';
import CountryForm from './CountryForm.tsx';
import Results from './CountryResults.tsx';
import Share from './Share.tsx';
import { StyledLink, StyledTypography, theme } from './StyledComponents.tsx';
import { correctCountry, getData } from './country.ts';

// TODO: Add better hints visualisation like - these continents not ruled out
// TODO: Add cookie to save game result after refresh
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

export default App;
