import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// クライアントサイドのみで実行するコンポーネント
const FeaturedPosts = dynamic(() => import('../components/FeaturedPosts'), {
  ssr: false,
  loading: () => <div className="text-center">Loading featured posts...</div>,
});

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  category_name: string;
  published_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    const fetchPosts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        console.log('Fetching posts from:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/posts`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        // データ構造の確認
        const postsArray = data.posts || data || [];
        setPosts(Array.isArray(postsArray) ? postsArray : []);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // サーバーサイドレンダリング時の表示
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">Blog App</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Blog App</h1>
          <nav className="mt-4 flex space-x-6">
            <Link href="/blog" className="text-blue-600 hover:underline">
              Blog
            </Link>
            <Link href="/category" className="text-blue-600 hover:underline">
              Categories
            </Link>
            <Link href="/search" className="text-blue-600 hover:underline">
              Search
            </Link>
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
        {isLoading ? (
          <div className="text-center">Loading posts...</div>
        ) : (
          <FeaturedPosts posts={posts} />
        )}
      </main>
    </div>
  );
}