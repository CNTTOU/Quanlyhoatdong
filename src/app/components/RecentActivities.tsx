interface RecentActivitiesProps {
  year: number;
}

const getActivitiesForYear = (year: number) => [
  {
    id: 1,
    name: `Ngày hội tình nguyện mùa hè xanh ${year}`,
    unit: 'Đoàn CNTT',
    time: `15/05/${year}`,
    status: 'approved',
    statusText: 'Đã duyệt'
  },
  {
    id: 2,
    name: 'Hội thảo khoa học sinh viên lần thứ 20',
    unit: 'Đoàn Khoa học',
    time: `12/05/${year}`,
    status: 'pending',
    statusText: 'Chờ duyệt'
  },
  {
    id: 3,
    name: 'Chương trình đào tạo kỹ năng mềm K66',
    unit: 'Hội SVHS',
    time: `10/05/${year}`,
    status: 'approved',
    statusText: 'Đã duyệt'
  },
  {
    id: 4,
    name: 'Hiến máu tình nguyện - Giọt hồng yêu thương',
    unit: 'Hội chữ thập đỏ',
    time: `08/05/${year}`,
    status: 'completed',
    statusText: 'Hoàn thành'
  },
  {
    id: 5,
    name: 'Cuộc thi Olympic Tin học sinh viên',
    unit: 'Đoàn CNTT',
    time: `05/05/${year}`,
    status: 'approved',
    statusText: 'Đã duyệt'
  },
];

export function RecentActivities({ year }: RecentActivitiesProps) {
  const activities = getActivitiesForYear(year);
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
