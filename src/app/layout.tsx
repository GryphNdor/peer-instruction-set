// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider, AppShell, AppShellMain, AppShellFooter } from '@mantine/core';
import Nav from './nav';
import app from '../../config'
import firebase from 'firebase/compat/app';

export const metadata = {
  title: 'CookingCrew',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AppShell
            footer={{ height: "45" }}
          >
            <AppShellMain p="md" mb="xl">
              {children}
            </AppShellMain>
            {/*
            <AppShellFooter p="sm">
              <Nav />
            </AppShellFooter>
            */}
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
