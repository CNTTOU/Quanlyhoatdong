import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '@/lib/firebase';
import type { CurrentUserProfile } from '@/types/firebase';
import * as authService from '@/services/authService';
import { hasAnyPermission, hasPermission, hasRole, isSuperAdmin, canAccessDonVi } from '@/services/permissionService';

interface AuthContextValue {
  user: CurrentUserProfile | null;
  loading: boolean;
  authReady: boolean;
  authError: string;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (maQuyen: string) => boolean;
  hasAnyPermission: (listQuyen: string[]) => boolean;
  hasRole: (maVaiTro: string) => boolean;
  isSuperAdmin: () => boolean;
  canAccessDonVi: (maDonVi: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setUser(null);
      return;
    }
    const profile = await authService.getCurrentUserProfile(currentUser.uid);
    setUser(profile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setAuthError('');
      try {
        if (!firebaseUser) {
          setUser(null);
          return;
        }

        const profile = await authService.getCurrentUserProfile(firebaseUser.uid);
        if (!profile) {
          setAuthError('Tài khoản chưa được cấp quyền trong hệ thống.');
          await authService.logout();
          setUser(null);
          return;
        }
        if (profile.trang_thai === 'tam_khoa' || profile.trang_thai === 'ngung_su_dung') {
          setAuthError(profile.trang_thai === 'tam_khoa' ? 'Tài khoản đang bị khóa.' : 'Tài khoản đã ngừng sử dụng.');
          await authService.logout();
          setUser(null);
          return;
        }

        await authService.syncActivityAuth();
        setUser(profile);
      } catch (error) {
        setUser(null);
        setAuthError(error instanceof Error ? error.message : 'Không thể xác thực tài khoản.');
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authReady,
      authError,
      logout: async () => {
        await authService.logout();
        setUser(null);
      },
      refreshUser,
      hasPermission: (maQuyen) => hasPermission(user, maQuyen),
      hasAnyPermission: (listQuyen) => hasAnyPermission(user, listQuyen),
      hasRole: (maVaiTro) => hasRole(user, maVaiTro),
      isSuperAdmin: () => isSuperAdmin(user),
      canAccessDonVi: (maDonVi) => canAccessDonVi(user, maDonVi),
    }),
    [user, loading, authReady, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
