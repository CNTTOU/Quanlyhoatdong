import { navigationItems } from '@/routes/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const { hasPermission, hasAnyPermission } = useAuth();
  const visibleItems = navigationItems.filter((item) => {
    const hasRequired = !item.requiredPermissions?.length || item.requiredPermissions.every(hasPermission);
    const hasAny = !item.anyPermissions?.length || hasAnyPermission(item.anyPermissions);
    return hasRequired && hasAny;
  });

  return (
    <aside className="w-64 bg-[#1e3a8a] h-screen fixed left-0 top-0 text-white flex flex-col">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-xl text-white">Quản lý Đoàn - Hội</h1>
        <p className="text-xs text-blue-200 mt-1">Hệ thống hoạt động</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {visibleItems.map((item) => {
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
