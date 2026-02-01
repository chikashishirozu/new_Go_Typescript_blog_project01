import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  category_name: string;
}

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (q && typeof q === 'string') {
      setSearchQuery(q);
      performSearch(q);
    }
  }, [q]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/posts?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setPosts(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Search Posts</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map(post => (
              <article key={post.id} className="bg-white p-6 rounded-lg shadow">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="text-sm text-gray-500">
                  {post.author_name} | {post.category_name}
                </div>
              </article>
            ))}
          </div>
        ) : q ? (
          <p className="text-gray-600">No results found for "{q}"</p>
        ) : null}
      </div>
    </div>
  );
}
