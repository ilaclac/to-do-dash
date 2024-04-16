import '@/src/styles/globals.css';
import type { AppProps } from 'next/app';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: {
    template: '%s | Deas Group',
    default: 'Deas Group',
  },
  description: 'Deas Group Business Dashboard',
  metadataBase: new URL('https://deasgroup.com/en'),
};
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
