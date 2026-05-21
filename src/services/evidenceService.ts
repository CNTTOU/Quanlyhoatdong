import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CurrentUserProfile, DonVi, HoatDong, MinhChung } from '@/types/firebase';
import { addLog } from './auditLogService';
import { getActivityTypes } from './activityTypeService';
import { getCachedSchoolYearsBasic } from './schoolYearService';
import { getCached, invalidateCache } from './cache';
import { getAccessibleUnits, getActivityUnitPathIds, getScopedActivities, getScopedEvidences } from './unitAccessService';
import { gatewayRequest } from './gatewayClient';

export type EvidenceType = 'image' | 'video' | 'pdf' | 'word' | 'excel' | 'link' | 'drive';

export type EvidenceRow = {
  id: string;
  name: string;
  type: EvidenceType;
  thumbnail?: string;
  activity: string;
  uploadDate: string;
  uploadTime: number;
  size?: string;
  url?: string;
  ma_nam_hoc: string;
  ma_don_vi: string;
  ma_loai: string;
  loai_minh_chung: string;
};

export type EvidenceFilterOptions = {
  years: Array<{ value: string; label: string }>;
  units: Array<{ value: string; label: string }>;
  activityTypes: Array<{ value: string; label: string }>;
};

export async function addEvidence(data: Partial<MinhChung>) {
  const result = await gatewayRequest<{ id: string }>('/api/evidence', {
    action: 'evidences.create',
    payload: { data },
  });
  invalidateCache('evidences:');
  return result.id;
}

export async function updateEvidence(maMinhChung: string, data: Partial<MinhChung>) {
  await gatewayRequest('/api/evidence', {
    action: 'evidences.update',
    payload: { id: maMinhChung, data },
  });
  invalidateCache('evidences:');
}

export async function deleteEvidence(maMinhChung: string) {
  await gatewayRequest('/api/evidence', {
    action: 'evidences.delete',
    payload: { id: maMinhChung },
  });
  invalidateCache('evidences:');
}

export async function getEvidenceByActivity(maHoatDong: string) {
  const snap = await getDocs(query(collection(db, 'minh_chung'), where('ma_hoat_dong', '==', maHoatDong)));
  return snap.docs.map((item) => ({ ma_minh_chung: item.id, ...(item.data() as MinhChung) }));
}

function toEvidenceType(evidence: MinhChung): EvidenceType {
  const evidenceType = String(evidence.loai_minh_chung ?? '');
  const storage = String(evidence.nguon_luu_tru ?? '');
  const fileFormat = String(evidence.dinh_dang_file ?? '').toLowerCase();

  if (evidence.loai_minh_chung === 'hinh_anh') return 'image';
  if (evidence.loai_minh_chung === 'video') return 'video';
  if (storage === 'google_drive' || evidenceType === 'link_google_drive') return 'drive';
  if (fileFormat.includes('pdf') || evidenceType === 'file_bao_cao') return 'pdf';
  if (fileFormat.includes('doc') || ['file_ke_hoach', 'bien_ban', 'cong_van', 'giay_chung_nhan'].includes(evidenceType)) return 'word';
  if (fileFormat.includes('xls') || evidenceType === 'danh_sach_tham_gia') return 'excel';
  return 'link';
}

function toDate(value: unknown) {
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate() as Date;
  }
  if (typeof value === 'string' && value) return new Date(value);
  return null;
}

function toFileSize(value: unknown) {
  const size = Number(value ?? 0);
  if (!size) return '';
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(size / 1024)} KB`;
}

async function getScopedActivitiesById(user: CurrentUserProfile) {
  const snap = await getScopedActivities(user);
  return new Map(
    snap.map((activity) => [activity.ma_hoat_dong, activity])
  );
}

export async function getEvidenceFilterOptions(user: CurrentUserProfile): Promise<EvidenceFilterOptions> {
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

export async function getEvidenceRowsByCurrentUser(user: CurrentUserProfile) {
  const cacheKey = `evidences:current:${user.uid}:${user.ma_vai_tro}:${user.ma_don_vi}`;
  return getCached(cacheKey, 30 * 1000, async () => {
    const [snap, activitiesById] = await Promise.all([
      getScopedEvidences(user),
      getScopedActivitiesById(user),
    ]);

    return snap.filter((evidence) => evidence.trang_thai !== 'da_xoa').map((evidence) => {
      const activity = activitiesById.get(String(evidence.ma_hoat_dong ?? ''));
      const uploadedAt = toDate(evidence.ngay_tai_len);
      const url = String(evidence.duong_dan_file || evidence.duong_dan_thu_muc || '');
      return {
        id: evidence.ma_minh_chung,
        name: String(evidence.ten_minh_chung || evidence.ten_file || 'Minh chứng'),
        type: toEvidenceType(evidence),
        thumbnail: evidence.loai_minh_chung === 'hinh_anh' ? url : '',
        activity: String(evidence.ten_hoat_dong || activity?.ten_hoat_dong || 'Chưa gắn hoạt động'),
        uploadDate: uploadedAt ? uploadedAt.toLocaleDateString('vi-VN') : 'Chưa có ngày tải lên',
        uploadTime: uploadedAt?.getTime() ?? 0,
        size: toFileSize(evidence.dung_luong_file),
        url,
        ma_nam_hoc: String(evidence.ma_nam_hoc || activity?.ma_nam_hoc || ''),
        ma_don_vi: String(evidence.ma_don_vi || activity?.ma_don_vi || ''),
        ma_loai: String(evidence.ma_loai || activity?.ma_loai || ''),
        loai_minh_chung: String(evidence.loai_minh_chung || ''),
      };
    });
  });
}
