import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { SxProps, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { useEffect, useState, Fragment } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import Zoom from '@mui/material/Zoom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

// Internal imports
import './App.css';
import CountryForm from './CountryForm.tsx';
import Results from './CountryResults.tsx';
import InfoText from './InfoText.tsx';
import Share from './Share.tsx';
import { StyledLink, StyledTypography, theme } from './StyledComponents.tsx';
import {
  correctCountry,
  dayNumber,
  getData,
  correctContinent,
  correctPopulation,
  correctLandlocked,
  correctReligion,
  correctTemperatureCelsius,
  correctGovernment,
} from './country.ts';
import Title from './Title.tsx';

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

const correctData: CountryData = {
  continent: correctContinent,
  population: correctPopulation,
  landlocked: correctLandlocked,
  religion: correctReligion,
  temperatureCelsius: correctTemperatureCelsius,
  government: correctGovernment,
  country: correctCountry,
};

function VerticalText({ topText, bottomText }: { topText: string, bottomText: string }) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', width: 'fit-content',
    }}>
      <StyledTypography variant="body1" sx={{ fontWeight: 500, fontSize: '1.25rem' }}>
        {topText}
      </StyledTypography>
      <StyledTypography variant="overline" sx={{ lineHeight: 1.5 }}>
       {bottomText}
      </StyledTypography>
    </Box>
  );
}

function GameStatisticsDialog({ guessesData, isWon }: { guessesData: CountryData[], isWon: boolean }) {
  const [open, setOpen] = useState(false);
  
  const statistics = Cookies.get('statistics') ? JSON.parse(Cookies.get('statistics') || "{}") : {
    won: 0,
    total: 0,
    streak: 0,
    longestStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0, 0],
    lastDayNumber: 0,
  };
  

  useEffect(() => {
    setTimeout(() => setOpen(true), 2000);

    if (statistics['lastDayNumber'] !== dayNumber) {
      statistics['lastDayNumber'] = dayNumber;
      statistics['streak'] = isWon ? statistics['streak'] + 1 : 0;
      statistics['longestStreak'] = Math.max(statistics['streak'], statistics['longestStreak']);
      statistics['won'] += isWon ? 1 : 0;
      statistics['total'] += 1;
      statistics['distribution'][guessesData.length - 1] += 1;
      Cookies.set('statistics', JSON.stringify(statistics), { expires: 500 });
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Zoom}
        fullWidth={true}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', gap: '1rem 0', margin: '1rem 0',
        }}>
          <StyledTypography variant="h6" sx={{ fontWeight: 'bold' }}>
            Statistics
          </StyledTypography>
          <Box sx={{
            display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center', gap: '0 7%', width: '80%',
          }}>
            <VerticalText bottomText='Played' topText={statistics['total']} />
            <VerticalText bottomText='Win Rate' topText={Math.round(100 * statistics['won'] / statistics['total']) + '%'} />
            <VerticalText bottomText='Streak' topText={statistics['streak']} />
            <VerticalText bottomText='Longest Streak' topText={statistics['longestStreak']} />
          </Box>
        </Box>
        <DialogActions sx={{
          display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', alignItems: 'center', gap: '0 1rem', marginBottom: '1rem',
        }}>
          <Share guessesData={guessesData} />
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

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
      <GameStatisticsDialog guessesData={guessesData} isWon={true} />
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
      <GameStatisticsDialog guessesData={guessesData} isWon={false} />
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
        <Results guessesData={guessesData} correctData={correctData} />
        { guessesData.length === 0 && <InfoText /> }
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
        <Title />
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
