import {
  signInWithCustomToken,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { activityAuth, auth, identityDb } from '@/lib/firebase';
import type { CurrentUserProfile, NguoiDung } from '@/types/firebase';
import { getRoleAuthorization } from './permissionService';
import { gatewayRequest } from './gatewayClient';

export async function getCurrentUserProfile(uid: string): Promise<CurrentUserProfile | null> {
  const userSnap = await getDoc(doc(identityDb, 'nguoi_dung', uid));
  if (!userSnap.exists()) return null;

  const profile = userSnap.data() as NguoiDung;
  const authorization = await getRoleAuthorization(profile.ma_vai_tro);
  return { ...profile, uid, danh_sach_quyen: authorization.permissions, danh_sach_he_thong: authorization.systems };
}

export async function updateLastLogin(uid: string) {
  await updateDoc(doc(identityDb, 'nguoi_dung', uid), {
    lan_dang_nhap_cuoi: serverTimestamp(),
    ngay_cap_nhat: serverTimestamp(),
  });
}

export async function syncActivityAuth() {
  const result = await gatewayRequest<{ token: string }>('/api/authz/activity-token', {});
  await signInWithCustomToken(activityAuth, result.token);
}

export async function logout() {
  await Promise.all([signOut(auth), signOut(activityAuth).catch(() => undefined)]);
}
