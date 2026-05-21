import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CurrentUserProfile, HoatDong, MinhChung } from '@/types/firebase';
import { addLog } from './auditLogService';
import { getCached, invalidateCache } from './cache';
import { hasPermission, isSuperAdmin } from './permissionService';

export interface SchoolYear {
  ma_nam_hoc: string;
  ten_nam_hoc: string;
  ngay_bat_dau: Timestamp | Date | string;
  ngay_ket_thuc: Timestamp | Date | string;
  trang_thai: string;
  la_nam_hoc_hien_tai: boolean;
  da_luu_tru: boolean;
  da_xoa_du_lieu_online: boolean;
  ngay_tao?: Timestamp;
  ngay_cap_nhat?: Timestamp;
}

export interface SchoolYearDisplay extends SchoolYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  activities: number;
  approvedActivities: number;
  evidence: number;
  reports: number;
  participants: number;
  dataItems: number;
  size: string;
  lastUpdated: string;
}

export type SchoolYearFormInput = Omit<SchoolYear, 'ngay_tao' | 'ngay_cap_nhat'>;

function toDateValue(value: Timestamp | Date | string) {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(value);
}

function toTimestamp(value: Timestamp | Date | string) {
  if (value instanceof Timestamp) return value;
  return Timestamp.fromDate(toDateValue(value));
}

function toDisplayDate(value: Timestamp | Date | string) {
  return toDateValue(value).toLocaleDateString('vi-VN');
}

async function getRelatedCount(collectionName: string, maNamHoc: string) {
  const snap = await getCountFromServer(query(collection(db, collectionName), where('ma_nam_hoc', '==', maNamHoc)));
  return snap.data().count;
}

async function getActivityStats(maNamHoc: string) {
  const snap = await getDocs(query(collection(db, 'hoat_dong'), where('ma_nam_hoc', '==', maNamHoc), where('trang_thai', '==', 'da_duyet')));
  const activities = snap.docs.map((item) => item.data() as HoatDong);

  return {
    ids: new Set(snap.docs.map((item) => item.id)),
    total: activities.length,
    approved: activities.length,
    participants: activities.reduce((sum, activity) => sum + Number(activity.so_luong_tham_gia ?? 0), 0),
  };
}

async function getApprovedEvidenceCount(maNamHoc: string, approvedActivityIds: Set<string>) {
  if (approvedActivityIds.size === 0) return 0;
  const snap = await getDocs(query(collection(db, 'minh_chung'), where('ma_nam_hoc', '==', maNamHoc)));
  return snap.docs.filter((item) => {
    const evidence = item.data() as MinhChung;
    return evidence.trang_thai !== 'da_xoa' && approvedActivityIds.has(String(evidence.ma_hoat_dong ?? ''));
  }).length;
}

export async function getSchoolYearsBasic() {
  const snap = await getDocs(query(collection(db, 'nam_hoc'), orderBy('ngay_bat_dau', 'desc')));
  return snap.docs.map((item) => ({ ...(item.data() as SchoolYear), ma_nam_hoc: item.id }));
}

export async function getCachedSchoolYearsBasic() {
  return getCached('school-years:basic', 5 * 60 * 1000, getSchoolYearsBasic);
}

export async function getSchoolYears() {
  const basicYears = await getCachedSchoolYearsBasic();
  const years = await Promise.all(
    basicYears.map(async (year) => {
      const activityStats = await getActivityStats(year.ma_nam_hoc);
      const [evidence, reports] = await Promise.all([
        getApprovedEvidenceCount(year.ma_nam_hoc, activityStats.ids),
        getRelatedCount('bao_cao_da_tao', year.ma_nam_hoc),
      ]);
      const dataItems = activityStats.total + evidence + reports;

      return {
        ...year,
        id: year.ma_nam_hoc,
        name: year.ten_nam_hoc,
        startDate: toDisplayDate(year.ngay_bat_dau),
        endDate: toDisplayDate(year.ngay_ket_thuc),
        status: year.trang_thai,
        activities: activityStats.total,
        approvedActivities: activityStats.approved,
        evidence,
        reports,
        participants: activityStats.participants,
        dataItems,
        size: `${dataItems} mục`,
        lastUpdated: year.ngay_cap_nhat ? toDisplayDate(year.ngay_cap_nhat) : toDisplayDate(year.ngay_ket_thuc),
      };
    }),
  );

  return years as SchoolYearDisplay[];
}

