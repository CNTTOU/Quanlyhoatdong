import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, identityDb } from '@/lib/firebase';
import type { CurrentUserProfile, DonVi, HoatDong, LoaiHoatDong, NamHoc } from '@/types/firebase';
import { addLog } from './auditLogService';
import { canEditActivityUnit, hasPermission, isSystemAdmin } from './permissionService';
import { getCached, invalidateCache } from './cache';
import { getActivityTypes } from './activityTypeService';
import { getCachedSchoolYearsBasic } from './schoolYearService';
import { canAccessUnit, getAccessibleUnits, getActivityUnitPathIds, getAllUnits, getScopedActivities } from './unitAccessService';
import { gatewayRequest } from './gatewayClient';

export interface ActivityFormInput {
  ten_hoat_dong: string;
  ma_nam_hoc: string;
  ma_loai: string;
  ma_don_vi: string;
  cap_to_chuc: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  dia_diem: string;
  doi_tuong_tham_gia: string;
  so_luong_tham_gia: number;
  muc_tieu: string;
  noi_dung: string;
  ket_qua: string;
  link_bai_viet: string;
  link_thu_muc_minh_chung: string;
  anh_dai_dien?: string;
}

function createSearchKeywords(values: Array<string | number | undefined>) {
  return values
    .flatMap((value) => String(value ?? '').toLowerCase().split(/\s+/))
    .map((value) => value.trim())
    .filter(Boolean);
}

function toDateText(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toLocaleDateString('vi-VN');
  if (typeof value === 'string' && value) return new Date(value).toLocaleDateString('vi-VN');
  return '';
}

function toStatusKey(status: string) {
  if (status === 'ban_nhap') return 'draft';
  if (status === 'cho_duyet') return 'pending';
  if (status === 'da_duyet') return 'approved';
  if (status === 'can_bo_sung') return 'need-update';
  return 'draft';
}

function toApprovalStatus(status: string) {
  if (status === 'cho_duyet') return 'pending';
  if (status === 'da_duyet') return 'approved';
  if (status === 'can_bo_sung') return 'need-update';
  if (status === 'tu_choi') return 'rejected';
  return 'pending';
}

function toTimestamp(value: string) {
  return Timestamp.fromDate(new Date(value));
}

async function assertActivityAccess(user: CurrentUserProfile, activity: HoatDong, permission: string) {
  if (!hasPermission(user, permission)) throw new Error('Bạn không có quyền thực hiện thao tác này.');
  if (!(await canAccessUnit(user, activity.ma_don_vi))) throw new Error('Bạn không có quyền thao tác với đơn vị này.');
}

async function assertSchoolYearUnlocked(activity: HoatDong, user: CurrentUserProfile) {
  await assertSchoolYearUnlockedById(activity.ma_nam_hoc, user);
}

async function assertSchoolYearUnlockedById(maNamHoc: unknown, user: CurrentUserProfile) {
  if (user.ma_vai_tro === 'super_admin' || !maNamHoc) return;
  const yearSnap = await getDoc(doc(db, 'nam_hoc', String(maNamHoc)));
  if (yearSnap.exists() && yearSnap.data().trang_thai === 'da_khoa') {
    throw new Error('Năm học đã khóa, không thể thao tác hoạt động.');
  }
}

export async function createActivity(data: Partial<HoatDong>, user: CurrentUserProfile) {
  const result = await gatewayRequest<{ id: string }>('/api/activity', {
    action: 'activities.create',
    payload: { data, status: data.trang_thai ?? 'ban_nhap' },
  });
  invalidateCache('activities:');
  return result.id;
}

export async function createActivityWithId(data: ActivityFormInput, user: CurrentUserProfile, status = 'ban_nhap') {
  const result = await gatewayRequest<{ id: string }>('/api/activity', {
    action: 'activities.create',
    payload: { data, status },
  });
  invalidateCache('activities:');
  return result.id;
}

export async function updateActivity(maHoatDong: string, data: Partial<HoatDong>, user: CurrentUserProfile) {
  await gatewayRequest('/api/activity', {
    action: 'activities.update',
    payload: { id: maHoatDong, data },
  });
  invalidateCache('activities:');
}

export async function deleteActivity(maHoatDong: string, user: CurrentUserProfile) {
  await gatewayRequest('/api/activity', {
    action: 'activities.delete',
    payload: { id: maHoatDong },
  });
  invalidateCache('activities:');
}

export async function updateActivityFeatured(maHoatDong: string, featured: boolean, user: CurrentUserProfile) {
  await gatewayRequest('/api/activity', {
    action: 'activities.featured',
    payload: { id: maHoatDong, featured },
  });
  invalidateCache('activities:');
}

async function transitionActivity(maHoatDong: string, user: CurrentUserProfile, action: string, status: string, permission: string, nhanXet = '') {
  await gatewayRequest('/api/activity', {
    action: 'activities.transition',
    payload: { id: maHoatDong, action, status, permission, comment: nhanXet },
  });
  invalidateCache('activities:');
}

