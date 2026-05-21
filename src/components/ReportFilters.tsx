import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { identityDb } from '@/lib/firebase';
import type { DonVi } from '@/types/firebase';
import { getActivityTypes } from '@/services/activityTypeService';
import { getCachedSchoolYearsBasic } from '@/services/schoolYearService';
import { getCached } from '@/services/cache';

interface ReportFiltersProps {
  onFilterChange: (filters: any) => void;
  filters?: any;
}

export function ReportFilters({ onFilterChange, filters = {} }: ReportFiltersProps) {
  const [years, setYears] = useState<Array<{ value: string; label: string }>>([]);
  const [units, setUnits] = useState<Array<{ value: string; label: string }>>([]);
  const [activityTypes, setActivityTypes] = useState<Array<{ value: string; label: string }>>([]);

  useEffect(() => {
    Promise.all([
      getCachedSchoolYearsBasic(),
      getActivityTypes(),
      getCached('units:all', 5 * 60 * 1000, async () => {
        const unitSnap = await getDocs(collection(identityDb, 'don_vi'));
        return unitSnap.docs.map((item) => ({ ma_don_vi: item.id, ...(item.data() as DonVi) }));
      }),
    ]).then(([schoolYears, types, allUnits]) => {
      setYears(schoolYears.map((year) => ({ value: year.ma_nam_hoc, label: year.ten_nam_hoc })));
      setActivityTypes(types.map((type) => ({ value: type.ma_loai, label: type.ten_loai })));
      setUnits(allUnits.map((unit) => ({ value: unit.ma_don_vi, label: unit.ten_don_vi ?? unit.ma_don_vi })));
    });
  }, []);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-gray-900">Bộ lọc thống kê</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">Năm học</label>
          <select value={filters.ma_nam_hoc ?? ''} onChange={(event) => onFilterChange({ ma_nam_hoc: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả năm</option>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Học kỳ</label>
          <select value={filters.hoc_ky ?? ''} onChange={(event) => onFilterChange({ hoc_ky: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Cả năm</option>
            <option value="1">Học kỳ I</option>
            <option value="2">Học kỳ II</option>
            <option value="3">Học kỳ hè</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Tháng</label>
          <select value={filters.thang ?? ''} onChange={(event) => onFilterChange({ thang: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
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
          <select value={filters.ma_don_vi ?? ''} onChange={(event) => onFilterChange({ ma_don_vi: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả đơn vị</option>
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
          <select value={filters.ma_loai ?? ''} onChange={(event) => onFilterChange({ ma_loai: event.target.value })} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="">Tất cả loại</option>
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
