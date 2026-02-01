export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BlogApp</h3>
            <p className="text-gray-300">
              モダンな技術スタックで構築されたブログプラットフォーム。
              Next.js 14 + Go + PostgreSQLで実装されています。
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">クイックリンク</h4>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-300 hover:text-white transition">ブログ一覧</a></li>
              <li><a href="/category" className="text-gray-300 hover:text-white transition">カテゴリー</a></li>
              <li><a href="/tags" className="text-gray-300 hover:text-white transition">タグ一覧</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white transition">プライバシーポリシー</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">技術スタック</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">Next.js 14</span>
              <span className="bg-green-600 px-3 py-1 rounded-full text-sm">TypeScript</span>
              <span className="bg-gray-600 px-3 py-1 rounded-full text-sm">Go</span>
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">PostgreSQL</span>
              <span className="bg-pink-600 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} BlogApp. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with ❤️ by hiroppy123</p>
        </div>
      </div>
    </footer>
  )
}