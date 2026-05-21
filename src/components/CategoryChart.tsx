import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryChartProps {
  year: number;
  data?: CategoryStat[];
}

type CategoryStat = { id: string; name: string; value: number; color: string };

export function CategoryChart({ year, data: inputData }: CategoryChartProps) {
  const [data, setData] = useState<CategoryStat[]>(inputData ?? []);

  useEffect(() => {
    if (inputData) {
      setData(inputData);
      return;
    }
    setData([]);
  }, [year, inputData]);

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
