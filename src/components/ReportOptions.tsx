import { Settings, FileText, FileSpreadsheet, File } from 'lucide-react';

export function ReportOptions() {
  return (
    <div className="space-y-6">
      {/* Options Panel */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Tùy chọn hiển thị</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Hiển thị hình ảnh minh chứng
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Hiển thị link minh chứng
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Hiển thị số liệu thống kê
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Hiển thị nhận xét
            </span>
          </label>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-5 shadow-lg">
        <h3 className="text-white mb-4">Xuất báo cáo</h3>

        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm">Xuất Word</p>
              <p className="text-xs text-gray-500">Định dạng .docx</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all group">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <File className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm">Xuất PDF</p>
              <p className="text-xs text-gray-500">Định dạng .pdf</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-lg hover:shadow-xl transition-all group">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm">Xuất Excel</p>
              <p className="text-xs text-gray-500">Định dạng .xlsx</p>
            </div>
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-900 mb-2">
          <strong>Lưu ý:</strong>
        </p>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Báo cáo sẽ được tạo dựa trên dữ liệu đã chọn</li>
          <li>Hình ảnh minh chứng có thể làm file nặng hơn</li>
          <li>Nên kiểm tra kỹ trước khi xuất file</li>
        </ul>
      </div>
    </div>
  );
}
