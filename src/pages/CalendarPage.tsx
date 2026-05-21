import { useEffect, useState } from 'react';
import { CalendarFilters } from '@/components/CalendarFilters';
import { MonthlyCalendar } from '@/components/MonthlyCalendar';
import { UpcomingActivities } from '@/components/UpcomingActivities';
import { ActivityQuickView } from '@/components/ActivityQuickView';
import { useAuth } from '@/contexts/AuthContext';
import { getActivitiesByCurrentUser, getActivityFormOptions } from '@/services/activityService';
import type { HoatDong } from '@/types/firebase';
import { Timestamp } from 'firebase/firestore';

type CalendarData = {
  days: Parameters<typeof MonthlyCalendar>[0]['days'];
  upcomingActivities: Parameters<typeof UpcomingActivities>[0]['activities'];
};

const emptyCalendarData: CalendarData = {
  days: [],
  upcomingActivities: [],
};

export function CalendarPage() {
  const { user } = useAuth();
  const [calendarData, setCalendarData] = useState<CalendarData>(emptyCalendarData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({ category: '', unit: '' });
  const [categories, setCategories] = useState<Array<{ value: string; label: string; color: string }>>([]);
  const [units, setUnits] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    getActivityFormOptions(user).then((options) => {
      setCategories(options.activityTypes.map((item) => ({ value: item.ma_loai, label: item.ten_loai, color: item.mau_hien_thi || '#64748B' })));
      setUnits(options.units.map((item) => ({ value: item.ma_don_vi, label: item.ten_don_vi })));
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getActivitiesByCurrentUser(user).then((activities) => {
      const categoryColors = new Map(categories.map((category) => [category.value, category.color]));
      const filtered = activities.filter((activity) => {
        const date = toDate(activity.thoi_gian_bat_dau);
        const sameMonth = date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
        const sameCategory = !filters.category || activity.ma_loai === filters.category;
        const sameUnit = !filters.unit || activity.ma_don_vi === filters.unit;
        return sameMonth && sameCategory && sameUnit;
      });
      setCalendarData(buildCalendarData(filtered, currentDate, categoryColors));
    });
  }, [categories, currentDate, filters, user]);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const handleActivityClick = (activity: any) => {
    setSelectedActivity({
      title: activity.title,
      type: activity.typeLabel,
      date: activity.dateText,
      time: activity.time,
      location: activity.location,
      unit: activity.unit,
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
        currentMonth={`Tháng ${currentDate.getMonth() + 1} năm ${currentDate.getFullYear()}`}
        onMonthChange={handleMonthChange}
        onFilterChange={(nextFilters) => setFilters((prev) => ({ ...prev, ...nextFilters }))}
        categories={categories}
        units={units}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyCalendar days={calendarData.days} onActivityClick={handleActivityClick} />

          {/* Legend */}
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-sm text-gray-900 mb-3">Phân loại hoạt động</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div key={category.value} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: category.color }}></div>
                  <span className="text-xs text-gray-600">{category.label}</span>
                </div>
              ))}
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

function toDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string' && value) return new Date(value);
  return new Date();
}

function toTimeRange(activity: HoatDong) {
  const start = toDate(activity.thoi_gian_bat_dau);
  const end = toDate(activity.thoi_gian_ket_thuc);
  return `${start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildCalendarData(activities: HoatDong[], currentDate: Date, categoryColors = new Map<string, string>()): CalendarData {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const startOffset = (firstDate.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);

  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    const dayActivities = activities
      .filter((activity) => {
        const activityDate = toDate(activity.thoi_gian_bat_dau);
        return activityDate.toDateString() === date.toDateString();
      })
      .map((activity) => ({
        id: activity.ma_hoat_dong,
        title: activity.ten_hoat_dong,
        type: activity.ma_loai || 'khac',
        color: String(activity.mau_hien_thi || activity.mau_loai || categoryColors.get(activity.ma_loai) || '#64748B'),
        typeLabel: activity.ten_loai,
        dateText: toDate(activity.thoi_gian_bat_dau).toLocaleDateString('vi-VN'),
        time: toTimeRange(activity),
        location: activity.dia_diem,
        unit: activity.ten_don_vi,
      }));

    return {
      date: date.getDate(),
      dateKey: formatDateKey(date),
      isCurrentMonth: date.getMonth() === month,
      activities: dayActivities,
    };
  });

  const upcomingActivities = activities
    .filter((activity) => toDate(activity.thoi_gian_bat_dau).getTime() >= Date.now())
    .sort((a, b) => toDate(a.thoi_gian_bat_dau).getTime() - toDate(b.thoi_gian_bat_dau).getTime())
    .slice(0, 6)
    .map((activity) => ({
      id: activity.ma_hoat_dong,
      title: activity.ten_hoat_dong,
      type: activity.ten_loai,
      date: toDate(activity.thoi_gian_bat_dau).toLocaleDateString('vi-VN'),
      time: toTimeRange(activity),
      location: activity.dia_diem,
      unit: activity.ten_don_vi,
    }));

  return { days, upcomingActivities };
}
