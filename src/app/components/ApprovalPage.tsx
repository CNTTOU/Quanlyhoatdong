import { useState } from 'react';
import { ApprovalTabs } from './ApprovalTabs';
import { ApprovalTable } from './ApprovalTable';
import { ApprovalDetailPanel } from './ApprovalDetailPanel';

const mockActivities = [
  {
    id: 1,
    name: 'Ngày hội tình nguyện mùa hè xanh 2026',
    unit: 'Đoàn CNTT',
    submitDate: '15/05/2026',
    category: 'Tình nguyện',
    evidenceCount: 25,
    status: 'pending' as const,
    level: 'Cấp Trường',
    startDate: '20/06/2026 08:00',
    endDate: '20/06/2026 17:00',
    location: 'Hội trường A',
    participants: 450,
    objective: 'Tổ chức ngày hội tình nguyện nhằm nâng cao ý thức trách nhiệm của sinh viên đối với cộng đồng.',
    content: 'Chương trình bao gồm: Lễ phát động, Workshop kỹ năng tình nguyện, Triển lãm ảnh, Trao giải cuộc thi.',
    evidences: {
      images: 45,
      files: 5,
      links: ['Facebook: Ngày hội tình nguyện', 'Google Drive: Thư viện ảnh'],
    },
    history: [
      {
        date: '14/05/2026 10:00',
        action: 'Gửi yêu cầu duyệt',
        by: 'Nguyễn Văn A',
      },
    ],
  },
  {
    id: 2,
    name: 'Hội thảo khoa học sinh viên lần thứ 20',
    unit: 'Đoàn Khoa học',
    submitDate: '12/05/2026',
    category: 'Học thuật',
    evidenceCount: 18,
    status: 'pending' as const,
    level: 'Cấp Trường',
    startDate: '25/06/2026 08:00',
    endDate: '25/06/2026 17:00',
    location: 'Giảng đường B',
    participants: 320,
    objective: 'Tạo diễn đàn trao đổi học thuật cho sinh viên nghiên cứu khoa học.',
    content: 'Báo cáo các đề tài nghiên cứu, Trao giải các công trình xuất sắc, Giao lưu với chuyên gia.',
    evidences: {
      images: 30,
      files: 8,
      links: ['Facebook: Hội thảo KHSV', 'Drive: Tài liệu báo cáo'],
    },
    history: [
      {
        date: '11/05/2026 14:00',
        action: 'Gửi yêu cầu duyệt',
        by: 'Trần Thị B',
      },
    ],
  },
  {
    id: 3,
    name: 'Workshop về AI và Machine Learning',
    unit: 'Đoàn CNTT',
    submitDate: '01/05/2026',
    category: 'Học thuật',
    evidenceCount: 10,
    status: 'approved' as const,
    level: 'Đoàn khoa',
    startDate: '15/05/2026 14:00',
    endDate: '15/05/2026 17:00',
    location: 'Phòng Lab 301',
    participants: 220,
    objective: 'Giới thiệu kiến thức cơ bản về AI và ML cho sinh viên.',
    content: 'Bài giảng lý thuyết, Thực hành coding, Q&A với diễn giả.',
    evidences: {
      images: 20,
      files: 3,
      links: ['Facebook: Workshop AI'],
    },
    history: [
      {
        date: '02/05/2026 09:00',
        action: 'Đã duyệt hoạt động',
        by: 'Admin',
        comment: 'Hoạt động tổ chức tốt, minh chứng đầy đủ.',
      },
      {
        date: '30/04/2026 16:00',
        action: 'Gửi yêu cầu duyệt',
        by: 'Lê Văn C',
      },
    ],
  },
  {
    id: 4,
    name: 'Cuộc thi Olympic Tin học sinh viên',
    unit: 'Đoàn CNTT',
    submitDate: '28/04/2026',
    category: 'Học thuật',
    evidenceCount: 12,
    status: 'need-update' as const,
    level: 'Cấp Trường',
    startDate: '10/05/2026 08:00',
    endDate: '10/05/2026 17:00',
    location: 'Phòng máy A1, A2',
    participants: 180,
    objective: 'Tổ chức cuộc thi lập trình cho sinh viên.',
    content: 'Vòng loại online, Vòng chung kết onsite, Trao giải.',
    evidences: {
      images: 15,
      files: 4,
      links: ['Facebook: Olympic Tin học'],
    },
    history: [
      {
        date: '29/04/2026 10:00',
        action: 'Yêu cầu bổ sung',
        by: 'Admin',
        comment: 'Cần bổ sung danh sách thí sinh và kết quả thi.',
      },
      {
        date: '27/04/2026 15:00',
        action: 'Gửi yêu cầu duyệt',
        by: 'Phạm Thị D',
      },
    ],
  },
];

export function ApprovalPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const filteredActivities = mockActivities.filter((activity) => {
    if (activeTab === 'pending') return activity.status === 'pending';
    if (activeTab === 'approved') return activity.status === 'approved';
    if (activeTab === 'need-update') return activity.status === 'need-update';
    if (activeTab === 'rejected') return activity.status === 'rejected';
    return true;
  });

  const selectedActivity = mockActivities.find((a) => a.id === selectedId);

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
