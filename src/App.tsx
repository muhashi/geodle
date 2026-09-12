import Cookies from 'js-cookie';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import ConfettiExplosion from 'react-confetti-blast';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ClientOnly, Head } from 'vite-react-ssg';

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
import { Footer as FooterView, PrivacyPage as PrivacyContent, TermsPage as TermsContent, UpdatesPage as UpdatesContent } from './Footer';
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
import type { RouteRecord } from 'vite-react-ssg';
import { MantineProvider } from '@mantine/core';
import theme from './theme';

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
  DESKTOP_LEFT_RAIL: '7158016818',
  DESKTOP_RIGHT_RAIL: '2939570207',
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
  if (typeof document === 'undefined') return DEFAULT_STATISTICS;
  try {
    return Cookies.get('statistics') ? JSON.parse(Cookies.get('statistics')!) : DEFAULT_STATISTICS;
  } catch {
    return DEFAULT_STATISTICS;
  }
}

function DailyStatistics({ guessesData, isWon }: { guessesData: CountryData[]; isWon: boolean }) {
  const [statistics, setStatistics] = useState<Statistics>(() => DEFAULT_STATISTICS);

  useEffect(() => {
    const loaded = loadStatistics();
    setStatistics((prev) => {
      // if already set to loaded and already recorded today, keep it
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

  // hydrate with actual cookies after mount to avoid SSR mismatch
  useEffect(() => {
    setStatistics(loadStatistics());
    // the effect above will handle recording today's result, ensure we reload after that
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
        <ClientOnly>{() => <DailyStatistics guessesData={guessesData} isWon={isWon} />}</ClientOnly>
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

      {!isDone && (
        <Box className="horizontal-ad-slot">
          <AdBanner format="horizontal" responsive={false} slot={AD_SLOTS.GAME_BANNER_BOTTOM} style={{ maxWidth: '100dvw', width: '100%', maxHeight: '120px' }} />
        </Box>
      )}
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
  if (typeof document === 'undefined') return 'new';
  try {
    const lastAttempt = Cookies.get('lastAttempt');
    const lastAttemptData = Cookies.get('lastAttemptData');
    if (!lastAttempt || Number(lastAttempt) !== dayNumber || !lastAttemptData) {
      return 'new';
    }
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
  const [status, setStatus] = useState<DailyStatus>('new');
  const [countdown, setCountdown] = useState(() => formatCountdown(msUntilNextDaily()));

  useEffect(() => {
    setStatus(getDailyStatus());
  }, []);

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
          {/* Daily card reads cookies; wrap in ClientOnly to avoid SSR mismatch, but provide fallback for SEO */}
          <ClientOnly fallback={<HomeActionCard title="Daily" subtitle="New country daily!" onClick={onDaily} emphasized />}>
            {() => <DailyHomeCard onClick={onDaily} />}
          </ClientOnly>
          <HomeActionCard title="Quick Play" subtitle="Unlimited practice!" onClick={onRandom} />
        </Group>
      </Stack>

      <Box className="horizontal-ad-slot">
        <AdBanner format="horizontal" responsive={false} slot={AD_SLOTS.HOME_BANNER} style={{ maxWidth: '100dvw', width: '100%', maxHeight: '120px' }} />
      </Box>

      <Stack align="center" gap="md">
        <MoreGamesButton />
        <FooterView onTerms={onTerms} onPrivacy={onPrivacy} onUpdates={onUpdates} />
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

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Head>
        <title>Geodle - Geography Wordle</title>
        <meta name="description" content="Guess the mystery country of the day based on demographics such as population, temperature, and religion. New country daily!" />
        <link rel="canonical" href="https://geodle.me/" />
      </Head>
      <HomePage
        onDaily={() => navigate('/daily')}
        onRandom={() => navigate('/random')}
        onTerms={() => navigate('/terms')}
        onPrivacy={() => navigate('/privacy')}
        onUpdates={() => navigate('/updates')}
      />
    </>
  );
}

function DailyRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Head>
        <title>{`Daily Geodle #${dayNumber} - Geography Wordle`}</title>
        <meta name="description" content={`Geodle Daily #${dayNumber} - Guess today's mystery country in 7 tries!`} />
        <link rel="canonical" href="https://geodle.me/daily" />
      </Head>
      {/* Game is client-heavy (cookies, random); render shell on SSR then hydrate full game client-side */}
      <ClientOnly fallback={<Box ta="center" py="xl"><Text c="dimmed">Loading daily puzzle…</Text></Box>}>
        {() => <GamePage mode="daily" onHome={() => navigate('/')} onRandom={() => navigate('/random')} />}
      </ClientOnly>
    </>
  );
}

function RandomRoute() {
  const navigate = useNavigate();
  const [seed, setSeed] = useState(0);
  return (
    <>
      <Head>
        <title>Random Geodle - Unlimited Practice</title>
        <meta name="description" content="Play Geodle unlimited - guess the mystery country based on continent, population, religion and more." />
        <link rel="canonical" href="https://geodle.me/random" />
      </Head>
      <ClientOnly fallback={<Box ta="center" py="xl"><Text c="dimmed">Loading puzzle…</Text></Box>}>
        {() => <GamePage key={seed} mode="random" onHome={() => navigate('/')} onRandom={() => setSeed((s) => s + 1)} />}
      </ClientOnly>
    </>
  );
}

function TermsRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Head>
        <title>Terms of Service — Geodle</title>
        <link rel="canonical" href="https://geodle.me/terms" />
      </Head>
      <TermsContent onBack={() => navigate('/')} />
    </>
  );
}
function PrivacyRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Head>
        <title>Privacy Policy — Geodle</title>
        <link rel="canonical" href="https://geodle.me/privacy" />
      </Head>
      <PrivacyContent onBack={() => navigate('/')} />
    </>
  );
}
function UpdatesRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Head>
        <title>Updates — Geodle</title>
        <link rel="canonical" href="https://geodle.me/updates" />
      </Head>
      <UpdatesContent onBack={() => navigate('/')} />
    </>
  );
}

