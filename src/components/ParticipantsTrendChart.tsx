import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getInterfaceDocument } from '@/services/interfaceDataService';

type ParticipantTrend = { id?: string; month: string; participants: number };

export function ParticipantsTrendChart() {
  const [data, setData] = useState<ParticipantTrend[]>([]);

  useEffect(() => {
    getInterfaceDocument<{ participantTrend: ParticipantTrend[] }>('du_lieu_bieu_do_dashboard', {
      participantTrend: [],
    }).then((result) => setData(result.participantTrend));
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-gray-900 mb-6">Lượt sinh viên tham gia theo thời gian</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="participants"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ fill: '#06b6d4', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
