import { Calendar, Users, MapPin, ArrowRight, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedActivityHeroProps {
  activity: {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    location: string;
    participants: number;
    category: string;
    unit: string;
  };
  onViewDetail: () => void;
}

export function FeaturedActivityHero({ activity, onViewDetail }: FeaturedActivityHeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 rounded-2xl overflow-hidden mb-8 shadow-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-cyan-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-full text-sm flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Hoạt động tiêu biểu</span>
            </span>
            <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm border border-white/30">
              {activity.category}
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl text-white mb-4 leading-tight">
            {activity.title}
          </h2>

          <p className="text-lg text-blue-100 mb-6 leading-relaxed">
            {activity.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-blue-200">Thời gian</p>
                <p className="text-sm font-medium">{activity.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-blue-200">Địa điểm</p>
                <p className="text-sm font-medium">{activity.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-blue-200">Tham gia</p>
                <p className="text-sm font-medium">{activity.participants} người</p>
              </div>
            </div>
          </div>

          <button
            onClick={onViewDetail}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-2xl shadow-yellow-500/50 w-fit group"
          >
            <span className="font-medium">Xem chi tiết</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-cyan-400/20 rounded-2xl blur-2xl" />
            <ImageWithFallback
              src={activity.image}
              alt={activity.title}
              className="relative w-full h-80 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
