import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const router = useRouter();
  const { token } = router.query;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // トークンの有効性確認
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('リセットトークンが指定されていません');
        setVerifying(false);
        return;
      }

      try {
        const response = await axios.get(
          `${apiUrl}/api/password/verify-token?token=${token}`
        );
        
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setError(response.data.error || '無効なトークンです');
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'トークンの検証に失敗しました');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, apiUrl]);

  // パスワード強度チェック
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // バリデーション
    if (formData.newPassword !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('パスワードは8文字以上必要です');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/password/reset`, {
        token,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });

      setMessage(response.data.message);
      
      // 3秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'パスワードリセットに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return '弱い';
    if (passwordStrength <= 3) return '普通';
    return '強い';
  };

  // トークン検証中
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto"
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
          <p className="mt-4 text-gray-600">トークンを確認中...</p>
        </div>
      </div>
    );
  }

  // トークンが無効
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">無効なリンクです</h2>
            <p className="mb-6">{error}</p>
            <Link
              href="/forgot-password"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              新しいリセットリンクを取得
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            新しいパスワードを設定
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            新しいパスワードを入力してください
          </p>
        </div>

        {/* 成功メッセージ */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">{message}</p>
            <p className="text-sm mt-2">
              3秒後にログインページへ移動します...
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
          <div className="space-y-4">
            {/* 新しいパスワード */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                新しいパスワード
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="8文字以上"
              />

              {/* パスワード強度インジケーター */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <ul className="mt-2 text-xs text-gray-500 space-y-1">
                    <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                      ✓ 8文字以上
                    </li>
                    <li
                      className={
                        /[a-z]/.test(formData.newPassword) &&
                        /[A-Z]/.test(formData.newPassword)
                          ? 'text-green-600'
                          : ''
                      }
                    >
                      ✓ 大文字と小文字を含む
                    </li>
                    <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                      ✓ 数字を含む
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* パスワード確認 */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                新しいパスワード（確認）
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="パスワードを再入力"
              />
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">パスワードが一致しません</p>
                )}
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={
              loading ||
              !formData.newPassword ||
              formData.newPassword !== formData.confirmPassword
            }
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
                パスワードをリセット中...
              </>
            ) : (
              'パスワードをリセット'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
