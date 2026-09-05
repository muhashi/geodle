import Cookies from 'js-cookie';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import ConfettiExplosion from 'react-confetti-blast';

import {
  Badge, Box, Burger, Button, Center,
  Container, Group, Menu, Modal, Paper,
  Stack, Switch, Text, UnstyledButton, useMantineColorScheme, useMantineTheme,
} from '@mantine/core';
import {
  IconBrandGithub, IconCoffee, IconHistory, IconMail, IconMoon, IconSettings, IconSun,
} from '@tabler/icons-react';

import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import './App.css';
import { AdBanner } from './AdSense';
import CountryForm from './CountryForm';
import Results from './CountryResults';
import { Footer, PrivacyPage, TermsPage, UpdatesPage } from './Footer';
import GuessDistribution from './GuessDistribution';
import InfoModal from './InfoModal';
import SettingsProvider, { useSettings } from './SettingsProvider';
import Share from './Share';
import Stamp from './Stamp';
import TitleLogo from './Title';
import wordlist from './wordlist';

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
} from './country';

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

const CONTACT_EMAIL = atob('aGVsbG9AZ2VvZGxlLm1l');
const GITHUB_URL = 'https://github.com/muhashi/geodle';
const TOTAL_GUESSES = 7;

const AD_SLOTS = {
  HOME_BANNER: '4988621227',
  GAME_BANNER_TOP: '5571804104',
  GAME_BANNER_BOTTOM: '1712450148',
};


interface global {
  playlightSDK?: {
    setDiscovery: (show: boolean) => void;
  };
};

function VerticalText({ top, bottom }: { top: string | number; bottom: string }) {
  return (
    <Stack gap={2} align="center">
      <Text fw={600} fz="lg">{top}</Text>
      <Text fz="xs" c="dimmed" tt="uppercase">{bottom}</Text>
    </Stack>
  );
}

function CenterRow({ children, left, right }: { children: ReactNode; left?: ReactNode; right?: ReactNode }) {
  return (
    <Box pos="relative" w="100%">
      <Center>{children}</Center>
      {left && (
        <Box pos="absolute" top="50%" left={0} style={{ transform: 'translateY(-50%)' }}>
          {left}
        </Box>
      )}
      {right && (
        <Box pos="absolute" top="50%" right={0} style={{ transform: 'translateY(-50%)' }}>
          {right}
        </Box>
      )}
    </Box>
  );
}

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
  return Cookies.get('statistics') ? JSON.parse(Cookies.get('statistics')!) : DEFAULT_STATISTICS;
}

function DailyStatistics({ guessesData, isWon }: { guessesData: CountryData[]; isWon: boolean }) {
  const [statistics, setStatistics] = useState<Statistics>(loadStatistics);

  useEffect(() => {
    setStatistics((prev) => {
      if (prev.lastDayNumber === dayNumber) return prev; // already recorded today

      const updated: Statistics = { ...prev, distribution: [...prev.distribution] };
      updated.streak = isWon && updated.lastDayNumber + 1 === dayNumber ? updated.streak + 1 : (isWon ? 1 : 0);
      updated.lastDayNumber = dayNumber;
      updated.longestStreak = Math.max(updated.streak, updated.longestStreak);
      updated.won += isWon ? 1 : 0;
      updated.total += 1;
      updated.distribution[guessesData.length - 1] += isWon ? 1 : 0;

      Cookies.set('statistics', JSON.stringify(updated), { expires: 500 });
      return updated;
    });
  }, []);

  return (
    <Stack gap="lg" w="100%">
      <Paper p="lg">
        <Group justify="space-between">
          <VerticalText top={statistics.total} bottom="Played" />
          <VerticalText
            top={statistics.total ? `${Math.round((statistics.won / statistics.total) * 100)}%` : '0%'}
            bottom="Win %"
          />
          <VerticalText top={statistics.streak} bottom="Streak" />
          <VerticalText top={statistics.longestStreak} bottom="Max streak" />
        </Group>
      </Paper>

      <Box w="100%">
        <Text fw={700} mb="xs">Guess distribution</Text>
        <GuessDistribution
          distribution={statistics.distribution}
          userResult={guessesData.length}
          isWon={isWon}
        />
      </Box>
    </Stack>
  );
}

function MoreGamesButton() {
  return (
    <Button
      onClick={() => { (globalThis as global)?.playlightSDK?.setDiscovery(true) }}
      variant="light"
    >
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
      {mode === 'daily' && (
        <DailyStatistics guessesData={guessesData} isWon={isWon} />
      )}

      <Group justify="center">
        <Button onClick={onRandom}>{mode === 'daily' ? 'Play random' : 'Play again'}</Button>
        <Button onClick={onHome} variant="outline">Back to home</Button>
      </Group>
    </Stack>
  );
}

