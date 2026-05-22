import {
  Calendar,
  MapPin,
  Users,
  Building2,
  Target,
  BookOpen,
  Award,
  MessageSquare,
  CheckCircle,
  Link as LinkIcon,
  FileText,
  User,
  Clock,
  Edit,
  Download,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, limit, query, Timestamp, where } from 'firebase/firestore';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ActivityDetailBanner } from '@/components/ActivityDetailBanner';
import { EvidencePreviewModal, getEvidenceDownloadUrl } from '@/components/EvidencePreviewModal';
import { InfoCard } from '@/components/InfoCard';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { getActivityById } from '@/services/activityService';
import { getEvidenceByActivity, type EvidenceType } from '@/services/evidenceService';
import { defaultActivityStatuses, getActivityStatusSettings, type ActivityStatusSetting } from '@/services/settingService';
import { identityDb } from '@/lib/firebase';
import type { MinhChung } from '@/types/firebase';
import { useAuth } from '@/contexts/AuthContext';

type ActivityDetailData = {
  id: number;
  title: string;
  category: string;
  unit: string;
  status: 'draft' | 'pending' | 'approved' | 'need-update';
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  level: string;
  target: string;
  participants: number;
  objective: string;
  content: string;
  result: string;
  note: string;
  rawStatus: string;
  evidenceLinks: Array<{ label: string; url: string }>;
  attachments: Array<{ name: string; type: EvidenceType; url: string; size?: string }>;
  creator: { name: string; role: string; avatar?: string };
  history: Array<{ date: string; action: string; by: string }>;
  images: string[];
};

