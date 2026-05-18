import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface CalendarFiltersProps {
  currentMonth: string;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onFilterChange: (filters: any) => void;
}

export function CalendarFilters({ currentMonth, onMonthChange, onFilterChange }: CalendarFiltersProps) {
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
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            <option value="hoc-thuat">Học thuật</option>
            <option value="tinh-nguyen">Tình nguyện</option>
            <option value="ky-nang">Kỹ năng</option>
            <option value="sv5t">SV5T</option>
            <option value="truyen-thong">Truyền thông</option>
            <option value="van-hoa-the-thao">Văn hóa - Thể thao</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Đơn vị tổ chức</label>
          <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả đơn vị</option>
            <option value="doan-cntt">Đoàn CNTT</option>
            <option value="doan-khoa-hoc">Đoàn Khoa học</option>
            <option value="hoi-svhs">Hội SVHS</option>
            <option value="hoi-chu-thap-do">Hội chữ thập đỏ</option>
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
