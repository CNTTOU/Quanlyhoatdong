import { useState } from 'react';
import { Settings } from 'lucide-react';
import { SettingsTabs } from './SettingsTabs';
import { SystemInfoTab } from './SystemInfoTab';
import { ActivityTypesTab } from './ActivityTypesTab';
import { StatusConfigTab } from './StatusConfigTab';
import { DisplaySettingsTab } from './DisplaySettingsTab';
import { ReportTemplatesTab } from './ReportTemplatesTab';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('system');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-blue-600" />
          <h2 className="text-gray-900">Cài đặt hệ thống</h2>
        </div>
        <p className="text-sm text-gray-500">
          Quản lý cấu hình và tùy chỉnh hệ thống
        </p>
      </div>

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'system' && <SystemInfoTab />}
        {activeTab === 'activity-types' && <ActivityTypesTab />}
        {activeTab === 'statuses' && <StatusConfigTab />}
        {activeTab === 'display' && <DisplaySettingsTab />}
        {activeTab === 'templates' && <ReportTemplatesTab />}
      </div>
    </div>
  );
}
