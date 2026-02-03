import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  post_count?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    fetch(`${apiUrl}/api/categories`)
      .then(res => res.json())
      .then(data => {
        console.log('Categories data:', data); // デバッグ用
        // ✅ APIレスポンスが配列かオブジェクトか確認
        const categoriesArray = Array.isArray(data) ? data : 
                               data.categories ? data.categories : 
                               [];
        setCategories(categoriesArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Categories</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="block"
            >
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-600 mb-4">{category.description}</p>
                )}
                {category.post_count !== undefined && (
                  <p className="text-sm text-gray-500">{category.post_count} posts</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
