import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ActivityFilters, FilterState } from '@/components/ActivityFilters';
import { ActivityTable } from '@/components/ActivityTable';
import { useAuth } from '@/contexts/AuthContext';
import { deleteActivity, getActivityFormOptions, getActivityRowsByCurrentUser, updateActivityFeatured } from '@/services/activityService';

interface ActivityListPageProps {
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onCreate?: () => void;
}

type ActivityRow = Parameters<typeof ActivityTable>[0]['activities'][number];

export function ActivityListPage({ onViewDetail, onEdit, onCreate }: ActivityListPageProps) {
  const { user, hasPermission } = useAuth();
  const canEditActivity = hasPermission('sua_hoat_dong');
  const canDeleteActivity = hasPermission('xoa_hoat_dong');
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [years, setYears] = useState<Array<{ value: string; label: string }>>([]);
  const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([{ value: '', label: 'Tất cả loại' }]);
  const [units, setUnits] = useState<Array<{ value: string; label: string }>>([{ value: '', label: 'Tất cả đơn vị' }]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
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
    if (!user) return;

    setLoading(true);
    Promise.all([getActivityRowsByCurrentUser(user), getActivityFormOptions(user)])
      .then(([rows, options]) => {
        setActivities(rows);
        setYears(options.years.map((year) => ({ value: year.ma_nam_hoc, label: year.ten_nam_hoc })));
        setCategories([{ value: '', label: 'Tất cả loại' }, ...options.activityTypes.map((type) => ({ value: type.ma_loai, label: type.ten_loai }))]);
        setUnits([{ value: '', label: 'Tất cả đơn vị' }, ...options.units.map((unit) => ({ value: unit.ma_don_vi, label: unit.ten_don_vi }))]);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách hoạt động.'))
      .finally(() => setLoading(false));
  }, [user]);

  const itemsPerPage = 8;

  const filteredActivities = activities.filter((activity) => {
    if (filters.search && !activity.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && activity.status !== filters.status) {
      return false;
    }
    if (filters.year && activity.ma_nam_hoc !== filters.year) {
      return false;
    }
    if (filters.month && activity.month !== filters.month) {
      return false;
    }
    if (filters.category && activity.ma_loai !== filters.category) {
      return false;
    }
    if (filters.unit && activity.ma_don_vi !== filters.unit) {
      return false;
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const activity = activities.find((item) => item.id === id);
    const confirmed = window.confirm(`Xóa hoạt động ${activity?.name ?? id}?`);
    if (!confirmed) return;

    try {
      await deleteActivity(id, user);
      setActivities((current) => current.filter((item) => item.id !== id));
      setMessage('Đã xóa hoạt động thành công.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể xóa hoạt động.');
    }
  };

  const handleToggleFeatured = async (id: string, nextFeatured: boolean) => {
    if (!user) return;
    try {
      await updateActivityFeatured(id, nextFeatured, user);
      setActivities((current) => current.map((item) => (item.id === id ? { ...item, isFeatured: nextFeatured } : item)));
      setMessage(nextFeatured ? 'Đã hiển thị hoạt động ở module nổi bật.' : 'Đã ẩn hoạt động khỏi module nổi bật.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái nổi bật.');
    }
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
        {hasPermission('them_hoat_dong') && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm hoạt động</span>
          </button>
        )}
      </div>

      <ActivityFilters onFilterChange={handleFilterChange} years={years} categories={categories} units={units} />

      {message && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {loading ? 'Đang tải hoạt động...' : `Hiển thị ${paginatedActivities.length} / ${filteredActivities.length} hoạt động`}
        </p>
      </div>

      <ActivityTable
        activities={paginatedActivities}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetail={onViewDetail}
        onEdit={canEditActivity ? onEdit : undefined}
        onDelete={canDeleteActivity ? handleDelete : undefined}
        onToggleFeatured={canEditActivity ? handleToggleFeatured : undefined}
      />
    </div>
  );
}
