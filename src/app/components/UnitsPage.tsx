import { Plus } from 'lucide-react';
import { UnitsOverviewCards } from './UnitsOverviewCards';
import { UnitsFilters } from './UnitsFilters';
import { UnitsTable } from './UnitsTable';

const mockUnits = [
  {
    id: 1,
    name: 'Đoàn CNTT',
    type: 'Đoàn khoa',
    level: 'Cấp Khoa',
    manager: 'Nguyễn Văn A',
    email: 'doan.cntt@university.edu.vn',
    activities: 85,
    status: 'active' as const,
  },
  {
    id: 2,
    name: 'Hội Sinh viên Khoa học',
    type: 'Liên chi Hội',
    level: 'Cấp Khoa',
    manager: 'Trần Thị B',
    email: 'hoi.khoahoc@university.edu.vn',
    activities: 72,
    status: 'active' as const,
  },
  {
    id: 3,
    name: 'Chi đoàn K66 CNTT',
    type: 'Chi đoàn',
    level: 'Cấp Lớp',
    manager: 'Lê Văn C',
    email: 'chidoan.k66cntt@university.edu.vn',
    activities: 28,
    status: 'active' as const,
  },
  {
    id: 4,
    name: 'Chi hội SV Khoa học K67',
    type: 'Chi hội',
    level: 'Cấp Lớp',
    manager: 'Phạm Thị D',
    email: 'chihoi.k67kh@university.edu.vn',
    activities: 24,
    status: 'active' as const,
  },
  {
    id: 5,
    name: 'CLB Lập trình AI',
    type: 'Câu lạc bộ',
    level: 'Cấp Trường',
    manager: 'Hoàng Văn E',
    email: 'clb.ai@university.edu.vn',
    activities: 32,
    status: 'active' as const,
  },
  {
    id: 6,
    name: 'Đội tình nguyện Mùa hè xanh',
    type: 'Đội / Nhóm',
    level: 'Cấp Khoa',
    manager: 'Đỗ Thị F',
    email: 'doi.muahexanh@university.edu.vn',
    activities: 18,
    status: 'active' as const,
  },
  {
    id: 7,
    name: 'Chi đoàn K65 Kinh tế',
    type: 'Chi đoàn',
    level: 'Cấp Lớp',
    manager: 'Vũ Văn G',
    email: 'chidoan.k65kt@university.edu.vn',
    activities: 15,
    status: 'inactive' as const,
  },
  {
    id: 8,
    name: 'CLB Nhiếp ảnh',
    type: 'Câu lạc bộ',
    level: 'Cấp Trường',
    manager: 'Bùi Thị H',
    email: 'clb.nhiephanh@university.edu.vn',
    activities: 22,
    status: 'active' as const,
  },
  {
    id: 9,
    name: 'Hội chữ thập đỏ Trường',
    type: 'Liên chi Hội',
    level: 'Cấp Trường',
    manager: 'Ngô Văn I',
    email: 'hoi.chuthapdo@university.edu.vn',
    activities: 54,
    status: 'active' as const,
  },
  {
    id: 10,
    name: 'Chi hội SV K66 CNTT',
    type: 'Chi hội',
    level: 'Cấp Lớp',
    manager: 'Đinh Thị K',
    email: 'chihoi.k66cntt@university.edu.vn',
    activities: 26,
    status: 'active' as const,
  },
];

export function UnitsPage() {
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

      <UnitsTable units={mockUnits} />
    </div>
  );
}
