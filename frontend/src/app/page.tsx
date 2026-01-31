import FeaturedPosts from '@/components/FeaturedPosts'
import CategoryList from '@/components/CategoryList'
import { getPosts, getCategories } from '@/lib/api'

export default async function Home() {
  // APIからデータを取得（実際の実装では）
  // const featuredPosts = await getPosts({ featured: true, limit: 3 })
  // const categories = await getCategories()

  // モックデータ（開発用）
  const featuredPosts = [
    { id: 1, title: 'Next.js 14の新機能', excerpt: 'App RouterとServer Componentsの詳細', slug: 'nextjs-14-features', createdAt: '2024-01-15' },
    { id: 2, title: 'Go言語でのAPI開発', excerpt: 'Ginフレームワークを使ったRESTful API', slug: 'go-api-development', createdAt: '2024-01-10' },
    { id: 3, title: 'TypeScriptの型安全', excerpt: '厳格な型チェックでバグを防止', slug: 'typescript-type-safety', createdAt: '2024-01-05' },
  ]

  const categories = [
    { id: 1, name: 'テクノロジー', slug: 'technology', postCount: 12 },
    { id: 2, name: 'プログラミング', slug: 'programming', postCount: 24 },
    { id: 3, name: 'Web開発', slug: 'web-development', postCount: 18 },
    { id: 4, name: 'データベース', slug: 'database', postCount: 8 },
  ]

  return (
    <div>
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            モダンブログプラットフォームへようこそ
          </h1>
          <p className="text-xl mb-6">
            最新の技術スタックで構築された、高速で安全なブログサイトです。
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            記事を読む →
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">注目の記事</h2>
          <FeaturedPosts posts={featuredPosts} />
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">カテゴリー</h2>
          <CategoryList categories={categories} />
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">技術スタック</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Next.js 14 (App Router)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                TypeScript 5.x
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                Go 1.22 (バックエンド)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                PostgreSQL 16
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}