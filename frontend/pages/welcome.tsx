import Link from 'next/link'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-lg shadow-2xl p-12 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              ブログアプリへようこそ！
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Go + TypeScript で構築された、モダンなブログプラットフォームです
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">記事を読む</h3>
                <p className="text-gray-600 text-sm">
                  様々なカテゴリの記事を探索できます
                </p>
              </div>

              <div className="p-6 bg-green-50 rounded-lg">
                <div className="text-4xl mb-4">✍️</div>
                <h3 className="text-lg font-semibold mb-2">記事を書く</h3>
                <p className="text-gray-600 text-sm">
                  あなたの考えを世界と共有しましょう
                </p>
              </div>

              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">記事を検索</h3>
                <p className="text-gray-600 text-sm">
                  興味のあるトピックを見つけられます
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blog"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  記事一覧を見る
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  新規登録
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                  ログイン
                </Link>
              </div>

              <div className="pt-6">
                <Link
                  href="/"
                  className="text-blue-600 hover:underline"
                >
                  ← ホームに戻る
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-white">
            <p className="text-sm opacity-90">
              Powered by Go + Next.js + PostgreSQL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