function isUrl(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

async function getUnitTypeName(typeId: string, unitId: string) {
  let resolvedTypeId = typeId.trim();

  if (!resolvedTypeId && unitId) {
    const unitSnap = await getDoc(doc(identityDb, 'don_vi', unitId));
    resolvedTypeId = String(unitSnap.data()?.loai_don_vi || '').trim();
  }

  if (!resolvedTypeId) return '';

  const unitTypeSnap = await getDoc(doc(identityDb, 'loai_don_vi', resolvedTypeId));
  if (unitTypeSnap.exists()) {
    return String(unitTypeSnap.data().ten_loai || resolvedTypeId);
  }

  const fallbackSnap = await getDocs(query(collection(identityDb, 'loai_don_vi'), where('ma_loai', '==', resolvedTypeId), limit(1)));
  if (!fallbackSnap.empty) {
    return String(fallbackSnap.docs[0].data().ten_loai || resolvedTypeId);
  }

  return resolvedTypeId;
}

function toEvidenceUrl(evidence: MinhChung) {
  return String(evidence.duong_dan_file || evidence.duong_dan_thu_muc || '').trim();
}

function isFileEvidence(evidence: MinhChung) {
  const type = String(evidence.loai_minh_chung || '').toLowerCase();
  const format = String(evidence.dinh_dang_file || '').toLowerCase();
  return ['file', 'tep', 'pdf', 'word', 'excel', 'tai_lieu'].includes(type) || Boolean(format);
}

function toFileSize(value: unknown) {
  const size = Number(value ?? 0);
  if (!size) return '';
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(size / 1024)} KB`;
}

function toAttachmentType(evidence: MinhChung): EvidenceType {
  const format = String(evidence.dinh_dang_file || '').toLowerCase();
  const mimeType = String(evidence.mime_type || '').toLowerCase();
  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(format)) return 'image';
  if (format.includes('pdf') || mimeType.includes('pdf')) return 'pdf';
  if (format.includes('doc') || mimeType.includes('word')) return 'word';
  if (format.includes('xls') || format.includes('csv') || mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'excel';
  return 'link';
}

function isAutoActivityLinkEvidence(evidence: MinhChung) {
  const type = String(evidence.loai_minh_chung || '').toLowerCase();
  return Boolean(evidence.tu_dong_tu_hoat_dong) && ['link_bai_viet', 'link_google_drive'].includes(type);
}

function toDisplayDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toLocaleString('vi-VN');
  if (typeof value === 'string' && value) return new Date(value).toLocaleString('vi-VN');
  return '';
}

function toBannerStatus(status: string) {
  if (status === 'ban_nhap') return 'draft';
  if (status === 'cho_duyet') return 'pending';
  if (status === 'da_duyet') return 'approved';
  if (status === 'can_bo_sung') return 'need-update';
  return 'draft';
}

function getStatusMeta(statuses: ActivityStatusSetting[], status: ActivityDetailData['status']) {
  const config = statuses.find((item) => item.khoa_hien_thi === status);
  return {
    label: config?.ten_hien_thi ?? status,
    color: config?.mau_hien_thi ?? '#6B7280',
  };
}

export function ActivityDetailPage() {
  const { id } = useParams();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState<ActivityDetailData | null>(null);
  const [statuses, setStatuses] = useState<ActivityStatusSetting[]>(defaultActivityStatuses);
  const [previewAttachment, setPreviewAttachment] = useState<ActivityDetailData['attachments'][number] | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    Promise.all([getActivityById(id), getEvidenceByActivity(id)])
      .then(async ([activity, evidences]) => {
        if (!activity) {
          setActivityData(null);
          return;
        }

        const level = await getUnitTypeName(String(activity.cap_to_chuc || ''), String(activity.ma_don_vi || ''));
        const activityLinks = [
          { label: 'Bài truyền thông', url: String(activity.link_bai_viet || '').trim() },
          { label: 'Thư mục minh chứng', url: String(activity.link_thu_muc_minh_chung || '').trim() },
        ].filter((link) => isUrl(link.url));
        const evidenceLinks = evidences
          .filter((evidence) => !isFileEvidence(evidence) && !isAutoActivityLinkEvidence(evidence))
          .map((evidence) => ({
            label: String(evidence.ten_minh_chung || 'Minh chứng'),
            url: toEvidenceUrl(evidence),
          }))
          .filter((link) => isUrl(link.url));
        const attachments = evidences
          .filter(isFileEvidence)
          .map((evidence) => ({
            name: String(evidence.ten_minh_chung || evidence.duong_dan_file || 'File đính kèm'),
            type: toAttachmentType(evidence),
            url: toEvidenceUrl(evidence),
            size: toFileSize(evidence.dung_luong_file),
          }))
          .filter((file) => isUrl(file.url));

        setActivityData({
          id: 0,
          title: activity.ten_hoat_dong,
          category: activity.ten_loai,
          unit: activity.ten_don_vi,
          status: toBannerStatus(activity.trang_thai) as ActivityDetailData['status'],
          rawStatus: String(activity.trang_thai || ''),
          image: String(activity.anh_dai_dien || ''),
          startDate: toDisplayDate(activity.thoi_gian_bat_dau),
          endDate: toDisplayDate(activity.thoi_gian_ket_thuc),
          location: String(activity.dia_diem || ''),
          level,
          target: String(activity.doi_tuong_tham_gia || ''),
          participants: Number(activity.so_luong_tham_gia || 0),
          objective: String(activity.muc_tieu || ''),
          content: String(activity.noi_dung || ''),
          result: String(activity.ket_qua || ''),
          note: String(activity.ly_do_yeu_cau_bo_sung || ''),
          evidenceLinks: [...activityLinks, ...evidenceLinks],
          attachments,
          creator: { name: activity.ten_nguoi_tao, role: 'Người tạo' },
          history: [
            { date: toDisplayDate(activity.ngay_tao), action: 'Tạo hoạt động', by: activity.ten_nguoi_tao },
            ...(activity.ngay_gui_duyet ? [{ date: toDisplayDate(activity.ngay_gui_duyet), action: 'Gửi duyệt', by: activity.ten_nguoi_tao }] : []),
            ...(activity.ngay_duyet ? [{ date: toDisplayDate(activity.ngay_duyet), action: 'Duyệt hoạt động', by: String(activity.ten_nguoi_duyet || '') }] : []),
          ],
          images: activity.anh_dai_dien ? [String(activity.anh_dai_dien)] : [],
        });
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải chi tiết hoạt động.'));
  }, [id]);

  useEffect(() => {
    getActivityStatusSettings().then(setStatuses).catch(() => undefined);
  }, []);

  if (!activityData) {
    return (
      <div className="p-6">
        {message && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500">
          Chưa có dữ liệu chi tiết hoạt động.
        </div>
      </div>
    );
  }

  const statusMeta = getStatusMeta(statuses, activityData.status);
  const canEditActivity = hasPermission('sua_hoat_dong') && activityData.rawStatus !== 'da_duyet';
  const canCreateReport = hasPermission('tao_bao_cao');
  const openAttachmentUrl = (file: { url?: string }) => {
    if (!file.url) return;
    window.open(file.url, '_blank', 'noopener,noreferrer');
  };
  const downloadAttachmentUrl = (file: { url?: string }) => {
    if (!file.url) return;
    window.open(getEvidenceDownloadUrl(file.url), '_blank', 'noopener,noreferrer');
  };
  const hasActionButtons = canEditActivity || canCreateReport || activityData.images.length > 0;

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Hoạt động', href: '/activities' },
          { label: 'Chi tiết hoạt động' },
        ]}
      />

      <ActivityDetailBanner
        title={activityData.title}
        category={activityData.category}
        unit={activityData.unit}
        status={activityData.status}
        image={activityData.image}
      />

      {activityData.rawStatus === 'can_bo_sung' && (
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <AlertCircle className="h-5 w-5" />
            <span>Hoạt động cần bổ sung minh chứng</span>
          </div>
          <p className="text-sm leading-relaxed">
            {activityData.note || 'Cấp duyệt đã yêu cầu bổ sung thông tin hoặc minh chứng cho hoạt động này.'}
          </p>
        </div>
      )}

      {hasActionButtons && (
        <div className="flex items-center gap-3 mb-6">
          {canEditActivity && (
            <button
              onClick={() => navigate(`/activities/${id}/edit`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <Edit className="w-4 h-4" />
              <span>{activityData.rawStatus === 'can_bo_sung' ? 'Bổ sung / chỉnh sửa' : 'Chỉnh sửa'}</span>
            </button>
          )}
          {canCreateReport && (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </button>
          )}
          {activityData.images.length > 0 && (
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
              <span>Xem ảnh</span>
            </button>
          )}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Thông tin hoạt động" icon={Calendar}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian bắt đầu</p>
                  <p className="text-gray-900">{activityData.startDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian kết thúc</p>
                  <p className="text-gray-900">{activityData.endDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Địa điểm</p>
                  <p className="text-gray-900">{activityData.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Cấp tổ chức</p>
                  <p className="text-gray-900">{activityData.level}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Đối tượng tham gia</p>
                  <p className="text-gray-900">{activityData.target}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Số lượng tham gia</p>
                  <p className="text-xl text-blue-600">{activityData.participants} người</p>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Mục tiêu hoạt động" icon={Target}>
            <p className="text-gray-700 leading-relaxed">{activityData.objective}</p>
          </InfoCard>

          <InfoCard title="Nội dung triển khai" icon={BookOpen}>
            <p className="text-gray-700 leading-relaxed">{activityData.content}</p>
          </InfoCard>

          <InfoCard title="Kết quả đạt được" icon={Award}>
            <p className="text-gray-700 leading-relaxed">{activityData.result}</p>
          </InfoCard>

          <InfoCard title="Nhận xét / Ghi chú" icon={MessageSquare}>
            <p className="text-gray-700 leading-relaxed">{activityData.note}</p>
          </InfoCard>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <InfoCard title="Trạng thái" icon={CheckCircle}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${statusMeta.color}1A` }}>
                <CheckCircle className="w-6 h-6" style={{ color: statusMeta.color }} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái duyệt</p>
                <p style={{ color: statusMeta.color }}>{statusMeta.label}</p>
              </div>
            </div>
          </InfoCard>

          {activityData.evidenceLinks.length > 0 && (
            <InfoCard title="Link minh chứng" icon={LinkIcon}>
              <div className="space-y-3">
                {activityData.evidenceLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            </InfoCard>
          )}

          {activityData.attachments.length > 0 && (
            <InfoCard title="File đính kèm" icon={FileText}>
              <div className="space-y-2">
                {activityData.attachments.map((file) => (
                  <div
                    key={`${file.name}-${file.url}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="w-4 h-4 shrink-0 text-gray-600" />
                      <span className="truncate text-sm text-gray-700">{file.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(file)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        title="Xem"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadAttachmentUrl(file)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        title="Tải về"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          <InfoCard title="Người tạo" icon={User}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-900">{activityData.creator.name}</p>
                <p className="text-sm text-gray-500">{activityData.creator.role}</p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Lịch sử cập nhật" icon={Clock}>
            <div className="space-y-3">
              {activityData.history.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                    <p className="text-xs text-gray-400">Bởi {item.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mt-6">
        <InfoCard title="Thư viện ảnh hoạt động" icon={Eye}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activityData.images.map((image, index) => (
              <div
                key={index}
                className="aspect-video rounded-lg overflow-hidden cursor-pointer group relative"
              >
                <ImageWithFallback
                  src={image}
                  alt={`Ảnh hoạt động ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>

      <EvidencePreviewModal
        evidence={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        onDownload={downloadAttachmentUrl}
      />
    </div>
  );
}
