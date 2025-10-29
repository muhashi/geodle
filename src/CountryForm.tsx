import React, { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { descriptions, synonyms } from './country.ts';
import { StyledAutocomplete, StyledButton, StyledTypography } from './StyledComponents.tsx';
import wordlist from './wordlist';

type OnSubmitProp = {
  onSubmit: (country: string) => void;
}

type FilterOptionsProp<T> = (
  options: T[],
  { inputValue }: { inputValue: string },
) => T[];

function CountryForm({ onSubmit }: OnSubmitProp) {
  const [country, setCountry] = useState('');
  const [inputValue, setInputValue] = useState('');

  const filterOptions: FilterOptionsProp<string> = (options, { inputValue }) => (
    options.filter((option) => {
      const cleanInput = inputValue.replace(/[^A-Za-z\s]/g, '').toLowerCase().trim();
      return (option.toLowerCase().indexOf(cleanInput) > -1)
        || (synonyms[option as keyof typeof synonyms]
          && synonyms[option as keyof typeof synonyms]
            .some((synonym) => synonym.toLowerCase().indexOf(cleanInput) > -1));
    }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(country); setCountry(''); setInputValue(''); }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', maxWidth: '95vw' }}>
        <StyledAutocomplete
          disablePortal
          autoHighlight
          id="country-select"
          noOptionsText="No countries found..."
          options={[...wordlist].sort((a, b) => a.localeCompare(b))}
          filterOptions={filterOptions as FilterOptionsProp<unknown>}
          sx={{ width: 300 }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} label="Country" />}
          onChange={(_, newValue) => setCountry(newValue as string)}
          onInputChange={(_, newValue) => setInputValue(newValue)}
          value={country}
          inputValue={inputValue}
          renderOption={(props, option) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <li {...props}>
              <Box sx={{ width: '100%' }}>
                <StyledTypography variant="body1">{option as React.ReactNode}</StyledTypography>
                {/* { typeof option === 'string' && ( */}
                <StyledTypography variant="subtitle1" sx={{ color: '#696969', display: 'block' }}>
                  {descriptions[option as keyof typeof descriptions] ?? ''}
                </StyledTypography>
                {/* )} */}
              </Box>
            </li>
          )}
        />
        <StyledButton id="country-submit" variant="contained" type="submit">Submit</StyledButton>
      </Box>
    </form>
  );
}

export default CountryForm;
