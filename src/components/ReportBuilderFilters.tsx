import { Filter, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReportBuilderFiltersState } from '@/services/reportBuilderService';
import { defaultActivityStatuses, getActivityStatusSettings, type ActivityStatusSetting } from '@/services/settingService';

interface ReportBuilderFiltersProps {
  filters: ReportBuilderFiltersState;
  years: Array<{ value: string; label: string }>;
  units: Array<{ value: string; label: string }>;
  activityTypes: Array<{ value: string; label: string }>;
  onChange: (filters: Partial<ReportBuilderFiltersState>) => void;
}

export function ReportBuilderFilters({ filters, years, units, activityTypes, onChange }: ReportBuilderFiltersProps) {
  const [statuses, setStatuses] = useState<ActivityStatusSetting[]>(defaultActivityStatuses);

  useEffect(() => {
    getActivityStatusSettings().then(setStatuses).catch(() => undefined);
  }, []);

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
          <select value={filters.ma_nam_hoc} onChange={(event) => onChange({ ma_nam_hoc: event.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Chọn năm học</option>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Học kỳ</label>
          <select value={filters.hoc_ky} onChange={(event) => onChange({ hoc_ky: event.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Cả năm</option>
            <option value="1">Học kỳ I</option>
            <option value="2">Học kỳ II</option>
            <option value="3">Học kỳ hè</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Đơn vị</label>
          <select value={filters.ma_don_vi} onChange={(event) => onChange({ ma_don_vi: event.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả đơn vị</option>
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Loại hoạt động</label>
          <select value={filters.ma_loai} onChange={(event) => onChange({ ma_loai: event.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Trạng thái</label>
          <select value={filters.trang_thai} onChange={(event) => onChange({ trang_thai: event.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả trạng thái</option>
            {statuses.filter((status) => status.trang_thai === 'dang_su_dung').map((status) => (
              <option key={status.ma_trang_thai} value={status.ma_trang_thai}>{status.ten_hien_thi}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Khoảng thời gian</label>
          <div className="space-y-2">
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={filters.tu_ngay}
                onChange={(event) => onChange({ tu_ngay: event.target.value })}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Từ ngày"
              />
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={filters.den_ngay}
                onChange={(event) => onChange({ den_ngay: event.target.value })}
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
