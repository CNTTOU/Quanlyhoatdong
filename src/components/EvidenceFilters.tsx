import { Filter } from 'lucide-react';

interface EvidenceFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function EvidenceFilters({ onFilterChange }: EvidenceFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-gray-900">Bộ lọc</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại minh chứng</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            <option value="image">Hình ảnh</option>
            <option value="video">Video</option>
            <option value="document">Tài liệu</option>
            <option value="link">Link</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Năm học</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year} - {year + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Đơn vị</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả đơn vị</option>
            <option value="doan-cntt">Đoàn CNTT</option>
            <option value="doan-khoa-hoc">Đoàn Khoa học</option>
            <option value="hoi-svhs">Hội SVHS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            <option value="hoc-thuat">Học thuật</option>
            <option value="tinh-nguyen">Tình nguyện</option>
            <option value="ky-nang">Kỹ năng</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Ngày tải lên</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả</option>
            <option value="today">Hôm nay</option>
            <option value="week">7 ngày qua</option>
            <option value="month">30 ngày qua</option>
          </select>
        </div>
      </div>
    </div>
  );
}
