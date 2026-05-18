import { Calendar, MapPin, Building2 } from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  unit: string;
}

interface UpcomingActivitiesProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
}

const typeColors = {
  'Học thuật': 'bg-blue-100 text-blue-700',
  'Tình nguyện': 'bg-green-100 text-green-700',
  'Kỹ năng': 'bg-purple-100 text-purple-700',
  'SV5T': 'bg-orange-100 text-orange-700',
  'Truyền thông': 'bg-cyan-100 text-cyan-700',
  'Văn hóa': 'bg-pink-100 text-pink-700',
};

export function UpcomingActivities({ activities, onActivityClick }: UpcomingActivitiesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        Hoạt động sắp tới
      </h3>

      <div className="space-y-3">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => onActivityClick(activity)}
            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm text-gray-900 line-clamp-2 flex-1 pr-2 group-hover:text-blue-600">
                {activity.title}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${
                  typeColors[activity.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {activity.type}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{activity.date} • {activity.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{activity.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{activity.unit}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
