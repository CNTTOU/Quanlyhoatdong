import { FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const templates = [
  {
    id: 'yearly',
    name: 'Báo cáo tổng hợp năm học',
    description: 'Tổng hợp toàn bộ hoạt động trong năm học',
  },
  {
    id: 'topic',
    name: 'Báo cáo hoạt động theo chuyên đề',
    description: 'Báo cáo chi tiết theo từng loại hoạt động',
  },
  {
    id: 'competition',
    name: 'Báo cáo thi đua',
    description: 'Dành cho báo cáo thi đua cấp trên',
  },
  {
    id: 'evidence',
    name: 'Báo cáo minh chứng',
    description: 'Tập hợp minh chứng hoạt động',
  },
  {
    id: 'sv5t',
    name: 'Báo cáo Sinh viên 5 tốt',
    description: 'Báo cáo cho phong trào SV5T',
  },
];

export function ReportTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState('yearly');

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
