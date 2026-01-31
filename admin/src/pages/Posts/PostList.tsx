import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

interface Post {
  id: number
  title: string
  status: 'published' | 'draft' | 'pending'
  author: string
  category: string
  views: number
  comments: number
  createdAt: string
  updatedAt: string
}

const mockPosts: Post[] = [
  { id: 1, title: 'Next.js 14の新機能解説', status: 'published', author: '管理者', category: 'テクノロジー', views: 1245, comments: 23, createdAt: '2024-01-20', updatedAt: '2024-01-20' },
  { id: 2, title: 'Go言語によるAPI設計', status: 'published', author: '開発者A', category: 'プログラミング', views: 892, comments: 15, createdAt: '2024-01-18', updatedAt: '2024-01-19' },
  { id: 3, title: 'TypeScript型定義のベストプラクティス', status: 'draft', author: '管理者', category: 'TypeScript', views: 0, comments: 0, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: 4, title: 'PostgreSQLパフォーマンスチューニング', status: 'pending', author: '開発者B', category: 'データベース', views: 567, comments: 8, createdAt: '2024-01-12', updatedAt: '2024-01-12' },
  { id: 5, title: 'React 18の新機能', status: 'published', author: '管理者', category: 'React', views: 2345, comments: 45, createdAt: '2024-01-10', updatedAt: '2024-01-11' },
]

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                         post.author.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: number) => {
    if (window.confirm('この記事を削除しますか？')) {
      setPosts(posts.filter(post => post.id !== id))
    }
  }

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">記事管理</h1>
          <p className="text-gray-600 mt-1">記事の作成、編集、削除を行います</p>
        </div>
        <Link
          to="/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          新規作成
        </Link>
      </div>

      {/* フィルターと検索 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="記事タイトルまたは著者で検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべてのステータス</option>
              <option value="published">公開済み</option>
              <option value="draft">下書き</option>
              <option value="pending">承認待ち</option>
            </select>
          </div>
        </div>
      </div>

      {/* 記事テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  閲覧数 / コメント
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">by {post.author}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                      {post.status === 'published' ? '公開中' : 
                       post.status === 'draft' ? '下書き' : '承認待ち'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-sm">{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-1 text-gray-400">💬</div>
                        <span className="text-sm">{post.comments}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/posts/edit/${post.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="編集"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="プレビュー"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="削除"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                全 <span className="font-semibold">{filteredPosts.length}</span> 件中
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
