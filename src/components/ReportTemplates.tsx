import { FileText, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getInterfaceDocument } from '@/services/interfaceDataService';

type ReportTemplateOption = {
  id: string;
  name: string;
  description: string;
};

export function ReportTemplates() {
  const [templates, setTemplates] = useState<ReportTemplateOption[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('yearly');

  useEffect(() => {
    getInterfaceDocument<{ reportTemplates: ReportTemplateOption[] }>('cau_hinh_giao_dien', {
      reportTemplates: [],
    }).then((data) => {
      setTemplates(data.reportTemplates);
      setSelectedTemplate(data.reportTemplates[0]?.id ?? '');
    });
  }, []);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-gray-900">Chọn mẫu báo cáo</h3>
      </div>

      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm ${
                    selectedTemplate === template.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </h4>
                  {selectedTemplate === template.id && (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600">{template.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
