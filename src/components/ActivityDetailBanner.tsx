import { useEffect, useState } from 'react';
import { defaultActivityStatuses, getActivityStatusSettings, type ActivityStatusSetting } from '@/services/settingService';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ActivityDetailBannerProps {
  title: string;
  category: string;
  unit: string;
  status: 'draft' | 'pending' | 'approved' | 'need-update';
  image: string;
}

function getStatusConfig(statuses: ActivityStatusSetting[], status: ActivityDetailBannerProps['status']) {
  const config = statuses.find((item) => item.khoa_hien_thi === status);
  return {
    label: config?.ten_hien_thi ?? status,
    color: config?.mau_hien_thi ?? '#6B7280',
  };
}

export function ActivityDetailBanner({ title, category, unit, status, image }: ActivityDetailBannerProps) {
  const [statuses, setStatuses] = useState<ActivityStatusSetting[]>(defaultActivityStatuses);
  const statusConfig = getStatusConfig(statuses, status);

  useEffect(() => {
    getActivityStatusSettings().then(setStatuses).catch(() => undefined);
  }, []);

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
            <span className="px-3 py-1 rounded-full text-sm border backdrop-blur-sm" style={{ backgroundColor: `${statusConfig.color}1A`, borderColor: statusConfig.color, color: statusConfig.color }}>
              {statusConfig.label}
            </span>
          </div>
          <h1 className="text-3xl mb-2">{title}</h1>
        </div>
      </div>
    </div>
  );
}