function assertCanCreateArchive(user: CurrentUserProfile) {
  if (!isSuperAdmin(user) && !hasPermission(user, 'tao_goi_luu_tru')) {
    throw new Error('Bạn không có quyền tạo gói lưu trữ.');
  }
}

function assertCanDeleteArchive(user: CurrentUserProfile) {
  if (!isSuperAdmin(user) && !hasPermission(user, 'xoa_du_lieu_nam_hoc')) {
    throw new Error('Bạn không có quyền xóa dữ liệu năm học.');
  }
}

export async function saveSchoolYear(data: SchoolYearFormInput, isEditing: boolean, user: CurrentUserProfile) {
  assertCanCreateArchive(user);
  invalidateCache('school-years:');
  const batch = writeBatch(db);
  const yearRef = doc(db, 'nam_hoc', data.ma_nam_hoc);

  if (data.la_nam_hoc_hien_tai) {
    const currentYears = await getDocs(query(collection(db, 'nam_hoc'), where('la_nam_hoc_hien_tai', '==', true)));
    currentYears.docs.forEach((item) => {
      if (item.id !== data.ma_nam_hoc) batch.update(item.ref, { la_nam_hoc_hien_tai: false, ngay_cap_nhat: serverTimestamp() });
    });
    batch.set(doc(db, 'cai_dat_he_thong', 'thong_tin_chung'), { nam_hoc_hien_tai: data.ma_nam_hoc, ngay_cap_nhat: serverTimestamp() }, { merge: true });
  }

  const yearData = {
    ...data,
    ngay_bat_dau: toTimestamp(data.ngay_bat_dau),
    ngay_ket_thuc: toTimestamp(data.ngay_ket_thuc),
    ngay_cap_nhat: serverTimestamp(),
    ...(!isEditing ? { ngay_tao: serverTimestamp() } : {}),
  };

  batch.set(yearRef, yearData, { merge: true });

  await batch.commit();
  await addLog({
    hanh_dong: isEditing ? 'sua_nam_hoc' : 'them_nam_hoc',
    module: 'nam_hoc',
    ma_doi_tuong: data.ma_nam_hoc,
    noi_dung: `${isEditing ? 'Cập nhật' : 'Thêm'} năm học ${data.ten_nam_hoc}`,
  }).catch(() => undefined);
}

export async function lockSchoolYear(year: SchoolYear, user: CurrentUserProfile) {
  assertCanCreateArchive(user);
  invalidateCache('school-years:');
  await updateDoc(doc(db, 'nam_hoc', year.ma_nam_hoc), {
    trang_thai: 'da_khoa',
    ngay_cap_nhat: serverTimestamp(),
  });

  await addLog({
    hanh_dong: 'khoa_nam_hoc',
    module: 'nam_hoc',
    ma_doi_tuong: year.ma_nam_hoc,
    noi_dung: `Khóa năm học ${year.ten_nam_hoc}`,
    muc_do: 'canh_bao',
  }).catch(() => undefined);
}

export async function deleteSchoolYear(year: SchoolYearDisplay, user: CurrentUserProfile) {
  assertCanDeleteArchive(user);
  invalidateCache('school-years:');
  if (year.la_nam_hoc_hien_tai) {
    await setDoc(doc(db, 'cai_dat_he_thong', 'thong_tin_chung'), { nam_hoc_hien_tai: '', ngay_cap_nhat: serverTimestamp() }, { merge: true });
  }

  await deleteDoc(doc(db, 'nam_hoc', year.ma_nam_hoc));
  await addLog({
    hanh_dong: 'xoa_nam_hoc',
    module: 'nam_hoc',
    ma_doi_tuong: year.ma_nam_hoc,
    noi_dung: `Xóa năm học ${year.ten_nam_hoc}. Dữ liệu liên quan: ${year.activities} hoạt động, ${year.evidence} minh chứng, ${year.reports} báo cáo.`,
    muc_do: year.activities + year.evidence + year.reports > 0 ? 'nguy_hiem' : 'canh_bao',
  }).catch(() => undefined);
}
