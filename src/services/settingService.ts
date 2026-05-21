import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addLog } from './auditLogService';
import { getCached, invalidateCache } from './cache';

export interface SystemSettings {
  ten_he_thong: string;
  ten_don_vi: string;
  logo_url: string;
  email_lien_he: string;
  mau_chu_dao: string;
  cho_phep_dang_ky: boolean;
  cho_phep_google_login: boolean;
  chi_admin_tao_tai_khoan: boolean;
  nam_hoc_hien_tai: string;
  mo_ta?: string;
}

export interface ActivityStatusSetting {
  ma_trang_thai: string;
  khoa_hien_thi: string;
  ten_hien_thi: string;
  mau_hien_thi: string;
  thu_tu: number;
  trang_thai: string;
}

export interface DisplaySettings {
  mau_chu_dao: string;
  hien_thi_hoat_dong_noi_bat: boolean;
  cho_phep_truy_cap_cong_khai: boolean;
  hien_thi_lich_cong_khai: boolean;
  che_do_toi: boolean;
}

export const SYSTEM_SETTINGS_UPDATED_EVENT = 'system-settings-updated';

const defaultSettings: SystemSettings = {
  ten_he_thong: 'Quản lý hoạt động',
  ten_don_vi: 'Đoàn - Hội Khoa Công nghệ Thông tin',
  logo_url: '',
  email_lien_he: '',
  mau_chu_dao: '#0F4C81',
  cho_phep_dang_ky: false,
  cho_phep_google_login: false,
  chi_admin_tao_tai_khoan: true,
  nam_hoc_hien_tai: '2025_2026',
  mo_ta: 'Hệ thống lưu trữ và quản lý hoạt động Đoàn - Hội',
};

export const defaultActivityStatuses: ActivityStatusSetting[] = [
  { ma_trang_thai: 'ban_nhap', khoa_hien_thi: 'draft', ten_hien_thi: 'Nháp', mau_hien_thi: '#6B7280', thu_tu: 1, trang_thai: 'dang_su_dung' },
  { ma_trang_thai: 'cho_duyet', khoa_hien_thi: 'pending', ten_hien_thi: 'Chờ duyệt', mau_hien_thi: '#D97706', thu_tu: 2, trang_thai: 'dang_su_dung' },
  { ma_trang_thai: 'da_duyet', khoa_hien_thi: 'approved', ten_hien_thi: 'Đã duyệt', mau_hien_thi: '#16A34A', thu_tu: 3, trang_thai: 'dang_su_dung' },
  { ma_trang_thai: 'can_bo_sung', khoa_hien_thi: 'need-update', ten_hien_thi: 'Cần bổ sung', mau_hien_thi: '#EA580C', thu_tu: 4, trang_thai: 'dang_su_dung' },
  { ma_trang_thai: 'tu_choi', khoa_hien_thi: 'rejected', ten_hien_thi: 'Từ chối', mau_hien_thi: '#DC2626', thu_tu: 5, trang_thai: 'dang_su_dung' },
];

const defaultDisplaySettings: DisplaySettings = {
  mau_chu_dao: defaultSettings.mau_chu_dao,
  hien_thi_hoat_dong_noi_bat: true,
  cho_phep_truy_cap_cong_khai: false,
  hien_thi_lich_cong_khai: true,
  che_do_toi: false,
};

export async function getSystemSettings() {
  return getCached('settings:system', 5 * 60 * 1000, async () => {
    const ref = doc(db, 'cai_dat_he_thong', 'thong_tin_chung');
    const snap = await getDoc(ref);
    if (snap.exists()) return { ...defaultSettings, ...(snap.data() as Partial<SystemSettings>) };
    await setDoc(ref, { ...defaultSettings, ngay_cap_nhat: serverTimestamp() }, { merge: true });
    return defaultSettings;
  });
}

