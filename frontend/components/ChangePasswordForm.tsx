import { useState } from 'react';
import axios from 'axios';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
      setError('新しいパスワードが一致しません');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('パスワードは8文字以上必要です');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('現在のパスワードと異なるパスワードを設定してください');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/password/change`, {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });

      setMessage(response.data.message);
      // フォームをリセット
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordStrength(0);
    } catch (err: any) {
      setError(err.response?.data?.error || 'パスワード変更に失敗しました');
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

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">パスワード変更</h2>

      {/* 成功メッセージ */}
      {message && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {/* エラーメッセージ */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 現在のパスワード */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            現在のパスワード
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
              </div>
              <ul className="mt-2 text-xs text-gray-500 space-y-1">
                <li className={formData.newPassword.length >= 8 ? 'text-green-600' : ''}>
                  ✓ 8文字以上
                </li>
                <li
                  className={
                    /[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword)
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
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            新しいパスワード（確認）
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.confirmPassword &&
            formData.newPassword !== formData.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">パスワードが一致しません</p>
            )}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={
            loading ||
            !formData.currentPassword ||
            !formData.newPassword ||
            formData.newPassword !== formData.confirmPassword
          }
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'パスワード変更中...' : 'パスワードを変更'}
        </button>
      </form>

      {/* セキュリティのヒント */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          🔒 パスワード変更時の注意
        </h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 他のサービスと同じパスワードは使わない</li>
          <li>• 定期的にパスワードを変更する</li>
          <li>• 誕生日や名前など推測しやすい文字列は避ける</li>
          <li>• パスワードマネージャーの利用を推奨</li>
        </ul>
      </div>
    </div>
  );
}
