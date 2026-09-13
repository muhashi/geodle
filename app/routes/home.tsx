import { Box, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AdBanner } from "../../src/AdSense";
import { correctCountry, dayNumber } from "../../src/country";
import { Footer as FooterView } from "../../src/Footer";
import { MoreGamesButton } from "../components/GamePage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Geodle - Geography Wordle" },
    { name: "description", content: "Guess the mystery country of the day based on demographics such as population, temperature, and religion. New country daily!" },
    { tagName: "link", rel: "canonical", href: "https://geodle.me/" },
  ];
}

const AD_SLOTS = {
  HOME_BANNER: '4988621227',
};

type DailyStatus = 'new' | 'in-progress' | 'done';

function getDailyStatus(): DailyStatus {
  if (typeof document === 'undefined') return 'new';
  try {
    const lastAttempt = Cookies.get('lastAttempt');
    const lastAttemptData = Cookies.get('lastAttemptData');
    if (!lastAttempt || Number(lastAttempt) !== dayNumber || !lastAttemptData) {
      return 'new';
    }
    const data: any[] = JSON.parse(lastAttemptData);
    const won = data.some((d) => d.country.toLowerCase() === correctCountry.toLowerCase());
    const lost = !won && data.length >= 7;
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
        width: '100%',
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
    <Box style={{ flex: 1, minWidth: 150 }} component={Link} to="/daily" prefetch="intent" td="none">
      <HomeActionCard
        title={status === 'in-progress' ? 'Resume Daily' : 'Daily'}
        subtitle={status === 'in-progress' ? 'Continue where you left off!' : 'New country daily!'}
        onClick={onClick}
        emphasized
      />
    </Box>
  );
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <Stack align="center" justify="space-between" mih="70vh" py="xl">
      <Stack align="center" gap="lg" mt="6vh" style={{ maxWidth: 480 }}>
        <Text ta="center" c="dimmed">
          Guess the mystery country of the day based on demographics such as population, temperature, and religion.
        </Text>

        <Group mt="md" w="100%" wrap="nowrap">
          <DailyHomeCard onClick={() => navigate('/daily')} />
          <Box style={{ flex: 1, minWidth: 150 }} component={Link} to="/random" prefetch="intent" td="none">
            <HomeActionCard title="Quick Play" subtitle="Unlimited practice!" onClick={() => navigate('/random')} />
          </Box>
        </Group>
      </Stack>

      <Box className="horizontal-ad-slot">
        <AdBanner format="horizontal" responsive={false} slot={AD_SLOTS.HOME_BANNER} style={{ maxWidth: '100dvw', width: '100%', maxHeight: '120px' }} />
      </Box>

      <Stack align="center" gap="md">
        <MoreGamesButton />
        <FooterView onTerms={() => navigate('/terms')} onPrivacy={() => navigate('/privacy')} onUpdates={() => navigate('/updates')} />
      </Stack>
    </Stack>
  );
}
