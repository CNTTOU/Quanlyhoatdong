import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { id: 'm1', month: 'T1', participants: 850 },
  { id: 'm2', month: 'T2', participants: 920 },
  { id: 'm3', month: 'T3', participants: 1100 },
  { id: 'm4', month: 'T4', participants: 980 },
  { id: 'm5', month: 'T5', participants: 1250 },
  { id: 'm6', month: 'T6', participants: 1150 },
  { id: 'm7', month: 'T7', participants: 850 },
  { id: 'm8', month: 'T8', participants: 1300 },
  { id: 'm9', month: 'T9', participants: 1180 },
  { id: 'm10', month: 'T10', participants: 1420 },
  { id: 'm11', month: 'T11', participants: 1350 },
  { id: 'm12', month: 'T12', participants: 1500 },
];

export function ParticipantsTrendChart() {
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
