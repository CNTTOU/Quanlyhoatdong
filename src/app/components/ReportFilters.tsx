import { Filter } from 'lucide-react';

interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-gray-900">Bộ lọc thống kê</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <label className="block text-sm text-gray-600 mb-2">Học kỳ</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Cả năm</option>
            <option value="1">Học kỳ I</option>
            <option value="2">Học kỳ II</option>
            <option value="3">Học kỳ hè</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Tháng</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                Tháng {month}
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
            <option value="hoi-chu-thap-do">Hội chữ thập đỏ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            <option value="hoc-thuat">Học thuật</option>
            <option value="tinh-nguyen">Tình nguyện</option>
            <option value="ky-nang">Kỹ năng</option>
            <option value="sv5t">SV5T</option>
            <option value="truyen-thong">Truyền thông</option>
          </select>
        </div>
      </div>
    </div>
  );
}
