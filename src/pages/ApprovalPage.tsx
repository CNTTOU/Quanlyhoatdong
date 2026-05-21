import { useEffect, useState } from 'react';
import { ApprovalTabs } from '@/components/ApprovalTabs';
import { ApprovalTable } from '@/components/ApprovalTable';
import { ApprovalDetailPanel } from '@/components/ApprovalDetailPanel';
import { useAuth } from '@/contexts/AuthContext';
import { approveActivity, getActivityFormOptions, getApprovalActivities, rejectActivity, requestSupplement } from '@/services/activityService';

type ApprovalActivity = NonNullable<Parameters<typeof ApprovalDetailPanel>[0]['activity']> & {
  id: string;
  ma_nam_hoc?: string;
  status: 'pending' | 'approved' | 'need-update' | 'rejected';
};

export function ApprovalPage() {
  const { user, hasPermission } = useAuth();
  const canReview = hasPermission('duyet_hoat_dong');
  const [activities, setActivities] = useState<ApprovalActivity[]>([]);
  const [years, setYears] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState('');

  async function loadActivities() {
    if (!user) return;
    try {
      const [items, options] = await Promise.all([getApprovalActivities(user), getActivityFormOptions(user)]);
      setActivities(items);
      setYears(options.years.map((year) => ({ value: year.ma_nam_hoc, label: year.ten_nam_hoc })));
      setSelectedId((current) => current && items.some((item) => item.id === current) ? current : items[0]?.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách duyệt.');
    }
  }

  useEffect(() => {
    loadActivities();
  }, [user]);

  const yearFilteredActivities = activities.filter((activity) => !selectedYear || activity.ma_nam_hoc === selectedYear);

  const counts = {
    pending: yearFilteredActivities.filter((activity) => activity.status === 'pending').length,
    approved: yearFilteredActivities.filter((activity) => activity.status === 'approved').length,
    'need-update': yearFilteredActivities.filter((activity) => activity.status === 'need-update').length,
    rejected: yearFilteredActivities.filter((activity) => activity.status === 'rejected').length,
  };

  const filteredActivities = yearFilteredActivities.filter((activity) => {
    if (activeTab === 'pending') return activity.status === 'pending';
    if (activeTab === 'approved') return activity.status === 'approved';
    if (activeTab === 'need-update') return activity.status === 'need-update';
    if (activeTab === 'rejected') return activity.status === 'rejected';
    return true;
  });

  useEffect(() => {
    if (selectedId && filteredActivities.some((activity) => activity.id === selectedId)) return;
    setSelectedId(filteredActivities[0]?.id);
  }, [activeTab, selectedYear, activities]);

  const selectedActivity = filteredActivities.find((a) => a.id === selectedId);

  const handleApprove = async (comment: string) => {
    if (!user || !selectedActivity) return;
    await approveActivity(selectedActivity.id, comment, user);
    setMessage('Hoạt động đã được duyệt.');
    await loadActivities();
  };

  const handleRequestUpdate = async (comment: string) => {
    if (!user || !selectedActivity) return;
    await requestSupplement(selectedActivity.id, comment, user);
    setMessage('Đã gửi yêu cầu bổ sung.');
    await loadActivities();
  };

  const handleReject = async (comment: string) => {
    if (!user || !selectedActivity) return;
    await rejectActivity(selectedActivity.id, comment, user);
    setMessage('Hoạt động đã bị từ chối.');
    await loadActivities();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Duyệt hoạt động</h2>
        <p className="text-sm text-gray-500">
          Kiểm tra và phê duyệt các hoạt động Đoàn - Hội
        </p>
      </div>

      <div className="mb-4 flex justify-end">
        <select
          value={selectedYear}
          onChange={(event) => {
            setSelectedYear(event.target.value);
            setSelectedId(undefined);
          }}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả năm học</option>
          {years.map((year) => (
            <option key={year.value} value={year.value}>{year.label}</option>
          ))}
        </select>
      </div>

      <ApprovalTabs activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        setSelectedId(undefined);
      }} counts={counts} />

      {message && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

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
            canReview={canReview}
          />
        </div>
      </div>
    </div>
  );
}
