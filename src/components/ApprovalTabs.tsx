import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { defaultActivityStatuses, getActivityStatusSettings, type ActivityStatusSetting } from '@/services/settingService';

interface Tab {
  id: string;
  label: string;
  icon: any;
  count: number;
  color: string;
}

interface ApprovalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: Record<string, number>;
}

const tabs: Tab[] = [
  { id: 'pending', label: 'Chờ duyệt', icon: Clock, count: 0, color: 'text-yellow-600' },
  { id: 'approved', label: 'Đã duyệt', icon: CheckCircle, count: 0, color: 'text-green-600' },
  { id: 'need-update', label: 'Cần bổ sung', icon: AlertCircle, count: 0, color: 'text-orange-600' },
  { id: 'rejected', label: 'Từ chối', icon: XCircle, count: 0, color: 'text-red-600' },
];

export function ApprovalTabs({ activeTab, onTabChange, counts }: ApprovalTabsProps) {
  const [statusSettings, setStatusSettings] = useState<ActivityStatusSetting[]>(defaultActivityStatuses);

  useEffect(() => {
    getActivityStatusSettings().then(setStatusSettings).catch(() => undefined);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const setting = statusSettings.find((item) => item.khoa_hien_thi === tab.id);
          const label = setting?.ten_hien_thi ?? tab.label;
          const color = setting?.mau_hien_thi;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive || color ? '' : tab.color}`} style={isActive ? undefined : { color }} />
              <span className="text-sm">{label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {counts[tab.id] ?? tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
