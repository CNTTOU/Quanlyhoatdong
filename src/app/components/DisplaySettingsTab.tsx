import { Save, Palette } from 'lucide-react';

export function DisplaySettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-900 mb-1">Cài đặt giao diện</h3>
        <p className="text-sm text-gray-500">Tùy chỉnh màu sắc và hiển thị hệ thống</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-3">
              Màu chủ đạo <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-6 gap-3">
              {[
                { name: 'Xanh dương', color: '#1e3a8a' },
                { name: 'Xanh lá', color: '#047857' },
                { name: 'Tím', color: '#7c3aed' },
                { name: 'Cam', color: '#ea580c' },
                { name: 'Hồng', color: '#db2777' },
                { name: 'Xám', color: '#374151' },
              ].map((theme) => (
                <div key={theme.name} className="text-center">
                  <div
                    className="w-full aspect-square rounded-lg cursor-pointer ring-2 ring-offset-2 ring-blue-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: theme.color }}
                    title={theme.name}
                  />
                  <p className="text-xs text-gray-600 mt-1">{theme.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Tùy chọn hiển thị
            </h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm text-gray-900">Hiển thị trang Hoạt động nổi bật</p>
                  <p className="text-xs text-gray-500">Cho phép truy cập trang showcase hoạt động</p>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm text-gray-900">Cho phép truy cập công khai</p>
                  <p className="text-xs text-gray-500">Người dùng ngoài có thể xem hoạt động nổi bật</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm text-gray-900">Hiển thị lịch hoạt động công khai</p>
                  <p className="text-xs text-gray-500">Cho phép sinh viên xem lịch hoạt động</p>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm text-gray-900">Chế độ tối (Dark mode)</p>
                  <p className="text-xs text-gray-500">Chuyển giao diện sang chế độ tối</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
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
