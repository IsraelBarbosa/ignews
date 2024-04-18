import type { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { SessionProvider } from 'next-auth/react';

import '../styles/global.scss';
import { repositoryName } from '@/services/prismicio';
import { PrismicPreview } from '@prismicio/next';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
      <PrismicPreview repositoryName={repositoryName} />
    </SessionProvider>
  );
}
