import { Search, Calendar, Filter } from 'lucide-react';

interface ActivityFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  year: string;
  month: string;
  category: string;
  unit: string;
  status: string;
}

const months = [
  { value: '', label: 'Tất cả tháng' },
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
];

const categories = [
  { value: '', label: 'Tất cả loại' },
  { value: 'hoc-thuat', label: 'Học thuật' },
  { value: 'tinh-nguyen', label: 'Tình nguyện' },
  { value: 'ky-nang', label: 'Kỹ năng' },
  { value: 'sv5t', label: 'SV5T' },
  { value: 'truyen-thong', label: 'Truyền thông' },
];

const units = [
  { value: '', label: 'Tất cả đơn vị' },
  { value: 'doan-cntt', label: 'Đoàn CNTT' },
  { value: 'doan-khoa-hoc', label: 'Đoàn Khoa học' },
  { value: 'hoi-svhs', label: 'Hội SVHS' },
  { value: 'hoi-chu-thap-do', label: 'Hội chữ thập đỏ' },
];

const statuses = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Nháp' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'need-update', label: 'Cần bổ sung' },
];

export function ActivityFilters({ onFilterChange }: ActivityFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleChange = (field: keyof FilterState, value: string) => {
    const filters = {
      search: (document.getElementById('search') as HTMLInputElement)?.value || '',
      year: (document.getElementById('year') as HTMLSelectElement)?.value || '',
      month: (document.getElementById('month') as HTMLSelectElement)?.value || '',
      category: (document.getElementById('category') as HTMLSelectElement)?.value || '',
      unit: (document.getElementById('unit') as HTMLSelectElement)?.value || '',
      status: (document.getElementById('status') as HTMLSelectElement)?.value || '',
      [field]: value,
    };
    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-gray-900">Bộ lọc nâng cao</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3">
          <label className="block text-sm text-gray-600 mb-2">Tìm kiếm</label>
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search"
              type="text"
              placeholder="Tìm kiếm theo tên hoạt động..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Năm học</label>
          <select
            id="year"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">Tất cả năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year} - {year + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Tháng</label>
          <select
            id="month"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleChange('month', e.target.value)}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
          <select
            id="category"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Đơn vị tổ chức</label>
          <select
            id="unit"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleChange('unit', e.target.value)}
          >
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Trạng thái</label>
          <select
            id="status"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
