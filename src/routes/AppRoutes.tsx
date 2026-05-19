import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { paths } from './paths';

const ActivityDetailPage = lazy(() =>
  import('@/pages/ActivityDetailPage').then((module) => ({ default: module.ActivityDetailPage })),
);
const ActivityListPage = lazy(() =>
  import('@/pages/ActivityListPage').then((module) => ({ default: module.ActivityListPage })),
);
const AddActivityPage = lazy(() =>
  import('@/pages/AddActivityPage').then((module) => ({ default: module.AddActivityPage })),
);
const ApprovalPage = lazy(() =>
  import('@/pages/ApprovalPage').then((module) => ({ default: module.ApprovalPage })),
);
const ArchivePage = lazy(() =>
  import('@/pages/ArchivePage').then((module) => ({ default: module.ArchivePage })),
);
const CalendarPage = lazy(() =>
  import('@/pages/CalendarPage').then((module) => ({ default: module.CalendarPage })),
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const EvidenceLibraryPage = lazy(() =>
  import('@/pages/EvidenceLibraryPage').then((module) => ({ default: module.EvidenceLibraryPage })),
);
const FeaturedRoute = lazy(() =>
  import('@/pages/FeaturedRoute').then((module) => ({ default: module.FeaturedRoute })),
);
const ReportBuilderPage = lazy(() =>
  import('@/pages/ReportBuilderPage').then((module) => ({ default: module.ReportBuilderPage })),
);
const ReportPage = lazy(() =>
  import('@/pages/ReportPage').then((module) => ({ default: module.ReportPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const UnitsPage = lazy(() =>
  import('@/pages/UnitsPage').then((module) => ({ default: module.UnitsPage })),
);

function PageLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-gray-50 text-gray-600">
      Đang tải...
    </div>
  );
}

function ActivityListRoute() {
  const navigate = useNavigate();

  return (
    <ActivityListPage
      onViewDetail={(id) => navigate(`/activities/${id}`)}
      onCreate={() => navigate(paths.activityNew)}
    />
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<FeaturedRoute />} />
        <Route path={paths.featured} element={<FeaturedRoute />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={paths.dashboard} element={<DashboardPage />} />
          <Route path={paths.activities} element={<ProtectedRoute requiredPermissions={['xem_hoat_dong']}><ActivityListRoute /></ProtectedRoute>} />
          <Route path={paths.activityNew} element={<ProtectedRoute requiredPermissions={['them_hoat_dong']}><AddActivityPage /></ProtectedRoute>} />
          <Route path={paths.activityDetail} element={<ProtectedRoute requiredPermissions={['xem_hoat_dong']}><ActivityDetailPage /></ProtectedRoute>} />
          <Route path={paths.evidences} element={<ProtectedRoute requiredPermissions={['quan_ly_minh_chung']}><EvidenceLibraryPage /></ProtectedRoute>} />
          <Route path={paths.approval} element={<ProtectedRoute requiredPermissions={['duyet_hoat_dong']}><ApprovalPage /></ProtectedRoute>} />
          <Route path={paths.reports} element={<ProtectedRoute anyPermissions={['xem_bao_cao', 'tao_bao_cao']}><ReportPage /></ProtectedRoute>} />
          <Route path={paths.reportBuilder} element={<ProtectedRoute requiredPermissions={['tao_bao_cao']}><ReportBuilderPage /></ProtectedRoute>} />
          <Route path={paths.units} element={<ProtectedRoute requiredPermissions={['quan_ly_don_vi']}><UnitsPage /></ProtectedRoute>} />
          <Route path={paths.settings} element={<ProtectedRoute requiredPermissions={['cai_dat_he_thong']}><SettingsPage /></ProtectedRoute>} />
          <Route path={paths.archive} element={<ProtectedRoute anyPermissions={['tao_goi_luu_tru', 'xoa_du_lieu_nam_hoc']}><ArchivePage /></ProtectedRoute>} />
          <Route path={paths.calendar} element={<ProtectedRoute requiredPermissions={['xem_hoat_dong']}><CalendarPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to={paths.featured} replace />} />
      </Routes>
    </Suspense>
  );
}
