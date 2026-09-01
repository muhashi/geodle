import { Box } from '@mantine/core';
import { shortenCountryName } from './helpers';
import './Stamp.css';


export default function Stamp({ country, isWon, guessCount }: { country: string; isWon: boolean, guessCount: number }) {

  const color = isWon ? '#007326' : '#c4523b';

  return (
    <Box className="stamp-wrap" style={{
      display: 'flex',
      width: 200,
      height: 200,
      // margin: '-24px 0',
      transform: 'rotate(-6deg)',
      filter: 'drop-shadow(0 6px 14px rgba(30,42,56,0.15))'
    }}>
      <svg viewBox="0 0 240 240">
        <defs>
          <path id="arcTop" d="M 34,120 A 86,86 0 0 1 206,120" />
          <path id="arcBottom" d="M 206,132 A 86,74 0 0 1 34,132" />
        </defs>
        <circle cx="120" cy="120" r="106" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 3" opacity="0.55" />
        <circle cx="120" cy="120" r="78" fill="none" stroke={color} strokeWidth="2.5" />
        <text fontFamily="monospace" fontSize="18" fontWeight="600" fill={color} letterSpacing="1">
          <textPath href="#arcTop" startOffset="50%" textAnchor="middle">{shortenCountryName(country)}</textPath>
        </text>
        <text x="120" y={isWon ? "115" : "125"} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontWeight="700" fontSize="22" fill={color}>{isWon ? 'Found' : 'Failed'}</text>
        {isWon && (
          <text x="120" y="140" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={color} letterSpacing="1">
            IN {guessCount} GUESSES
          </text>
        )}
        <text fontFamily="monospace" fontSize="15" fontWeight="600" fill={color} letterSpacing="3">
          <textPath href="#arcBottom" startOffset="50%" textAnchor="middle">GEODLE</textPath>
        </text>
      </svg>
    </Box>
  );
}

