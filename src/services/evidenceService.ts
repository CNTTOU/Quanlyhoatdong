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
  raw: MinhChung;
};

export type EvidenceFilterOptions = {
  years: Array<{ value: string; label: string }>;
  units: Array<{ value: string; label: string }>;
  activityTypes: Array<{ value: string; label: string }>;
};

export type EvidenceActivityOption = {
  id: string;
  name: string;
  ma_nam_hoc: string;
  ma_loai: string;
  ten_loai: string;
  ma_don_vi: string;
  ten_don_vi: string;
};

export type EvidenceFormOptions = EvidenceFilterOptions & {
  activities: EvidenceActivityOption[];
};

export type EvidenceFormInput = {
  ma_hoat_dong: string;
  ten_minh_chung: string;
  loai_minh_chung: string;
  nguon_luu_tru: string;
  duong_dan_file: string;
  duong_dan_thu_muc: string;
  ten_file: string;
  dinh_dang_file: string;
  dung_luong_file: number;
  mime_type?: string;
  ghi_chu: string;
};

export type EvidenceUploadResult = {
  url: string;
  path: string;
  nguon_luu_tru: string;
  ten_file: string;
  dinh_dang_file: string;
  dung_luong_file: number;
  mime_type: string;
  loai_minh_chung: string;
};

type CloudinaryUploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  resourceType: 'image' | 'auto';
  signature: string;
};

const cloudinarySignatureCache = new Map<string, { expiresAt: number; value: CloudinaryUploadSignature }>();

export const defaultEvidenceFormInput: EvidenceFormInput = {
  ma_hoat_dong: '',
  ten_minh_chung: '',
  loai_minh_chung: 'hinh_anh',
  nguon_luu_tru: 'link_ngoai',
  duong_dan_file: '',
  duong_dan_thu_muc: '',
  ten_file: '',
  dinh_dang_file: '',
  dung_luong_file: 0,
  mime_type: '',
  ghi_chu: '',
};

export const evidenceTypeOptions = [
  { value: 'hinh_anh', label: 'Hình ảnh' },
  { value: 'video', label: 'Video' },
  { value: 'file_bao_cao', label: 'File báo cáo' },
  { value: 'file_ke_hoach', label: 'File kế hoạch' },
  { value: 'danh_sach_tham_gia', label: 'Danh sách tham gia' },
  { value: 'link_bai_viet', label: 'Link bài viết' },
  { value: 'link_google_drive', label: 'Google Drive' },
  { value: 'bien_ban', label: 'Biên bản' },
  { value: 'cong_van', label: 'Công văn' },
  { value: 'giay_chung_nhan', label: 'Giấy chứng nhận' },
];

export const evidenceStorageOptions = [
  { value: 'link_ngoai', label: 'Link ngoài' },
  { value: 'google_drive', label: 'Google Drive' },
  { value: 'cloudinary', label: 'Cloudinary' },
  { value: 'cloudflare_r2', label: 'Cloudflare R2' },
  { value: 'firebase_storage', label: 'Firebase Storage' },
  { value: 'one_drive', label: 'OneDrive' },
  { value: 'khac', label: 'Khác' },
];

function isUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

function buildEvidencePayload(data: EvidenceFormInput, activity?: EvidenceActivityOption): Partial<MinhChung> {
  const fileUrl = data.duong_dan_file.trim();
  const folderUrl = data.duong_dan_thu_muc.trim();
  return {
    ma_hoat_dong: activity?.id ?? data.ma_hoat_dong,
    ten_hoat_dong: activity?.name ?? '',
    ten_minh_chung: data.ten_minh_chung.trim(),
    loai_minh_chung: data.loai_minh_chung,
    nguon_luu_tru: data.nguon_luu_tru,
    duong_dan_file: fileUrl,
    duong_dan_thu_muc: folderUrl,
    ten_file: data.ten_file.trim(),
    dinh_dang_file: data.dinh_dang_file.trim().toLowerCase(),
    dung_luong_file: Number(data.dung_luong_file || 0),
    mime_type: String(data.mime_type || '').trim(),
    ghi_chu: data.ghi_chu.trim(),
    ma_nam_hoc: activity?.ma_nam_hoc ?? '',
    ma_loai: activity?.ma_loai ?? '',
    ten_loai: activity?.ten_loai ?? '',
    ma_don_vi: activity?.ma_don_vi ?? '',
    ten_don_vi: activity?.ten_don_vi ?? '',
  };
}

