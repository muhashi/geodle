import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

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

function ResultRow(
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

  return (
    <TableRow>
      <TableCell 
        component="th" 
        scope="row" 
        sx={{ 
          minWidth: '100px',
          position: 'sticky',
          left: 0,
          backgroundColor: '#f7f7f7',
          zIndex: 1,
          borderRight: '1px solid rgba(224, 224, 224, 1)',
          boxShadow: '3px 0px 0px -1px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Tooltip title={tooltipText}>
          <Typography 
            sx={{ 
              width: '100%', 
              textDecoration: 'underline dotted', 
              textDecorationThickness: '2px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {country}
          </Typography>
        </Tooltip>
      </TableCell>
      {tips.map((tip, i) => (
        <TableCell key={`${country}-${headers[i]}`} align="center" sx={{ cursor: 'pointer', minWidth: '60px' }}>
          <Tooltip title={tip}>{getEmojiHintImage(correctDataList[i], data[i])}</Tooltip>
        </TableCell>
      ))}
    </TableRow>
  );
}

function Results(
  { guessesData, correctData }: { guessesData: CountryData[], correctData: CountryData },
) {
  const matches = useMediaQuery('(min-width:750px)');
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
    guessesData.length > 0 ? (

      <Box sx={{ 
        width: '100%',
        marginBottom: '10vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: '100vw',
        }}>
          <TableContainer sx={{ 
            width: '100%',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          }}>
            <Table sx={{ minWidth: '500px', width: '100%' }}>
              <TableHead sx={{ borderBottom: '2px solid #4d4d4d' }}>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#f7f7f7',
                      zIndex: 2,
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                      minWidth: '100px',
                       // -1px spread for some reason fixes a weird thicker row border showing up in safari
                      boxShadow: '3px 0px 0px -1px rgba(0, 0, 0, 0.4)',
                    }}
                  />
                  {headers.map((header, i) => (
                    <Tooltip title={tips[i]} key={header}>
                      <TableCell align="center" sx={{ cursor: 'pointer', minWidth: '60px' }}>
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: 'underline dotted',
                            textDecorationThickness: '2px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {header}
                        </Typography>
                      </TableCell>
                    </Tooltip>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {guessesData.toReversed().map((data) => (
                  <ResultRow guessData={data} correctData={correctData} key={data.country} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {!matches && (<Typography variant="body2" color="textSecondary" sx={{ userSelect: 'none' }}>
          &larr; Scroll to see all hints &rarr;
        </Typography>)}
      </Box>
    ) : null
  );
}

export default Results;
