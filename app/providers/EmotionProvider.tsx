'use client';
import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import { emotionCache } from '../utils/emotion-cache';
import SplashScreen from "../providers/SplashScreen";

export default function EmotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={emotionCache}>
      <SpScrn>{children}</SpScrn>
    </CacheProvider>
  );
}

const SpScrn = ({ children }: { children: React.ReactNode }) => {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
