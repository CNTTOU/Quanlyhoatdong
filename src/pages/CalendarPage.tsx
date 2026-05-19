import { useEffect, useState } from 'react';
import { CalendarFilters } from '@/components/CalendarFilters';
import { MonthlyCalendar } from '@/components/MonthlyCalendar';
import { UpcomingActivities } from '@/components/UpcomingActivities';
import { ActivityQuickView } from '@/components/ActivityQuickView';
import { getInterfaceDocument } from '@/services/interfaceDataService';

type CalendarData = {
  days: Parameters<typeof MonthlyCalendar>[0]['days'];
  upcomingActivities: Parameters<typeof UpcomingActivities>[0]['activities'];
};

const emptyCalendarData: CalendarData = {
  days: [],
  upcomingActivities: [],
};

export function CalendarPage() {
  const [calendarData, setCalendarData] = useState<CalendarData>(emptyCalendarData);
  const [currentMonth, setCurrentMonth] = useState('Tháng 6 năm 2026');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  useEffect(() => {
    getInterfaceDocument<CalendarData>('lich_hoat_dong', emptyCalendarData).then(setCalendarData);
  }, []);

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
          <MonthlyCalendar days={calendarData.days} onActivityClick={handleActivityClick} />

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
            activities={calendarData.upcomingActivities}
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
