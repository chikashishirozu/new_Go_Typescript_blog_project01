import { useState } from 'react'
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  postCount: number
}

const mockCategories: Category[] = [
  { id: 1, name: 'テクノロジー', slug: 'technology', description: '最新の技術情報', postCount: 45 },
  { id: 2, name: 'プログラミング', slug: 'programming', description: 'プログラミング関連', postCount: 89 },
  { id: 3, name: 'Web開発', slug: 'web-development', description: 'Web開発全般', postCount: 67 },
  { id: 4, name: 'データベース', slug: 'database', description: 'DB関連の情報', postCount: 23 },
  { id: 5, name: 'デザイン', slug: 'design', description: 'UI/UXデザイン', postCount: 34 },
]

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })

  const handleDelete = (id: number) => {
    if (window.confirm('このカテゴリーを削除しますか？')) {
      setCategories(categories.filter(cat => cat.id !== id))
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategory) {
      // 編集モード
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ))
    } else {
      // 新規作成モード
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...formData,
        postCount: 0,
      }
      setCategories([...categories, newCategory])
    }
    
    setIsModalOpen(false)
    setFormData({ name: '', slug: '', description: '' })
    setEditingCategory(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">カテゴリー管理</h1>
          <p className="text-gray-600 mt-1">記事のカテゴリーを管理します</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', slug: '', description: '' })
            setIsModalOpen(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          新規作成
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">URLスラッグ</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                  /category/{category.slug}
                </code>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">記事数</span>
                <span className="font-semibold">{category.postCount}記事</span>
              </div>
              
              <div className="pt-4 border-t">
                <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                  記事を表示 →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingCategory ? 'カテゴリー編集' : '新規カテゴリー作成'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    カテゴリー名 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URLスラッグ *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingCategory ? '更新' : '作成'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
