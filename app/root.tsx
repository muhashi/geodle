import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";
import type { Route } from "./+types/root";
import { MantineProvider, Box, Container, useMantineTheme, Badge, Burger, Button, Center, Group, Menu, Modal, Paper, Stack, Switch, Text, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { IconBrandGithub, IconCoffee, IconHistory, IconMail, IconMoon, IconSettings, IconSun } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import SettingsProvider, { useSettings } from "../src/SettingsProvider";
import theme from "../src/theme";
import TitleLogo from "../src/Title";
import { AdBanner } from "../src/AdSense";
import { dayNumber } from "../src/country";
import "../src/index.css";
import "@mantine/core/styles.css";
import "../src/App.css";
import { useEffect, useState, type ReactNode } from "react";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/logo192.png" },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "stylesheet", href: "https://sdk.playlight.dev/playlight-sdk.css" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="google-adsense-account" content="ca-pub-3330710888188184" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3330710888188184" crossOrigin="anonymous"></script>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NQ39LVPM');`
        }} />
        {/* End Google Tag Manager */}
        {/* Global site tag (gtag.js) - Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-RKEL5SMCTC"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RKEL5SMCTC');
        `}} />
        {/* Playlight */}
        <script type="module" dangerouslySetInnerHTML={{
          __html: `
        try {
          const module = await import("https://sdk.playlight.dev/playlight-sdk.es.js");
          const playlightSDK = module.default;
          await playlightSDK.init({
            button: {
              visible: false,
            },
            exitIntent: {
              enabled: true,
              immediate: false,
            },
          });
          globalThis.playlightSDK = playlightSDK;
        } catch (error) {
          console.error("Error loading the Playlight SDK:", error);
        }
        `}} />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NQ39LVPM"
          height={0} width={0} style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const AD_SLOTS = {
  DESKTOP_LEFT_RAIL: '7158016818',
  DESKTOP_RIGHT_RAIL: '2939570207',
};

const CONTACT_EMAIL = atob('aGVsbG9AZ2VvZGxlLm1l');
const GITHUB_URL = 'https://github.com/muhashi/geodle';

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

function SettingsModal({ opened, setOpened }: { opened: boolean; setOpened: (open: boolean) => void }) {
  const { tempFahrenheit, setTempFahrenheit, areaMiles, setAreaMiles, hideHints, setHideHints } = useSettings();
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Settings" centered>
      <Switch className="settings-switch" checked={tempFahrenheit} label="Show temperatures in Fahrenheit" onChange={(e) => setTempFahrenheit(e.currentTarget.checked)} />
      <Switch className="settings-switch" checked={areaMiles} label="Show surface area in mi²" onChange={(e) => setAreaMiles(e.currentTarget.checked)} mt="md" />
      <Switch className="settings-switch" checked={hideHints} label="Hide population hints" onChange={(e) => setHideHints(e.currentTarget.checked)} mt="md" />
      <Group justify="right" mt="md">
        <Button variant="filled" onClick={() => setOpened(false)}>Close</Button>
      </Group>
    </Modal>
  );
}

function DarkModeMenuItem() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <Menu.Item leftSection={isDark ? <IconSun size={16} /> : <IconMoon size={16} />} onClick={() => setColorScheme(isDark ? 'light' : 'dark')}>
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

function HeaderPill({ mode }: { mode: "daily" | "random" }) {
  const isMobile = useMediaQuery('(max-width: 450px)');
  const isXsMobile = useMediaQuery('(max-width: 400px)');
  const dailyPillText = isXsMobile ? `#${dayNumber}` : `Daily #${dayNumber}`;
  return <Badge size={isMobile ? 'xs' : 'md'}>{mode === 'daily' ? dailyPillText : 'Random'}</Badge>;
}

function Header({ onLogoClick, mode }: { onLogoClick: () => void; mode: "daily" | "random" | null }) {
  const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);
  const [displaySettings, setDisplaySettings] = useState(false);
  const badge = mode && (<HeaderPill mode={mode} />);
  const menu = (
    <Menu opened={menuOpened} onChange={toggleMenu} position="bottom-end" withArrow>
      <Menu.Target>
        <Burger opened={menuOpened} onClick={toggleMenu} size="md" aria-label="Open menu" lineSize={3} />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<IconSettings size={16} />} onClick={() => { closeMenu(); setDisplaySettings(true); }}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconMail size={16} />} component="a" href={`mailto:${CONTACT_EMAIL}`} onClick={closeMenu}>Email</Menu.Item>
        <Menu.Item leftSection={<IconBrandGithub size={16} />} component="a" href={GITHUB_URL} target="_blank" onClick={closeMenu}>GitHub</Menu.Item>
        <Menu.Item leftSection={<IconCoffee size={16} />} component="a" href="https://ko-fi.com/muhashi" target="_blank" onClick={closeMenu}>Donate</Menu.Item>
        <Menu.Item leftSection={<IconHistory size={16} />} component="a" href="https://old.geodle.me" onClick={closeMenu}>Old site</Menu.Item>
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

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const themeMantine = useMantineTheme();
  const pathname = location.pathname;
  // headerMode derived from pathname like before
  let headerMode: "daily" | "random" | null = null;
  if (pathname.startsWith('/daily')) headerMode = 'daily';
  else if (pathname.startsWith('/random')) headerMode = 'random';

  const verticalAdRefreshKey = pathname;

  useEffect(() => {
    const wrapper = document.getElementById('App');
    if (!wrapper) return;
    const observer = new MutationObserver(() => {
      if (wrapper.style.height) wrapper.style.height = '';
      if ((wrapper.style as any).minHeight !== '100dvh') (wrapper.style as any).minHeight = '100dvh';
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
          {/* reuse Header from src/App.tsx */}
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

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <SettingsProvider>
        <AppLayout />
      </SettingsProvider>
    </MantineProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
