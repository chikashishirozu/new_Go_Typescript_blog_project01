// frontend/components/PostCard.tsx
import Link from 'next/link'
import { Post } from '@/lib/api'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {post.image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>{new Date(post.created_at).toLocaleDateString('ja-JP')}</span>
          {post.category && (
            <>
              <span>•</span>
              <Link 
                href={`/category/${post.category.slug}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {post.category.name}
              </Link>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold mb-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-blue-600 transition"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.tags?.slice(0, 3).map(tag => (
              <span 
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <Link 
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            続きを読む →
          </Link>
        </div>
      </div>
    </div>
  )
}