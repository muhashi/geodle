import { useState, React } from 'react';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import wordlist from './wordlist';
import { synonyms } from './country';

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
      <Autocomplete
        disablePortal
        id="country-select"
        options={wordlist}
        filterOptions={filterOptions}
        sx={{ width: 300 }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        renderInput={(params) => <TextField {...params} label="Country" />}
        onChange={(event, newValue) => setCountry(newValue)}
      />
      <Button id="country-submit" variant="contained" type="submit">Submit</Button>
    </form>
  );
}

export default CountryForm;
