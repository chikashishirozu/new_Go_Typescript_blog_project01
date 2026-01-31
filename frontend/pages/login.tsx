import LoginForm from '@/components/LoginForm';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>ログイン | ブログアプリ</title>
        <meta name="description" content="ブログアプリにログイン" />
      </Head>
      <LoginForm />
    </>
  );
}
