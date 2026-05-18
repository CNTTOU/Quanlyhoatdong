import { Award, Filter } from 'lucide-react';
import { FeaturedActivityHero } from './FeaturedActivityHero';
import { FeaturedActivityCard } from './FeaturedActivityCard';

const heroActivity = {
  title: 'Ngày hội tình nguyện mùa hè xanh 2026',
  description:
    'Chương trình tình nguyện quy mô lớn với sự tham gia của hơn 500 sinh viên, mang đến nhiều hoạt động ý nghĩa cho cộng đồng và góp phần nâng cao tinh thần trách nhiệm xã hội của thế hệ trẻ.',
  image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop',
  date: '20/06/2026',
  location: 'Hội trường A',
  participants: 520,
  category: 'Tình nguyện',
  unit: 'Đoàn CNTT',
};

const featuredActivities = [
  {
    id: 1,
    title: 'Hội thảo khoa học sinh viên lần thứ 20',
    category: 'Học thuật',
    date: '25/05/2026',
    unit: 'Đoàn Khoa học',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Workshop về AI và Machine Learning',
    category: 'Học thuật',
    date: '15/05/2026',
    unit: 'Đoàn CNTT',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Chiến dịch Mùa hè xanh 2026',
    category: 'Tình nguyện',
    date: '10/06/2026',
    unit: 'Đoàn CNTT',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Sinh viên 5 tốt cấp trường 2026',
    category: 'SV5T',
    date: '28/04/2026',
    unit: 'Hội SVHS',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    title: 'Talkshow kỹ năng giao tiếp và thuyết trình',
    category: 'Kỹ năng',
    date: '20/04/2026',
    unit: 'Hội SVHS',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    title: 'Giải bóng đá sinh viên cúp Đoàn trường',
    category: 'Văn hóa - Thể thao',
    date: '15/03/2026',
    unit: 'Hội SVHS',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    title: 'Chương trình truyền thông chào tân sinh viên K67',
    category: 'Truyền thông',
    date: '03/09/2025',
    unit: 'Đoàn CNTT',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    title: 'Hiến máu tình nguyện - Giọt hồng yêu thương',
    category: 'Tình nguyện',
    date: '08/05/2026',
    unit: 'Hội chữ thập đỏ',
    image: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=400&h=300&fit=crop',
  },
  {
    id: 9,
    title: 'Olympic Tin học sinh viên toàn quốc',
    category: 'Học thuật',
    date: '05/05/2026',
    unit: 'Đoàn CNTT',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
  },
];

export function FeaturedActivitiesPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl lg:text-5xl">Hoạt động nổi bật Đoàn - Hội</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            Lưu giữ những dấu ấn tiêu biểu trong công tác Đoàn - Hội và phong trào sinh viên
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Featured Activity */}
        <FeaturedActivityHero activity={heroActivity} onViewDetail={() => {}} />

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Bộ lọc</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Năm học</label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tất cả năm</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year} - {year + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tất cả loại</option>
                <option value="hoc-thuat">Học thuật</option>
                <option value="tinh-nguyen">Tình nguyện</option>
                <option value="ky-nang">Kỹ năng</option>
                <option value="sv5t">SV5T</option>
                <option value="truyen-thong">Truyền thông</option>
                <option value="van-hoa">Văn hóa - Thể thao</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Activities Grid */}
        <div className="mb-6">
          <h2 className="text-2xl text-gray-900 mb-1">Các hoạt động tiêu biểu khác</h2>
          <p className="text-gray-600 mb-6">
            Khám phá những hoạt động ý nghĩa đã để lại dấu ấn tích cực
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredActivities.map((activity) => (
            <FeaturedActivityCard
              key={activity.id}
              activity={activity}
              onViewDetail={(id) => console.log('View activity', id)}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl mb-6 text-center">Thành tích nổi bật năm học 2025-2026</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">410</div>
              <div className="text-blue-100">Hoạt động tổ chức</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">13,480</div>
              <div className="text-blue-100">Lượt tham gia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">48</div>
              <div className="text-blue-100">Đơn vị tham gia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-blue-100">Hoạt động nổi bật</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
