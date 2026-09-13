import { Box, Button, Group, Paper, Stack, Text } from '@mantine/core';
import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';
import ConfettiExplosion from 'react-confetti-blast';
import { AdBanner } from "../../src/AdSense";
import {
  correctContinent,
  correctCountry,
  correctLandlocked,
  correctPopulation,
  correctReligion,
  correctSurfaceArea,
  correctTemperatureCelsius,
  dayNumber,
  getData,
} from "../../src/country";
import CountryForm from "../../src/CountryForm";
import Results from "../../src/CountryResults";
import GuessDistribution from "../../src/GuessDistribution";
import InfoModal from "../../src/InfoModal";
import { useSettings } from "../../src/SettingsProvider";
import Share from "../../src/Share";
import Stamp from "../../src/Stamp";
import wordlist from "../../src/wordlist";

type CountryData = {
  continent: string;
  population: number;
  landlocked: boolean;
  religion: string;
  temperatureCelsius: number;
  surfaceArea: number;
  country: string;
};

const correctData: CountryData = {
  continent: correctContinent,
  population: correctPopulation,
  landlocked: correctLandlocked,
  religion: correctReligion,
  temperatureCelsius: correctTemperatureCelsius,
  surfaceArea: correctSurfaceArea,
  country: correctCountry,
};

const TOTAL_GUESSES = 7;

const AD_SLOTS = {
  GAME_BANNER_TOP: '5571804104',
  GAME_BANNER_BOTTOM: '1712450148',
};

function pickRandomCountryData(): CountryData {
  const name = wordlist[Math.floor(Math.random() * wordlist.length)];
  const data = getData(name);
  data.country = name;
  return data;
}

type Statistics = {
  won: number;
  total: number;
  streak: number;
  longestStreak: number;
  distribution: number[];
  lastDayNumber: number;
};

const DEFAULT_STATISTICS: Statistics = {
  won: 0,
  total: 0,
  streak: 0,
  longestStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0, 0],
  lastDayNumber: 0,
};

function loadStatistics(): Statistics {
  if (typeof document === 'undefined') return DEFAULT_STATISTICS;
  try {
    return Cookies.get('statistics') ? JSON.parse(Cookies.get('statistics')!) : DEFAULT_STATISTICS;
  } catch {
    return DEFAULT_STATISTICS;
  }
}

function VerticalText({ top, bottom }: { top: string | number; bottom: string }) {
  return (
    <Stack gap={2} align="center">
      <Text fw={600} fz="lg">{top}</Text>
      <Text fz="xs" c="dimmed" tt="uppercase">{bottom}</Text>
    </Stack>
  );
}

function DailyStatistics({ guessesData, isWon }: { guessesData: CountryData[]; isWon: boolean }) {
  const [statistics, setStatistics] = useState<Statistics>(() => DEFAULT_STATISTICS);

  useEffect(() => {
    const loaded = loadStatistics();
    setStatistics((prev) => {
      const base = prev.total === 0 && loaded.total !== 0 ? loaded : prev.total === 0 ? loaded : prev;
      if (base.lastDayNumber === dayNumber) return base;
      const updated: Statistics = { ...base, distribution: [...base.distribution] };
      updated.streak = isWon && updated.lastDayNumber + 1 === dayNumber ? updated.streak + 1 : (isWon ? 1 : 0);
      updated.lastDayNumber = dayNumber;
      updated.longestStreak = Math.max(updated.streak, updated.longestStreak);
      updated.won += isWon ? 1 : 0;
      updated.total += 1;
      updated.distribution[guessesData.length - 1] += isWon ? 1 : 0;
      try { Cookies.set('statistics', JSON.stringify(updated), { expires: 500 }); } catch {}
      return updated;
    });
  }, [guessesData.length, isWon]);

  useEffect(() => {
    setStatistics(loadStatistics());
  }, []);

  return (
    <Stack gap="lg" w="100%">
      <Paper p="lg">
        <Group justify="space-between">
          <VerticalText top={statistics.total} bottom="Played" />
          <VerticalText top={statistics.total ? `${Math.round((statistics.won / statistics.total) * 100)}%` : '0%'} bottom="Win %" />
          <VerticalText top={statistics.streak} bottom="Streak" />
          <VerticalText top={statistics.longestStreak} bottom="Max streak" />
        </Group>
      </Paper>
      <Box w="100%">
        <Text fw={700} mb="xs">Guess distribution</Text>
        <GuessDistribution distribution={statistics.distribution} userResult={guessesData.length} isWon={isWon} />
      </Box>
    </Stack>
  );
}

export function MoreGamesButton() {
  return (
    <Button onClick={() => { (globalThis as any)?.playlightSDK?.setDiscovery(true) }} variant="light">
      More games
    </Button>
  );
}

function CompletionPanel({
  mode,
  guessesData,
  isWon,
  onRandom,
  onHome,
}: {
  mode: GameMode;
  guessesData: CountryData[];
  isWon: boolean;
  onRandom: () => void;
  onHome: () => void;
}) {
  return (
    <Stack align="center" gap="xl" w="100%" style={{ maxWidth: 420 }}>
      {mode === 'daily' && <DailyStatistics guessesData={guessesData} isWon={isWon} />}
      <Group justify="center">
        <Button onClick={onRandom}>{mode === 'daily' ? 'Play random' : 'Play again'}</Button>
        <Button onClick={onHome} variant="outline">Back to home</Button>
      </Group>
    </Stack>
  );
}

