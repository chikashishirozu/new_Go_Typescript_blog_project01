import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  DocumentTextIcon,
  TagIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: HomeIcon },
  { name: '記事管理', href: '/posts', icon: DocumentTextIcon },
  { name: 'カテゴリー', href: '/categories', icon: TagIcon },
  { name: 'タグ', href: '/tags', icon: TagIcon },
  { name: 'ユーザー', href: '/users', icon: UserGroupIcon },
  { name: '設定', href: '/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 mt-6">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-2">統計</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">記事数</span>
            <span className="font-semibold">156</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">コメント</span>
            <span className="font-semibold">2,345</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ユーザー</span>
            <span className="font-semibold">89</span>
          </div>
        </div>
      </div>
    </aside>
  )
}