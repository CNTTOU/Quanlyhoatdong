import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface CalendarFiltersProps {
  currentMonth: string;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onFilterChange: (filters: any) => void;
  categories?: Array<{ value: string; label: string }>;
  units?: Array<{ value: string; label: string }>;
}

export function CalendarFilters({ currentMonth, onMonthChange, onFilterChange, categories = [], units = [] }: CalendarFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-gray-900">Lịch hoạt động</h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onMonthChange('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-gray-900 min-w-[150px] text-center">{currentMonth}</h3>
          <button
            onClick={() => onMonthChange('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
          <select
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onChange={(event) => onFilterChange({ category: event.target.value })}
          >
            <option value="">Tất cả loại</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Đơn vị tổ chức</label>
          <select
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onChange={(event) => onFilterChange({ unit: event.target.value })}
          >
            <option value="">Tất cả đơn vị</option>
            {units.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Xem theo</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="month">Tháng</option>
            <option value="week">Tuần</option>
          </select>
        </div>
      </div>
    </div>
  );
}
