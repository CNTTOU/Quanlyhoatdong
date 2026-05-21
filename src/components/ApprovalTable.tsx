import { Calendar, Building2, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { defaultActivityStatuses, getActivityStatusSettings, type ActivityStatusSetting } from '@/services/settingService';

interface Activity {
  id: string;
  name: string;
  unit: string;
  submitDate: string;
  category: string;
  evidenceCount: number;
  status: 'pending' | 'approved' | 'need-update' | 'rejected';
}

interface ApprovalTableProps {
  activities: Activity[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

function getStatusConfig(statuses: ActivityStatusSetting[], status: Activity['status']) {
  const config = statuses.find((item) => item.khoa_hien_thi === status);
  return {
    label: config?.ten_hien_thi ?? status,
    color: config?.mau_hien_thi ?? '#6B7280',
  };
}

export function ApprovalTable({ activities, selectedId, onSelect }: ApprovalTableProps) {
  const [statuses, setStatuses] = useState<ActivityStatusSetting[]>(defaultActivityStatuses);

  useEffect(() => {
    getActivityStatusSettings().then(setStatuses).catch(() => undefined);
  }, []);

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          onClick={() => onSelect(activity.id)}
          className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all hover:shadow-md ${
            selectedId === activity.id
              ? 'border-blue-500 shadow-md'
              : 'border-gray-100 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-gray-900 line-clamp-2 flex-1 pr-3">{activity.name}</h4>
            {(() => {
              const status = getStatusConfig(statuses, activity.status);
              return (
                <span className="px-2.5 py-1 rounded-full text-xs whitespace-nowrap" style={{ backgroundColor: `${status.color}1A`, color: status.color }}>
                  {status.label}
                </span>
              );
            })()}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{activity.unit}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{activity.submitDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                {activity.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="text-xs">{activity.evidenceCount} minh chứng</span>
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
          <p className="text-gray-500">Không có hoạt động nào</p>
        </div>
      )}
    </div>
  );
}
