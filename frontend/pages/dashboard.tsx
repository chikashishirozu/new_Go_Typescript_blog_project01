import { withAuth } from '@/hoc/withAuth';
import { useAuth } from '@/contexts/AuthContext';
import Head from 'next/head';
import Link from 'next/link';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <>
      <Head>
        <title>ダッシュボード | ブログアプリ</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* ヘッダー */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                こんにちは、<strong>{user?.username}</strong>さん
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ユーザー情報カード */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">ユーザー情報</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>メール:</strong> {user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>ユーザー名:</strong> {user?.username}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>権限:</strong> {user?.is_admin ? '管理者' : '一般ユーザー'}
                </p>
              </div>
              <Link
                href="/profile"
                className="mt-4 block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                プロフィール編集
              </Link>
            </div>

            {/* 記事管理カード */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">記事管理</h2>
              <div className="space-y-3">
                <Link
                  href="/posts/new"
                  className="block text-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  新規記事作成
                </Link>
                <Link
                  href="/posts/my"
                  className="block text-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  自分の記事一覧
                </Link>
              </div>
            </div>

            {/* 統計情報カード */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">統計情報</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">投稿数:</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">閲覧数:</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">いいね:</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* 管理者専用セクション */}
          {user?.is_admin && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-yellow-800">
                管理者メニュー
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/users"
                  className="block text-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  ユーザー管理
                </Link>
                <Link
                  href="/admin/posts"
                  className="block text-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  記事管理
                </Link>
                <Link
                  href="/admin/settings"
                  className="block text-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  サイト設定
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// 認証が必要なページとして保護
export default withAuth(DashboardPage);
