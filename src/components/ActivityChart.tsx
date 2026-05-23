import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



interface ActivityChartProps {
  year: number;
  data?: MonthlyActivity[];
}

type MonthlyActivity = { id: string; month: string; activities: number };

export function ActivityChart({ year, data: inputData }: ActivityChartProps) {
  const [data, setData] = useState<MonthlyActivity[]>(inputData ?? []);

  useEffect(() => {
    if (inputData) {
      setData(inputData);
      return;
    }
    setData([]);
  }, [year, inputData]);

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
