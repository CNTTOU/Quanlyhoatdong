import { Calendar, Users, FileCheck, Building2, GitBranch } from 'lucide-react';
import { ReportFilters } from './ReportFilters';
import { ReportStatCard } from './ReportStatCard';
import { ActivityChart } from './ActivityChart';
import { CategoryChart } from './CategoryChart';
import { ParticipantsTrendChart } from './ParticipantsTrendChart';
import { UnitRankingTable } from './UnitRankingTable';
import { ExportReportSection } from './ExportReportSection';

export function ReportPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Thống kê – Báo cáo</h2>
        <p className="text-sm text-gray-500">
          Phân tích và tổng hợp dữ liệu hoạt động Đoàn - Hội
        </p>
      </div>

      {/* Filters */}
      <ReportFilters onFilterChange={() => {}} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <ReportStatCard
          icon={Calendar}
          title="Tổng hoạt động"
          value="410"
          change={{ value: '+12%', type: 'increase' }}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <ReportStatCard
          icon={Users}
          title="Lượt sinh viên tham gia"
          value="13,480"
          change={{ value: '+18%', type: 'increase' }}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-100"
        />
        <ReportStatCard
          icon={FileCheck}
          title="Minh chứng đầy đủ"
          value="385"
          change={{ value: '+8%', type: 'increase' }}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <ReportStatCard
          icon={Building2}
          title="Hoạt động cấp khoa"
          value="156"
          change={{ value: '+15%', type: 'increase' }}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <ReportStatCard
          icon={GitBranch}
          title="Hoạt động cấp chi"
          value="254"
          change={{ value: '+10%', type: 'increase' }}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ActivityChart year={2026} />
        </div>
        <div>
          <CategoryChart year={2026} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ParticipantsTrendChart />
        <UnitRankingTable />
      </div>

      {/* Export Section */}
      <ExportReportSection />
    </div>
  );
}
