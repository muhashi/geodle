import { useEffect, useState } from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';

type GuessDistributionProps = {
  distribution: number[];
  userResult: number;
  isWon: boolean;
};

function GuessDistribution({
  distribution,
  userResult,
  isWon,
}: GuessDistributionProps) {
  const max = Math.max(...distribution);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Stack
      w="80%"
      gap="xs"
      style={{ userSelect: 'none' }}
      align="flex-start"
    >
      {distribution.map((value, i) => {
        const isHighlighted = isWon && i + 1 === userResult;
        const width = max === 0 ? 0 : Math.round((value / max) * 80);

        return (
          <Group key={i} gap="md" w="100%" wrap="nowrap">
            <Text fw={800} ff="monospace" size="sm">
              {i + 1}
            </Text>

            <Box
              style={{
                flexBasis: grown ? `${width}%` : 0,
                flexGrow: 0,
                flexShrink: 1,
                backgroundColor: isHighlighted
                  ? 'var(--mantine-color-green-filled)'
                  : 'var(--mantine-color-gray-filled)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                transition: 'flex-basis 0.5s ease',
                transitionDelay: '0.25s',
              }}
            >
              <Text
                c="white"
                fw={700}
                ff="monospace"
                size="sm"
                style={{ margin: '0.2rem 0.5rem' }}
              >
                {value}
              </Text>
            </Box>
          </Group>
        );
      })}
    </Stack>
  );
}

export default GuessDistribution;
