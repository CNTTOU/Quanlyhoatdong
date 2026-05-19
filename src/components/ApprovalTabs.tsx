import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

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
}

const tabs: Tab[] = [
  { id: 'pending', label: 'Chờ duyệt', icon: Clock, count: 28, color: 'text-yellow-600' },
  { id: 'approved', label: 'Đã duyệt', icon: CheckCircle, count: 156, color: 'text-green-600' },
  { id: 'need-update', label: 'Cần bổ sung', icon: AlertCircle, count: 12, color: 'text-orange-600' },
  { id: 'rejected', label: 'Từ chối', icon: XCircle, count: 8, color: 'text-red-600' },
];

export function ApprovalTabs({ activeTab, onTabChange }: ApprovalTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200 mb-6">
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
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : tab.color}`} />
              <span className="text-sm">{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
