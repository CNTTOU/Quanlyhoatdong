interface Activity {
  id: number;
  title: string;
  type: 'hoc-thuat' | 'tinh-nguyen' | 'ky-nang' | 'sv5t' | 'truyen-thong' | 'van-hoa';
  time: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  activities: Activity[];
}

interface MonthlyCalendarProps {
  days: CalendarDay[];
  onActivityClick: (activity: Activity) => void;
}

const typeColors = {
  'hoc-thuat': 'bg-blue-100 text-blue-700 border-blue-300',
  'tinh-nguyen': 'bg-green-100 text-green-700 border-green-300',
  'ky-nang': 'bg-purple-100 text-purple-700 border-purple-300',
  'sv5t': 'bg-orange-100 text-orange-700 border-orange-300',
  'truyen-thong': 'bg-cyan-100 text-cyan-700 border-cyan-300',
  'van-hoa': 'bg-pink-100 text-pink-700 border-pink-300',
};

const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

export function MonthlyCalendar({ days, onActivityClick }: MonthlyCalendarProps) {
  const today = new Date().getDate();

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
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
              !day.isCurrentMonth ? 'bg-gray-50' : ''
            } ${day.date === today && day.isCurrentMonth ? 'bg-blue-50' : ''}`}
          >
            <div
              className={`text-sm mb-2 ${
                day.date === today && day.isCurrentMonth
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
                  className={`w-full text-left px-2 py-1 rounded text-xs border transition-all hover:shadow-md ${
                    typeColors[activity.type]
                  }`}
                >
                  <div className="truncate">{activity.time}</div>
                  <div className="truncate font-medium">{activity.title}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
