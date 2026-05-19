import { LogOut, Search, Bell, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AUTH_LOGOUT_FLAG, goToLoginAfterLogout } from '@/utils/externalApps';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    sessionStorage.setItem(AUTH_LOGOUT_FLAG, '1');
    await logout();
    goToLoginAfterLogout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm hoạt động, đơn vị, sinh viên..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm text-gray-900">{user?.ho_ten ?? 'Người dùng'}</p>
            <p className="text-xs text-gray-500">{user?.ten_vai_tro ?? 'Tài khoản nội bộ'}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Đăng xuất">
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
