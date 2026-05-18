import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  year: number;
}

const getDataForYear = (year: number) => {
  // Giả lập dữ liệu khác nhau cho mỗi năm
  const baseData = [45, 52, 61, 48, 70, 55, 42, 65, 58, 73, 68, 80];
  const yearOffset = (year - 2026) * 5;

  return [
    { id: 'm1', month: 'T1', activities: Math.max(20, baseData[0] + yearOffset) },
    { id: 'm2', month: 'T2', activities: Math.max(20, baseData[1] + yearOffset) },
    { id: 'm3', month: 'T3', activities: Math.max(20, baseData[2] + yearOffset) },
    { id: 'm4', month: 'T4', activities: Math.max(20, baseData[3] + yearOffset) },
    { id: 'm5', month: 'T5', activities: Math.max(20, baseData[4] + yearOffset) },
    { id: 'm6', month: 'T6', activities: Math.max(20, baseData[5] + yearOffset) },
    { id: 'm7', month: 'T7', activities: Math.max(20, baseData[6] + yearOffset) },
    { id: 'm8', month: 'T8', activities: Math.max(20, baseData[7] + yearOffset) },
    { id: 'm9', month: 'T9', activities: Math.max(20, baseData[8] + yearOffset) },
    { id: 'm10', month: 'T10', activities: Math.max(20, baseData[9] + yearOffset) },
    { id: 'm11', month: 'T11', activities: Math.max(20, baseData[10] + yearOffset) },
    { id: 'm12', month: 'T12', activities: Math.max(20, baseData[11] + yearOffset) },
  ];
};

export function ActivityChart({ year }: ActivityChartProps) {
  const data = getDataForYear(year);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-gray-900 mb-6">Thống kê hoạt động theo tháng - Năm {year}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="activities" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
