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
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ActivityDetailBanner } from '@/components/ActivityDetailBanner';
import { InfoCard } from '@/components/InfoCard';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { getInterfaceDocument } from '@/services/interfaceDataService';

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
  fbLink: string;
  driveLink: string;
  creator: { name: string; role: string; avatar?: string };
  history: Array<{ date: string; action: string; by: string }>;
  images: string[];
};

export function ActivityDetailPage() {
  const [activityData, setActivityData] = useState<ActivityDetailData | null>(null);

  useEffect(() => {
    getInterfaceDocument<ActivityDetailData | null>('chi_tiet_hoat_dong_mac_dinh', null).then(setActivityData);
  }, []);

  if (!activityData) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500">
          Chưa có dữ liệu chi tiết hoạt động.
        </div>
      </div>
    );
  }

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

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
          <Edit className="w-4 h-4" />
          <span>Chỉnh sửa</span>
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo</span>
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Eye className="w-4 h-4" />
          <span>Xem ảnh</span>
        </button>
      </div>

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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái duyệt</p>
                <p className="text-green-600">Đã duyệt</p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Link minh chứng" icon={LinkIcon}>
            <div className="space-y-3">
              <a
                href={activityData.fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 truncate">Facebook</span>
              </a>
              <a
                href={activityData.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600 truncate">Google Drive</span>
              </a>
            </div>
          </InfoCard>

          <InfoCard title="File đính kèm" icon={FileText}>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Kế hoạch.pdf</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Báo cáo.pdf</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Danh sách.xlsx</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-600" />
              </div>
            </div>
          </InfoCard>

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
    </div>
  );
}
