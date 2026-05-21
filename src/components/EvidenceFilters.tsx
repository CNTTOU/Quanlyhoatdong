import { Filter } from 'lucide-react';
import type { EvidenceFilterOptions } from '@/services/evidenceService';

export type EvidenceFiltersState = {
  loai_minh_chung: string;
  ma_nam_hoc: string;
  ma_don_vi: string;
  ma_loai: string;
  ngay_tai_len: string;
};

interface EvidenceFiltersProps {
  filters: EvidenceFiltersState;
  options: EvidenceFilterOptions;
  onFilterChange: (filters: Partial<EvidenceFiltersState>) => void;
}

export function EvidenceFilters({ filters, options, onFilterChange }: EvidenceFiltersProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-gray-900">Bộ lọc</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại minh chứng</label>
          <select value={filters.loai_minh_chung} onChange={(event) => onFilterChange({ loai_minh_chung: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            <option value="image">Hình ảnh</option>
            <option value="video">Video</option>
            <option value="document">Tài liệu</option>
            <option value="link">Link</option>
            <option value="drive">Google Drive</option>
            <option value="attendance">Danh sách tham gia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Năm học</label>
          <select value={filters.ma_nam_hoc} onChange={(event) => onFilterChange({ ma_nam_hoc: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả năm</option>
            {options.years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Đơn vị</label>
          <select value={filters.ma_don_vi} onChange={(event) => onFilterChange({ ma_don_vi: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả đơn vị</option>
            {options.units.map((unit) => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
          <select value={filters.ma_loai} onChange={(event) => onFilterChange({ ma_loai: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            {options.activityTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Ngày tải lên</label>
          <select value={filters.ngay_tai_len} onChange={(event) => onFilterChange({ ngay_tai_len: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
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
