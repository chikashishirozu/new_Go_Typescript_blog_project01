import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  author_name: string
  category_name: string
  published_at: string
  featured_image?: string
}

export default function PostDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
        const response = await fetch(`${apiUrl}/api/posts/${slug}`)

        if (!response.ok) {
          throw new Error('記事が見つかりません')
        }

        const data = await response.json()
        setPost(data.post || data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">読み込み中...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-4">{error || '記事が見つかりません'}</p>
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← 記事一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
            ← 記事一覧に戻る
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <article className="bg-white shadow rounded-lg overflow-hidden">
          {post.featured_image && (
            <div className="w-full h-96 bg-gray-200">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author_name}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {post.category_name}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.published_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {post.excerpt && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-gray-700 italic">{post.excerpt}</p>
              </div>
            )}

            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  記事ID: {post.id} | スラッグ: {post.slug}
                </div>
                <div className="space-x-4">
                  <button className="text-blue-600 hover:underline text-sm">
                    共有
                  </button>
                  <button className="text-blue-600 hover:underline text-sm">
                    ブックマーク
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-blue-600 hover:underline"
          >
            ← 記事一覧に戻る
          </Link>
        </div>
      </main>
    </div>
  )
}
