import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import CommentSection from '@/components/CommentSection'
import { getPost } from '@/lib/api'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // APIからデータを取得（実際の実装では）
  // const post = await getPost(params.slug)
  
  // モックデータ
  const post = {
    id: 1,
    title: 'Next.js 14 App Router完全ガイド',
    content: `
      <h2>はじめに</h2>
      <p>Next.js 14では、App Routerがデフォルトになりました。この新しいルーティングシステムは、より直感的で強力な機能を提供します。</p>
      
      <h2>App Routerの特徴</h2>
      <ul>
        <li>レイアウトとネストされたルーティング</li>
        <li>Server Componentsによるパフォーマンス最適化</li>
        <li>Loading、Error、Not Found UIの統合</li>
        <li>React Suspenseとの連携</li>
      </ul>
      
      <h2>実装例</h2>
      <pre><code>// app/page.tsx
export default function Home() {
  return (
    &lt;main&gt;
      &lt;h1&gt;Hello Next.js 14!&lt;/h1&gt;
    &lt;/main&gt;
  )
}</code></pre>
      
      <h2>まとめ</h2>
      <p>App Routerは、Next.jsアプリケーションの開発をより簡単かつ効率的にします。</p>
    `,
    excerpt: 'App Routerの基本から応用まで',
    slug: params.slug,
    category: { id: 1, name: 'Next.js', slug: 'nextjs' },
    tags: [
      { id: 1, name: 'React', slug: 'react' },
      { id: 2, name: 'TypeScript', slug: 'typescript' },
      { id: 3, name: 'フロントエンド', slug: 'frontend' },
    ],
    author: {
      id: 1,
      name: 'hiroppy123',
      email: 'hiroppy123@example.com',
    },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    readTime: '5分',
    featured: true,
  }

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="mb-4">
          <Link 
            href={`/category/${post.category.slug}`}
            className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition"
          >
            {post.category.name}
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">📅 {new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
          <span className="mr-4">⏱️ {post.readTime}</span>
          <span className="mr-4">👤 {post.author.name}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </header>

      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <div className="border-t pt-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">コメント ({post.id * 3})</h2>
        <CommentSection postId={post.id} />
      </div>
    </article>
  )
}
