import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryChartProps {
  year: number;
}

const getDataForYear = (year: number) => {
  // Giả lập dữ liệu khác nhau cho mỗi năm
  const baseData = [120, 95, 80, 65, 50];
  const yearOffset = (year - 2026) * 10;

  return [
    { id: 'cat1', name: 'Học thuật', value: Math.max(30, baseData[0] + yearOffset), color: '#3b82f6' },
    { id: 'cat2', name: 'Tình nguyện', value: Math.max(30, baseData[1] + yearOffset), color: '#0ea5e9' },
    { id: 'cat3', name: 'Kỹ năng', value: Math.max(30, baseData[2] + yearOffset), color: '#06b6d4' },
    { id: 'cat4', name: 'SV5T', value: Math.max(30, baseData[3] + yearOffset), color: '#22d3ee' },
    { id: 'cat5', name: 'Truyền thông', value: Math.max(30, baseData[4] + yearOffset), color: '#67e8f9' },
  ];
};

export function CategoryChart({ year }: CategoryChartProps) {
  const data = getDataForYear(year);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-gray-900 mb-6">Phân loại hoạt động - Năm {year}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
