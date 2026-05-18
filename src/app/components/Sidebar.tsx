import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Database,
  CheckSquare,
  BarChart3,
  Building2,
  Users,
  Settings,
  Award,
  FileEdit,
  Archive
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { id: 'featured', icon: Award, label: 'Hoạt động nổi bật' },
  { id: 'calendar', icon: Calendar, label: 'Lịch hoạt động' },
  { id: 'activities', icon: Calendar, label: 'Quản lý hoạt động' },
  { id: 'add', icon: PlusCircle, label: 'Thêm hoạt động' },
  { id: 'evidence', icon: Database, label: 'Kho minh chứng' },
  { id: 'approval', icon: CheckSquare, label: 'Duyệt hoạt động' },
  { id: 'reports', icon: BarChart3, label: 'Thống kê báo cáo' },
  { id: 'report-builder', icon: FileEdit, label: 'Tạo báo cáo' },
  { id: 'units', icon: Building2, label: 'Đơn vị' },
  { id: 'users', icon: Users, label: 'Người dùng' },
  { id: 'archive', icon: Archive, label: 'Lưu trữ năm học' },
  { id: 'settings', icon: Settings, label: 'Cài đặt' },
];

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1e3a8a] h-screen fixed left-0 top-0 text-white flex flex-col">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-xl text-white">Quản lý Đoàn - Hội</h1>
        <p className="text-xs text-blue-200 mt-1">Hệ thống hoạt động</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-l-4 border-cyan-400'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <p className="text-xs text-blue-200 text-center">© 2026 Đoàn - Hội</p>
      </div>
    </aside>
  );
}
