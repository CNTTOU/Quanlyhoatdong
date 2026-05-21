import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CurrentUserProfile, LoaiHoatDong } from '@/types/firebase';
import { addLog } from './auditLogService';
import { getCached, invalidateCache } from './cache';
import { hasPermission, isSuperAdmin } from './permissionService';

export type ActivityTypeInput = Omit<LoaiHoatDong, 'thu_tu'> & { thu_tu?: number };

export async function getActivityTypes(includeInactive = false) {
  const items = await getCached('activity-types:all', 5 * 60 * 1000, async () => {
    const snap = await getDocs(query(collection(db, 'loai_hoat_dong'), orderBy('thu_tu', 'asc')));
    return snap.docs.map((item) => ({ ...(item.data() as LoaiHoatDong), ma_loai: item.id }));
  });
  return includeInactive ? items : items.filter((item) => item.trang_thai === 'dang_su_dung' || item.trang_thai === 'dang_hoat_dong');
}

export async function getActivityTypesWithCounts() {
  const items = await getActivityTypes(true);
  return Promise.all(
    items.map(async (item) => {
      const usedSnap = await getDocs(query(collection(db, 'hoat_dong'), where('ma_loai', '==', item.ma_loai)));
      return { ...item, count: usedSnap.size };
    }),
  );
}

function assertCanConfigure(user: CurrentUserProfile) {
  if (!isSuperAdmin(user) && !hasPermission(user, 'cai_dat_he_thong')) {
    throw new Error('Bạn không có quyền cấu hình hệ thống.');
  }
}

export async function saveActivityType(data: ActivityTypeInput, isEditing: boolean, user: CurrentUserProfile) {
  assertCanConfigure(user);
  invalidateCache('activity-types:');
  const ref = doc(db, 'loai_hoat_dong', data.ma_loai);
  if (!isEditing) {
    const existingSnap = await getDoc(ref);
    if (existingSnap.exists()) throw new Error('Mã loại hoạt động đã tồn tại.');
  }

  await setDoc(
    ref,
    {
      mo_ta: '',
      mau_hien_thi: '#2563EB',
      icon: '',
      thu_tu: 999,
      ...data,
      ngay_cap_nhat: serverTimestamp(),
      ...(!isEditing ? { ngay_tao: serverTimestamp() } : {}),
    },
    { merge: true },
  );

  await addLog({
    hanh_dong: isEditing ? 'sua_loai_hoat_dong' : 'them_loai_hoat_dong',
    module: 'loai_hoat_dong',
    ma_doi_tuong: data.ma_loai,
    noi_dung: `${isEditing ? 'Cập nhật' : 'Thêm'} loại hoạt động ${data.ten_loai}`,
  }).catch(() => undefined);
}

export async function lockActivityType(activityType: LoaiHoatDong, user: CurrentUserProfile) {
  assertCanConfigure(user);
  invalidateCache('activity-types:');
  const usedSnap = await getDocs(query(collection(db, 'hoat_dong'), where('ma_loai', '==', activityType.ma_loai)));
  await updateDoc(doc(db, 'loai_hoat_dong', activityType.ma_loai), {
    trang_thai: 'ngung_su_dung',
    ngay_cap_nhat: serverTimestamp(),
  });

  await addLog({
    hanh_dong: usedSnap.empty ? 'xoa_loai_hoat_dong' : 'khoa_loai_hoat_dong',
    module: 'loai_hoat_dong',
    ma_doi_tuong: activityType.ma_loai,
    noi_dung: `Ngừng sử dụng loại hoạt động ${activityType.ten_loai}`,
    muc_do: usedSnap.empty ? 'canh_bao' : 'nguy_hiem',
  }).catch(() => undefined);
}
