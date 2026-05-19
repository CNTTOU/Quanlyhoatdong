import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ActivityFilters, FilterState } from '@/components/ActivityFilters';
import { ActivityTable } from '@/components/ActivityTable';
import { getInterfaceList } from '@/services/interfaceDataService';

interface ActivityListPageProps {
  onViewDetail: (id: number) => void;
  onCreate?: () => void;
}

type ActivityRow = Parameters<typeof ActivityTable>[0]['activities'][number];

export function ActivityListPage({ onViewDetail, onCreate }: ActivityListPageProps) {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    year: '',
    month: '',
    category: '',
    unit: '',
    status: '',
  });

  useEffect(() => {
    getInterfaceList<ActivityRow>('danh_sach_hoat_dong').then(setActivities);
  }, []);

  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(activities.length / itemsPerPage));

  const filteredActivities = activities.filter((activity) => {
    if (filters.search && !activity.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && activity.status !== filters.status) {
      return false;
    }
    return true;
  });

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">Danh sách hoạt động</h2>
          <p className="text-sm text-gray-500">
            Quản lý và tra cứu toàn bộ hoạt động Đoàn - Hội
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm hoạt động</span>
        </button>
      </div>

      <ActivityFilters onFilterChange={handleFilterChange} />

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị {paginatedActivities.length} / {filteredActivities.length} hoạt động
        </p>
      </div>

      <ActivityTable
        activities={paginatedActivities}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetail={onViewDetail}
      />
    </div>
  );
}
