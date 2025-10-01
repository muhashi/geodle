import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';

import { formatPopulation, getEmojiHintText, tempFahrenheit } from './helpers.ts';

import svgSquareCaretDown from './img/square-caret-down.svg';
import svgSquareCaretUp from './img/square-caret-up.svg';
import svgSquareGreen from './img/square-green.svg';
import svgSquareRed from './img/square-red.svg';

const squareRedImg = <img src={svgSquareRed} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Red Square" />;
const squareGreenImg = <img src={svgSquareGreen} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Green Square" />;
const upwardsArrowImg = <img src={svgSquareCaretUp} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Upwards Arrow" />;
const downwardsArrowImg = <img src={svgSquareCaretDown} className="emoji-icon" style={{ width: '2rem', height: '2rem' }} alt="Downwards Arrow" />;

const getHeaders = () => ['Continent', 'Population', 'Landlocked', 'Religion', 'Avg. Temp.', 'Gov.'];

type DemographicDataType = number | string | boolean;

function getEmojiHintImage(correct: DemographicDataType, guess: DemographicDataType) {
  if (typeof correct === 'number') {
    correct = Math.round(correct);
  }

  if (typeof guess === 'number') {
    guess = Math.round(guess);
  }

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

type CountryData = {
  continent: string,
  population: number,
  landlocked: boolean,
  religion: string,
  temperatureCelsius: number,
  government: string,
  country: string,
};

const getTooltipText = ({
  population, landlocked, religion, temperatureCelsius, continent, government,
}: CountryData) => {
  const temperatureTip = temperatureCelsius === 0 ? 'N/A' : `${Math.round(temperatureCelsius)}°C / ${Math.round(tempFahrenheit(temperatureCelsius))}°F`;
  const landlockedTip = landlocked ? 'Landlocked' : 'Coastal';
  const populationTip = formatPopulation(population);
  const tips = [continent, populationTip, landlockedTip, religion, temperatureTip, government];
  return tips;
};

function ResultCard(
  { guessData, correctData }: { guessData: CountryData, correctData: CountryData },
) {
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

  const correctDataList = [
    correctData.continent,
    correctData.population,
    correctData.landlocked,
    correctData.religion,
    correctData.temperatureCelsius,
    correctData.government,
  ];

  const tips = getTooltipText(guessData);
  const headers = getHeaders();
  const tooltipText = <div style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>{headers.map((header, i) => `${header}: ${tips[i]}`).join('\n')}</div>;
  
  const headerTips = [
    'Continent matches the correct country',
    'Population within 10% of correct country',
    'A landlocked country does not have territory connected to an ocean',
    'Most common religion matches the correct country',
    'Temperature within 10% of correct country',
    'Government type matches the correct country',
  ];

  return (
    <Card sx={{ mb: 1, width: '98vw', maxWidth: 'min(800px, 100%)', minWidth: '300px', backgroundColor: 'transparent', }}>
      <CardContent>
        <Tooltip title={tooltipText}>
          <Typography 
            variant="h6"
            align='center'
            sx={{ 
              mb: 2,
              pb: 1,
              width: '100%',
              fontWeight: 'bold',
              borderBottom: '2px solid #4d4d4d',
              textDecoration: 'underline dotted',
              textDecorationThickness: '2px',
            }}
          >
            {country}
          </Typography>
        </Tooltip>
        
        <Grid container justifyContent="space-evenly" spacing={2}>
          {headers.map((header, i) => (
            <Grid key={header} size={{xs: 4, sm: 2}}>
              <Box sx={{ textAlign: 'center' }}>
                <Tooltip title={headerTips[i]} sx={{ cursor: 'pointer' }}>
                  <Typography
                    variant="body2" 
                    noWrap
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      textDecoration: 'underline dotted',
                      textDecorationThickness: '2px',
                      cursor: 'pointer',
                      overflow: 'visible',
                    }}
                  >
                    {header}
                  </Typography>
                </Tooltip>
                <Tooltip title={tips[i]}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                    {getEmojiHintImage(correctDataList[i], data[i])}
                  </Box>
                </Tooltip>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function Results(
  { guessesData, correctData }: { guessesData: CountryData[], correctData: CountryData },
) {
  return (
    guessesData.length > 0 ? (
      <Box sx={{ marginBottom: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        {guessesData.map((data) => (
          <ResultCard guessData={data} correctData={correctData} key={data.country} />
        ))}
      </Box>
    ) : null
  );
}

export default Results;
export { ResultCard };
