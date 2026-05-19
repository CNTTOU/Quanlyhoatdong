import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getInterfaceDocument } from '@/services/interfaceDataService';

type ActivityTypeRow = {
  id: number;
  name: string;
  color: string;
  count: number;
};

export function ActivityTypesTab() {
  const [activityTypes, setActivityTypes] = useState<ActivityTypeRow[]>([]);

  useEffect(() => {
    getInterfaceDocument<{ activityTypes: ActivityTypeRow[] }>('cau_hinh_giao_dien', { activityTypes: [] })
      .then((data) => setActivityTypes(data.activityTypes));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-900 mb-1">Quản lý loại hoạt động</h3>
          <p className="text-sm text-gray-500">Thêm, sửa hoặc xóa các loại hoạt động</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
          <Plus className="w-4 h-4" />
          <span>Thêm loại</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-6 text-sm text-gray-600">Tên loại</th>
              <th className="text-left py-3 px-6 text-sm text-gray-600">Màu sắc</th>
              <th className="text-center py-3 px-6 text-sm text-gray-600">Số hoạt động</th>
              <th className="text-center py-3 px-6 text-sm text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {activityTypes.map((type) => (
              <tr key={type.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-900">{type.name}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm text-gray-600">{type.color}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center text-sm text-gray-900">{type.count}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
