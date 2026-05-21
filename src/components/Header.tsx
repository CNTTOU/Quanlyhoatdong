import { useEffect, useState } from 'react';
import { LayoutGrid, LogOut, Search, Bell, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AUTH_LOGOUT_FLAG, goToLoginAfterLogout } from '@/utils/externalApps';
import { getSystemSettings, SYSTEM_SETTINGS_UPDATED_EVENT, type SystemSettings } from '@/services/settingService';

function getGoogleDriveFileId(url: string) {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/) ?? url.match(/[?&]id=([^&]+)/);
  return match?.[1] ?? '';
}

function getLogoUrlCandidates(url: string) {
  const trimmedUrl = url.trim();
  const driveFileId = getGoogleDriveFileId(trimmedUrl);
  if (!driveFileId) return [trimmedUrl];
  return [
    `https://lh3.googleusercontent.com/d/${driveFileId}=w1000`,
    `https://drive.google.com/uc?export=view&id=${driveFileId}`,
    `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1000`,
  ];
}

function HeaderLogo({ logoUrl, systemName }: { logoUrl: string; systemName: string }) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const candidates = getLogoUrlCandidates(logoUrl);
  const src = candidates[candidateIndex] ?? '';

  useEffect(() => {
    setCandidateIndex(0);
  }, [logoUrl]);

  if (!src) return null;

  return (
    <div className="flex h-10 w-28 shrink-0 items-center justify-center overflow-hidden">
      <img
        src={src}
        alt={systemName}
        className="max-h-full max-w-full object-contain"
        onError={() => setCandidateIndex((current) => current + 1)}
      />
    </div>
  );
}

export function Header() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const systemName = settings?.ten_he_thong || 'Hệ thống hoạt động';

  useEffect(() => {
    getSystemSettings().then(setSettings).catch(() => undefined);

    const handleSettingsUpdated = (event: Event) => {
      setSettings((event as CustomEvent<SystemSettings>).detail);
    };

    window.addEventListener(SYSTEM_SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
    return () => window.removeEventListener(SYSTEM_SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
  }, []);

  const handleLogout = async () => {
    sessionStorage.setItem(AUTH_LOGOUT_FLAG, '1');
    await logout();
    goToLoginAfterLogout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6">
      <div className="flex flex-1 items-center gap-4">
        {settings?.logo_url && <HeaderLogo logoUrl={settings.logo_url} systemName={systemName} />}
        <div className="relative max-w-xl flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm hoạt động, đơn vị, sinh viên..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/login/chon-he-thong"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          title="Quay lại chọn phân hệ"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Phân hệ</span>
        </a>

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
