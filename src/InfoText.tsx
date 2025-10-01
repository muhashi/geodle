import InfoIcon from '@mui/icons-material/Info';
import { Typography } from '@mui/material';
import { ResultCard } from './CountryResults.tsx';
import svgSquareCaretUp from './img/square-caret-up.svg';
import svgSquareGreen from './img/square-green.svg';
import svgSquareRed from './img/square-red.svg';

const squareRedImg = <img src={svgSquareRed} className="emoji-icon" style={{ width: '1rem', height: '1rem', padding: '0 0.5rem' }} alt="Red Square" />;
const squareGreenImg = <img src={svgSquareGreen} className="emoji-icon" style={{ width: '1rem', height: '1rem', padding: '0 0.5rem' }} alt="Green Square" />;
const upwardsArrowImg = <img src={svgSquareCaretUp} className="emoji-icon" style={{ width: '1rem', height: '1rem', padding: '0 0.5rem' }} alt="Upwards Arrow" />;

function InfoText() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '2rem', width: '75%',
    }}
    >
      <div style={{
        display: 'flex', alignContent: 'center', justifyContent: 'center', gap: '0.5rem',
      }}
      >
        <InfoIcon sx={{ margin: 'auto 0' }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          How to Play
        </Typography>
      </div>
      <Typography>
        Figure out the secret country in 7 guesses!
      </Typography>
      <Typography>
        Each guess must be a country that appears in the search box.
      </Typography>
      <Typography>
        After each guess,
        you will get a hint about how different your guess is from the correct country.
      </Typography>
      <Typography>
        You are given hints about the following categories:
        Continent, Population, Landlocked, Religion, Temperature, and Government.
      </Typography>
      <Typography>
        For example:
      </Typography>
      <ResultCard
        guessData={{
          country: 'Australia',
          continent: 'Oceania',
          population: 25000000,
          landlocked: false,
          religion: 'Christianity',
          temperatureCelsius: 22,
          government: 'Federation Constitutional Monarchy',
        }}
        correctData={{
          country: 'Ivory Coast',
          continent: 'Africa',
          population: 25100000,
          landlocked: false,
          religion: 'N/A',
          temperatureCelsius: 26,
          government: 'Republic',
        }}
      />
      <Typography>
        You guess Australia, but it&apos;s in the wrong continent from the correct country,
        so it shows
        {squareRedImg}
      </Typography>
      <Typography>
        The population is within 10% of the correct country&apos;s population, so it shows
        {squareGreenImg}
      </Typography>
      <Typography>
        Landlocked refers to whether the country is surrounded by land.
        Australia is not landlocked, as it is surrounded by ocean, so it is coastal.
        Both countries have the same landlocked status - they are both coastal, so it shows
        {squareGreenImg}
      </Typography>
      <Typography>
        The average temperature of the correct country is at least 10% higher than Australia&apos;s,
        so it shows
        {upwardsArrowImg}
      </Typography>
      <Typography>
        Hover over the boxes to get information on your guess&apos;s data.
      </Typography>
      <Typography>
        Hover over the category titles to get more information on what it means.
      </Typography>
      <Typography>
        If you had fun, please share this game with your friends!
      </Typography>
    </div>
  );
}

export default InfoText;
