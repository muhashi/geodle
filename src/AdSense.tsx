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
  refreshKey?: string | number;
};

export function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  style,
  refreshKey,
}: AdBannerProps) {
  const isVertical = format === 'vertical';

  useEffect(() => {
    if (import.meta.env.DEV) return;
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [slot, refreshKey]);

  if (import.meta.env.DEV) {
    return (
      <Box
        my={isVertical ? 0 : 'md'}
        p="md"
        style={{
          minHeight: isVertical ? 600 : 90,
          width: isVertical ? 160 : undefined,
          maxWidth: isVertical ? 160 : undefined,
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
        <Text size="xs" c="dimmed" style={{ wordBreak: 'break-word' }}>
          AdSense placeholder — slot {slot} ({format})
        </Text>
      </Box>
    );
  }

  return (
    <Box
      my={isVertical ? 0 : 'md'}
      style={{
        minHeight: isVertical ? 600 : 90,
        width: isVertical ? 160 : undefined,
        overflow: 'hidden',
        textAlign: 'center',
        ...style,
      }}
    >
      <ins
        key={refreshKey != null ? String(refreshKey) : slot}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(isVertical ? { width: '160px', height: '600px' } : {}),
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </Box>
  );
}