export const submitActivity = (maHoatDong: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'gui_duyet', 'cho_duyet', 'gui_duyet_hoat_dong');
export const approveActivity = (maHoatDong: string, nhanXet: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'duyet', 'da_duyet', 'duyet_hoat_dong', nhanXet);
export const requestSupplement = (maHoatDong: string, nhanXet: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'yeu_cau_bo_sung', 'can_bo_sung', 'yeu_cau_bo_sung_hoat_dong', nhanXet);
export const rejectActivity = (maHoatDong: string, nhanXet: string, user: CurrentUserProfile) => transitionActivity(maHoatDong, user, 'tu_choi', 'tu_choi', 'tu_choi_hoat_dong', nhanXet);

export async function getActivitiesByCurrentUser(user: CurrentUserProfile) {
  const cacheKey = `activities:current:${user.uid}:${user.ma_vai_tro}:${user.ma_don_vi}`;
  return getCached(cacheKey, 30 * 1000, async () => {
    const activities = await getScopedActivities(user);
    if (user.ma_vai_tro === 'nguoi_xem') {
      return activities.filter((activity) => activity.trang_thai === 'da_duyet');
    }
    return activities;
  });
}

export async function getActivityRowsByCurrentUser(user: CurrentUserProfile) {
  const activities = await getActivitiesByCurrentUser(user);
  return activities.map((activity) => ({
    id: activity.ma_hoat_dong,
    name: activity.ten_hoat_dong,
    category: activity.ten_loai,
    unit: activity.ten_don_vi,
    date: toDateText(activity.thoi_gian_bat_dau),
    month: activity.thoi_gian_bat_dau instanceof Timestamp ? String(activity.thoi_gian_bat_dau.toDate().getMonth() + 1) : '',
    participants: Number(activity.so_luong_tham_gia ?? 0),
    evidence: Number(activity.so_luong_minh_chung ?? 0),
    status: toStatusKey(activity.trang_thai) as 'draft' | 'pending' | 'approved' | 'need-update',
    isFeatured: Boolean(activity.hien_thi_noi_bat),
    ma_nam_hoc: activity.ma_nam_hoc,
    ma_loai: activity.ma_loai,
    ma_don_vi: activity.ma_don_vi,
  }));
}

export async function getApprovalActivities(user: CurrentUserProfile) {
  const activities = await getActivitiesByCurrentUser(user);
  return activities
    .filter((activity) => ['cho_duyet', 'da_duyet', 'can_bo_sung', 'tu_choi'].includes(activity.trang_thai))
    .map((activity) => ({
      id: activity.ma_hoat_dong,
      name: activity.ten_hoat_dong,
      unit: activity.ten_don_vi,
      ma_nam_hoc: activity.ma_nam_hoc,
      submitDate: toDateText(activity.ngay_gui_duyet ?? activity.ngay_cap_nhat ?? activity.ngay_tao),
      category: activity.ten_loai,
      evidenceCount: Number(activity.so_luong_minh_chung ?? 0),
      status: toApprovalStatus(activity.trang_thai) as 'pending' | 'approved' | 'need-update' | 'rejected',
      level: String(activity.cap_to_chuc ?? ''),
      startDate: toDateText(activity.thoi_gian_bat_dau),
      endDate: toDateText(activity.thoi_gian_ket_thuc),
      location: String(activity.dia_diem ?? ''),
      participants: Number(activity.so_luong_tham_gia ?? 0),
      objective: String(activity.muc_tieu ?? ''),
      content: String(activity.noi_dung ?? ''),
      evidences: {
        images: 0,
        files: Number(activity.so_luong_minh_chung ?? 0),
        links: [activity.link_bai_viet, activity.link_thu_muc_minh_chung].filter(Boolean).map(String),
      },
      history: [
        { date: toDateText(activity.ngay_tao), action: 'Tạo hoạt động', by: activity.ten_nguoi_tao },
        ...(activity.ngay_gui_duyet ? [{ date: toDateText(activity.ngay_gui_duyet), action: 'Gửi duyệt', by: activity.ten_nguoi_tao }] : []),
        ...(activity.ngay_duyet ? [{ date: toDateText(activity.ngay_duyet), action: 'Duyệt hoạt động', by: String(activity.ten_nguoi_duyet ?? '') }] : []),
      ],
    }));
}

export async function getActivityById(maHoatDong: string) {
  const snap = await getDoc(doc(db, 'hoat_dong', maHoatDong));
  if (!snap.exists()) return null;
  return { ma_hoat_dong: snap.id, ...(snap.data() as HoatDong) };
}

export async function getActivityFormOptions(user: CurrentUserProfile) {
  const [years, activityTypes, units] = await Promise.all([
    getCachedSchoolYearsBasic(),
    getActivityTypes(),
    canEditActivityUnit(user) ? getAccessibleUnits(user) : getAllUnits().then((allUnits) => allUnits.filter((unit) => unit.ma_don_vi === user.ma_don_vi)),
  ]);

  return {
    years: years.filter((item) => item.trang_thai !== 'da_khoa') as NamHoc[],
    activityTypes: activityTypes as LoaiHoatDong[],
    units,
    canEditUnit: canEditActivityUnit(user),
  };
}