export function toEvidenceFormInput(evidence?: MinhChung): EvidenceFormInput {
  if (!evidence) return defaultEvidenceFormInput;
  return {
    ma_hoat_dong: String(evidence.ma_hoat_dong || ''),
    ten_minh_chung: String(evidence.ten_minh_chung || ''),
    loai_minh_chung: String(evidence.loai_minh_chung || 'hinh_anh'),
    nguon_luu_tru: String(evidence.nguon_luu_tru || 'link_ngoai'),
    duong_dan_file: String(evidence.duong_dan_file || ''),
    duong_dan_thu_muc: String(evidence.duong_dan_thu_muc || ''),
    ten_file: String(evidence.ten_file || ''),
    dinh_dang_file: String(evidence.dinh_dang_file || ''),
    dung_luong_file: Number(evidence.dung_luong_file || 0),
    mime_type: String(evidence.mime_type || ''),
    ghi_chu: String(evidence.ghi_chu || ''),
  };
}

export function validateEvidenceForm(data: EvidenceFormInput) {
  if (!data.ma_hoat_dong) return 'Vui lòng chọn hoạt động.';
  if (!data.ten_minh_chung.trim()) return 'Vui lòng nhập tên minh chứng.';
  if (!data.loai_minh_chung) return 'Vui lòng chọn loại minh chứng.';
  if (!data.duong_dan_file.trim() && !data.duong_dan_thu_muc.trim()) return 'Vui lòng nhập URL file hoặc URL thư mục.';
  if (data.duong_dan_file.trim() && !isUrl(data.duong_dan_file)) return 'URL file/link minh chứng không hợp lệ.';
  if (data.duong_dan_thu_muc.trim() && !isUrl(data.duong_dan_thu_muc)) return 'URL thư mục minh chứng không hợp lệ.';
  return '';
}

export async function addEvidence(data: EvidenceFormInput, activity?: EvidenceActivityOption) {
  const result = await gatewayRequest<{ id: string }>('/api/evidence', {
    action: 'evidences.create',
    payload: { data: buildEvidencePayload(data, activity) },
  });
  invalidateCache('evidences:');
  return result.id;
}

function getUploadFileInfo(file: File) {
  const mimeType = file.type || '';
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const format = extension === 'jpeg' ? 'jpg' : extension;
  const isImage = mimeType.startsWith('image/');
  const isSpreadsheet = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ].includes(mimeType) || ['xls', 'xlsx', 'csv'].includes(format);

  return {
    mimeType,
    format,
    resourceType: isImage ? 'image' as const : 'auto' as const,
    loai_minh_chung: isImage
      ? 'hinh_anh'
      : isSpreadsheet
        ? 'danh_sach_tham_gia'
        : mimeType === 'application/pdf' || format === 'pdf'
          ? 'file_bao_cao'
          : 'file_ke_hoach',
  };
}

