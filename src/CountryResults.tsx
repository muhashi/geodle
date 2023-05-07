import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { Suspense } from 'react';

import {
  correctContinent,
  correctGovernment,
  correctLandlocked,
  correctPopulation,
  correctReligion,
  correctTemperatureCelsius,
} from './country.ts';
import { formatPopulation, getEmojiHintText, tempFahrenheit } from './helpers.ts';
import { StyledTableHeaderTypography } from './StyledComponents.tsx';

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
  const textEmoji = getEmojiHintText(correct, guess);
  let img = squareRedImg;

  switch (textEmoji) {
    case '🟥':
      img = squareRedImg;
      break;
    case '🟩':
      img = squareGreenImg;
      break;
    case '🔼':
      img = upwardsArrowImg;
      break;
    case '🔽':
      img = downwardsArrowImg;
      break;
    default:
      img = squareRedImg;
  }
  // Suspense so that all images are loaded before rendering, otherwise it flickers
  return <Suspense>{img}</Suspense>;
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

function ResultRow({ guessData }: { guessData: CountryData }) {
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
        <Tooltip title={tooltipText}>
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

function Results({ guessesData }: { guessesData: CountryData[] }) {
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
                    <Tooltip title={tips[i]} key={header} sx={{ cursor: 'pointer' }}>
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
    ) : null
  );
}

export default Results;
