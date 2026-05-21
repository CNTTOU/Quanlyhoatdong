import { useEffect, useState } from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedActivitiesProps {
  year: number;
}

type FeaturedActivity = {
  id: number;
  title: string;
  date: string;
  participants: number;
  location: string;
  image: string;
};

export function FeaturedActivities({ year }: FeaturedActivitiesProps) {
  const [featured, setFeatured] = useState<FeaturedActivity[]>([]);

  useEffect(() => {
    setFeatured([]);
  }, [year]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900">Hoạt động nổi bật</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">Xem thêm</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((activity) => (
          <div key={activity.id} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <ImageWithFallback
              src={activity.image}
              alt={activity.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="text-gray-900 mb-3">{activity.title}</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{activity.participants} người tham gia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
