import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function GuessDistribution({ distribution, userResult, isWon }: { distribution: number[], userResult: number, isWon: boolean}) {
  const personalBestColumns = 11;

  return (
    <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'flex-start', gap: '0.5rem 0', userSelect: 'none' }}>
      {distribution.map((g, i) => (
        <Box key={i} sx={{ display: 'grid', gridTemplateColumns: `1fr repeat(${personalBestColumns}, 1fr [personal-best-track])`, gridTemplateRows: 'auto', width: '100%' }}>
          <Typography variant="body1" sx={{ width: '1rem', textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, padding: '0 0.2rem', marginRight: '10px' }}>{i + 1}</Typography>
          <Box
            sx={{
              gridColumnStart: 'personal-best-track 0',
              gridColumnEnd: g === 0 ? undefined : 'span ' + (g >= personalBestColumns ? personalBestColumns : g + 1),
              backgroundColor: i + 1 === userResult && isWon ? 'green' : 'grey',
              animation: `slide${i} 0.5s forwards`,
              animationDelay: '0.25s',
              ["@keyframes slide" + i]: {
                "100%": {
                  flexBasis: `${Math.round(
                    (g / distribution.reduce((partial, a) => partial + a, 0)) * 100
                  )}%`
                }
              }
            }}>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 700, padding:'0 0.2rem', textAlign: g === 0 ? 'center' : 'end', verticalAlign: 'middle' }}>
              {g}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default GuessDistribution;
