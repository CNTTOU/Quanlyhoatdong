import { useEffect, useState } from 'react';
import { Award, Filter } from 'lucide-react';
import { FeaturedActivityHero } from '@/components/FeaturedActivityHero';
import { FeaturedActivityCard } from '@/components/FeaturedActivityCard';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getActivityTypes } from '@/services/activityTypeService';
import { getCachedSchoolYearsBasic } from '@/services/schoolYearService';
import { defaultFeaturedActivitySettings, getFeaturedActivitySettings, type FeaturedActivitySettings } from '@/services/settingService';

interface FeaturedData {
  heroActivity: Parameters<typeof FeaturedActivityHero>[0]['activity'] | null;
  featuredActivities: Array<Parameters<typeof FeaturedActivityCard>[0]['activity']>;
  stats: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  settings: FeaturedActivitySettings;
}

const emptyFeaturedData: FeaturedData = {
  heroActivity: null,
  featuredActivities: [],
  stats: { title: 'Thành tích nổi bật', items: [] },
  settings: defaultFeaturedActivitySettings,
};

export function FeaturedActivitiesPage() {
  const [data, setData] = useState<FeaturedData>(emptyFeaturedData);
  const [isLoading, setIsLoading] = useState(true);
  const [years, setYears] = useState<Array<{ value: string; label: string }>>([]);
  const [activityTypes, setActivityTypes] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getDocs(query(collection(db, 'hoat_dong'), where('trang_thai', '==', 'da_duyet'), where('hien_thi_noi_bat', '==', true))),
      getCachedSchoolYearsBasic(),
      getActivityTypes(),
      getFeaturedActivitySettings().catch(() => defaultFeaturedActivitySettings),
    ])
      .then(([activitySnap, schoolYears, types, settings]) => {
        const activities = activitySnap.docs.map((item) => {
          const itemData = item.data();
          return {
            id: item.id,
            title: String(itemData.ten_hoat_dong ?? ''),
            description: String(itemData.noi_dung ?? ''),
            image: String(itemData.anh_dai_dien ?? ''),
            date: toDateText(itemData.thoi_gian_bat_dau),
            location: String(itemData.dia_diem ?? ''),
            participants: Number(itemData.so_luong_tham_gia ?? 0),
            category: String(itemData.ten_loai ?? ''),
            unit: String(itemData.ten_don_vi ?? ''),
            ma_nam_hoc: String(itemData.ma_nam_hoc ?? ''),
            ma_loai: String(itemData.ma_loai ?? ''),
          };
        }).filter((activity) => (!selectedYear || activity.ma_nam_hoc === selectedYear) && (!selectedType || activity.ma_loai === selectedType));
        const activityMap = new Map(activities.map((activity) => [activity.id, activity]));
        const configuredHero = settings.ma_hoat_dong_noi_bat_nhat ? activityMap.get(settings.ma_hoat_dong_noi_bat_nhat) : null;
        const heroActivity = configuredHero ?? activities[0] ?? null;
        const orderedOtherActivities = [
          ...settings.danh_sach_hoat_dong_tieu_bieu.map((id) => activityMap.get(id)).filter(Boolean),
          ...activities.filter((activity) => !settings.danh_sach_hoat_dong_tieu_bieu.includes(activity.id)),
        ].filter((activity) => activity?.id !== heroActivity?.id);
        setYears(schoolYears.map((year) => ({ value: year.ma_nam_hoc, label: year.ten_nam_hoc })));
        setActivityTypes(types.map((type) => ({ value: type.ma_loai, label: type.ten_loai })));
        setData({
          heroActivity,
          featuredActivities: orderedOtherActivities.slice(0, settings.so_luong_tieu_bieu),
          stats: { title: settings.tieu_de_thong_ke, items: [] },
          settings,
        });
      })
      .finally(() => setIsLoading(false));
  }, [selectedType, selectedYear]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl lg:text-5xl">{data.settings.tieu_de}</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            {data.settings.mo_ta}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Featured Activity */}
        {data.heroActivity && (
          <FeaturedActivityHero activity={data.heroActivity} />
        )}

        {/* Filters */}
        {data.settings.hien_thi_bo_loc && <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Bộ lọc</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Năm học</label>
              <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tất cả năm</option>
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
              <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tất cả loại</option>
                {activityTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>}

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
            />
          ))}
        </div>

        {!isLoading && data.featuredActivities.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500">
            Chưa có dữ liệu hoạt động nổi bật.
          </div>
        )}

        {/* Stats Section */}
        {data.settings.hien_thi_thong_ke && <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl mb-6 text-center">{data.stats.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.stats.items.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-4xl font-bold mb-2">{item.value}</div>
                <div className="text-blue-100">{item.label}</div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}

function toDateText(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toLocaleDateString('vi-VN');
  if (typeof value === 'string' && value) return new Date(value).toLocaleDateString('vi-VN');
  return '';
}
