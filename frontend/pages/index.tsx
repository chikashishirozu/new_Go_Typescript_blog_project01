import { useEffect, useState } from 'react';
import Link from 'next/link';
import FeaturedPosts from '../components/FeaturedPosts';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  category_name: string;
  published_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    fetch(`${apiUrl}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
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
        <FeaturedPosts posts={posts} />
      </main>
    </div>
  );
}
