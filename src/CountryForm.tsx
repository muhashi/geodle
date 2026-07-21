// import { useState } from 'react';
// import {
//   Autocomplete,
//   Box,
//   Button,
//   Group,
//   Text,
//   OptionsFilter,
//   ComboboxItem,
// } from '@mantine/core';

// import { descriptions, synonyms, getData } from './country';
// import wordlist from './wordlist';

// type CountryFormProps = {
//   onSubmit: (country: string) => void;
//   hideHints: boolean;
// };

// function CountryForm({ onSubmit, hideHints }: CountryFormProps) {
//   const [value, setValue] = useState('');
//   const [search, setCountryrch] = useState('');

//   const options = [...wordlist].sort((a, b) => {
//     const ca = getData(a).continent;
//     const cb = getData(b).continent;
//     return ca !== cb ? ca.localeCompare(cb) : a.localeCompare(b);
//   });

//   const filter: OptionsFilter = ({options, search}) => {
//     const clean = search.replace(/[^A-Za-z\s]/g, '').toLowerCase().trim();

//     return (options as ComboboxItem[]).filter(({ label }) => {
//       if (label.toLowerCase().includes(clean)) return true;

//       return (
//         synonyms[label as keyof typeof synonyms]?.some((s) =>
//           s.toLowerCase().includes(clean)
//         ) ?? false
//       );
//     });
//   };

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSubmit(value);
//         setValue('');
//         setCountryrch('');
//       }}
//     >
//       <Group gap="sm" wrap="nowrap">
//         <Autocomplete
//           value={value}
//           // searchValue={search}
//           onChange={setValue}
//           // onSearchChange={setCountryrch}
//           placeholder="Country"
//           // nothingFound="No countries found..."
//           data={options}
//           filter={filter}
//           groupBy={(item) => getData(item).continent}
//           renderGroup={({ group, children }) => (
//             <Box key={group}>
//               <Text
//                 size="xs"
//                 fw={600}
//                 c="blue"
//                 style={(theme) => ({
//                   position: 'sticky',
//                   top: 0,
//                   backgroundColor: theme.fn.lighten(
//                     theme.colors.blue[1],
//                     0.85
//                   ),
//                   padding: '4px 10px',
//                   userSelect: 'none',
//                 })}
//               >
//                 {group}
//               </Text>
//               {children}
//             </Box>
//           )}
//           itemComponent={({ value, ...others }) => (
//             <Box {...others}>
//               <Text ta={hideHints ? 'left' : 'center'}>
//                 {value}
//               </Text>
//               {!hideHints && (
//                 <Text size="sm" c="dimmed">
//                   {descriptions[value as keyof typeof descriptions] ?? ''}
//                 </Text>
//               )}
//             </Box>
//           )}
//           maxDropdownHeight={300}
//           withinPortal
//           w={300}
//         />

//         <Button type="submit">
//           Submit
//         </Button>
//       </Group>
//     </form>
//   );
// }

// export default CountryForm;


import React, { useState } from 'react';

import { Select, Button, Group, OptionsFilter, ComboboxItem } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { descriptions, synonyms, getData } from './country';
import wordlist from './wordlist';

type CountryFormProps = {
  onSubmit: (country: string) => void;
  hideHints: boolean;
  guessed: string[];
};


function CountryForm({ onSubmit, hideHints, guessed }: CountryFormProps) {
  const [country, setCountry] = useState('');
  const isMobile = useMediaQuery(`(max-width: 485px)`);

  const filter: OptionsFilter = ({options, search}) => {
    const clean = search.replace(/[^A-Za-z\s]/g, '').toLowerCase().trim();

    return (options as ComboboxItem[]).filter(({ label }) => {
      if (label.toLowerCase().includes(clean)) return true;

      return (
        synonyms[label as keyof typeof synonyms]?.some((s) =>
          s.toLowerCase().includes(clean)
        ) ?? false
      );
    });
  };

  return (
    <form style={{ width: '100%' }} onSubmit={(e) => { e.preventDefault(); onSubmit(country); setCountry("");}}>
      <Group style={{ width: '100%' }} gap="sm" wrap="nowrap" justify="center">
        <Button size="md" variant="contained" type="submit" style={{visibility: 'hidden', display: isMobile ? 'none' : 'block'}} disabled>Guess</Button> {/* hidden button for centering */}
        <Select
          data={[...wordlist].filter(country => !guessed.some((guess) => country === guess)).sort((a, b) => a.localeCompare(b))}
          autoSelectOnBlur
          searchable
          clearable
          filter={filter}
          withCheckIcon={false}
          rightSection={null}
          comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 }, shadow: 'md' }}
          placeholder="Search a country..."
          onChange={(_value, option) => setCountry(option?.value)}
          size="md"
          value={country ?? null}
        />
        <Button size="md" variant="contained" type="submit">Guess</Button>
      </Group>
    </form>
  );
}

export default CountryForm;
