interface Activity {
  id: string;
  title: string;
  type: string;
  color?: string;
  time: string;
}

interface CalendarDay {
  date: number;
  dateKey: string;
  isCurrentMonth: boolean;
  activities: Activity[];
}

interface MonthlyCalendarProps {
  days: CalendarDay[];
  onActivityClick: (activity: Activity) => void;
}

const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function MonthlyCalendar({ days, onActivityClick }: MonthlyCalendarProps) {
  const todayKey = formatDateKey(new Date());

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Week days header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="py-3 text-center text-sm text-gray-700 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isToday = day.dateKey === todayKey;

          return (
            <div
              key={index}
              className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                !day.isCurrentMonth ? 'bg-gray-50' : ''
              } ${isToday ? 'bg-blue-50' : ''}`}
            >
              <div
                className={`text-sm mb-2 ${
                  isToday
                    ? 'w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center'
                    : day.isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {day.date}
              </div>

              <div className="space-y-1">
                {day.activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => onActivityClick(activity)}
                    className="w-full rounded border px-2 py-1 text-left text-xs transition-all hover:shadow-md"
                    style={{
                      backgroundColor: `${activity.color || '#64748B'}18`,
                      borderColor: activity.color || '#CBD5E1',
                      color: activity.color || '#334155',
                    }}
                  >
                    <div className="truncate">{activity.time}</div>
                    <div className="truncate font-medium">{activity.title}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
