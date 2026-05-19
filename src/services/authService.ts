import {
  signOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { CurrentUserProfile, NguoiDung } from '@/types/firebase';
import { getRolePermissions } from './permissionService';

export async function getCurrentUserProfile(uid: string): Promise<CurrentUserProfile | null> {
  const userSnap = await getDoc(doc(db, 'nguoi_dung', uid));
  if (!userSnap.exists()) return null;

  const profile = userSnap.data() as NguoiDung;
  const danh_sach_quyen = await getRolePermissions(profile.ma_vai_tro);
  return { ...profile, uid, danh_sach_quyen };
}

export async function updateLastLogin(uid: string) {
  await updateDoc(doc(db, 'nguoi_dung', uid), {
    lan_dang_nhap_cuoi: serverTimestamp(),
    ngay_cap_nhat: serverTimestamp(),
  });
}

export async function logout() {
  await signOut(auth);
}
