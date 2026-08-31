import { ActionIcon, Box, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { IconHelpCircle, IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import CountryResults from './CountryResults.tsx';

const squareStyle = {
  width: '1rem',
  height: '1rem',
  display: 'inline-block',
  margin: '0 0 0 0.5rem',
};

const squareRedImg = (
  <Box bg="red" style={squareStyle} />
);

const squareGreenImg = (
  <Box bg="green" style={squareStyle} />
);

export default function InfoModal() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <ActionIcon
        variant="subtle"
        color="gray"
        aria-label="How to play"
        onClick={() => setOpened(true)}
      >
        <IconHelpCircle size={20} />
      </ActionIcon>

      <Modal opened={opened} onClose={() => setOpened(false)} centered>
        <InfoText />
      </Modal>
    </>
  );
}

function InfoText() {
  return (
    <>
      <Stack
        gap="md"
        p="0"
        pr="sm"
        pl="sm"
        w="100%"
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
          After each guess, you will get a hint about how the demographics
          of your guess compare to the secret country.
        </Text>

        <Text>
          For example:
        </Text>
      </Stack>

      <Box style={{ width: '95%' }}>
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
          isTempFahrenheit={false}
          isAreaMiles={false}
          isMobile={true}
        />
      </Box>

      <Stack
        gap="md"
        p="0"
        pt="lg"
        pr="sm"
        pl="sm"
        w="100%"
      >
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
          Australia is surrounded by ocean, so it is not landlocked. Both countries have the same landlocked status - they are
          both coastal, so it shows {squareGreenImg}
        </Text>

        <Text>
          The average temperature of the correct country is at least 10% higher
          than Australia&apos;s, so it shows
          {squareRedImg}
        </Text>

        <Text>
          If you had fun, please share this game with your friends!
        </Text>
      </Stack>
    </>
  );
}
