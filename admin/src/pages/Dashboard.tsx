import StatCard from '@/components/common/StatCard'
import RecentPosts from '@/components/dashboard/RecentPosts'
import ActivityChart from '@/components/dashboard/ActivityChart'
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const stats = [
    { title: '総記事数', value: '156', change: '+12%', icon: DocumentTextIcon, color: 'blue' },
    { title: '総コメント', value: '2,345', change: '+8%', icon: ChatBubbleLeftRightIcon, color: 'green' },
    { title: '登録ユーザー', value: '89', change: '+5%', icon: UserGroupIcon, color: 'purple' },
    { title: '月間PV', value: '45.2K', change: '+23%', icon: ChartBarIcon, color: 'orange' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">サイトの統計情報と最近のアクティビティ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div>
          <RecentPosts />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">クイックアクション</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
            📝 新規記事作成
          </button>
          <button className="bg-green-50 text-green-700 px-4 py-3 rounded-lg hover:bg-green-100 transition text-sm font-medium">
            🏷️ カテゴリー追加
          </button>
          <button className="bg-purple-50 text-purple-700 px-4 py-3 rounded-lg hover:bg-purple-100 transition text-sm font-medium">
            👥 ユーザー招待
          </button>
          <button className="bg-orange-50 text-orange-700 px-4 py-3 rounded-lg hover:bg-orange-100 transition text-sm font-medium">
            📊 レポート出力
          </button>
        </div>
      </div>
    </div>
  )
}
