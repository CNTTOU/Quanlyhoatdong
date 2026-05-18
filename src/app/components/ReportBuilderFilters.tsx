import { Filter, Calendar } from 'lucide-react';

export function ReportBuilderFilters() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="text-gray-900">Chọn dữ liệu báo cáo</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Năm học <span className="text-red-500">*</span>
          </label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Chọn năm học</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year} - {year + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Học kỳ</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Cả năm</option>
            <option value="1">Học kỳ I</option>
            <option value="2">Học kỳ II</option>
            <option value="3">Học kỳ hè</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Đơn vị</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả đơn vị</option>
            <option value="doan-cntt">Đoàn CNTT</option>
            <option value="doan-khoa-hoc">Đoàn Khoa học</option>
            <option value="hoi-svhs">Hội SVHS</option>
            <option value="hoi-chu-thap-do">Hội chữ thập đỏ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Loại hoạt động</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            <option value="hoc-thuat">Học thuật</option>
            <option value="tinh-nguyen">Tình nguyện</option>
            <option value="ky-nang">Kỹ năng</option>
            <option value="sv5t">SV5T</option>
            <option value="truyen-thong">Truyền thông</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Trạng thái</label>
          <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả trạng thái</option>
            <option value="approved">Đã duyệt</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Khoảng thời gian</label>
          <div className="space-y-2">
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Từ ngày"
              />
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Đến ngày"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
