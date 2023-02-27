// _app.tsx
import {
  Button,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { setCookies } from 'cookies-next';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useState } from 'react';
import { rtlCache } from '../lib/rtl-cache';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const [rtl, setRtl] = useState(false);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  const dir = rtl ? 'rtl' : 'ltr';

  return (
    <div dir={dir}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ dir, colorScheme }}
          withGlobalStyles
          withNormalizeCSS
          emotionCache={rtl ? rtlCache : undefined}
        >
          <SessionProvider>
            <Button onClick={() => setRtl((c) => !c)}>Toggle direction</Button>
            <Component {...pageProps} />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  );
}
