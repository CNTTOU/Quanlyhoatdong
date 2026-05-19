import { useEffect, useState } from 'react';
import { ApprovalTabs } from '@/components/ApprovalTabs';
import { ApprovalTable } from '@/components/ApprovalTable';
import { ApprovalDetailPanel } from '@/components/ApprovalDetailPanel';
import { getInterfaceList } from '@/services/interfaceDataService';

type ApprovalActivity = NonNullable<Parameters<typeof ApprovalDetailPanel>[0]['activity']> & {
  id: number;
  status: 'pending' | 'approved' | 'need-update' | 'rejected';
};

export function ApprovalPage() {
  const [activities, setActivities] = useState<ApprovalActivity[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  useEffect(() => {
    getInterfaceList<ApprovalActivity>('duyet_hoat_dong').then(setActivities);
  }, []);

  const filteredActivities = activities.filter((activity) => {
    if (activeTab === 'pending') return activity.status === 'pending';
    if (activeTab === 'approved') return activity.status === 'approved';
    if (activeTab === 'need-update') return activity.status === 'need-update';
    if (activeTab === 'rejected') return activity.status === 'rejected';
    return true;
  });

  const selectedActivity = activities.find((a) => a.id === selectedId);

  const handleApprove = (comment: string) => {
    console.log('Approved with comment:', comment);
    alert('Hoạt động đã được duyệt!');
  };

  const handleRequestUpdate = (comment: string) => {
    console.log('Request update with comment:', comment);
    alert('Đã gửi yêu cầu bổ sung!');
  };

  const handleReject = (comment: string) => {
    console.log('Rejected with comment:', comment);
    alert('Hoạt động đã bị từ chối!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Duyệt hoạt động</h2>
        <p className="text-sm text-gray-500">
          Kiểm tra và phê duyệt các hoạt động Đoàn - Hội
        </p>
      </div>

      <ApprovalTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - List */}
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="text-gray-900">{filteredActivities.length}</span> hoạt động
            </p>
          </div>
          <ApprovalTable
            activities={filteredActivities}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Right Column - Detail Panel */}
        <div className="lg:sticky lg:top-6 h-[calc(100vh-200px)]">
          <ApprovalDetailPanel
            activity={selectedActivity || null}
            onApprove={handleApprove}
            onRequestUpdate={handleRequestUpdate}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}
