import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { isAuthResolving } from '@/utils/authState';
import { FeaturedActivitiesPage } from './FeaturedActivitiesPage';
import { PublicFeaturedPage } from './PublicFeaturedPage';

export function FeaturedRoute() {
  const { user, loading, authReady } = useAuth();

  if (isAuthResolving(user, loading, authReady)) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        Đang tải...
      </div>
    );
  }

  if (user) {
    return (
      <AppLayout>
        <FeaturedActivitiesPage />
      </AppLayout>
    );
  }

  return <PublicFeaturedPage />;
}
