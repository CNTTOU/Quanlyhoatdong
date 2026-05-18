import { useState } from 'react';
import { Plus, Upload, Settings, Search, Eye, Edit, Copy, Star, Lock, Trash2, Info } from 'lucide-react';

const reportTypes = [
  'Kết quả hoạt động',
  'Tổng kết năm học',
  'Thi đua',
  'Minh chứng',
  'Sinh viên 5 tốt',
  'Mô hình, giải pháp',
  'Hoạt động chuyên đề',
];

const units = [
  'Toàn hệ thống',
  'Đoàn khoa',
  'Liên chi Hội khoa',
  'Chi đoàn',
  'Chi hội',
  'Câu lạc bộ',
];

const templates = [
  {
    id: 1,
    name: 'Báo cáo kết quả hoạt động',
    type: 'Kết quả hoạt động',
    unit: 'Toàn hệ thống',
    fields: 12,
    formats: ['Word', 'PDF', 'Excel'],
    isDefault: true,
    status: 'active',
    updatedAt: '15/05/2026',
  },
  {
    id: 2,
    name: 'Báo cáo tổng kết năm học',
    type: 'Tổng kết năm học',
    unit: 'Đoàn khoa',
    fields: 15,
    formats: ['Word', 'PDF'],
    isDefault: false,
    status: 'active',
    updatedAt: '12/05/2026',
  },
  {
    id: 3,
    name: 'Báo cáo thi đua Đoàn – Hội',
    type: 'Thi đua',
    unit: 'Toàn hệ thống',
    fields: 10,
    formats: ['Word', 'PDF', 'Excel'],
    isDefault: false,
    status: 'active',
    updatedAt: '10/05/2026',
  },
  {
    id: 4,
    name: 'Báo cáo minh chứng hoạt động',
    type: 'Minh chứng',
    unit: 'Chi đoàn',
    fields: 8,
    formats: ['PDF', 'Excel'],
    isDefault: false,
    status: 'active',
    updatedAt: '08/05/2026',
  },
  {
    id: 5,
    name: 'Báo cáo hoạt động tình nguyện',
    type: 'Hoạt động chuyên đề',
    unit: 'Toàn hệ thống',
    fields: 11,
    formats: ['Word', 'PDF'],
    isDefault: false,
    status: 'draft',
    updatedAt: '05/05/2026',
  },
  {
    id: 6,
    name: 'Báo cáo hoạt động học thuật',
    type: 'Hoạt động chuyên đề',
    unit: 'Đoàn khoa',
    fields: 9,
    formats: ['Word', 'PDF'],
    isDefault: false,
    status: 'active',
    updatedAt: '03/05/2026',
  },
  {
    id: 7,
    name: 'Báo cáo Sinh viên 5 tốt',
    type: 'Sinh viên 5 tốt',
    unit: 'Toàn hệ thống',
    fields: 14,
    formats: ['Word', 'PDF', 'Excel'],
    isDefault: false,
    status: 'active',
    updatedAt: '01/05/2026',
  },
  {
    id: 8,
    name: 'Báo cáo mô hình, giải pháp',
    type: 'Mô hình, giải pháp',
    unit: 'Liên chi Hội khoa',
    fields: 13,
    formats: ['Word', 'PDF'],
    isDefault: false,
    status: 'locked',
    updatedAt: '28/04/2026',
  },
];

const dataFields = [
  '{{ten_hoat_dong}}',
  '{{loai_hoat_dong}}',
  '{{don_vi_to_chuc}}',
  '{{thoi_gian}}',
  '{{dia_diem}}',
  '{{so_luong_tham_gia}}',
  '{{noi_dung_hoat_dong}}',
  '{{ket_qua_dat_duoc}}',
  '{{link_minh_chung}}',
  '{{hinh_anh_minh_chung}}',
  '{{nguoi_phu_trach}}',
  '{{ngay_tao_bao_cao}}',
];

