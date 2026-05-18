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
import { Breadcrumb } from './Breadcrumb';
import { ActivityDetailBanner } from './ActivityDetailBanner';
import { InfoCard } from './InfoCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

const activityData = {
  id: 1,
  title: 'Ngày hội tình nguyện mùa hè xanh 2026',
  category: 'Tình nguyện',
  unit: 'Đoàn CNTT',
  status: 'approved' as const,
  image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=400&fit=crop',
  startDate: '20/06/2026 08:00',
  endDate: '20/06/2026 17:00',
  location: 'Hội trường A - Trường Đại học ABC',
  level: 'Cấp Trường',
  target: 'Sinh viên K66, K67',
  participants: 450,
  objective: 'Tổ chức ngày hội tình nguyện nhằm nâng cao ý thức trách nhiệm của sinh viên đối với cộng đồng, góp phần lan tỏa tinh thần tình nguyện và những giá trị nhân văn trong môi trường sinh viên.',
  content: 'Chương trình bao gồm các hoạt động: Lễ phát động chiến dịch tình nguyện, Workshop về kỹ năng tình nguyện, Triển lãm ảnh các hoạt động tình nguyện tiêu biểu, Trao giải cuộc thi sáng tạo về tình nguyện, Giao lưu với các tình nguyện viên xuất sắc.',
  result: 'Chương trình thu hút 450 sinh viên tham gia, trong đó có 120 sinh viên đăng ký trở thành tình nguyện viên chính thức. Đã trao 30 giải thưởng cho các dự án tình nguyện xuất sắc. Thu thập được 5 tấn quần áo và 200 quyển sách ủng hộ cho vùng khó khăn.',
  note: 'Hoạt động được phối hợp với Hội chữ thập đỏ và các đơn vị tình nguyện địa phương.',
  fbLink: 'https://facebook.com/doan.cntt/posts/123456',
  driveLink: 'https://drive.google.com/drive/folders/abc123',
  creator: {
    name: 'Nguyễn Văn A',
    role: 'Bí thư Đoàn CNTT',
    avatar: '',
  },
  history: [
    { date: '15/06/2026 14:30', action: 'Đã duyệt hoạt động', by: 'Admin' },
    { date: '14/06/2026 10:00', action: 'Gửi yêu cầu duyệt', by: 'Nguyễn Văn A' },
    { date: '10/06/2026 09:00', action: 'Tạo hoạt động', by: 'Nguyễn Văn A' },
  ],
  images: [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  ],
};

export function ActivityDetailPage() {
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
