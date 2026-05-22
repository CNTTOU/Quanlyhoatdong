import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { SettingsTabs } from '@/components/SettingsTabs';
import { SystemInfoTab } from '@/components/SystemInfoTab';
import { ActivityTypesTab } from '@/components/ActivityTypesTab';
import { StatusConfigTab } from '@/components/StatusConfigTab';
import { DisplaySettingsTab } from '@/components/DisplaySettingsTab';
import { ReportTemplatesTab } from '@/components/ReportTemplatesTab';
import { FeaturedActivitiesSettingsTab } from '@/components/FeaturedActivitiesSettingsTab';
import { useAuth } from '@/contexts/AuthContext';

export function SettingsPage({ initialTab = 'system' }: { initialTab?: string }) {
  const { hasPermission } = useAuth();
  const canManageSystem = hasPermission('cai_dat_he_thong');
  const canManageFeatured = hasPermission('quan_ly_hoat_dong_noi_bat');
  const [activeTab, setActiveTab] = useState(initialTab);
  const isFeaturedModule = initialTab === 'featured-activities';

  useEffect(() => {
    if (initialTab === 'featured-activities' && canManageFeatured) setActiveTab('featured-activities');
    else if (!canManageSystem && canManageFeatured) setActiveTab('featured-activities');
    else if (canManageSystem && activeTab === 'featured-activities' && !canManageFeatured) setActiveTab('system');
  }, [activeTab, canManageFeatured, canManageSystem, initialTab]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-blue-600" />
          <h2 className="text-gray-900">{isFeaturedModule ? 'Chỉnh sửa hoạt động nổi bật' : 'Cài đặt hệ thống'}</h2>
        </div>
        <p className="text-sm text-gray-500">
          {isFeaturedModule ? 'Thiết lập hoạt động nổi bật nhất và các hoạt động tiêu biểu khác' : 'Quản lý cấu hình và tùy chỉnh hệ thống'}
        </p>
      </div>

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} canManageSystem={canManageSystem} canManageFeatured={canManageFeatured} />

      <div className="mt-6">
        {canManageSystem && activeTab === 'system' && <SystemInfoTab />}
        {canManageSystem && activeTab === 'activity-types' && <ActivityTypesTab />}
        {canManageSystem && activeTab === 'statuses' && <StatusConfigTab />}
        {canManageSystem && activeTab === 'display' && <DisplaySettingsTab />}
        {canManageSystem && activeTab === 'templates' && <ReportTemplatesTab />}
        {canManageFeatured && activeTab === 'featured-activities' && <FeaturedActivitiesSettingsTab />}
      </div>
    </div>
  );
}
