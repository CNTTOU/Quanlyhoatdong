import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CurrentUserProfile, DonVi, HoatDong, MinhChung } from '@/types/firebase';
import { getActivityTypes } from './activityTypeService';
import { getCachedSchoolYearsBasic } from './schoolYearService';
import { getCached, invalidateCache } from './cache';
import { getAccessibleUnits, getScopedActivities, getScopedEvidences } from './unitAccessService';
import { hasPermission, isSuperAdmin } from './permissionService';

export type ReportBuilderFiltersState = {
  ma_nam_hoc: string;
  hoc_ky: string;
  ma_don_vi: string;
  ma_loai: string;
  trang_thai: string;
  tu_ngay: string;
  den_ngay: string;
};

export type ReportBuilderOptionsState = {
  showImages: boolean;
  showLinks: boolean;
  showStats: boolean;
  showComments: boolean;
};

export type ReportTemplate = {
  ma_mau: string;
  ten_mau: string;
  loai_bao_cao: string;
  mo_ta: string;
  don_vi_ap_dung: string[];
  cau_truc: Array<{ thu_tu?: number; tieu_de: string; kieu: string; noi_dung?: string }>;
  truong_du_lieu_dong: string[];
  ho_tro_word: boolean;
  ho_tro_pdf: boolean;
  ho_tro_excel: boolean;
  la_mac_dinh: boolean;
  trang_thai: string;
};

export type ReportPreviewData = {
  title: string;
  subtitle: string;
  generatedAt: string;
  filtersText: string;
  stats: {
    totalActivities: number;
    participants: number;
    evidence: number;
    approved: number;
  };
  activities: Array<{
    id: string;
    name: string;
    unit: string;
    category: string;
    date: string;
    location: string;
    participants: number;
    result: string;
    links: string[];
  }>;
  evidences: Array<{
    id: string;
    name: string;
    activity: string;
    type: string;
    url: string;
  }>;
};

function toDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string' && value) return new Date(value);
  return null;
}

function toDateText(value: unknown) {
  const date = toDate(value);
  return date ? date.toLocaleDateString('vi-VN') : '';
}

function getSemester(date: Date | null) {
  if (!date) return '';
  const month = date.getMonth() + 1;
  if (month >= 9 || month <= 1) return '1';
  if (month >= 2 && month <= 6) return '2';
  return '3';
}

function matchesFilters(activity: HoatDong, filters: ReportBuilderFiltersState) {
  const date = toDate(activity.thoi_gian_bat_dau ?? activity.ngay_tao);
  if (filters.ma_nam_hoc && activity.ma_nam_hoc !== filters.ma_nam_hoc) return false;
  if (filters.hoc_ky && getSemester(date) !== filters.hoc_ky) return false;
  if (filters.ma_don_vi && activity.ma_don_vi !== filters.ma_don_vi) return false;
  if (filters.ma_loai && activity.ma_loai !== filters.ma_loai) return false;
  if (filters.trang_thai && activity.trang_thai !== filters.trang_thai) return false;
  if (filters.tu_ngay && date && date < new Date(filters.tu_ngay)) return false;
  if (filters.den_ngay && date && date > new Date(`${filters.den_ngay}T23:59:59`)) return false;
  return true;
}

function normalizeTemplate(data: Record<string, unknown>, id: string): ReportTemplate {
  return {
    ma_mau: String(data.ma_mau ?? id),
    ten_mau: String(data.ten_mau ?? data.ten_bao_cao ?? id),
    loai_bao_cao: String(data.loai_bao_cao ?? 'tong_ket_nam_hoc'),
    mo_ta: String(data.mo_ta ?? ''),
    don_vi_ap_dung: Array.isArray(data.don_vi_ap_dung) ? data.don_vi_ap_dung.map(String) : [],
    cau_truc: Array.isArray(data.cau_truc) ? data.cau_truc as ReportTemplate['cau_truc'] : [],
    truong_du_lieu_dong: Array.isArray(data.truong_du_lieu_dong) ? data.truong_du_lieu_dong.map(String) : [],
    ho_tro_word: data.ho_tro_word !== false,
    ho_tro_pdf: data.ho_tro_pdf !== false,
    ho_tro_excel: Boolean(data.ho_tro_excel),
    la_mac_dinh: Boolean(data.la_mac_dinh),
    trang_thai: String(data.trang_thai ?? 'dang_su_dung'),
  };
}

export async function getReportBuilderOptions(user: CurrentUserProfile) {
  const [schoolYears, activityTypes, units] = await Promise.all([
    getCachedSchoolYearsBasic(),
    getActivityTypes(),
    getAccessibleUnits(user),
  ]);

  return {
    years: schoolYears.map((year) => ({ value: year.ma_nam_hoc, label: year.ten_nam_hoc })),
    units: units.map((unit) => ({ value: unit.ma_don_vi, label: unit.ten_don_vi })),
    activityTypes: activityTypes.map((type) => ({ value: type.ma_loai, label: type.ten_loai })),
  };
}

