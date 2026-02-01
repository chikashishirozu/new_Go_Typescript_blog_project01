import '../styles/globals.css';
import Head from 'next/head'
import type { AppProps } from 'next/app';
import { AuthProvider, setupAxiosInterceptors } from '@/contexts/AuthContext';

// Axiosインターセプターを初期化
setupAxiosInterceptors();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <link rel="icon" href="/images/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        {/* 他のメタタグ */}
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}