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
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const statusConfig = getStatusConfig(statuses, status);
  const hasImage = Boolean(image?.trim());
  const imageAspectRatio = imageSize ? `${imageSize.width} / ${imageSize.height}` : '16 / 9';

  useEffect(() => {
    getActivityStatusSettings().then(setStatuses).catch(() => undefined);
  }, []);

  useEffect(() => {
    setImageSize(null);
    if (!hasImage) return;
    const preview = new Image();
    preview.onload = () => {
      if (preview.naturalWidth && preview.naturalHeight) {
        setImageSize({ width: preview.naturalWidth, height: preview.naturalHeight });
      }
    };
    preview.src = image;
  }, [hasImage, image]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <div
        className={`relative ${hasImage ? 'bg-slate-950' : 'h-64 bg-gradient-to-br from-blue-600 to-cyan-600'}`}
        style={hasImage ? { aspectRatio: imageAspectRatio } : undefined}
      >
        {hasImage ? (
          <>
            <ImageWithFallback
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-45"
            />
            <ImageWithFallback
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-3">
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
          </>
        ) : (
          <div className="h-64" />
        )}
        {!hasImage && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
