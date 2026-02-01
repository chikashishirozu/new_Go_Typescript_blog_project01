import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_name: string;
  category_name: string;
  published_at: string;
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    fetch(`${apiUrl}/api/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col space-y-4">
        <div className="text-red-600 text-xl">Post not found</div>
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
        
        <article className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
            <span>By {post.author_name}</span>
            <span>•</span>
            <span>{post.category_name}</span>
            <span>•</span>
            <span>{new Date(post.published_at).toLocaleDateString('ja-JP')}</span>
          </div>

          {post.excerpt && (
            <div className="text-lg text-gray-600 italic mb-6 pb-6 border-b">
              {post.excerpt}
            </div>
          )}

          <div className="prose max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
