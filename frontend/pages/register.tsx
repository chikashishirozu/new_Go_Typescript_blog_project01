import RegisterForm from '@/components/RegisterForm';
import Head from 'next/head';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>新規登録 | ブログアプリ</title>
        <meta name="description" content="ブログアプリに新規登録" />
      </Head>
      <RegisterForm />
    </>
  );
}
