#!/bin/bash
# frontend を Pages Router に統一するスクリプト

cd ~/new_Go_Typescript_blog_project02/new_Go_Typescript_blog_project02/frontend

echo "=== Frontend を Pages Router に統一します ==="

# 1. src/app をバックアップ
echo "1. src/app をバックアップ中..."
if [ -d "src/app" ]; then
    mv src/app src/app.backup
    echo "✓ src/app を src/app.backup に移動しました"
fi

# 2. pages/index.tsx を作成（トップページ）
echo "2. トップページを作成中..."
cat > pages/index.tsx << 'EOF'
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/posts`)
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Blog App</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <FeaturedPosts posts={posts} />
      </main>
    </div>
  );
}
EOF
echo "✓ pages/index.tsx を作成しました"

# 3. pages/blog/index.tsx を作成
echo "3. ブログ一覧ページを作成中..."
mkdir -p pages/blog
cat > pages/blog/index.tsx << 'EOF'
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

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        <div className="grid gap-6">
          {posts.map(post => (
            <article key={post.id} className="bg-white p-6 rounded-lg shadow">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="text-sm text-gray-500">
                By {post.author_name} | {post.category_name} | 
                {new Date(post.published_at).toLocaleDateString()}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF
echo "✓ pages/blog/index.tsx を作成しました"

# 4. pages/blog/[slug].tsx を作成
echo "4. ブログ詳細ページを作成中..."
cat > pages/blog/[slug].tsx << 'EOF'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_name: string;
  category_name: string;
  published_at: string;
}

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        <article className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-6">
            By {post.author_name} | {post.category_name} | 
            {new Date(post.published_at).toLocaleDateString()}
          </div>
          <div className="prose max-w-none">
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
EOF
echo "✓ pages/blog/[slug].tsx を作成しました"

# 5. next.config.js から swcMinify を削除
echo "5. next.config.js を修正中..."
if [ -f "next.config.js" ]; then
    sed -i 's/swcMinify: true,//g' next.config.js
    sed -i 's/swcMinify: true//g' next.config.js
    echo "✓ next.config.js を修正しました"
fi

echo ""
echo "=== 完了 ==="
echo "次のコマンドを実行してください："
echo "docker-compose restart frontend"
echo "docker-compose logs -f frontend"
