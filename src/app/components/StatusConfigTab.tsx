import { Save } from 'lucide-react';

const statuses = [
  { id: 'draft', name: 'Nháp', color: '#6b7280', enabled: true },
  { id: 'pending', name: 'Chờ duyệt', color: '#f59e0b', enabled: true },
  { id: 'approved', name: 'Đã duyệt', color: '#10b981', enabled: true },
  { id: 'need-update', name: 'Cần bổ sung', color: '#f97316', enabled: true },
  { id: 'rejected', name: 'Từ chối', color: '#ef4444', enabled: true },
];

export function StatusConfigTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-900 mb-1">Cấu hình trạng thái duyệt</h3>
        <p className="text-sm text-gray-500">Quản lý các trạng thái trong quy trình duyệt hoạt động</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: status.color }}
                />
                <div>
                  <h4 className="text-sm text-gray-900">{status.name}</h4>
                  <p className="text-xs text-gray-500">ID: {status.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-gray-600">Kích hoạt</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      defaultChecked={status.enabled}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>
            </div>
          ))}
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
