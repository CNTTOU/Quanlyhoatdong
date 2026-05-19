import { Search, Filter } from 'lucide-react';

interface UnitsFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function UnitsFilters({ onFilterChange }: UnitsFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-gray-900">Bộ lọc</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm text-gray-600 mb-2">Tìm kiếm</label>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên đơn vị, người phụ trách..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại đơn vị</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            <option value="doan-khoa">Đoàn khoa</option>
            <option value="lien-chi-hoi">Liên chi Hội khoa</option>
            <option value="chi-doan">Chi đoàn</option>
            <option value="chi-hoi">Chi hội</option>
            <option value="clb">Câu lạc bộ</option>
            <option value="doi-nhom">Đội / Nhóm</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Cấp quản lý</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả cấp</option>
            <option value="truong">Cấp Trường</option>
            <option value="khoa">Cấp Khoa</option>
            <option value="lop">Cấp Lớp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Trạng thái</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm ngưng</option>
          </select>
        </div>
      </div>
    </div>
  );
}
