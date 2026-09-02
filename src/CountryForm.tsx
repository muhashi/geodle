import { useMemo, useState } from 'react';

import { Button, ComboboxItem, ComboboxItemGroup, Group, OptionsFilter, Select } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { descriptions, synonyms } from './country';
import { useSettings } from './SettingsProvider';
import wordlist from './wordlist';
import continentData from './data/country-by-continent.json';

type CountryFormProps = {
  onSubmit: (country: string) => void;
  guessed: string[];
  revealedContinent?: string | null;
  excludedContinents?: string[] | Set<string>;
};

// Order in which continent groups appear in the dropdown
const CONTINENT_ORDER = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Antarctica',
];

const continentMap = new Map(
  continentData.map((entry) => [entry.country.toLowerCase(), entry.continent]),
);

function buildGroupedData(
  guessed: string[],
  revealedContinent: string | null,
  excludedContinents: Set<string>,
): ComboboxItemGroup<ComboboxItem>[] {
  const groups = new Map<string, ComboboxItem[]>();

  wordlist.forEach((countryName) => {
    if (guessed.includes(countryName)) return;
    const continent = continentMap.get(countryName.toLowerCase()) ?? 'Other';
    if (revealedContinent && continent !== revealedContinent) return;
    if (!revealedContinent && excludedContinents.has(continent)) return;
    const items = groups.get(continent) ?? [];
    items.push({ value: countryName, label: countryName });
    groups.set(continent, items);
  });

  return CONTINENT_ORDER
    .filter((continent) => groups.has(continent))
    .map((continent) => ({
      group: continent,
      items: (groups.get(continent) ?? []).sort((a, b) => a.label.localeCompare(b.label)),
    }));
}

function CountryForm({ onSubmit, guessed, revealedContinent = null, excludedContinents = [] }: CountryFormProps) {
  const [country, setCountry] = useState<string | null>(null);
  const isMobile = useMediaQuery(`(max-width: 600px)`);
  const { hideHints } = useSettings();

  const excludedSet = useMemo(
    () => (excludedContinents instanceof Set ? excludedContinents : new Set(excludedContinents)),
    [excludedContinents],
  );

  const data = useMemo(
    () => buildGroupedData(guessed, revealedContinent, excludedSet),
    [guessed, revealedContinent, excludedSet],
  );

  const filter: OptionsFilter = ({ options, search }) => {
    const clean = search.replace(/[^A-Za-z\s]/g, '').toLowerCase().trim();

    const matches = (label: string) =>
      label.toLowerCase().includes(clean) ||
      (synonyms[label as keyof typeof synonyms]?.some((s) =>
        s.toLowerCase().includes(clean),
      ) ?? false);

    return options
      .map((option) => {
        // Keep continent group structure while filtering
        if ('items' in option) {
          return { group: option.group, items: option.items.filter((item) => matches(item.label)) };
        }
        return matches(option.label) ? option : null;
      })
      .filter((option): option is ComboboxItem | ComboboxItemGroup<ComboboxItem> => {
        if (option === null) return false;
        if ('items' in option) return option.items.length > 0;
        return true;
      });
  };

  return (
    <form style={{ width: '100%' }} onSubmit={(e) => { e.preventDefault(); onSubmit(country ?? ''); setCountry(null);}}>
      <Group style={{ width: '100%' }} gap="sm" wrap="nowrap" justify="center">
        <Button size="md" variant="contained" type="submit" style={{visibility: 'hidden', display: isMobile ? 'none' : 'block'}} disabled>Guess</Button> {/* hidden button for centering */}
        <Select
          data={data}
          autoSelectOnBlur
          searchable
          clearable
          filter={filter}
          withCheckIcon={false}
          rightSection={' '}
          comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 }, shadow: 'md' }}
          placeholder="Search a country..."
          onChange={(_value, option) => setCountry(option?.value)}
          size="md"
          value={country ?? null}
          renderOption={({ option }) => (
            <div>
              <div>{option.label}</div>
              {!hideHints && (
                <div style={{ fontSize: '0.75rem', opacity: 0.6, lineHeight: 1.2 }}>
                  {(descriptions as Record<string, string>)[option.value]}
                </div>
              )}
            </div>
          )}
        />
        <Button size="md" variant="contained" type="submit" style={{ overflow: 'visible' }}>Guess</Button>
      </Group>
    </form>
  );
}

export default CountryForm;
