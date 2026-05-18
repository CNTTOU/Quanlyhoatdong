import { FileText } from 'lucide-react';
import { ReportBuilderFilters } from './ReportBuilderFilters';
import { ReportTemplates } from './ReportTemplates';
import { ReportPreview } from './ReportPreview';
import { ReportOptions } from './ReportOptions';

export function ReportBuilderPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <h2 className="text-gray-900">Tạo báo cáo hoạt động</h2>
        </div>
        <p className="text-sm text-gray-500">
          Công cụ tạo báo cáo tự động từ dữ liệu hoạt động Đoàn - Hội
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Filters & Templates */}
        <div className="lg:col-span-3 space-y-6">
          <ReportBuilderFilters />
          <ReportTemplates />
        </div>

        {/* Middle Column - Preview */}
        <div className="lg:col-span-6">
          <ReportPreview />
        </div>

        {/* Right Column - Options & Export */}
        <div className="lg:col-span-3">
          <ReportOptions />
        </div>
      </div>
    </div>
  );
}
