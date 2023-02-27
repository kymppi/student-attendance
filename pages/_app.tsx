import { authOptions } from '@/lib/auth-options';
import { rtlCache } from '@/lib/rtl-cache';
import {
  Button,
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { setCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { Session, getServerSession } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { useState } from 'react';

export default function App(
  props: AppProps & { colorScheme: ColorScheme; session: Session | null }
) {
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
          <SessionProvider session={props.session}>
            <Button onClick={() => setRtl((c) => !c)}>Toggle direction</Button>
            <Component {...pageProps} />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(req, res, authOptions),
    },
  };
}
