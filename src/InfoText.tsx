import { Stack, Group, Text, Title, Image } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import CountryResults from './CountryResults.tsx';

import svgSquareCaretUp from './img/square-caret-up.svg';
import svgSquareGreen from './img/square-green.svg';
import svgSquareRed from './img/square-red.svg';

const squareStyle = {
  width: '1rem',
  height: '1rem',
  padding: '0 0.5rem',
};

const squareRedImg = (
  <Image src={svgSquareRed} alt="Red Square" style={squareStyle} />
);

const squareGreenImg = (
  <Image src={svgSquareGreen} alt="Green Square" style={squareStyle} />
);

const upwardsArrowImg = (
  <Image src={svgSquareCaretUp} alt="Upwards Arrow" style={squareStyle} />
);

function InfoText() {
  return (
    <Stack
      gap="md"
      p="xl"
      w="75%"
    >
      <Group justify="center" gap="xs">
        <IconInfoCircle size={22} />
        <Title order={3} fw={600}>
          How to Play
        </Title>
      </Group>

      <Text>
        Figure out the secret country in 7 guesses!
      </Text>

      <Text>
        Each guess must be a country that appears in the search box.
      </Text>

      <Text>
        After each guess, you will get a hint about how different your guess
        is from the correct country.
      </Text>

      <Text>
        You are given hints about the following categories: Continent,
        Population, Landlocked, Religion, Temperature, and Surface Area.
      </Text>

      <Text>
        For example:
      </Text>

      <CountryResults
        guessesData={[
          {
            country: 'Australia',
            continent: 'Oceania',
            population: 25000000,
            landlocked: false,
            religion: 'Christianity',
            temperatureCelsius: 22,
            surfaceArea: 7741220,
          },
        ]}
        correctData={{
          country: 'Ivory Coast',
          continent: 'Africa',
          population: 25100000,
          landlocked: false,
          religion: 'N/A',
          temperatureCelsius: 26,
          surfaceArea: 322463,
        }}
      />

      <Text>
        You guess Australia, but it&apos;s in the wrong continent from the
        correct country, so it shows
        {squareRedImg}
      </Text>

      <Text>
        The population is within 10% of the correct country&apos;s population,
        so it shows
        {squareGreenImg}
      </Text>

      <Text>
        Landlocked refers to whether the country is surrounded by land.
        Australia is not landlocked, as it is surrounded by ocean, so it is
        coastal. Both countries have the same landlocked status – they are
        both coastal, so it shows
        {squareGreenImg}
      </Text>

      <Text>
        The average temperature of the correct country is at least 10% higher
        than Australia&apos;s, so it shows
        {upwardsArrowImg}
      </Text>

      <Text>
        Hover over the category titles to get more information on what it means.
      </Text>

      <Text>
        If you had fun, please share this game with your friends!
      </Text>
    </Stack>
  );
}

export default InfoText;