function NotFoundRoute() {
  const navigate = useNavigate();
  return (
    <>
      <Head>
        <title>404 — Geodle</title>
      </Head>
      <Stack align="center" py="xl" gap="md">
        <Text fz="xl" fw={700}>Page not found</Text>
        <Button onClick={() => navigate('/')}>Go home</Button>
      </Stack>
    </>
  );
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const themeMantine = useMantineTheme();

  const pathname = location.pathname;
  let headerMode: GameMode | null = null;
  if (pathname.startsWith('/daily')) headerMode = 'daily';
  else if (pathname.startsWith('/random')) headerMode = 'random';

  // Key that changes on every navigation so vertical ads refresh via adsbygoogle push.
  const verticalAdRefreshKey = pathname;

  // Stop adsense from messing up app height
  useEffect(() => {
    const wrapper = document.getElementById('App');
    if (!wrapper) return;
    const observer = new MutationObserver(() => {
      if (wrapper.style.height) wrapper.style.height = '';
      if (wrapper.style.minHeight !== '100dvh') wrapper.style.minHeight = '100dvh';
    });
    observer.observe(wrapper, {
      attributes: true,
      attributeFilter: ['style'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      className="App"
      id="App"
      style={{
        minHeight: '100dvh',
        backgroundColor: themeMantine.other.pageBackground,
        backgroundImage: `linear-gradient(${themeMantine.other.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${themeMantine.other.gridLine} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    >
      <Box className="app-layout">
        <Box className="side-ad">
          <AdBanner
            key={`left-${verticalAdRefreshKey}`}
            slot={AD_SLOTS.DESKTOP_LEFT_RAIL}
            responsive={false}
            format="vertical"
            refreshKey={verticalAdRefreshKey}
            style={{ maxWidth: 180, maxHeight: '100dvh' }}
          />
        </Box>

        <Container size="sm" px="md" py="md" style={{ flex: 1, minWidth: 0 }}>
          <Header onLogoClick={() => navigate('/')} mode={headerMode} />
          <Outlet />
        </Container>

        <Box className="side-ad">
          <AdBanner
            key={`right-${verticalAdRefreshKey}`}
            slot={AD_SLOTS.DESKTOP_RIGHT_RAIL}
            responsive={false}
            format="vertical"
            refreshKey={verticalAdRefreshKey}
            style={{ maxWidth: 180, maxHeight: '100dvh' }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function Root() {
  return (
    <MantineProvider theme={theme}>
      <SettingsProvider>
        <Layout />
      </SettingsProvider>
    </MantineProvider>
  );
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'daily', element: <DailyRoute /> },
      { path: 'random', element: <RandomRoute /> },
      { path: 'terms', element: <TermsRoute /> },
      { path: 'privacy', element: <PrivacyRoute /> },
      { path: 'updates', element: <UpdatesRoute /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
];

export default Root;
