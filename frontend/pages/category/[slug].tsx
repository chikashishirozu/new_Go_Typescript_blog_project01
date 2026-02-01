import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  published_at: string;
}

interface Category {
  name: string;
  description: string;
}

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    Promise.all([
      fetch(`${apiUrl}/api/categories/${slug}`).then(r => r.json()),
      fetch(`${apiUrl}/api/posts?category=${slug}`).then(r => r.json())
    ])
      .then(([categoryData, postsData]) => {
        setCategory(categoryData);
        setPosts(postsData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/category" className="text-blue-600 hover:underline">
            ← All Categories
          </Link>
        </div>

        {category && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600">{category.description}</p>
            )}
          </div>
        )}

        {posts.length === 0 ? (
          <p className="text-gray-600">No posts in this category.</p>
        ) : (
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
                  By {post.author_name} | {new Date(post.published_at).toLocaleDateString('ja-JP')}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
