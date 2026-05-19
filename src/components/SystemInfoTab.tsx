import { Save, Upload, Image as ImageIcon } from 'lucide-react';

export function SystemInfoTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-900 mb-6">Thông tin cơ bản</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Tên hệ thống <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Hệ thống quản lý hoạt động Đoàn - Hội"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Logo hệ thống</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-white" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Tải lên logo</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Tên đơn vị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Trường Đại học ABC"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email liên hệ <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              defaultValue="doan@university.edu.vn"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Mô tả ngắn</label>
            <textarea
              rows={3}
              defaultValue="Hệ thống lưu trữ và quản lý hoạt động Đoàn - Hội của trường"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
          <Save className="w-5 h-5" />
          <span>Lưu thay đổi</span>
        </button>
      </div>
    </div>
  );
}
