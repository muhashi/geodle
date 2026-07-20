import { Fragment, ReactNode, JSX } from 'react';
import { Box, Grid, Text, Tooltip } from '@mantine/core';

import { formatPopulation, getEmojiHintText } from './helpers';

const HINT_GREEN = '#6a9955';
const HINT_RED = '#c15c4c';
const HEADER_TEXT = '#000';

type DemographicDataType = number | string | boolean;

type CountryData = {
  continent: string;
  population: number;
  landlocked: boolean;
  religion: string;
  temperatureCelsius: number;
  government: string;
  country: string;
};

type HintResult = 'correct' | 'up' | 'down' | 'wrong';

/* ---------------- Icons ---------------- */

const iconProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const IconGlobe = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" />
  </svg>
);

const IconUsers = () => (
  <svg {...iconProps}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconAnchor = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="8" x2="12" y2="21" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

const IconBook = () => (
  <svg {...iconProps}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconThermometer = () => (
  <svg {...iconProps}>
    <path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />
    <line x1="12" y1="8" x2="12" y2="14" />
  </svg>
);

const IconBuilding = () => (
  <svg {...iconProps}>
    <path d="M3 10l9-6 9 6" />
    <path d="M4 10v9" />
    <path d="M8 10v9" />
    <path d="M12 10v9" />
    <path d="M16 10v9" />
    <path d="M20 10v9" />
    <path d="M2 21h20" />
  </svg>
);

/* ---------------- Column config ---------------- */

const COLUMNS: { label: string; icon: () => JSX.Element; tip: string }[] = [
  { label: 'Continent', icon: IconGlobe, tip: 'Continent matches the correct country' },
  { label: 'Population', icon: IconUsers, tip: 'Population within 10% of correct country' },
  {
    label: 'Landlocked',
    icon: IconAnchor,
    tip: 'A landlocked country does not have territory connected to an ocean',
  },
  { label: 'Religion', icon: IconBook, tip: 'Most common religion matches the correct country' },
  { label: 'Avg. Temp.', icon: IconThermometer, tip: 'Temperature within 10% of correct country' },
  { label: 'Gov.', icon: IconBuilding, tip: 'Government type matches the correct country' },
];

function getHintResult(correct: DemographicDataType, guess: DemographicDataType): HintResult {
  if (typeof correct === 'number') correct = Math.round(correct);
  if (typeof guess === 'number') guess = Math.round(guess);

  switch (getEmojiHintText(correct, guess)) {
    case '🟩':
      return 'correct';
    case '🔼':
      return 'up';
    case '🔽':
      return 'down';
    default:
      return 'wrong';
  }
}

function formatCellValue(columnIndex: number, value: DemographicDataType): string {
  switch (columnIndex) {
    case 1: // Population
      return formatPopulation(value as number);
    case 2: // Landlocked
      return value ? 'Landlocked' : 'Coastal';
    case 4: // Avg. Temp.
      return value === 0 ? 'N/A' : `${Math.round(value as number)}°C`;
    default:
      return String(value);
  }
}

function ResultCard({ background, children }: { background: string; children: ReactNode }) {
  return (
    <Box
      h="100%"
      style={{
        background,
        borderRadius: 16,
        padding: '20px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 92,
      }}
    >
      <Text size="sm" fw={700} c="white" ta="center">
        {children}
      </Text>
    </Box>
  );
}

function HeaderCell({ label, tip, icon: Icon }: { label: string; tip: string; icon: () => JSX.Element }) {
  return (
    <Tooltip label={tip} withinPortal multiline w={220}>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          color: HEADER_TEXT,
          cursor: 'help',
        }}
      >
        {/* <Icon /> */}
        <Text
          ta="center"
          fw={700}
          size="xs"
          tt="uppercase"
          style={{ color: HEADER_TEXT }}
        >
          {label}
        </Text>
      </Box>
    </Tooltip>
  );
}

export default function Results({
  guessesData,
  correctData,
}: {
  guessesData: CountryData[];
  correctData: CountryData;
}) {
  if (guessesData.length === 0) return null;

  return (
    <Box w="100%" mb="10vh">
      <Grid columns={7} gutter="sm" align="stretch">
        {/* Header row */}
        <Grid.Col span={1}>
          <Text ta="center" fw={700} size="xs" tt="uppercase" style={{ color: HEADER_TEXT }}>
            Guess
          </Text>
        </Grid.Col>
        {COLUMNS.map((column) => (
          <Grid.Col span={1} key={column.label}>
            <HeaderCell {...column} />
          </Grid.Col>
        ))}

        {/* Guess rows */}
        {[...guessesData].reverse().map((guessData) => {
          const guessValues: DemographicDataType[] = [
            guessData.continent,
            guessData.population,
            guessData.landlocked,
            guessData.religion,
            guessData.temperatureCelsius,
            guessData.government,
          ];
          const correctValues: DemographicDataType[] = [
            correctData.continent,
            correctData.population,
            correctData.landlocked,
            correctData.religion,
            correctData.temperatureCelsius,
            correctData.government,
          ];
          const isCorrectGuess = guessData.country === correctData.country;

          return (
            <Fragment key={guessData.country}>
              <Grid.Col span={1}>
                <ResultCard background={isCorrectGuess ? HINT_GREEN : HINT_RED}>
                  {guessData.country}
                </ResultCard>
              </Grid.Col>

              {guessValues.map((guessValue, i) => {
                const hint = getHintResult(correctValues[i], guessValue);
                const displayValue = formatCellValue(i, guessValue);

                return (
                  <Grid.Col span={1} key={`${guessData.country}-${COLUMNS[i].label}`}>
                    <ResultCard background={hint === 'correct' ? HINT_GREEN : HINT_RED}>
                      {displayValue}
                      {hint === 'up' && ' ↑'}
                      {hint === 'down' && ' ↓'}
                    </ResultCard>
                  </Grid.Col>
                );
              })}
            </Fragment>
          );
        })}
      </Grid>
    </Box>
  );
}