type GameMode = 'daily' | 'random';

function GamePage({
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
  // Tracks whether we've finished checking cookies for a saved in-progress game,
  // so we don't clobber a saved game with an empty guess list before it loads.
  const [hasLoadedSavedGame, setHasLoadedSavedGame] = useState(mode !== 'daily');
  const { tempFahrenheit, areaMiles } = useSettings();

  const [target] = useState<CountryData>(() => (mode === 'daily' ? correctData : pickRandomCountryData()));

  const revealedContinent = useMemo(
    () => (guessesData.some((g) => g.continent === target.continent) ? target.continent : null),
    [guessesData, target.continent],
  );

  const excludedContinents = useMemo(() => {
    const set = new Set<string>();
    for (const g of guessesData) {
      if (g.continent && g.continent !== target.continent) set.add(g.continent);
    }
    return set;
  }, [guessesData, target.continent]);

  const guessesLeft = TOTAL_GUESSES - guessesData.length;
  const isLost = !isWon && guessesLeft <= 0;
  const isDone = isWon || isLost;

  useEffect(() => {
    if (mode !== 'daily') return undefined;

    const lastAttempt = Cookies.get('lastAttempt');
    const lastAttemptData = Cookies.get('lastAttemptData');

    if (lastAttempt && Number(lastAttempt) === dayNumber && lastAttemptData) {
      const data: CountryData[] = JSON.parse(lastAttemptData);
      setGuessesData(data);
      setIsWon(data.some(d => d.country.toLowerCase() === correctCountry.toLowerCase()));
    }
    setHasLoadedSavedGame(true);
    return undefined;
  }, []);

  useEffect(() => {
    if (mode !== 'daily' || !hasLoadedSavedGame) return;
    Cookies.set('lastAttempt', dayNumber.toString(), { expires: 1 });
    Cookies.set('lastAttemptData', JSON.stringify(guessesData), { expires: 1 });
  }, [mode, guessesData, hasLoadedSavedGame]);

  const onSubmit = (guess: string) => {
    const clean = guess.toLowerCase().trim();
    if (!clean || guessesData.some(g => g.country.toLowerCase() === clean)) return;

    const data = getData(guess);
    data.country = guess;

    setGuessesData([...guessesData, data]);

    if (clean === target.country.toLowerCase()) {
      setIsWon(true);
    }
  };

  return (
    <Stack align="center" gap="sm" mb="10vh">
      {isDone && <AdBanner format="horizontal" slot={AD_SLOTS.GAME_BANNER_TOP} style={{ maxWidth: 728, width: '100%' }} />}

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
            <ConfettiExplosion
              style={{ position: 'absolute', top: '50vh', left: '50vw' }}
              duration={3000}
              force={0.6}
            />
          )}
          <Stamp country={target.country} isWon={isWon} guessCount={guessesData.length} />
          <Group>
            {mode === 'daily' && <Share guessesData={guessesData} />}
            <MoreGamesButton />
          </Group>
        </>
      )}

      {isDone && (
        <CompletionPanel
          mode={mode}
          guessesData={guessesData}
          isWon={isWon}
          onRandom={onRandom}
          onHome={onHome}
        />
      )}

      {!isDone && (
        <Results
          guessesData={guessesData}
          correctData={target}
          isTempFahrenheit={tempFahrenheit}
          isAreaMiles={areaMiles}
        />
      )}

      {!isDone && <AdBanner slot={AD_SLOTS.GAME_BANNER_BOTTOM} style={{ maxWidth: 728, width: '100%' }} />}
    </Stack>
  );
}

