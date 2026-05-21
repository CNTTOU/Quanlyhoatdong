import { useEffect, useState } from 'react';

interface RecentActivitiesProps {
  year: number;
  activities?: RecentActivity[];
}

type RecentActivity = {
  id: string;
  name: string;
  unit: string;
  time: string;
  status: string;
  statusText: string;
};

export function RecentActivities({ year, activities: inputActivities }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<RecentActivity[]>(inputActivities ?? []);

  useEffect(() => {
    if (inputActivities) {
      setActivities(inputActivities);
      return;
    }
    setActivities([]);
  }, [year, inputActivities]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900">Hoạt động gần đây</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">Xem tất cả</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm text-gray-600">Tên hoạt động</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Đơn vị</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Thời gian</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-gray-900">{activity.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{activity.unit}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{activity.time}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                    activity.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : activity.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.statusText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
