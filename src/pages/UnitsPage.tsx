import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { UnitsOverviewCards } from '@/components/UnitsOverviewCards';
import { UnitsFilters } from '@/components/UnitsFilters';
import { UnitsTable } from '@/components/UnitsTable';
import { getInterfaceList } from '@/services/interfaceDataService';

type UnitRow = Parameters<typeof UnitsTable>[0]['units'][number];

export function UnitsPage() {
  const [units, setUnits] = useState<UnitRow[]>([]);

  useEffect(() => {
    getInterfaceList<UnitRow>('danh_sach_don_vi').then(setUnits);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Quản lý đơn vị</h2>
          <p className="text-sm text-gray-500">
            Quản lý các đơn vị trực thuộc Đoàn - Hội
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
          <Plus className="w-5 h-5" />
          <span>Thêm đơn vị</span>
        </button>
      </div>

      <UnitsOverviewCards />

      <UnitsFilters onFilterChange={() => {}} />

      <UnitsTable units={units} />
    </div>
  );
}
