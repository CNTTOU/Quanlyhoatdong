import { FileText, FileSpreadsheet, File, FileDown } from 'lucide-react';

export function ExportReportSection() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 shadow-lg">
      <div className="text-white mb-6">
        <h3 className="mb-2">Xuất báo cáo</h3>
        <p className="text-sm text-blue-100">
          Tải xuống báo cáo thống kê dưới nhiều định dạng khác nhau
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button className="flex items-center gap-3 px-5 py-3.5 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all group">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Xuất Word</p>
            <p className="text-xs text-gray-500">Định dạng .docx</p>
          </div>
        </button>

        <button className="flex items-center gap-3 px-5 py-3.5 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all group">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Xuất Excel</p>
            <p className="text-xs text-gray-500">Định dạng .xlsx</p>
          </div>
        </button>

        <button className="flex items-center gap-3 px-5 py-3.5 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all group">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <File className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Xuất PDF</p>
            <p className="text-xs text-gray-500">Định dạng .pdf</p>
          </div>
        </button>

        <button className="flex items-center gap-3 px-5 py-3.5 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all group">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <FileDown className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-medium">Báo cáo tổng hợp</p>
            <p className="text-xs text-gray-500">Tất cả định dạng</p>
          </div>
        </button>
      </div>
    </div>
  );
}