async function uploadFileDirectlyToCloudinary(file: File, activityId: string) {
  const uploadInfo = getUploadFileInfo(file);
  const cacheKey = `${activityId}:${uploadInfo.resourceType}`;
  const cached = cloudinarySignatureCache.get(cacheKey);
  let signed = cached && cached.expiresAt > Date.now() ? cached.value : null;
  if (!signed) {
    signed = await gatewayRequest<CloudinaryUploadSignature>('/api/evidence', {
      action: 'evidences.cloudinarySignature',
      payload: {
        activityId,
        resourceType: uploadInfo.resourceType,
      },
    });
    cloudinarySignatureCache.set(cacheKey, {
      value: signed,
      expiresAt: Date.now() + 45 * 60 * 1000,
    });
  }

  const formData = new FormData();
  formData.set('file', file, file.name);
  formData.set('api_key', signed.apiKey);
  formData.set('timestamp', String(signed.timestamp));
  formData.set('folder', signed.folder);
  formData.set('signature', signed.signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${signed.resourceType}/upload`,
    { method: 'POST', body: formData },
  );
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result?.error?.message || 'Upload Cloudinary thất bại.');
  }

  return {
    url: String(result.secure_url || ''),
    path: `${result.resource_type || signed.resourceType}/${result.public_id || ''}`,
    nguon_luu_tru: 'cloudinary',
    ten_file: file.name,
    dinh_dang_file: uploadInfo.format,
    dung_luong_file: file.size,
    mime_type: uploadInfo.mimeType,
    loai_minh_chung: uploadInfo.loai_minh_chung,
  } satisfies EvidenceUploadResult;
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = () => reject(new Error('Không thể đọc file upload.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadEvidenceFile(file: File, activityId: string) {
  try {
    return await uploadFileDirectlyToCloudinary(file, activityId);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Không thể kết nối Cloudinary để upload file. Vui lòng kiểm tra mạng hoặc thử file nhỏ hơn.');
    }
    throw error;
  }
}

export async function uploadEvidenceFileViaGateway(file: File, activityId: string) {
  const dataBase64 = await readFileAsBase64(file);
  return gatewayRequest<EvidenceUploadResult>('/api/evidence', {
    action: 'evidences.upload',
    payload: {
      activityId,
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
        dataBase64,
      },
    },
  });
}

export async function updateEvidence(maMinhChung: string, data: EvidenceFormInput, activity?: EvidenceActivityOption) {
  await gatewayRequest('/api/evidence', {
    action: 'evidences.update',
    payload: { id: maMinhChung, data: buildEvidencePayload(data, activity) },
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

export async function getEvidenceFormOptions(user: CurrentUserProfile): Promise<EvidenceFormOptions> {
  const [filterOptions, activities] = await Promise.all([
    getEvidenceFilterOptions(user),
    getScopedActivities(user),
  ]);

  return {
    ...filterOptions,
    activities: activities
      .filter((activity) => activity.trang_thai !== 'ban_nhap')
      .map((activity) => ({
        id: activity.ma_hoat_dong,
        name: activity.ten_hoat_dong,
        ma_nam_hoc: activity.ma_nam_hoc,
        ma_loai: activity.ma_loai,
        ten_loai: activity.ten_loai,
        ma_don_vi: activity.ma_don_vi,
        ten_don_vi: activity.ten_don_vi,
      })),
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
      const evidenceType = String(evidence.loai_minh_chung || '');
      const activityPreviewImage = String(activity?.anh_dai_dien || '');
      const thumbnail = evidenceType === 'hinh_anh'
        ? url
        : evidenceType === 'link_bai_viet'
          ? activityPreviewImage
          : '';
      return {
        id: evidence.ma_minh_chung,
        name: String(evidence.ten_minh_chung || evidence.ten_file || 'Minh chứng'),
        type: toEvidenceType(evidence),
        thumbnail,
        activity: String(evidence.ten_hoat_dong || activity?.ten_hoat_dong || 'Chưa gắn hoạt động'),
        uploadDate: uploadedAt ? uploadedAt.toLocaleDateString('vi-VN') : 'Chưa có ngày tải lên',
        uploadTime: uploadedAt?.getTime() ?? 0,
        size: toFileSize(evidence.dung_luong_file),
        url,
        ma_nam_hoc: String(evidence.ma_nam_hoc || activity?.ma_nam_hoc || ''),
        ma_don_vi: String(evidence.ma_don_vi || activity?.ma_don_vi || ''),
        ma_loai: String(evidence.ma_loai || activity?.ma_loai || ''),
        loai_minh_chung: String(evidence.loai_minh_chung || ''),
        raw: evidence,
      };
    });
  });
}
