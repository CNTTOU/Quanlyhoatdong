import { LogIn, Award } from "lucide-react";

interface PublicHeaderProps {
  onLoginClick: () => void;
}

export function PublicHeader({
  onLoginClick,
}: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Đoàn - Hội Khoa Công nghệ Thông tin
              </h1>
              <p className="text-xs text-gray-500">
                Trường Đại học Mở Tp. Hồ Chí Minh
              </p>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <LogIn className="w-5 h-5" />
            <span className="font-medium">Đăng nhập</span>
          </button>
        </div>
      </div>
    </header>
  );
}