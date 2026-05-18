import { Eye, Edit, Trash2, Mail, Calendar } from 'lucide-react';

interface Unit {
  id: number;
  name: string;
  type: string;
  level: string;
  manager: string;
  email: string;
  activities: number;
  status: 'active' | 'inactive';
}

interface UnitsTableProps {
  units: Unit[];
}

const statusConfig = {
  active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700' },
  inactive: { label: 'Tạm ngưng', color: 'bg-gray-100 text-gray-700' },
};

export function UnitsTable({ units }: UnitsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-sm text-gray-600">Tên đơn vị</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Loại đơn vị</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Cấp quản lý</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Người phụ trách</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Email liên hệ</th>
              <th className="text-center py-4 px-6 text-sm text-gray-600">Số hoạt động</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Trạng thái</th>
              <th className="text-center py-4 px-6 text-sm text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr
                key={unit.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">{unit.name}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {unit.type}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600">{unit.level}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-900">{unit.manager}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{unit.email}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{unit.activities}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                      statusConfig[unit.status].color
                    }`}
                  >
                    {statusConfig[unit.status].label}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Hiển thị {units.length} đơn vị
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Trước
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            2
          </button>
          <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
