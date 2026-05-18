import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { ActivityChart } from './components/ActivityChart';
import { CategoryChart } from './components/CategoryChart';
import { RecentActivities } from './components/RecentActivities';
import { FeaturedActivities } from './components/FeaturedActivities';
import { YearFilter } from './components/YearFilter';
import { ActivityListPage } from './components/ActivityListPage';
import { AddActivityPage } from './components/AddActivityPage';
import { ActivityDetailPage } from './components/ActivityDetailPage';
import { EvidenceLibraryPage } from './components/EvidenceLibraryPage';
import { ApprovalPage } from './components/ApprovalPage';
import { ReportPage } from './components/ReportPage';
import { UnitsPage } from './components/UnitsPage';
import { CalendarPage } from './components/CalendarPage';
import { FeaturedActivitiesPage } from './components/FeaturedActivitiesPage';
import { ReportBuilderPage } from './components/ReportBuilderPage';
import { SettingsPage } from './components/SettingsPage';
import { UsersPage } from './components/UsersPage';
import { ArchivePage } from './components/ArchivePage';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { getStatsForYear } from './utils/yearData';

export default function App() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [currentPage, setCurrentPage] = useState('featured');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderDashboard = () => {
    const stats = getStatsForYear(selectedYear);

    return (
      <div className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">Tổng quan</h2>
            <p className="text-sm text-gray-500">Chào mừng trở lại! Đây là tổng quan hoạt động năm {selectedYear}.</p>
          </div>
          <YearFilter selectedYear={selectedYear} onYearChange={setSelectedYear} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={Calendar}
            title="Tổng số hoạt động"
            value={stats.totalActivities}
            subtitle={`Năm ${selectedYear}`}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatCard
            icon={FileText}
            title="Hoạt động trong tháng"
            value={stats.monthlyActivities}
            subtitle={`${stats.monthlyChange} so với tháng trước`}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-100"
          />
          <StatCard
            icon={Users}
            title="Lượt tham gia"
            value={stats.participants.toLocaleString()}
            subtitle="Sinh viên tham gia"
            iconColor="text-indigo-600"
            iconBg="bg-indigo-100"
          />
          <StatCard
            icon={FileText}
            title="Minh chứng"
            value={stats.evidence.toLocaleString()}
            subtitle="Đã lưu trữ"
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <StatCard
            icon={Clock}
            title="Chờ duyệt"
            value={stats.pending}
            subtitle="Cần xem xét"
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ActivityChart year={selectedYear} />
          </div>
          <div>
            <CategoryChart year={selectedYear} />
          </div>
        </div>

        <div className="mb-6">
          <RecentActivities year={selectedYear} />
        </div>

        <div>
          <FeaturedActivities year={selectedYear} />
        </div>
      </div>
    );
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'featured' && isLoggedIn && <Sidebar activePage={currentPage} onPageChange={setCurrentPage} />}
      {currentPage !== 'featured' && isLoggedIn && <Header />}

      <main className={currentPage !== 'featured' && isLoggedIn ? 'ml-64 pt-16' : ''}>
        {currentPage === 'dashboard' && renderDashboard()}

        {currentPage === 'activities' && (
          <ActivityListPage onViewDetail={(id) => setCurrentPage('detail')} />
        )}

        {currentPage === 'add' && <AddActivityPage />}

        {currentPage === 'detail' && <ActivityDetailPage />}

        {currentPage === 'evidence' && <EvidenceLibraryPage />}

        {currentPage === 'approval' && <ApprovalPage />}

        {currentPage === 'reports' && <ReportPage />}

        {currentPage === 'units' && <UnitsPage />}

        {currentPage === 'calendar' && <CalendarPage />}

        {currentPage === 'featured' && <FeaturedActivitiesPage onLoginSuccess={handleLoginSuccess} />}

        {currentPage === 'report-builder' && <ReportBuilderPage />}

        {currentPage === 'users' && <UsersPage />}

        {currentPage === 'archive' && <ArchivePage />}

        {currentPage === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}