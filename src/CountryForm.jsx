import { React, useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { synonyms } from './country';
import { StyledAutocomplete, StyledButton } from './StyledComponents';
import wordlist from './wordlist';

wordlist.sort((a, b) => a.localeCompare(b));

function CountryForm({ onSubmit }) {
  const [country, setCountry] = useState('');
  const filterOptions = (options, { inputValue }) => (options.filter((option) => {
    const cleanInput = inputValue.replace(/[^A-Za-z\s]/g, '').toLowerCase().trim();
    return (option.toLowerCase().indexOf(cleanInput) > -1)
      || (synonyms[option]
        && synonyms[option]
          .some((synonym) => synonym.toLowerCase().indexOf(cleanInput) > -1));
  }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(country); }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <StyledAutocomplete
          disablePortal
          id="country-select"
          options={wordlist}
          filterOptions={filterOptions}
          sx={{ width: 300 }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} label="Country" />}
          onChange={(event, newValue) => setCountry(newValue)}
        />
        <StyledButton id="country-submit" variant="contained" type="submit">Submit</StyledButton>
      </Box>
    </form>
  );
}

export default CountryForm;
