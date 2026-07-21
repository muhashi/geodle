import { Box, Stack, Group, Text } from '@mantine/core';

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

  return (
    <Stack
      w="80%"
      gap="xs"
      style={{ userSelect: 'none' }}
      align="flex-start"
    >
      {distribution.map((value, i) => {
        const isUser = isWon && i + 1 === userResult;
        const width = max === 0 ? 0 : Math.round((value / max) * 80);

        return (
          <Group key={i} gap="md" w="100%" wrap="nowrap">
            <Text
              fw={800}
              ff="monospace"
              size="sm"
            >
              {i + 1}
            </Text>

            <Box
              style={{
                flexBasis: 0,
                flexGrow: 0,
                flexShrink: 1,
                backgroundColor: isUser ? 'green' : 'gray',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                animation: `grow-${i} 0.5s forwards`,
                animationDelay: '0.25s',

                [`@keyframes grow-${i}`]: {
                  '100%': {
                    flexBasis: `${width}%`,
                  },
                },
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
