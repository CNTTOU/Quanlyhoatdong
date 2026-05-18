import { Calendar, Building2, Award, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedActivityCardProps {
  activity: {
    id: number;
    title: string;
    category: string;
    date: string;
    unit: string;
    image: string;
  };
  onViewDetail: (id: number) => void;
}

const categoryColors = {
  'Học thuật': 'bg-blue-100 text-blue-700',
  'Tình nguyện': 'bg-green-100 text-green-700',
  'Kỹ năng': 'bg-purple-100 text-purple-700',
  'SV5T': 'bg-orange-100 text-orange-700',
  'Truyền thông': 'bg-cyan-100 text-cyan-700',
  'Văn hóa - Thể thao': 'bg-pink-100 text-pink-700',
};

export function FeaturedActivityCard({ activity, onViewDetail }: FeaturedActivityCardProps) {
  return (
    <div
      onClick={() => onViewDetail(activity.id)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-full text-xs flex items-center gap-1.5 shadow-lg">
            <Award className="w-3.5 h-3.5" />
            <span>Nổi bật</span>
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              categoryColors[activity.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {activity.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {activity.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span>{activity.unit}</span>
          </div>
        </div>

        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm group-hover:gap-3 transition-all">
          <span>Xem chi tiết</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
