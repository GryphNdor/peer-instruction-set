// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import './globals.css';

import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'], // Specify the weights you need
  subsets: ['latin'], // Specify subsets
});



import { ColorSchemeScript, MantineProvider, AppShell, AppShellMain, AppShellFooter } from '@mantine/core';
import Nav from './components/nav';
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
    <html lang="en" suppressHydrationWarning className={poppins.className}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AppShell
            footer={{ height: "52" }}
          >
            <AppShellMain p="md">
              {children}
            </AppShellMain>
            <AppShellFooter p="sm">
              <Nav />
            </AppShellFooter>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}