function HomeActionCard({
  title,
  subtitle,
  onClick,
  emphasized,
  disabled,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  emphasized?: boolean;
  disabled?: boolean;
}) {
  return (
    <UnstyledButton
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className="home-action-card"
      p="sm"
      style={{
        flex: 1,
        minWidth: 150,
        textAlign: 'center',
        backgroundColor: disabled
          ? 'var(--mantine-color-gray-2)'
          : (emphasized ? 'var(--mantine-color-ink-6)' : 'var(--mantine-color-body)'),
        border: disabled
          ? '2px solid var(--mantine-color-gray-4)'
          : (emphasized ? 'none' : '2px solid var(--mantine-color-ink-6)'),
        borderRadius: 'var(--mantine-radius-lg)',
        transition: 'transform 0.1s ease-in-out, filter 0.1s ease-in-out',
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <Text fw={700} fz="lg" c={disabled ? 'dimmed' : (emphasized ? 'white' : 'ink')}>
        {title}
      </Text>
      <Text fz="xs" c={disabled ? 'dimmed' : (emphasized ? 'ink.1' : 'dimmed')}>
        {subtitle}
      </Text>
    </UnstyledButton>
  );
}

type DailyStatus = 'new' | 'in-progress' | 'done';

function getDailyStatus(): DailyStatus {
  const lastAttempt = Cookies.get('lastAttempt');
  const lastAttemptData = Cookies.get('lastAttemptData');

  if (!lastAttempt || Number(lastAttempt) !== dayNumber || !lastAttemptData) {
    return 'new';
  }

  try {
    const data: CountryData[] = JSON.parse(lastAttemptData);
    const won = data.some((d) => d.country.toLowerCase() === correctCountry.toLowerCase());
    const lost = !won && data.length >= TOTAL_GUESSES;
    return won || lost ? 'done' : 'in-progress';
  } catch {
    return 'new';
  }
}

function msUntilNextDaily(): number {
  const next = new Date();
  next.setHours(24, 0, 0, 0);
  return next.getTime() - Date.now();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function DailyHomeCard({ onClick }: { onClick: () => void }) {
  const [status] = useState<DailyStatus>(getDailyStatus);
  const [countdown, setCountdown] = useState(() => formatCountdown(msUntilNextDaily()));

  useEffect(() => {
    if (status !== 'done') return undefined;

    const id = setInterval(() => {
      setCountdown(formatCountdown(msUntilNextDaily()));
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  if (status === 'done') {
    return (
      <HomeActionCard
        title="Daily"
        subtitle={`New country in ${countdown}`}
        onClick={onClick}
        emphasized
        disabled
      />
    );
  }

  return (
    <HomeActionCard
      title={status === 'in-progress' ? 'Resume Daily' : 'Daily'}
      subtitle={status === 'in-progress' ? 'Continue where you left off!' : 'New country daily!'}
      onClick={onClick}
      emphasized
    />
  );
}

function HomePage({
  onDaily,
  onRandom,
  onTerms,
  onPrivacy,
  onUpdates,
}: {
  onDaily: () => void;
  onRandom: () => void;
  onTerms: () => void;
  onPrivacy: () => void;
  onUpdates: () => void;
}) {
  return (
    <Stack align="center" justify="space-between" mih="70vh" py="xl">
      <Stack align="center" gap="lg" mt="6vh" style={{ maxWidth: 480 }}>
        <Text ta="center" c="dimmed">
          Guess the mystery country of the day based on demographics such as population, temperature, and religion.
        </Text>

        <Group mt="md" w="100%" wrap="nowrap">
          <DailyHomeCard onClick={onDaily} />
          <HomeActionCard title="Quick Play" subtitle="Unlimited practice!" onClick={onRandom} />
        </Group>
      </Stack>

      <AdBanner slot={AD_SLOTS.HOME_BANNER} style={{ maxWidth: 728, width: '100%' }} />

      <Stack align="center" gap="md">
        <MoreGamesButton />
        <Footer onTerms={onTerms} onPrivacy={onPrivacy} onUpdates={onUpdates} />
      </Stack>
    </Stack>
  );
}

function SettingsModal({ opened, setOpened }: { opened: boolean; setOpened: (open: boolean) => void }) {
  const { tempFahrenheit, setTempFahrenheit, areaMiles, setAreaMiles, hideHints, setHideHints } = useSettings();

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Settings" centered>
      <Switch
        className="settings-switch"
        checked={tempFahrenheit}
        label="Show temperatures in Fahrenheit"
        onChange={(e) => setTempFahrenheit(e.currentTarget.checked)}
      />
      <Switch
        className="settings-switch"
        checked={areaMiles}
        label="Show surface area in mi²"
        onChange={(e) => setAreaMiles(e.currentTarget.checked)}
        mt="md"
      />
      <Switch
        className="settings-switch"
        checked={hideHints}
        label="Hide population hints"
        onChange={(e) => setHideHints(e.currentTarget.checked)}
        mt="md"
      />
      <Group justify="right" mt="md">
        <Button variant="filled" onClick={() => setOpened(false)}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}

// todo
function DarkModeMenuItem() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Menu.Item
      leftSection={isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
      onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? 'Light mode' : 'Dark mode'}
    </Menu.Item>
  );
}

function LogoButton({ onClick }: { onClick: () => void }) {
  return (
    <UnstyledButton onClick={onClick} aria-label="Go to home page">
      <TitleLogo />
    </UnstyledButton>
  );
}

function HeaderPill({ mode }: { mode: GameMode }) {
  const isMobile = useMediaQuery('(max-width: 450px)');
  const isXsMobile = useMediaQuery('(max-width: 400px)');
  const dailyPillText = isXsMobile ? `#${dayNumber}` : `Daily #${dayNumber}`;

  return (
    <Badge size={isMobile ? 'xs' : 'md'}>{mode === 'daily' ? dailyPillText : 'Random'}</Badge>
  );
}

function Header({ onLogoClick, mode }: { onLogoClick: () => void; mode: GameMode | null }) {
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);
  const [displaySettings, setDisplaySettings] = useState(false);

  const badge = mode && (<HeaderPill mode={mode} />);

  const menu = (
    <Menu opened={menuOpened} onChange={toggleMenu} position="bottom-end" withArrow>
      <Menu.Target>
        <Burger opened={menuOpened} onClick={toggleMenu} size="md" aria-label="Open menu" lineSize={3} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconSettings size={16} />}
          onClick={() => {
            closeMenu();
            setDisplaySettings(true);
          }}
        >
          Settings
        </Menu.Item>
        {/* <DarkModeMenuItem /> */}
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconMail size={16} />}
          component="a"
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={closeMenu}
        >
          Email
        </Menu.Item>
        <Menu.Item
          leftSection={<IconBrandGithub size={16} />}
          component="a"
          href={GITHUB_URL}
          target="_blank"
          onClick={closeMenu}
        >
          GitHub
        </Menu.Item>
        <Menu.Item
          leftSection={<IconCoffee size={16} />}
          component="a"
          href="https://ko-fi.com/muhashi"
          target="_blank"
          onClick={closeMenu}
        >
          Donate
        </Menu.Item>
        <Menu.Item
          leftSection={<IconHistory size={16} />}
          component="a"
          href="https://old.geodle.me"
          onClick={closeMenu}
        >
          Old site
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <>
      <Box component="header" className="header" py="md">
        <CenterRow left={badge} right={menu}>
          <LogoButton onClick={onLogoClick} />
        </CenterRow>
      </Box>
      <SettingsModal opened={displaySettings} setOpened={setDisplaySettings} />
    </>
  );
}

type View = 'home' | 'daily' | 'random' | 'terms' | 'privacy' | 'updates';

function Content({
  view,
  setView,
  randomSeed,
  goHome,
  goRandom,
}: {
  view: View;
  setView: (view: View) => void;
  randomSeed: number;
  goHome: () => void;
  goRandom: () => void;
}) {
  switch (view) {
    case 'daily':
      return <GamePage mode="daily" onHome={goHome} onRandom={goRandom} />;
    case 'random':
      return <GamePage key={randomSeed} mode="random" onHome={goHome} onRandom={goRandom} />;
    case 'terms':
      return <TermsPage onBack={goHome} />;
    case 'privacy':
      return <PrivacyPage onBack={goHome} />;
    case 'updates':
      return <UpdatesPage onBack={goHome} />;
    case 'home':
    default:
      return (
        <HomePage
          onDaily={() => setView('daily')}
          onRandom={goRandom}
          onTerms={() => setView('terms')}
          onPrivacy={() => setView('privacy')}
          onUpdates={() => setView('updates')}
        />
      );
  }
}

export default function App() {
  const [view, setView] = useState<View>('home');
  // Bumped every time game is restarted, so game component properly rerenders with new country
  const [randomSeed, setRandomSeed] = useState(0);
  const theme = useMantineTheme();

  const goHome = () => setView('home');
  const goRandom = () => {
    setRandomSeed((s) => s + 1);
    setView('random');
  };

  const headerMode: GameMode | null = view === 'daily' || view === 'random' ? view : null;

  return (
    <Box
      className="App"
      style={{
        minHeight: '100vh',
        backgroundColor: theme.other.pageBackground,
        backgroundImage: `linear-gradient(${theme.other.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.other.gridLine} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    >
      <SettingsProvider>
        <Container size="sm" px="md" py="md">
          <Header onLogoClick={goHome} mode={headerMode} />
          <Content view={view} setView={setView} randomSeed={randomSeed} goHome={goHome} goRandom={goRandom} />
        </Container>
      </SettingsProvider>
    </Box>
  );
}