export async function getReportTemplates(activeOnly = true) {
  return getCached(`report-templates:${activeOnly ? 'active' : 'all'}`, 2 * 60 * 1000, async () => {
    const snap = await getDocs(activeOnly ? query(collection(db, 'mau_bao_cao'), where('trang_thai', '==', 'dang_su_dung')) : collection(db, 'mau_bao_cao'));
    return snap.docs
      .map((item) => normalizeTemplate(item.data(), item.id))
      .sort((a, b) => Number(b.la_mac_dinh) - Number(a.la_mac_dinh) || a.ten_mau.localeCompare(b.ten_mau));
  });
}

export async function buildReportPreview(user: CurrentUserProfile, filters: ReportBuilderFiltersState, template: ReportTemplate | null): Promise<ReportPreviewData> {
  const [activities, evidences] = await Promise.all([getScopedActivities(user), getScopedEvidences(user)]);
  const filteredActivities = activities.filter((activity) => matchesFilters(activity, filters));
  const activityIds = new Set(filteredActivities.map((activity) => activity.ma_hoat_dong));
  const filteredEvidences = evidences.filter((evidence) => activityIds.has(String(evidence.ma_hoat_dong)));

  return {
    title: template?.ten_mau || 'Báo cáo tổng hợp',
    subtitle: template?.mo_ta || 'Hoạt động Đoàn - Hội',
    generatedAt: new Date().toLocaleDateString('vi-VN'),
    filtersText: [
      filters.ma_nam_hoc && `Năm học: ${filters.ma_nam_hoc}`,
      filters.hoc_ky && `Học kỳ: ${filters.hoc_ky}`,
      filters.ma_don_vi && `Đơn vị: ${filters.ma_don_vi}`,
      filters.ma_loai && `Loại: ${filters.ma_loai}`,
      filters.trang_thai && `Trạng thái: ${filters.trang_thai}`,
    ].filter(Boolean).join(' | ') || 'Tất cả dữ liệu được phép xem',
    stats: {
      totalActivities: filteredActivities.length,
      participants: filteredActivities.reduce((sum, activity) => sum + Number(activity.so_luong_tham_gia ?? 0), 0),
      evidence: filteredEvidences.length,
      approved: filteredActivities.filter((activity) => activity.trang_thai === 'da_duyet').length,
    },
    activities: filteredActivities.map((activity) => ({
      id: activity.ma_hoat_dong,
      name: activity.ten_hoat_dong,
      unit: activity.ten_don_vi,
      category: activity.ten_loai,
      date: toDateText(activity.thoi_gian_bat_dau),
      location: String(activity.dia_diem ?? ''),
      participants: Number(activity.so_luong_tham_gia ?? 0),
      result: String(activity.ket_qua ?? ''),
      links: [activity.link_bai_viet, activity.link_thu_muc_minh_chung].filter(Boolean).map(String),
    })),
    evidences: filteredEvidences.map((evidence) => ({
      id: evidence.ma_minh_chung,
      name: evidence.ten_minh_chung,
      activity: evidence.ten_hoat_dong,
      type: evidence.loai_minh_chung,
      url: String(evidence.duong_dan_file || evidence.duong_dan_thu_muc || ''),
    })),
  };
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderReportHtml(data: ReportPreviewData, template: ReportTemplate | null, options: ReportBuilderOptionsState) {
  const sections = template?.cau_truc?.length ? template.cau_truc : [
    { tieu_de: 'Tình hình chung', kieu: 'section' },
    { tieu_de: 'Kết quả thực hiện', kieu: 'table' },
    { tieu_de: 'Đánh giá chung', kieu: 'section' },
  ];

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(data.title)}</title>
  <style>body{font-family:Arial,sans-serif;line-height:1.5;color:#111827}table{border-collapse:collapse;width:100%;margin:12px 0}th,td{border:1px solid #d1d5db;padding:8px;text-align:left}h1,h2{text-align:center}.meta{color:#4b5563}.section{margin-top:24px}</style>
  </head><body>
  <h1>${escapeHtml(data.title)}</h1>
  <h2>${escapeHtml(data.subtitle)}</h2>
  <p class="meta">Ngày tạo: ${escapeHtml(data.generatedAt)}</p>
  <p class="meta">Bộ lọc: ${escapeHtml(data.filtersText)}</p>
  ${options.showStats ? `<div class="section"><h3>Số liệu thống kê</h3><ul><li>Tổng hoạt động: ${data.stats.totalActivities}</li><li>Lượt tham gia: ${data.stats.participants}</li><li>Minh chứng: ${data.stats.evidence}</li><li>Đã duyệt: ${data.stats.approved}</li></ul></div>` : ''}
  ${sections.map((section, index) => `<div class="section"><h3>${index + 1}. ${escapeHtml(section.tieu_de)}</h3>${section.kieu === 'table' ? `
    <table><thead><tr><th>Hoạt động</th><th>Đơn vị</th><th>Loại</th><th>Thời gian</th><th>Tham gia</th><th>Kết quả</th></tr></thead><tbody>
    ${data.activities.map((activity) => `<tr><td>${escapeHtml(activity.name)}</td><td>${escapeHtml(activity.unit)}</td><td>${escapeHtml(activity.category)}</td><td>${escapeHtml(activity.date)}</td><td>${activity.participants}</td><td>${escapeHtml(activity.result)}</td></tr>`).join('')}
    </tbody></table>` : `<p>Tổng hợp ${data.activities.length} hoạt động, ${data.stats.participants} lượt tham gia.</p>`}</div>`).join('')}
  ${options.showLinks ? `<div class="section"><h3>Liên kết minh chứng</h3><ul>${data.activities.flatMap((activity) => activity.links).map((link) => `<li>${escapeHtml(link)}</li>`).join('')}</ul></div>` : ''}
  ${options.showImages || options.showComments ? `<div class="section"><h3>Ghi chú</h3><p>Các tùy chọn hình ảnh/nhận xét được ghi nhận trong cấu hình xuất báo cáo.</p></div>` : ''}
  </body></html>`;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportReport(format: 'docx' | 'pdf' | 'xlsx', data: ReportPreviewData, template: ReportTemplate | null, filters: ReportBuilderFiltersState, options: ReportBuilderOptionsState, user: CurrentUserProfile) {
  if (!hasPermission(user, 'tao_bao_cao')) throw new Error('Bạn không có quyền tạo báo cáo.');
  const baseName = `${template?.ma_mau || 'bao_cao'}_${Date.now()}`;
  const html = renderReportHtml(data, template, options);
  const extension = format === 'docx' ? 'doc' : format === 'xlsx' ? 'xls' : 'html';
  const filename = `${baseName}.${extension}`;

  if (format === 'pdf') {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(html);
    printWindow?.document.close();
    printWindow?.print();
  } else {
    downloadFile(filename, html, format === 'xlsx' ? 'application/vnd.ms-excel;charset=utf-8' : 'application/msword;charset=utf-8');
  }

  await addDoc(collection(db, 'bao_cao_da_tao'), {
    ten_bao_cao: data.title,
    ma_mau: template?.ma_mau ?? '',
    loai_bao_cao: template?.loai_bao_cao ?? '',
    ma_nam_hoc: filters.ma_nam_hoc,
    ten_nam_hoc: filters.ma_nam_hoc,
    ma_don_vi: filters.ma_don_vi,
    ten_don_vi: filters.ma_don_vi,
    bo_loc_su_dung: filters,
    dinh_dang: format,
    duong_dan_file: filename,
    nguon_luu_tru: 'local_download',
    nguoi_tao: user.uid,
    ten_nguoi_tao: user.ho_ten,
    ngay_tao: serverTimestamp(),
  });
}

export async function saveReportTemplate(template: ReportTemplate, user: CurrentUserProfile) {
  if (!isSuperAdmin(user) && !hasPermission(user, 'cai_dat_he_thong')) throw new Error('Bạn không có quyền cấu hình mẫu báo cáo.');
  invalidateCache('report-templates:');
  await setDoc(doc(db, 'mau_bao_cao', template.ma_mau), {
    ...template,
    nguoi_tao: user.uid,
    ngay_cap_nhat: serverTimestamp(),
  }, { merge: true });
}

export async function deactivateReportTemplate(maMau: string, user: CurrentUserProfile) {
  if (!isSuperAdmin(user) && !hasPermission(user, 'cai_dat_he_thong')) throw new Error('Bạn không có quyền cấu hình mẫu báo cáo.');
  invalidateCache('report-templates:');
  await updateDoc(doc(db, 'mau_bao_cao', maMau), {
    trang_thai: 'ngung_su_dung',
    ngay_cap_nhat: serverTimestamp(),
  });
}

export async function setDefaultReportTemplate(template: ReportTemplate, user: CurrentUserProfile) {
  if (!isSuperAdmin(user) && !hasPermission(user, 'cai_dat_he_thong')) throw new Error('Bạn không có quyền cấu hình mẫu báo cáo.');
  invalidateCache('report-templates:');
  const snap = await getDocs(query(collection(db, 'mau_bao_cao'), where('loai_bao_cao', '==', template.loai_bao_cao)));
  const batch = writeBatch(db);
  snap.docs.forEach((item) => {
    batch.update(doc(db, 'mau_bao_cao', item.id), {
      la_mac_dinh: item.id === template.ma_mau,
      ngay_cap_nhat: serverTimestamp(),
    });
  });
  if (!snap.docs.some((item) => item.id === template.ma_mau)) {
    batch.update(doc(db, 'mau_bao_cao', template.ma_mau), {
      la_mac_dinh: true,
      ngay_cap_nhat: serverTimestamp(),
    });
  }
  await batch.commit();
}

export async function deleteReportTemplate(maMau: string, user: CurrentUserProfile) {
  if (!isSuperAdmin(user) && !hasPermission(user, 'cai_dat_he_thong')) throw new Error('Bạn không có quyền cấu hình mẫu báo cáo.');
  invalidateCache('report-templates:');
  await updateDoc(doc(db, 'mau_bao_cao', maMau), {
    trang_thai: 'da_xoa',
    la_mac_dinh: false,
    ngay_cap_nhat: serverTimestamp(),
  });
}
