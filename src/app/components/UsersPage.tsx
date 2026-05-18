import { useState } from 'react';
import { Users, Plus, Search, Download, Edit, Lock, Unlock, Key, Trash2, Filter, AlertTriangle } from 'lucide-react';

const roles = [
  { id: 'super-admin', name: 'Super Admin', color: 'bg-red-100 text-red-700' },
  { id: 'admin', name: 'Admin Đoàn – Hội', color: 'bg-blue-100 text-blue-700' },
  { id: 'executive', name: 'Ban Chấp hành', color: 'bg-purple-100 text-purple-700' },
  { id: 'unit-officer', name: 'Cán bộ Chi đoàn', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'collaborator', name: 'Cộng tác viên', color: 'bg-green-100 text-green-700' },
  { id: 'viewer', name: 'Người xem', color: 'bg-gray-100 text-gray-700' },
];

const users = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@uit.edu.vn',
    unit: 'Đoàn Khoa CNTT',
    role: 'super-admin',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=1e3a8a&color=fff',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@uit.edu.vn',
    unit: 'Đoàn Khoa CNTT',
    role: 'admin',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=0891b2&color=fff',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@uit.edu.vn',
    unit: 'Ban Chấp hành',
    role: 'executive',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=7c3aed&color=fff',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@uit.edu.vn',
    unit: 'Chi đoàn CNTT1',
    role: 'unit-officer',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=06b6d4&color=fff',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@uit.edu.vn',
    unit: 'Chi đoàn CNTT2',
    role: 'collaborator',
    status: 'locked',
    avatar: 'https://ui-avatars.com/api/?name=Hoang+Van+E&background=10b981&color=fff',
  },
  {
    id: 6,
    name: 'Võ Thị F',
    email: 'vothif@uit.edu.vn',
    unit: 'Sinh viên',
    role: 'viewer',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Vo+Thi+F&background=6b7280&color=fff',
  },
];

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getRoleBadge = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? { name: role.name, color: role.color } : { name: roleId, color: 'bg-gray-100 text-gray-700' };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-gray-900">Quản lý người dùng</h2>
        </div>
        <p className="text-sm text-gray-500">
          Quản lý tài khoản, vai trò và quyền truy cập của người dùng trong hệ thống
        </p>
      </div>

      {/* Security Warning */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-amber-900 mb-1">Lưu ý bảo mật</h4>
          <p className="text-sm text-amber-700">
            Quản lý người dùng ảnh hưởng trực tiếp đến quyền truy cập dữ liệu hoạt động, minh chứng và báo cáo. Chỉ Super Admin hoặc Admin Đoàn – Hội được thực hiện các thao tác quan trọng.
          </p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
            <Plus className="w-5 h-5" />
            <span>Thêm người dùng</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            <span>Xuất danh sách</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">Lọc theo:</span>
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả vai trò</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-sm text-gray-600">Người dùng</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Đơn vị</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Vai trò</th>
              <th className="text-center py-4 px-6 text-sm text-gray-600">Trạng thái</th>
              <th className="text-center py-4 px-6 text-sm text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              return (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{user.unit}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                      {roleBadge.name}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Đã khóa
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          className="p-2 hover:bg-orange-50 rounded-lg transition-colors group"
                          title="Khóa tài khoản"
                        >
                          <Lock className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                        </button>
                      ) : (
                        <button
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Mở khóa tài khoản"
                        >
                          <Unlock className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                        </button>
                      )}
                      <button
                        className="p-2 hover:bg-purple-50 rounded-lg transition-colors group"
                        title="Đặt lại mật khẩu"
                      >
                        <Key className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                      </button>
                      {user.role !== 'super-admin' && (
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Tổng số người dùng</p>
          <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Đang hoạt động</p>
          <p className="text-2xl font-semibold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Đã khóa</p>
          <p className="text-2xl font-semibold text-red-600">
            {users.filter(u => u.status === 'locked').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Quản trị viên</p>
          <p className="text-2xl font-semibold text-blue-600">
            {users.filter(u => u.role === 'super-admin' || u.role === 'admin').length}
          </p>
        </div>
      </div>
    </div>
  );
}
