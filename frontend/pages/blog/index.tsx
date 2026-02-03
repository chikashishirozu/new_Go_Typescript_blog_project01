import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  category_name: string;
  published_at: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    console.log('BlogList API URL:', apiUrl);
    
    fetch(`${apiUrl}/api/posts`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Raw API response:', data);
        
        // ✅ データ構造の確認と修正
        let postsArray: Post[] = [];
        
        if (Array.isArray(data)) {
          // ケース1: dataが配列の場合
          postsArray = data;
        } else if (data && Array.isArray(data.posts)) {
          // ケース2: data.postsが配列の場合
          postsArray = data.posts;
        } else if (data && data.posts && typeof data.posts === 'object') {
          // ケース3: data.postsがオブジェクトの場合（キーがID）
          postsArray = Object.values(data.posts);
        }
        
        console.log('Processed posts:', postsArray);
        setPosts(postsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Home
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        
        {!Array.isArray(posts) || posts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          <div className="grid gap-6">
            {posts.map(post => (
              <article key={post.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4">{post.excerpt || 'No excerpt available.'}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>By {post.author_name || 'Unknown'}</span>
                  <span>•</span>
                  <span>{post.category_name || 'Uncategorized'}</span>
                  <span>•</span>
                  <span>{new Date(post.published_at).toLocaleDateString('ja-JP')}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}