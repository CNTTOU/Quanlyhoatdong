import { doc, getDoc } from 'firebase/firestore';
import { identityDb } from '@/lib/firebase';
import type { CurrentUserProfile, NguoiDung, VaiTro } from '@/types/firebase';

export async function getRole(maVaiTro: string) {
  const roleSnap = await getDoc(doc(identityDb, 'vai_tro', maVaiTro));
  if (!roleSnap.exists()) return null;
  return { ...(roleSnap.data() as VaiTro), ma_vai_tro: roleSnap.id };
}

export async function getRolePermissions(maVaiTro: string) {
  const role = await getRole(maVaiTro);
  return role?.danh_sach_quyen ?? [];
}

export async function getRoleAuthorization(maVaiTro: string) {
  const role = await getRole(maVaiTro);
  return {
    permissions: role?.danh_sach_quyen ?? [],
    systems: role?.danh_sach_he_thong ?? [],
  };
}

export function buildEffectivePermissions(profile: Pick<NguoiDung, 'ma_vai_tro' | 'quyen_bo_sung' | 'quyen_bi_chan'>, rolePermissions: string[]) {
  return Array.from(new Set(rolePermissions));
}

export function hasPermission(user: CurrentUserProfile | null | undefined, maQuyen: string) {
  if (isSuperAdmin(user)) return true;
  return Boolean(user?.danh_sach_quyen?.includes(maQuyen));
}

export function hasAnyPermission(user: CurrentUserProfile | null | undefined, listQuyen: string[]) {
  return listQuyen.some((maQuyen) => hasPermission(user, maQuyen));
}

export function hasRole(user: CurrentUserProfile | null | undefined, maVaiTro: string) {
  return user?.ma_vai_tro === maVaiTro;
}

export function isSuperAdmin(user: CurrentUserProfile | null | undefined) {
  return hasRole(user, 'super_admin');
}

export function isSystemAdmin(user: CurrentUserProfile | null | undefined) {
  return user?.ma_vai_tro === 'super_admin' || user?.ma_vai_tro === 'admin_doan_hoi';
}

export function canAccessDonVi(user: CurrentUserProfile | null | undefined, maDonVi: string) {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  return user.ma_don_vi === maDonVi;
}

export function canEditActivityUnit(user: CurrentUserProfile | null | undefined) {
  return Boolean(user && (isSystemAdmin(user) || hasPermission(user, 'quan_ly_don_vi')));
}