export async function updateSystemSettings(data: SystemSettings) {
  invalidateCache('settings:');
  const nextSettings = {
    ...data,
    cho_phep_dang_ky: false,
    cho_phep_google_login: false,
    chi_admin_tao_tai_khoan: true,
  };

  await setDoc(
    doc(db, 'cai_dat_he_thong', 'thong_tin_chung'),
    {
      ...nextSettings,
      ngay_cap_nhat: serverTimestamp(),
    },
    { merge: true },
  );
  invalidateCache('settings:');
  window.dispatchEvent(new CustomEvent<SystemSettings>(SYSTEM_SETTINGS_UPDATED_EVENT, { detail: nextSettings }));

  await addLog({
    hanh_dong: 'cap_nhat_cai_dat_he_thong',
    module: 'cai_dat_he_thong',
    ma_doi_tuong: 'thong_tin_chung',
    noi_dung: 'Cập nhật thông tin hệ thống',
  }).catch(() => undefined);
}

export async function getActivityStatusSettings() {
  return getCached('settings:activity-statuses', 5 * 60 * 1000, async () => {
    const ref = doc(db, 'cai_dat_he_thong', 'trang_thai_hoat_dong');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      const statuses = Array.isArray(data.danh_sach_trang_thai) ? data.danh_sach_trang_thai : [];
      return statuses
        .map((status) => status as Partial<ActivityStatusSetting>)
        .map((status) => ({
          ma_trang_thai: String(status.ma_trang_thai ?? ''),
          khoa_hien_thi: String(status.khoa_hien_thi ?? status.ma_trang_thai ?? ''),
          ten_hien_thi: String(status.ten_hien_thi ?? status.ma_trang_thai ?? ''),
          mau_hien_thi: String(status.mau_hien_thi ?? '#6B7280'),
          thu_tu: Number(status.thu_tu ?? 999),
          trang_thai: String(status.trang_thai ?? 'dang_su_dung'),
        }))
        .filter((status) => status.ma_trang_thai)
        .sort((a, b) => a.thu_tu - b.thu_tu);
    }

    await setDoc(ref, { danh_sach_trang_thai: defaultActivityStatuses, ngay_cap_nhat: serverTimestamp() }, { merge: true });
    return defaultActivityStatuses;
  });
}

export async function updateActivityStatusSettings(statuses: ActivityStatusSetting[]) {
  invalidateCache('settings:');
  await setDoc(
    doc(db, 'cai_dat_he_thong', 'trang_thai_hoat_dong'),
    {
      danh_sach_trang_thai: statuses,
      ngay_cap_nhat: serverTimestamp(),
    },
    { merge: true },
  );

  await addLog({
    hanh_dong: 'cap_nhat_trang_thai_hoat_dong',
    module: 'cai_dat_he_thong',
    ma_doi_tuong: 'trang_thai_hoat_dong',
    noi_dung: 'Cập nhật cấu hình trạng thái hoạt động',
  }).catch(() => undefined);
}

export async function getDisplaySettings() {
  return getCached('settings:display', 5 * 60 * 1000, async () => {
    const ref = doc(db, 'cai_dat_he_thong', 'giao_dien');
    const snap = await getDoc(ref);
    if (snap.exists()) return { ...defaultDisplaySettings, ...(snap.data() as Partial<DisplaySettings>) };
    await setDoc(ref, { ...defaultDisplaySettings, ngay_cap_nhat: serverTimestamp() }, { merge: true });
    return defaultDisplaySettings;
  });
}

export async function updateDisplaySettings(data: DisplaySettings) {
  invalidateCache('settings:');
  await setDoc(
    doc(db, 'cai_dat_he_thong', 'giao_dien'),
    {
      ...data,
      ngay_cap_nhat: serverTimestamp(),
    },
    { merge: true },
  );

  await setDoc(
    doc(db, 'cai_dat_he_thong', 'thong_tin_chung'),
    {
      mau_chu_dao: data.mau_chu_dao,
      ngay_cap_nhat: serverTimestamp(),
    },
    { merge: true },
  );

  await addLog({
    hanh_dong: 'cap_nhat_cai_dat_giao_dien',
    module: 'cai_dat_he_thong',
    ma_doi_tuong: 'giao_dien',
    noi_dung: 'Cập nhật cài đặt giao diện',
  }).catch(() => undefined);
}
