import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AuthProvider, setupAxiosInterceptors } from '@/contexts/AuthContext';

// Axiosインターセプターを初期化
setupAxiosInterceptors();

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // クライアントサイドマウント前はシンプル表示
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Blog App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}