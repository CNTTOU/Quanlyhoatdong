import { Calendar, Users, FileCheck, Building2, GitBranch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReportFilters } from '@/components/ReportFilters';
import { ReportStatCard } from '@/components/ReportStatCard';
import { ActivityChart } from '@/components/ActivityChart';
import { CategoryChart } from '@/components/CategoryChart';
import { ParticipantsTrendChart } from '@/components/ParticipantsTrendChart';
import { UnitRankingTable } from '@/components/UnitRankingTable';
import { ExportReportSection } from '@/components/ExportReportSection';
import { useAuth } from '@/contexts/AuthContext';
import { getReportData, type ReportData, type ReportFilterState } from '@/services/reportService';

const emptyReportData: ReportData = {
  stats: {
    totalActivities: 0,
    participants: 0,
    evidenceComplete: 0,
    facultyActivities: 0,
    branchActivities: 0,
  },
  monthlyActivities: [],
  participantTrend: [],
  categoryStats: [],
  unitRanking: [],
};

function getDisplayYear(filters: ReportFilterState) {
  const match = filters.ma_nam_hoc.match(/\d{4}/);
  return match ? Number(match[0]) : new Date().getFullYear();
}

export function ReportPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ReportFilterState>({
    ma_nam_hoc: '',
    hoc_ky: '',
    thang: '',
    ma_don_vi: '',
    ma_loai: '',
  });
  const [reportData, setReportData] = useState(emptyReportData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const displayYear = getDisplayYear(filters);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setMessage('');
    getReportData(user, filters)
      .then(setReportData)
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu báo cáo.'))
      .finally(() => setLoading(false));
  }, [user, filters]);

  function handleFilterChange(nextFilters: Partial<ReportFilterState>) {
    setFilters((current) => ({ ...current, ...nextFilters }));
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Thống kê – Báo cáo</h2>
        <p className="text-sm text-gray-500">
          Phân tích và tổng hợp dữ liệu hoạt động Đoàn - Hội
        </p>
      </div>

      {/* Filters */}
      <ReportFilters filters={filters} onFilterChange={handleFilterChange} />

      {message && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}
      {loading && <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">Đang tải dữ liệu báo cáo...</div>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <ReportStatCard
          icon={Calendar}
          title="Tổng hoạt động"
          value={reportData.stats.totalActivities.toLocaleString('vi-VN')}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <ReportStatCard
          icon={Users}
          title="Lượt sinh viên tham gia"
          value={reportData.stats.participants.toLocaleString('vi-VN')}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
        />
        <ReportStatCard
          icon={FileCheck}
          title="Minh chứng đầy đủ"
          value={reportData.stats.evidenceComplete.toLocaleString('vi-VN')}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <ReportStatCard
          icon={Building2}
          title="Hoạt động cấp khoa"
          value={reportData.stats.facultyActivities.toLocaleString('vi-VN')}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <ReportStatCard
          icon={GitBranch}
          title="Hoạt động cấp chi"
          value={reportData.stats.branchActivities.toLocaleString('vi-VN')}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ActivityChart year={displayYear} data={reportData.monthlyActivities} />
        </div>
        <div>
          <CategoryChart year={displayYear} data={reportData.categoryStats} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ParticipantsTrendChart data={reportData.participantTrend} />
        <UnitRankingTable data={reportData.unitRanking} />
      </div>

      {/* Export Section */}
      <ExportReportSection data={reportData} filters={filters} />
    </div>
  );
}
