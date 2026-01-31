import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    requireAdmin?: boolean;
  }
) {
  return function ProtectedRoute(props: P) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        // 未認証の場合はログインページへ
        if (!isAuthenticated) {
          router.push(options?.redirectTo || '/login');
          return;
        }

        // 管理者権限が必要な場合
        if (options?.requireAdmin && !user?.is_admin) {
          router.push('/403'); // Forbidden
          return;
        }
      }
    }, [loading, isAuthenticated, user, router]);

    // ローディング中
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      );
    }

    // 認証済みの場合はコンポーネントを表示
    if (isAuthenticated) {
      return <Component {...props} />;
    }

    // それ以外は何も表示しない（リダイレクト処理中）
    return null;
  };
}

// 使用例:
// export default withAuth(DashboardPage);
// export default withAuth(AdminPage, { requireAdmin: true });
