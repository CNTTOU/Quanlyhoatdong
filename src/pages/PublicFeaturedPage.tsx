import { LogIn } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { paths } from '@/routes/paths';
import { getLoginUrl } from '@/utils/externalApps';
import { isAuthResolving } from '@/utils/authState';
import { FeaturedActivitiesPage } from './FeaturedActivitiesPage';

export function PublicFeaturedPage() {
  const { user, loading, authReady } = useAuth();
  const loginUrl = getLoginUrl(undefined, '/hoat-dong/dashboard');

  if (isAuthResolving(user, loading, authReady)) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        Đang tải...
      </div>
    );
  }

  if (user) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return (
    <div className="relative">
      <div className="fixed right-5 top-5 z-50">
        <a
          href={loginUrl}
          className="inline-flex items-center gap-2 rounded-lg bg-white/95 px-4 py-2.5 text-sm font-medium text-blue-800 shadow-lg ring-1 ring-blue-100 transition-colors hover:bg-blue-50"
        >
          <LogIn className="h-4 w-4" />
          Đăng nhập
        </a>
      </div>
      <FeaturedActivitiesPage />
    </div>
  );
}
