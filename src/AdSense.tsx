import { useEffect } from 'react';
import { Box, Text } from '@mantine/core';

const AD_CLIENT = 'ca-pub-3330710888188184';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdBannerProps = {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
};

export function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  style,
}: AdBannerProps) {
  useEffect(() => {
    if (import.meta.env.DEV) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [slot]);

  if (import.meta.env.DEV) {
    return (
      <Box
        my="md"
        p="md"
        style={{
          minHeight: 90,
          border: '1px dashed var(--mantine-color-gray-4)',
          borderRadius: 'var(--mantine-radius-md)',
          backgroundColor: 'var(--mantine-color-gray-0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          ...style,
        }}
      >
        <Text size="xs" c="dimmed">
          AdSense placeholder — slot {slot} ({format})
        </Text>
      </Box>
    );
  }

  return (
    <Box
      my="md"
      style={{
        minHeight: 90,
        overflow: 'hidden',
        textAlign: 'center',
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </Box>
  );
}
