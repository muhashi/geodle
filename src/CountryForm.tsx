import React, { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { lighten, styled } from '@mui/material/styles';


import { descriptions, synonyms, getData } from './country.ts';
import { StyledAutocomplete, StyledButton, StyledTypography } from './StyledComponents.tsx';
import wordlist from './wordlist';

type CountryFormProp = {
  onSubmit: (country: string) => void;
  hideHints: boolean;
}

type FilterOptionsProp<T> = (
  options: T[],
  { inputValue }: { inputValue: string },
) => T[];

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

function CountryForm({ onSubmit, hideHints }: CountryFormProp) {
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
          options={[...wordlist].sort((a, b) => {
            if (getData(a).continent !== getData(b).continent) {
              return getData(a).continent.localeCompare(getData(b).continent);
            }
            return a.localeCompare(b);
          })}
          filterOptions={filterOptions as FilterOptionsProp<unknown>}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Country" />}
          onChange={(_, newValue) => setCountry(newValue as string)}
          onInputChange={(_, newValue) => setInputValue(newValue)}
          value={country}
          inputValue={inputValue}
          groupBy={(country) => getData(country as string).continent}
          renderGroup={(params) => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box sx={{ width: '100%' }}>
                <StyledTypography variant="body1" sx={{ textAlign: hideHints ? 'left' : 'center' }}>{option as React.ReactNode}</StyledTypography>
                { !hideHints && (
                <StyledTypography variant="subtitle1" sx={{ color: '#696969', display: 'block' }}>
                  {descriptions[option as keyof typeof descriptions] ?? ''}
                </StyledTypography>
                )}
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
