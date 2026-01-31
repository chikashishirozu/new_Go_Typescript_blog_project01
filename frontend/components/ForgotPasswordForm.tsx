import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(''); // 開発用

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/password/forgot`, {
        email,
      });

      setMessage(response.data.message);
      
      // 開発環境ではリセットURLを表示
      if (response.data.dev_reset_url) {
        setDevResetUrl(response.data.dev_reset_url);
      }
      
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'リクエストの送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            パスワードを忘れた場合
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            登録済みのメールアドレスにパスワードリセット用のリンクを送信します
          </p>
        </div>

        {/* 成功メッセージ */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">{message}</p>
            <p className="text-sm mt-2">
              メールが届かない場合は、迷惑メールフォルダをご確認ください。
            </p>
          </div>
        )}

        {/* 開発用リセットURL */}
        {devResetUrl && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <p className="font-semibold text-sm mb-2">
              🔧 開発環境: リセットURL
            </p>
            <a
              href={devResetUrl}
              className="text-blue-600 hover:text-blue-800 text-xs break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {devResetUrl}
            </a>
            <p className="text-xs mt-2">
              ※ 本番環境ではメールで送信されます
            </p>
          </div>
        )}

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="example@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                送信中...
              </>
            ) : (
              'パスワードリセット用メールを送信'
            )}
          </button>
        </form>

        {/* リンク */}
        <div className="text-center text-sm space-y-2">
          <div>
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              ログインページに戻る
            </Link>
          </div>
          <div>
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              新規登録はこちら
            </Link>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            ⚠️ パスワードリセットの注意点
          </h3>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• リセットリンクの有効期限は1時間です</li>
            <li>• リンクは1回のみ使用可能です</li>
            <li>• メールが届かない場合は迷惑メールフォルダを確認してください</li>
            <li>• 登録されていないメールアドレスには送信されません</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
