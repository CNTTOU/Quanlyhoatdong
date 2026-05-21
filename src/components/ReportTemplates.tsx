import { FileText, CheckCircle } from 'lucide-react';
import type { ReportTemplate } from '@/services/reportBuilderService';

interface ReportTemplatesProps {
  templates: ReportTemplate[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export function ReportTemplates({ templates, selectedTemplateId, onSelect }: ReportTemplatesProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-gray-900">Chọn mẫu báo cáo</h3>
      </div>

      <div className="space-y-2">
        {templates.length === 0 && (
          <p className="text-sm text-gray-500">Chưa có mẫu báo cáo đang sử dụng.</p>
        )}

        {templates.map((template) => (
          <button
            key={template.ma_mau}
            onClick={() => onSelect(template.ma_mau)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedTemplateId === template.ma_mau
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm ${
                    selectedTemplateId === template.ma_mau ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {template.ten_mau}
                  </h4>
                  {selectedTemplateId === template.ma_mau && (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  )}
                  {template.la_mac_dinh && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Mặc định</span>
                  )}
                </div>
                <p className="text-xs text-gray-600">{template.mo_ta || template.loai_bao_cao}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
