import { FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ReportBuilderFilters } from '@/components/ReportBuilderFilters';
import { ReportTemplates } from '@/components/ReportTemplates';
import { ReportPreview } from '@/components/ReportPreview';
import { ReportOptions } from '@/components/ReportOptions';
import { useAuth } from '@/contexts/AuthContext';
import {
  buildReportPreview,
  exportReport,
  getReportBuilderOptions,
  getReportTemplates,
  type ReportBuilderFiltersState,
  type ReportBuilderOptionsState,
  type ReportPreviewData,
  type ReportTemplate,
} from '@/services/reportBuilderService';

const initialFilters: ReportBuilderFiltersState = {
  ma_nam_hoc: '',
  hoc_ky: '',
  ma_don_vi: '',
  ma_loai: '',
  trang_thai: '',
  tu_ngay: '',
  den_ngay: '',
};

const initialOptions: ReportBuilderOptionsState = {
  showImages: true,
  showLinks: true,
  showStats: true,
  showComments: false,
};

export function ReportBuilderPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ReportBuilderFiltersState>(initialFilters);
  const [options, setOptions] = useState<ReportBuilderOptionsState>(initialOptions);
  const [years, setYears] = useState<Array<{ value: string; label: string }>>([]);
  const [units, setUnits] = useState<Array<{ value: string; label: string }>>([]);
  const [activityTypes, setActivityTypes] = useState<Array<{ value: string; label: string }>>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [previewData, setPreviewData] = useState<ReportPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.ma_mau === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  );

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([getReportBuilderOptions(user), getReportTemplates(true)])
      .then(([optionData, templateData]) => {
        setYears(optionData.years);
        setUnits(optionData.units);
        setActivityTypes(optionData.activityTypes);
        setTemplates(templateData);
        setSelectedTemplateId(templateData.find((template) => template.la_mac_dinh)?.ma_mau ?? templateData[0]?.ma_mau ?? '');
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setPreviewLoading(true);
    buildReportPreview(user, filters, selectedTemplate)
      .then(setPreviewData)
      .finally(() => setPreviewLoading(false));
  }, [user, filters, selectedTemplate]);

  const handleExport = async (format: 'docx' | 'pdf' | 'xlsx') => {
    if (!user || !previewData) return;
    setExporting(true);
    setMessage('');
    try {
      await exportReport(format, previewData, selectedTemplate, filters, options, user);
      setMessage('Đã xuất báo cáo và lưu lịch sử tạo báo cáo.');
    } catch (error) {
      console.error(error);
      setMessage('Không thể xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

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

      {message && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ReportBuilderFilters
            filters={filters}
            years={years}
            units={units}
            activityTypes={activityTypes}
            onChange={(nextFilters) => setFilters((current) => ({ ...current, ...nextFilters }))}
          />
          <ReportTemplates
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelect={setSelectedTemplateId}
          />
        </div>

        <div className="lg:col-span-6">
          <ReportPreview template={selectedTemplate} data={previewData} options={options} loading={loading || previewLoading} />
        </div>

        <div className="lg:col-span-3">
          <ReportOptions
            options={options}
            template={selectedTemplate}
            exporting={exporting}
            onChange={(nextOptions) => setOptions((current) => ({ ...current, ...nextOptions }))}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}
