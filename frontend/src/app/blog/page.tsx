import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'
import { getPosts } from '@/lib/api'

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    tag?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const category = searchParams.category
  const tag = searchParams.tag

  // APIからデータを取得（実際の実装では）
  // const { posts, totalPages } = await getPosts({ 
  //   page: currentPage, 
  //   category, 
  //   tag,
  //   limit: 10 
  // })

  // モックデータ
  const posts = [
    { id: 1, title: 'Next.js 14 App Router完全ガイド', excerpt: 'App Routerの基本から応用まで', slug: 'nextjs-14-app-router', category: { name: 'Next.js', slug: 'nextjs' }, tags: [{ name: 'React' }, { name: 'TypeScript' }], createdAt: '2024-01-20', readTime: '5分' },
    { id: 2, title: 'Go言語で高速APIサーバー構築', excerpt: 'GinフレームワークとGORMを使った実践的開発', slug: 'go-api-server', category: { name: 'Go', slug: 'go' }, tags: [{ name: 'API' }, { name: 'バックエンド' }], createdAt: '2024-01-18', readTime: '8分' },
    { id: 3, title: 'TypeScriptの型定義パターン集', excerpt: '実務で役立つ型定義のテクニック', slug: 'typescript-type-patterns', category: { name: 'TypeScript', slug: 'typescript' }, tags: [{ name: '型安全' }, { name: 'JavaScript' }], createdAt: '2024-01-15', readTime: '6分' },
    { id: 4, title: 'Tailwind CSS活用術', excerpt: '効率的なスタイリングのコツ', slug: 'tailwind-css-tips', category: { name: 'CSS', slug: 'css' }, tags: [{ name: 'デザイン' }, { name: 'UI' }], createdAt: '2024-01-12', readTime: '4分' },
    { id: 5, title: 'PostgreSQLパフォーマンスチューニング', excerpt: '大規模データベースの最適化手法', slug: 'postgresql-performance', category: { name: 'データベース', slug: 'database' }, tags: [{ name: 'SQL' }, { name: '最適化' }], createdAt: '2024-01-10', readTime: '10分' },
  ]

  const totalPages = 5

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ブログ記事一覧</h1>
        <p className="text-gray-600">
          最新の技術記事やチュートリアルを掲載しています。{posts.length}件の記事があります。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
