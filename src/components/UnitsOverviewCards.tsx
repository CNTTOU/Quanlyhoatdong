import { Building2, GitBranch, Users, Award, TrendingUp } from 'lucide-react';
import { ReportStatCard } from './ReportStatCard';

export function UnitsOverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <ReportStatCard
        icon={Building2}
        title="Tổng số đơn vị"
        value="48"
        change={{ value: '+5', type: 'increase' }}
        iconColor="text-blue-600"
        iconBg="bg-blue-100"
      />
      <ReportStatCard
        icon={GitBranch}
        title="Số chi đoàn"
        value="18"
        iconColor="text-cyan-600"
        iconBg="bg-cyan-100"
      />
      <ReportStatCard
        icon={Users}
        title="Số chi hội"
        value="15"
        iconColor="text-purple-600"
        iconBg="bg-purple-100"
      />
      <ReportStatCard
        icon={Award}
        title="Số câu lạc bộ"
        value="8"
        iconColor="text-green-600"
        iconBg="bg-green-100"
      />
      <ReportStatCard
        icon={TrendingUp}
        title="Đơn vị hoạt động tích cực"
        value="42"
        change={{ value: '+12%', type: 'increase' }}
        iconColor="text-orange-600"
        iconBg="bg-orange-100"
      />
    </div>
  );
}
