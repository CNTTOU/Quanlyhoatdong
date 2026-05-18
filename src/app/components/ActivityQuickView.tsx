import { X, Calendar, MapPin, Building2, Clock, Eye } from 'lucide-react';

interface ActivityQuickViewProps {
  activity: {
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    unit: string;
    status: string;
  } | null;
  onClose: () => void;
  onViewDetail: () => void;
}

const typeColors = {
  'Học thuật': 'bg-blue-100 text-blue-700',
  'Tình nguyện': 'bg-green-100 text-green-700',
  'Kỹ năng': 'bg-purple-100 text-purple-700',
  'SV5T': 'bg-orange-100 text-orange-700',
  'Truyền thông': 'bg-cyan-100 text-cyan-700',
  'Văn hóa': 'bg-pink-100 text-pink-700',
};

const statusColors = {
  'Sắp diễn ra': 'bg-yellow-100 text-yellow-700',
  'Đang diễn ra': 'bg-green-100 text-green-700',
  'Đã hoàn thành': 'bg-gray-100 text-gray-700',
};

export function ActivityQuickView({ activity, onClose, onViewDetail }: ActivityQuickViewProps) {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h3 className="text-lg text-gray-900 mb-2">{activity.title}</h3>
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs ${
                  typeColors[activity.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {activity.type}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs ${
                  statusColors[activity.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {activity.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Thời gian</p>
              <p className="text-sm text-gray-900">{activity.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Giờ tổ chức</p>
              <p className="text-sm text-gray-900">{activity.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Địa điểm</p>
              <p className="text-sm text-gray-900">{activity.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Đơn vị tổ chức</p>
              <p className="text-sm text-gray-900">{activity.unit}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={onViewDetail}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <Eye className="w-4 h-4" />
            <span>Xem chi tiết</span>
          </button>
        </div>
      </div>
    </div>
  );
}
