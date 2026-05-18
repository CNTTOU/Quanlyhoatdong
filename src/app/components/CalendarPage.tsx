import { useState } from 'react';
import { CalendarFilters } from './CalendarFilters';
import { MonthlyCalendar } from './MonthlyCalendar';
import { UpcomingActivities } from './UpcomingActivities';
import { ActivityQuickView } from './ActivityQuickView';

const mockCalendarData = [
  // Previous month days
  { date: 29, isCurrentMonth: false, activities: [] },
  { date: 30, isCurrentMonth: false, activities: [] },
  { date: 31, isCurrentMonth: false, activities: [] },
  // Current month
  { date: 1, isCurrentMonth: true, activities: [] },
  { date: 2, isCurrentMonth: true, activities: [] },
  { date: 3, isCurrentMonth: true, activities: [
    { id: 1, title: 'Workshop AI', type: 'hoc-thuat' as const, time: '14:00' }
  ]},
  { date: 4, isCurrentMonth: true, activities: [] },
  { date: 5, isCurrentMonth: true, activities: [
    { id: 2, title: 'Hiến máu tình nguyện', type: 'tinh-nguyen' as const, time: '08:00' }
  ]},
  { date: 6, isCurrentMonth: true, activities: [] },
  { date: 7, isCurrentMonth: true, activities: [] },
  { date: 8, isCurrentMonth: true, activities: [
    { id: 3, title: 'Talkshow kỹ năng', type: 'ky-nang' as const, time: '15:00' }
  ]},
  { date: 9, isCurrentMonth: true, activities: [] },
  { date: 10, isCurrentMonth: true, activities: [
    { id: 4, title: 'Hội thảo KHSV', type: 'hoc-thuat' as const, time: '08:00' }
  ]},
  { date: 11, isCurrentMonth: true, activities: [] },
  { date: 12, isCurrentMonth: true, activities: [] },
  { date: 13, isCurrentMonth: true, activities: [] },
  { date: 14, isCurrentMonth: true, activities: [] },
  { date: 15, isCurrentMonth: true, activities: [
    { id: 5, title: 'SV5T cấp trường', type: 'sv5t' as const, time: '09:00' },
    { id: 6, title: 'Giải bóng đá', type: 'van-hoa' as const, time: '16:00' }
  ]},
  { date: 16, isCurrentMonth: true, activities: [] },
  { date: 17, isCurrentMonth: true, activities: [] },
  { date: 18, isCurrentMonth: true, activities: [
    { id: 7, title: 'Ngày hội tình nguyện', type: 'tinh-nguyen' as const, time: '08:00' }
  ]},
  { date: 19, isCurrentMonth: true, activities: [] },
  { date: 20, isCurrentMonth: true, activities: [
    { id: 8, title: 'Tuyên truyền chiến dịch', type: 'truyen-thong' as const, time: '14:00' }
  ]},
  { date: 21, isCurrentMonth: true, activities: [] },
  { date: 22, isCurrentMonth: true, activities: [] },
  { date: 23, isCurrentMonth: true, activities: [] },
  { date: 24, isCurrentMonth: true, activities: [] },
  { date: 25, isCurrentMonth: true, activities: [
    { id: 9, title: 'Olympic Tin học', type: 'hoc-thuat' as const, time: '08:00' }
  ]},
  { date: 26, isCurrentMonth: true, activities: [] },
  { date: 27, isCurrentMonth: true, activities: [] },
  { date: 28, isCurrentMonth: true, activities: [
    { id: 10, title: 'Ngày hội văn hóa', type: 'van-hoa' as const, time: '09:00' }
  ]},
  { date: 29, isCurrentMonth: true, activities: [] },
  { date: 30, isCurrentMonth: true, activities: [] },
  { date: 31, isCurrentMonth: true, activities: [] },
  // Next month days
  { date: 1, isCurrentMonth: false, activities: [] },
  { date: 2, isCurrentMonth: false, activities: [] },
];

const upcomingActivitiesData = [
  {
    id: 11,
    title: 'Workshop về AI và Machine Learning',
    type: 'Học thuật',
    date: '15/06/2026',
    time: '14:00 - 17:00',
    location: 'Phòng Lab 301',
    unit: 'Đoàn CNTT',
  },
  {
    id: 12,
    title: 'Ngày hội tình nguyện mùa hè xanh',
    type: 'Tình nguyện',
    date: '20/06/2026',
    time: '08:00 - 17:00',
    location: 'Hội trường A',
    unit: 'Đoàn CNTT',
  },
  {
    id: 13,
    title: 'Talkshow kỹ năng giao tiếp',
    type: 'Kỹ năng',
    date: '22/06/2026',
    time: '15:00 - 17:00',
    location: 'Giảng đường B',
    unit: 'Hội SVHS',
  },
  {
    id: 14,
    title: 'Sinh viên 5 tốt cấp trường 2026',
    type: 'SV5T',
    date: '25/06/2026',
    time: '09:00 - 12:00',
    location: 'Hội trường lớn',
    unit: 'Hội SVHS',
  },
  {
    id: 15,
    title: 'Giải bóng đá sinh viên',
    type: 'Văn hóa',
    date: '28/06/2026',
    time: '16:00 - 18:00',
    location: 'Sân vận động trường',
    unit: 'Hội SVHS',
  },
];

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('Tháng 6 năm 2026');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    // Logic to change month
  };

  const handleActivityClick = (activity: any) => {
    setSelectedActivity({
      title: activity.title,
      type: activity.type === 'hoc-thuat' ? 'Học thuật' :
            activity.type === 'tinh-nguyen' ? 'Tình nguyện' :
            activity.type === 'ky-nang' ? 'Kỹ năng' :
            activity.type === 'sv5t' ? 'SV5T' :
            activity.type === 'truyen-thong' ? 'Truyền thông' : 'Văn hóa',
      date: '15/06/2026',
      time: activity.time + ' - 17:00',
      location: 'Hội trường A',
      unit: 'Đoàn CNTT',
      status: 'Sắp diễn ra',
    });
  };

  const handleUpcomingActivityClick = (activity: any) => {
    setSelectedActivity({
      ...activity,
      status: 'Sắp diễn ra',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Lịch hoạt động</h2>
        <p className="text-sm text-gray-500">
          Theo dõi và quản lý lịch trình hoạt động Đoàn - Hội
        </p>
      </div>

      <CalendarFilters
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        onFilterChange={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyCalendar days={mockCalendarData} onActivityClick={handleActivityClick} />

          {/* Legend */}
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-sm text-gray-900 mb-3">Phân loại hoạt động</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-xs text-gray-600">Học thuật</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-xs text-gray-600">Tình nguyện</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                <span className="text-xs text-gray-600">Kỹ năng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                <span className="text-xs text-gray-600">SV5T</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-100 border border-cyan-300 rounded"></div>
                <span className="text-xs text-gray-600">Truyền thông</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-100 border border-pink-300 rounded"></div>
                <span className="text-xs text-gray-600">Văn hóa - Thể thao</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <UpcomingActivities
            activities={upcomingActivitiesData}
            onActivityClick={handleUpcomingActivityClick}
          />
        </div>
      </div>

      <ActivityQuickView
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onViewDetail={() => {
          setSelectedActivity(null);
          // Navigate to detail page
        }}
      />
    </div>
  );
}