const templateStructure = [
  'I. Thông tin chung',
  'II. Mục đích, yêu cầu',
  'III. Nội dung triển khai',
  'IV. Kết quả thực hiện',
  'V. Số liệu tham gia',
  'VI. Minh chứng kèm theo',
  'VII. Đánh giá, kiến nghị',
];

export function ReportTemplatesTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Đang sử dụng', color: 'bg-green-100 text-green-700' };
      case 'draft':
        return { label: 'Bản nháp', color: 'bg-gray-100 text-gray-700' };
      case 'locked':
        return { label: 'Tạm khóa', color: 'bg-orange-100 text-orange-700' };
      default:
        return { label: 'Ngừng sử dụng', color: 'bg-red-100 text-red-700' };
    }
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'Word':
        return 'bg-blue-100 text-blue-700';
      case 'PDF':
        return 'bg-red-100 text-red-700';
      case 'Excel':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const selected = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-900 mb-1">Cấu hình mẫu báo cáo</h3>
          <p className="text-sm text-gray-500">
            Quản lý các mẫu báo cáo chuẩn được sử dụng trong chức năng Tạo báo cáo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Quản lý trường dữ liệu</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Nhập mẫu Word</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Thêm mẫu báo cáo</span>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900">
          Tab này dùng để cấu hình khung báo cáo, trường dữ liệu động và định dạng xuất file. Để tạo báo cáo thực tế, vui lòng sử dụng module <span className="font-medium">Tạo báo cáo</span>.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên mẫu báo cáo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Loại báo cáo</option>
            {reportTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Đơn vị áp dụng</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Trạng thái</option>
            <option value="active">Đang sử dụng</option>
            <option value="draft">Bản nháp</option>
            <option value="locked">Tạm khóa</option>
            <option value="inactive">Ngừng sử dụng</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all text-sm">
            Lọc
          </button>
        </div>
      </div>

      {/* Templates Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Tên mẫu báo cáo</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Loại</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Đơn vị</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-600">Trường</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Định dạng</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-600">Mặc định</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Trạng thái</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => {
                  const statusBadge = getStatusBadge(template.status);
                  return (
                    <tr
                      key={template.id}
                      className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                        selectedTemplate === template.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900 font-medium">{template.name}</p>
                        <p className="text-xs text-gray-500">Cập nhật: {template.updatedAt}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-gray-700">{template.type}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-gray-700">{template.unit}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs text-gray-900 font-medium">{template.fields}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {template.formats.map(format => (
                            <span
                              key={format}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getFormatBadge(format)}`}
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={template.isDefault}
                              onChange={() => {}}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-blue-50 rounded transition-colors group" title="Xem cấu trúc">
                            <Eye className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
                          </button>
                          <button className="p-1.5 hover:bg-green-50 rounded transition-colors group" title="Chỉnh sửa">
                            <Edit className="w-3.5 h-3.5 text-gray-400 group-hover:text-green-600" />
                          </button>
                          <button className="p-1.5 hover:bg-purple-50 rounded transition-colors group" title="Nhân bản">
                            <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-600" />
                          </button>
                          <button className="p-1.5 hover:bg-orange-50 rounded transition-colors group" title="Đặt làm mặc định">
                            <Star className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded transition-colors group" title="Xóa">
                            <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Template Structure Panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Cấu trúc mẫu báo cáo</h4>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tên mẫu</p>
                  <p className="text-sm text-gray-900 font-medium">{selected.name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Loại báo cáo</p>
                  <p className="text-sm text-gray-900">{selected.type}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Đơn vị áp dụng</p>
                  <p className="text-sm text-gray-900">{selected.unit}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Định dạng xuất file</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.formats.map(format => (
                      <span
                        key={format}
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getFormatBadge(format)}`}
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 mb-3">Danh sách các phần trong báo cáo</p>
                  <div className="space-y-2">
                    {templateStructure.map((section, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-gray-700">{section}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 mb-3">Trường dữ liệu động đang sử dụng</p>
                  <div className="flex flex-wrap gap-2">
                    {dataFields.slice(0, selected.fields).map((field, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-mono"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Chọn một mẫu báo cáo để xem cấu trúc chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
