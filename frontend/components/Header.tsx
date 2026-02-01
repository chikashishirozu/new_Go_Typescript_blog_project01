'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            {/* ロゴとしてfavicon.pngを使用 */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/favicon.png"
                alt="BlogApp Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">            
              BlogApp
            </Link>
            <span className="text-sm text-gray-500 hidden md:inline">| モダンブログプラットフォーム</span>
          </div>

          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              ホーム
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition">
              ブログ一覧
            </Link>
            <Link href="/category" className="text-gray-700 hover:text-blue-600 transition">
              カテゴリー
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
              このサイトについて
            </Link>
          </nav>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              🔍
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
