import { Info, Tag, CheckCircle, FileText, Palette } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'system', label: 'Thông tin hệ thống', icon: Info },
  { id: 'activity-types', label: 'Loại hoạt động', icon: Tag },
  { id: 'statuses', label: 'Trạng thái duyệt', icon: CheckCircle },
  { id: 'templates', label: 'Mẫu báo cáo', icon: FileText },
  { id: 'display', label: 'Giao diện hiển thị', icon: Palette },
];

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

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
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
