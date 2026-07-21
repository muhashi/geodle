import { Popover, Button, Text } from '@mantine/core';
import { useState } from 'react';
import {
  correctContinent,
  correctSurfaceArea,
  correctLandlocked,
  correctPopulation,
  correctReligion,
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
  const [opened, setOpened] = useState(false);

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

  const title = `geodle.me ${dayNumber} ${guessesData.length}/7`;

  const onClick = async () => {
    const copyText = `${title}\n${emojis}`;
    await navigator.clipboard.writeText(copyText);
    setOpened(true);

    // auto-close after a short delay (optional but nice UX)
    setTimeout(() => setOpened(false), 1500);
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <Button onClick={onClick}>
          Share 📋
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Text
          size="sm"
          style={{
            userSelect: 'none',
            border: '1px solid #4d4d4d',
            borderRadius: 4,
            padding: '0.5rem',
          }}
        >
          Copied results to clipboard
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}

export default Share;
