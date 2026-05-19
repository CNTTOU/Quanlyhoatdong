import { useEffect, useState } from 'react';
import { Award, Filter } from 'lucide-react';
import { FeaturedActivityHero } from '@/components/FeaturedActivityHero';
import { FeaturedActivityCard } from '@/components/FeaturedActivityCard';
import { getPublicInterfaceData } from '@/services/interfaceDataService';

interface FeaturedData {
  heroActivity: Parameters<typeof FeaturedActivityHero>[0]['activity'] | null;
  featuredActivities: Array<Parameters<typeof FeaturedActivityCard>[0]['activity']>;
  stats: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
}

const emptyFeaturedData: FeaturedData = {
  heroActivity: null,
  featuredActivities: [],
  stats: { title: 'Thành tích nổi bật', items: [] },
};

export function FeaturedActivitiesPage() {
  const [data, setData] = useState<FeaturedData>(emptyFeaturedData);
  const [isLoading, setIsLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    getPublicInterfaceData<FeaturedData>('hoat_dong_noi_bat', emptyFeaturedData)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

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
        {data.heroActivity && (
          <FeaturedActivityHero activity={data.heroActivity} onViewDetail={() => {}} />
        )}

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
          {data.featuredActivities.map((activity) => (
            <FeaturedActivityCard
              key={activity.id}
              activity={activity}
              onViewDetail={(id) => console.log('View activity', id)}
            />
          ))}
        </div>

        {!isLoading && data.featuredActivities.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500">
            Chưa có dữ liệu hoạt động nổi bật.
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl mb-6 text-center">{data.stats.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.stats.items.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-4xl font-bold mb-2">{item.value}</div>
                <div className="text-blue-100">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
