import { Button } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import {
  correctContinent,
  correctLandlocked,
  correctPopulation,
  correctReligion,
  correctSurfaceArea,
  correctTemperatureCelsius,
  dayNumber,
} from './country.ts';
import { getEmojiHintText } from './helpers.ts';

type CountryData = {
  continent: string;
  population: number;
  landlocked: boolean;
  religion: string;
  temperatureCelsius: number;
  surfaceArea: number;
  country: string;
};

function Share({ guessesData }: { guessesData: CountryData[] }) {
  const clipboard = useClipboard({ timeout: 750 });

  const title = `geodle.me ${dayNumber} ${guessesData.length}/7`;

  const emojis = guessesData
    .map(
      ({
        population,
        landlocked,
        religion,
        temperatureCelsius,
        continent,
        surfaceArea,
      }) => [
        [correctContinent, continent],
        [correctPopulation, population],
        [correctLandlocked, landlocked],
        [correctReligion, religion],
        [correctTemperatureCelsius, temperatureCelsius],
        [correctSurfaceArea, surfaceArea],
      ]
    )
    .map((data) =>
      data.map(([correct, guess]) => getEmojiHintText(correct, guess)).join('')
    )
    .join('\n');

  const copyText = `${title}\n${emojis}`;

  return (
      <Button onClick={() => clipboard.copy(copyText)} color={clipboard.copied ? "var(--mantine-color-green-6)" : "var(--mantine-color-yellow-6)"}>
        {clipboard.copied ? 'Copied!' : 'Share results'}
      </Button>
  );
}

export default Share;
