import { useEffect, useState } from 'react';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { ActivityChart } from '@/components/ActivityChart';
import { CategoryChart } from '@/components/CategoryChart';
import { FeaturedActivities } from '@/components/FeaturedActivities';
import { RecentActivities } from '@/components/RecentActivities';
import { StatCard } from '@/components/StatCard';
import { YearFilter } from '@/components/YearFilter';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardData } from '@/services/dashboardService';
import { getCachedSchoolYearsBasic } from '@/services/schoolYearService';

interface YearStats {
  totalActivities: number;
  monthlyActivities: number;
  participants: number;
  evidence: number;
  pending: number;
  monthlyChange: string;
}

const emptyStats: YearStats = {
  totalActivities: 0,
  monthlyActivities: 0,
  participants: 0,
  evidence: 0,
  pending: 0,
  monthlyChange: '0%',
};

export function DashboardPage() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [stats, setStats] = useState<YearStats>(emptyStats);
  const [monthlyActivities, setMonthlyActivities] = useState<Array<{ id: string; month: string; activities: number }>>([]);
  const [categoryStats, setCategoryStats] = useState<Array<{ id: string; name: string; value: number; color: string }>>([]);
  const [recentActivities, setRecentActivities] = useState<Array<{ id: string; name: string; unit: string; time: string; status: string; statusText: string }>>([]);
  const [yearOptions, setYearOptions] = useState<Array<{ value: number; label: string }>>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getCachedSchoolYearsBasic()
      .then((years) => {
        const options = years.map((year) => ({
          value: Number(year.ten_nam_hoc.split('-')[0]) || Number(year.ma_nam_hoc.split('_')[0]),
          label: year.ten_nam_hoc,
        }));
        setYearOptions(options);
        const currentYear = years.find((year) => year.la_nam_hoc_hien_tai) ?? years[0];
        if (currentYear) setSelectedYear(Number(currentYear.ten_nam_hoc.split('-')[0]) || Number(currentYear.ma_nam_hoc.split('_')[0]));
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách năm học.'));
  }, []);

  useEffect(() => {
    if (!user) return;
    getDashboardData(user, selectedYear)
      .then((data) => {
        setStats(data.stats);
        setMonthlyActivities(data.monthlyActivities);
        setCategoryStats(data.categoryStats);
        setRecentActivities(data.recentActivities);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu dashboard.'));
  }, [selectedYear, user]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Tổng quan</h2>
          <p className="text-sm text-gray-500">Chào mừng trở lại! Đây là tổng quan hoạt động năm {selectedYear}.</p>
        </div>
        <YearFilter selectedYear={selectedYear} onYearChange={setSelectedYear} years={yearOptions} />
      </div>

      {message && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

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
          <ActivityChart year={selectedYear} data={monthlyActivities} />
        </div>
        <div>
          <CategoryChart year={selectedYear} data={categoryStats} />
        </div>
      </div>

      <div className="mb-6">
        <RecentActivities year={selectedYear} activities={recentActivities} />
      </div>

      <div>
        <FeaturedActivities year={selectedYear} />
      </div>
    </div>
  );
}
