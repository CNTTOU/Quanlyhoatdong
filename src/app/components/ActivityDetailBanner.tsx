import { ImageWithFallback } from './figma/ImageWithFallback';

interface ActivityDetailBannerProps {
  title: string;
  category: string;
  unit: string;
  status: 'draft' | 'pending' | 'approved' | 'need-update';
  image: string;
}

const statusConfig = {
  draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-700 border-green-300' },
  'need-update': { label: 'Cần bổ sung', color: 'bg-orange-100 text-orange-700 border-orange-300' },
};

export function ActivityDetailBanner({ title, category, unit, status, image }: ActivityDetailBannerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div className="relative h-64 bg-gradient-to-br from-blue-600 to-cyan-600">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30">
              {category}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30">
              {unit}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm border backdrop-blur-sm ${statusConfig[status].color}`}>
              {statusConfig[status].label}
            </span>
          </div>
          <h1 className="text-3xl mb-2">{title}</h1>
        </div>
      </div>
    </div>
  );
}
