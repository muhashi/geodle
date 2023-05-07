import Popover from '@mui/material/Popover';
import { useState } from 'react';
import { StyledButton, StyledTypography } from './StyledComponents.tsx';
import {
  correctContinent,
  correctGovernment,
  correctLandlocked,
  correctPopulation,
  correctReligion,
  correctTemperatureCelsius,
  dayNumber,
} from './country.ts';
import { getEmojiHintText } from './helpers.ts';

type CountryData = {
  continent: string,
  population: number,
  landlocked: boolean,
  religion: string,
  temperatureCelsius: number,
  government: string,
  country: string,
};

function Share({ guessesData }: { guessesData: CountryData[] }) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const popoverOpen = Boolean(popoverAnchorEl);

  const emojis = guessesData
    .map(({
      population, landlocked, religion, temperatureCelsius, continent, government,
    }) => [[correctContinent, continent],
      [correctPopulation, population],
      [correctLandlocked, landlocked],
      [correctReligion, religion],
      [correctTemperatureCelsius, temperatureCelsius],
      [correctGovernment, government]])
    .map((data) => data.map(([correct, guess]) => getEmojiHintText(correct, guess)).join(''))
    .join('\n');

  const title = `geodle.me ${dayNumber} ${guessesData.length}/7`;

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const copyText = `${title}\n${emojis}`;
    navigator.clipboard.writeText(copyText);
    setPopoverAnchorEl(event.currentTarget);
  };

  return (
    <>
      <StyledButton variant="contained" onClick={onClick} type="button">
        Share 📋
      </StyledButton>
      <Popover
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={() => setPopoverAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <StyledTypography
          variant="body1"
          sx={{
            padding: '0.5rem', border: '1px solid #4d4d4d', borderRadius: '4px', userSelect: 'none',
          }}
        >
          Copied results to clipboard
        </StyledTypography>
      </Popover>
    </>
  );
}

export default Share;