type GameMode = 'daily' | 'random';

export function GamePage({
  mode,
  onHome,
  onRandom,
}: {
  mode: GameMode;
  onHome: () => void;
  onRandom: () => void;
}) {
  const [guessesData, setGuessesData] = useState<CountryData[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [hasLoadedSavedGame, setHasLoadedSavedGame] = useState(mode !== 'daily');
  const { tempFahrenheit, areaMiles } = useSettings();

  const [target, setTarget] = useState<CountryData | null>(null);
  useEffect(() => {
    setTarget(mode === 'daily' ? correctData : pickRandomCountryData());
  }, [mode]);

  const revealedContinent = useMemo(
    () => (target && guessesData.some((g) => g.continent === target.continent) ? target.continent : null),
    [guessesData, target],
  );

  const excludedContinents = useMemo(() => {
    const set = new Set<string>();
    if (!target) return set;
    for (const g of guessesData) {
      if (g.continent && g.continent !== target.continent) set.add(g.continent);
    }
    return set;
  }, [guessesData, target]);

  const guessesLeft = TOTAL_GUESSES - guessesData.length;
  const isLost = !isWon && guessesLeft <= 0;
  const isDone = isWon || isLost;

  useEffect(() => {
    if (mode !== 'daily') return undefined;
    if (typeof document === 'undefined') {
      setHasLoadedSavedGame(true);
      return undefined;
    }
    try {
      const lastAttempt = Cookies.get('lastAttempt');
      const lastAttemptData = Cookies.get('lastAttemptData');
      if (lastAttempt && Number(lastAttempt) === dayNumber && lastAttemptData) {
        const data: CountryData[] = JSON.parse(lastAttemptData);
        setGuessesData(data);
        setIsWon(data.some(d => d.country.toLowerCase() === correctCountry.toLowerCase()));
      }
    } catch {}
    setHasLoadedSavedGame(true);
    return undefined;
  }, [mode]);

  useEffect(() => {
    if (mode !== 'daily' || !hasLoadedSavedGame) return;
    if (typeof document === 'undefined') return;
    try {
      Cookies.set('lastAttempt', dayNumber.toString(), { expires: 1 });
      Cookies.set('lastAttemptData', JSON.stringify(guessesData), { expires: 1 });
    } catch {}
  }, [mode, guessesData, hasLoadedSavedGame]);

  const onSubmit = (guess: string) => {
    if (!target) return;
    const clean = guess.toLowerCase().trim();
    if (!clean || guessesData.some(g => g.country.toLowerCase() === clean)) return;
    const data = getData(guess);
    data.country = guess;
    setGuessesData([...guessesData, data]);
    if (clean === target.country.toLowerCase()) {
      setIsWon(true);
    }
  };

  if (!target) {
    return (
      <Box ta="center" py="xl">
        <Text c="dimmed">Loading puzzle…</Text>
      </Box>
    );
  }

  return (
    <Stack align="center" gap="sm" mb="10vh">
      {isDone && (
        <Box className="horizontal-ad-slot">
          <AdBanner format="horizontal" responsive={false} slot={AD_SLOTS.GAME_BANNER_TOP} style={{ maxWidth: '100dvw', width: '100%', maxHeight: '120px' }} />
        </Box>
      )}

      <Group gap="xs" justify="center" wrap="nowrap">
        {!isDone && <Box style={{ width: 20, height: 20, visibility: 'hidden' }} />}
        <Text ta="center" fw={500}>
          {isDone
            ? (mode === 'daily' ? 'Come back tomorrow for a new country!' : (isWon ? 'Amazing geography skills!' : 'Better luck next time!'))
            : <>Guess the country. <strong>{guessesLeft} guesses left.</strong></>}
        </Text>
        {!isDone && <InfoModal />}
      </Group>

      {!isDone && (
        <CountryForm
          onSubmit={onSubmit}
          guessed={guessesData.map(({ country }) => country)}
          revealedContinent={revealedContinent}
          excludedContinents={excludedContinents}
        />
      )}

      {isDone && (
        <>
          {isWon && (
            <ConfettiExplosion style={{ position: 'absolute', top: '50vh', left: '50vw' }} duration={3000} force={0.6} />
          )}
          <Stamp country={target.country} isWon={isWon} guessCount={guessesData.length} />
          <Group>
            {mode === 'daily' && <Share guessesData={guessesData} />}
            <MoreGamesButton />
          </Group>
        </>
      )}

      {isDone && (
        <CompletionPanel mode={mode} guessesData={guessesData} isWon={isWon} onRandom={onRandom} onHome={onHome} />
      )}

      {!isDone && (
        <Results guessesData={guessesData} correctData={target} isTempFahrenheit={tempFahrenheit} isAreaMiles={areaMiles} />
      )}

      {!isDone && (
        <Box className="horizontal-ad-slot">
          <AdBanner format="horizontal" responsive={false} slot={AD_SLOTS.GAME_BANNER_BOTTOM} style={{ maxWidth: '100dvw', width: '100%', maxHeight: '120px' }} />
        </Box>
      )}
    </Stack>
  );
}
