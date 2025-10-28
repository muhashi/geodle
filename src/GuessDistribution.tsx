import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function GuessDistribution({ distribution, userResult, isWon }: { distribution: number[], userResult: number, isWon: boolean}) {
  return (
    <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'flex-start', gap: '0.5rem 0', userSelect: 'none' }}>
      {distribution.map((g, i) => (
        <Box key={i} sx={{ display: 'flex', gap: '0 1rem', width: '100%' }}>
          <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{i + 1}</Typography>
          <Box
            sx={{
              flex: `0 1 0%`,
              backgroundColor: i + 1 === userResult && isWon ? 'green' : 'grey',
              height: '100%',
              display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row',
              animation: `slide${i} 0.5s forwards`,
              animationDelay: '0.25s',
              ["@keyframes slide" + i]: {
                "100%": {
                  flexBasis: `${Math.round(
                    (g / Math.max(...distribution) * 80)
                  )}%`
                }
              }
            }}>
            <Typography variant="body1" sx={{ lineHeight: '1rem', color: 'white', fontWeight: 700, fontFamily: 'monospace', height: 'fit-content', margin: '0.2rem 0.5rem' }}>
              {g}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default GuessDistribution;
