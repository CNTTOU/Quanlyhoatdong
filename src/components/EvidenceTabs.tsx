import { Image, Video, FileText, Link as LinkIcon, Users, HardDrive } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: any;
  count: number;
}

interface EvidenceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs: Tab[] = [
  { id: 'all', label: 'Tất cả', icon: null, count: 156 },
  { id: 'images', label: 'Hình ảnh', icon: Image, count: 89 },
  { id: 'videos', label: 'Video', icon: Video, count: 24 },
  { id: 'reports', label: 'File báo cáo', icon: FileText, count: 32 },
  { id: 'links', label: 'Link bài viết', icon: LinkIcon, count: 15 },
  { id: 'attendance', label: 'Danh sách tham gia', icon: Users, count: 18 },
  { id: 'drive', label: 'Google Drive', icon: HardDrive, count: 12 },
];

export function EvidenceTabs({ activeTab, onTabChange }: EvidenceTabsProps) {
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
              {Icon && <Icon className="w-4 h-4" />}
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
