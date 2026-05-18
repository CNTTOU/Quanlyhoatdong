import { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { EvidenceTabs } from './EvidenceTabs';
import { EvidenceFilters } from './EvidenceFilters';
import { EvidenceCard } from './EvidenceCard';

const mockEvidences = [
  {
    id: 1,
    name: 'Lễ khai mạc Ngày hội tình nguyện 2026',
    type: 'image' as const,
    thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
    activity: 'Ngày hội tình nguyện mùa hè xanh 2026',
    uploadDate: '15/05/2026',
    size: '2.4 MB',
  },
  {
    id: 2,
    name: 'Video tổng hợp hoạt động tháng 5',
    type: 'video' as const,
    activity: 'Chiến dịch Mùa hè xanh 2026',
    uploadDate: '14/05/2026',
    size: '45.2 MB',
  },
  {
    id: 3,
    name: 'Báo cáo kết quả Hội thảo khoa học',
    type: 'pdf' as const,
    activity: 'Hội thảo khoa học sinh viên lần thứ 20',
    uploadDate: '12/05/2026',
    size: '1.8 MB',
  },
  {
    id: 4,
    name: 'Danh sách tham gia Workshop AI',
    type: 'excel' as const,
    activity: 'Workshop về AI và Machine Learning',
    uploadDate: '10/05/2026',
    size: '156 KB',
  },
  {
    id: 5,
    name: 'Kế hoạch tổ chức hiến máu tình nguyện',
    type: 'word' as const,
    activity: 'Hiến máu tình nguyện - Giọt hồng yêu thương',
    uploadDate: '08/05/2026',
    size: '420 KB',
  },
  {
    id: 6,
    name: 'Bài viết Facebook - Ngày hội tình nguyện',
    type: 'link' as const,
    activity: 'Ngày hội tình nguyện mùa hè xanh 2026',
    uploadDate: '16/05/2026',
    url: 'https://facebook.com/...',
  },
  {
    id: 7,
    name: 'Thư viện ảnh hoạt động tháng 5',
    type: 'drive' as const,
    activity: 'Tổng hợp minh chứng tháng 5/2026',
    uploadDate: '01/06/2026',
    url: 'https://drive.google.com/...',
  },
  {
    id: 8,
    name: 'Sinh viên tham gia tình nguyện',
    type: 'image' as const,
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    activity: 'Chiến dịch Mùa hè xanh 2026',
    uploadDate: '13/05/2026',
    size: '3.1 MB',
  },
  {
    id: 9,
    name: 'Buổi tọa đàm với diễn giả',
    type: 'image' as const,
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
    activity: 'Talkshow kỹ năng giao tiếp',
    uploadDate: '11/05/2026',
    size: '2.7 MB',
  },
  {
    id: 10,
    name: 'Biên bản họp tổ chức SV5T',
    type: 'pdf' as const,
    activity: 'Sinh viên 5 tốt cấp trường 2026',
    uploadDate: '09/05/2026',
    size: '890 KB',
  },
  {
    id: 11,
    name: 'Clip highlight ngày hội',
    type: 'video' as const,
    activity: 'Ngày hội tình nguyện mùa hè xanh 2026',
    uploadDate: '17/05/2026',
    size: '128 MB',
  },
  {
    id: 12,
    name: 'Chứng nhận tham gia Olympic',
    type: 'image' as const,
    thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
    activity: 'Cuộc thi Olympic Tin học sinh viên',
    uploadDate: '06/05/2026',
    size: '1.2 MB',
  },
];

export function EvidenceLibraryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidences = mockEvidences.filter((evidence) => {
    if (activeTab !== 'all') {
      const tabTypeMap: { [key: string]: string[] } = {
        images: ['image'],
        videos: ['video'],
        reports: ['pdf', 'word'],
        links: ['link'],
        attendance: ['excel'],
        drive: ['drive'],
      };
      if (!tabTypeMap[activeTab]?.includes(evidence.type)) {
        return false;
      }
    }
    if (searchQuery && !evidence.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Kho minh chứng</h2>
        <p className="text-sm text-gray-500">
          Thư viện lưu trữ tất cả minh chứng hoạt động Đoàn - Hội
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm hình ảnh, file, link minh chứng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap">
            <Upload className="w-5 h-5" />
            <span>Tải lên</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <EvidenceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <EvidenceFilters onFilterChange={() => {}} />

      {/* Stats */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Hiển thị <span className="text-gray-900">{filteredEvidences.length}</span> minh chứng
        </p>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvidences.map((evidence) => (
          <EvidenceCard key={evidence.id} evidence={evidence} />
        ))}
      </div>

      {filteredEvidences.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">Không tìm thấy minh chứng</h3>
          <p className="text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
