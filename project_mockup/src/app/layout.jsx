import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'yet-another-react-lightbox/styles.css';
import '../index.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'seato-mockup',
  description: 'Seato mockup using Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <div id="root">
            {children}
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
