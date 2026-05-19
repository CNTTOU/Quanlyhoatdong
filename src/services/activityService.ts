import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CurrentUserProfile, HoatDong } from '@/types/firebase';
import { addLog } from './auditLogService';
import { canAccessDonVi, hasPermission, isSystemAdmin } from './permissionService';

function assertActivityAccess(user: CurrentUserProfile, activity: HoatDong, permission: string) {
  if (!hasPermission(user, permission)) throw new Error('Bạn không có quyền thực hiện thao tác này.');
  if (!canAccessDonVi(user, activity.ma_don_vi)) throw new Error('Bạn không có quyền thao tác với đơn vị này.');
}

export async function createActivity(data: Partial<HoatDong>, user: CurrentUserProfile) {
  if (!hasPermission(user, 'them_hoat_dong')) throw new Error('Bạn không có quyền thêm hoạt động.');
  if (data.ma_don_vi && !canAccessDonVi(user, String(data.ma_don_vi))) throw new Error('Bạn không có quyền tạo hoạt động cho đơn vị này.');

  const ref = await addDoc(collection(db, 'hoat_dong'), {
    ...data,
    trang_thai: data.trang_thai ?? 'ban_nhap',
    nguoi_tao: user.uid,
    ten_nguoi_tao: user.ho_ten,
    so_luong_minh_chung: 0,
    da_luu_tru: false,
    ngay_tao: serverTimestamp(),
    ngay_cap_nhat: serverTimestamp(),
  });
  await updateDoc(ref, { ma_hoat_dong: ref.id });
  await addLog({ hanh_dong: 'them_hoat_dong', module: 'hoat_dong', ma_doi_tuong: ref.id, noi_dung: `Thêm hoạt động ${data.ten_hoat_dong ?? ref.id}` });
  return ref.id;
}

export async function updateActivity(maHoatDong: string, data: Partial<HoatDong>, user: CurrentUserProfile) {
  const snap = await getDoc(doc(db, 'hoat_dong', maHoatDong));
  if (!snap.exists()) throw new Error('Không tìm thấy hoạt động.');
  const activity = snap.data() as HoatDong;
  assertActivityAccess(user, activity, 'sua_hoat_dong');
  if (activity.trang_thai === 'da_duyet' && !isSystemAdmin(user) && !hasPermission(user, 'duyet_hoat_dong')) {
    throw new Error('Không được sửa hoạt động đã duyệt.');
  }
  await updateDoc(doc(db, 'hoat_dong', maHoatDong), { ...data, ngay_cap_nhat: serverTimestamp() });
  await addLog({ hanh_dong: 'sua_hoat_dong', module: 'hoat_dong', ma_doi_tuong: maHoatDong, noi_dung: `Cập nhật hoạt động ${activity.ten_hoat_dong}` });
}

async function transitionActivity(maHoatDong: string, user: CurrentUserProfile, action: string, status: string, permission: string, nhanXet = '') {
  const snap = await getDoc(doc(db, 'hoat_dong', maHoatDong));
  if (!snap.exists()) throw new Error('Không tìm thấy hoạt động.');
  const activity = snap.data() as HoatDong;
  assertActivityAccess(user, activity, permission);
  await updateDoc(doc(db, 'hoat_dong', maHoatDong), {
    trang_thai: status,
    ngay_cap_nhat: serverTimestamp(),
    ...(action === 'gui_duyet' ? { ngay_gui_duyet: serverTimestamp() } : {}),
    ...(action === 'duyet' ? { ngay_duyet: serverTimestamp(), nguoi_duyet: user.uid, ten_nguoi_duyet: user.ho_ten } : {}),
    ...(action === 'yeu_cau_bo_sung' ? { ly_do_yeu_cau_bo_sung: nhanXet } : {}),
  });
  await addDoc(collection(db, 'duyet_hoat_dong'), {
    ma_hoat_dong: maHoatDong,
    ten_hoat_dong: activity.ten_hoat_dong,
    hanh_dong: action,
    trang_thai_truoc: activity.trang_thai,
    trang_thai_sau: status,
    nhan_xet: nhanXet,
    nguoi_thuc_hien: user.uid,
    ten_nguoi_thuc_hien: user.ho_ten,
    ngay_thuc_hien: serverTimestamp(),
  });
  await addLog({ hanh_dong: action, module: 'hoat_dong', ma_doi_tuong: maHoatDong, noi_dung: `${action}: ${activity.ten_hoat_dong}` });
}

export const submitActivity = (maHoatDong: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'gui_duyet', 'cho_duyet', 'gui_duyet_hoat_dong');
export const approveActivity = (maHoatDong: string, nhanXet: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'duyet', 'da_duyet', 'duyet_hoat_dong', nhanXet);
export const requestSupplement = (maHoatDong: string, nhanXet: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'yeu_cau_bo_sung', 'can_bo_sung', 'yeu_cau_bo_sung_hoat_dong', nhanXet);
export const rejectActivity = (maHoatDong: string, nhanXet: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'tu_choi', 'tu_choi', 'tu_choi_hoat_dong', nhanXet);

export async function getActivitiesByCurrentUser(user: CurrentUserProfile) {
  const filters = [];
  if (!isSystemAdmin(user)) filters.push(where('ma_don_vi', '==', user.ma_don_vi));
  if (user.ma_vai_tro === 'nguoi_xem') filters.push(where('trang_thai', '==', 'da_duyet'));
  const q = filters.length ? query(collection(db, 'hoat_dong'), ...filters) : query(collection(db, 'hoat_dong'));
  const snap = await getDocs(q);
  return snap.docs.map((item) => ({ ma_hoat_dong: item.id, ...(item.data() as HoatDong) }));
}
