import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ActivityFilters, FilterState } from './ActivityFilters';
import { ActivityTable } from './ActivityTable';

interface ActivityListPageProps {
  onViewDetail: (id: number) => void;
}

const mockActivities = [
  {
    id: 1,
    name: 'Ngày hội tình nguyện mùa hè xanh 2026',
    category: 'Tình nguyện',
    unit: 'Đoàn CNTT',
    date: '15/05/2026',
    participants: 450,
    evidence: 25,
    status: 'approved' as const,
  },
  {
    id: 2,
    name: 'Hội thảo khoa học sinh viên lần thứ 20',
    category: 'Học thuật',
    unit: 'Đoàn Khoa học',
    date: '12/05/2026',
    participants: 320,
    evidence: 18,
    status: 'pending' as const,
  },
  {
    id: 3,
    name: 'Chương trình đào tạo kỹ năng mềm K66',
    category: 'Kỹ năng',
    unit: 'Hội SVHS',
    date: '10/05/2026',
    participants: 280,
    evidence: 15,
    status: 'approved' as const,
  },
  {
    id: 4,
    name: 'Hiến máu tình nguyện - Giọt hồng yêu thương',
    category: 'Tình nguyện',
    unit: 'Hội chữ thập đỏ',
    date: '08/05/2026',
    participants: 520,
    evidence: 30,
    status: 'approved' as const,
  },
  {
    id: 5,
    name: 'Cuộc thi Olympic Tin học sinh viên',
    category: 'Học thuật',
    unit: 'Đoàn CNTT',
    date: '05/05/2026',
    participants: 180,
    evidence: 12,
    status: 'draft' as const,
  },
  {
    id: 6,
    name: 'Chương trình truyền thông chào tân sinh viên K67',
    category: 'Truyền thông',
    unit: 'Đoàn CNTT',
    date: '03/05/2026',
    participants: 650,
    evidence: 40,
    status: 'need-update' as const,
  },
  {
    id: 7,
    name: 'Workshop về AI và Machine Learning',
    category: 'Học thuật',
    unit: 'Đoàn CNTT',
    date: '01/05/2026',
    participants: 220,
    evidence: 10,
    status: 'approved' as const,
  },
  {
    id: 8,
    name: 'Sinh viên 5 tốt cấp trường 2026',
    category: 'SV5T',
    unit: 'Hội SVHS',
    date: '28/04/2026',
    participants: 95,
    evidence: 50,
    status: 'pending' as const,
  },
  {
    id: 9,
    name: 'Chiến dịch Mùa hè xanh 2026',
    category: 'Tình nguyện',
    unit: 'Đoàn CNTT',
    date: '25/04/2026',
    participants: 380,
    evidence: 22,
    status: 'approved' as const,
  },
  {
    id: 10,
    name: 'Talkshow kỹ năng giao tiếp và thuyết trình',
    category: 'Kỹ năng',
    unit: 'Hội SVHS',
    date: '20/04/2026',
    participants: 310,
    evidence: 16,
    status: 'approved' as const,
  },
];

export function ActivityListPage({ onViewDetail }: ActivityListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    year: '',
    month: '',
    category: '',
    unit: '',
    status: '',
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(mockActivities.length / itemsPerPage);

  const filteredActivities = mockActivities.filter((activity) => {
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
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
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
