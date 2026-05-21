import { useEffect, useState } from 'react';
import { navigationItems } from '@/routes/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSystemSettings, SYSTEM_SETTINGS_UPDATED_EVENT, type SystemSettings } from '@/services/settingService';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  const { hasPermission, hasAnyPermission } = useAuth();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const visibleItems = navigationItems.filter((item) => {
    const hasRequired = !item.requiredPermissions?.length || item.requiredPermissions.every(hasPermission);
    const hasAny = !item.anyPermissions?.length || hasAnyPermission(item.anyPermissions);
    return hasRequired && hasAny;
  });
  const systemName = settings?.ten_he_thong || 'Quản lý Đoàn - Hội';
  const unitName = settings?.ten_don_vi || 'Hệ thống hoạt động';

  useEffect(() => {
    getSystemSettings().then(setSettings).catch(() => undefined);

    const handleSettingsUpdated = (event: Event) => {
      setSettings((event as CustomEvent<SystemSettings>).detail);
    };

    window.addEventListener(SYSTEM_SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
    return () => window.removeEventListener(SYSTEM_SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
  }, []);

  return (
    <aside className="w-64 bg-[#1e3a8a] h-screen fixed left-0 top-0 text-white flex flex-col">
      <div className="p-6 border-b border-blue-700">
        <h1 className="line-clamp-2 text-xl leading-6 text-white">{systemName}</h1>
        <p className="mt-1 line-clamp-2 text-xs leading-4 text-blue-200">{unitName}</p>
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
