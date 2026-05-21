import { BarChart3, FileSpreadsheet, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/routes/paths';
import type { ReportData, ReportFilterState } from '@/services/reportService';
import { Can } from './auth/Can';

interface ExportReportSectionProps {
  data: ReportData;
  filters: ReportFilterState;
}

function csvEscape(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportReportSection({ data, filters }: ExportReportSectionProps) {
  function exportSummaryCsv() {
    downloadCsv('du-lieu-thong-ke-tong-hop.csv', [
      ['Nhóm', 'Chỉ số', 'Giá trị'],
      ['Bộ lọc', 'Năm học', filters.ma_nam_hoc || 'Tất cả'],
      ['Bộ lọc', 'Học kỳ', filters.hoc_ky || 'Cả năm'],
      ['Bộ lọc', 'Tháng', filters.thang || 'Tất cả'],
      ['Bộ lọc', 'Đơn vị', filters.ma_don_vi || 'Tất cả'],
      ['Bộ lọc', 'Loại hoạt động', filters.ma_loai || 'Tất cả'],
      ['Tổng quan', 'Tổng hoạt động', data.stats.totalActivities],
      ['Tổng quan', 'Lượt sinh viên tham gia', data.stats.participants],
      ['Tổng quan', 'Minh chứng đầy đủ', data.stats.evidenceComplete],
      ['Tổng quan', 'Hoạt động cấp khoa', data.stats.facultyActivities],
      ['Tổng quan', 'Hoạt động cấp chi', data.stats.branchActivities],
    ]);
  }

  function exportDetailCsv() {
    downloadCsv('du-lieu-thong-ke-chi-tiet.csv', [
      ['Bảng', 'Tên', 'Hoạt động', 'Lượt tham gia'],
      ...data.monthlyActivities.map((item) => ['Theo tháng', item.month, item.activities, data.participantTrend.find((trend) => trend.id === item.id)?.participants ?? 0]),
      ...data.categoryStats.map((item) => ['Theo loại hoạt động', item.name, item.value, '']),
      ...data.unitRanking.map((item) => ['Xếp hạng đơn vị', item.name, item.activities, item.participants]),
    ]);
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="mb-2 text-gray-900">Xuất dữ liệu thống kê</h3>
        <p className="text-sm text-gray-500">
          Tải nhanh dữ liệu dashboard theo bộ lọc hiện tại. Báo cáo Word/PDF hoàn chỉnh nằm ở module Tạo báo cáo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <button onClick={exportSummaryCsv} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-3.5 text-gray-900 transition-all hover:border-green-200 hover:bg-green-50 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Xuất CSV tổng hợp</p>
            <p className="text-xs text-gray-500">Mở được bằng Excel</p>
          </div>
        </button>

        <button onClick={exportDetailCsv} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-3.5 text-gray-900 transition-all hover:border-blue-200 hover:bg-blue-50 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Xuất CSV chi tiết</p>
            <p className="text-xs text-gray-500">Tháng, loại, đơn vị</p>
          </div>
        </button>

        <Can permission="tao_bao_cao">
          <Link to={paths.reportBuilder} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-3.5 text-gray-900 transition-all hover:border-purple-200 hover:bg-purple-50 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Tạo báo cáo chính thức</p>
              <p className="text-xs text-gray-500">Word/PDF/Excel</p>
            </div>
          </Link>
        </Can>
      </div>
    </div>
  );
}
