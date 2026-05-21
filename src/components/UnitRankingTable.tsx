import { useEffect, useState } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, identityDb } from '@/lib/firebase';

interface UnitRanking {
  rank: number;
  name: string;
  activities: number;
  participants: number;
  change: number;
}

interface UnitRankingTableProps {
  data?: UnitRanking[];
}

export function UnitRankingTable({ data: inputData }: UnitRankingTableProps) {
  const [rankings, setRankings] = useState<UnitRanking[]>(inputData ?? []);

  useEffect(() => {
    if (inputData) {
      setRankings(inputData);
      return;
    }
    Promise.all([getDocs(collection(identityDb, 'don_vi')), getDocs(collection(db, 'hoat_dong'))]).then(([unitSnap, activitySnap]) => {
      const activities = activitySnap.docs.map((item) => item.data());
      const rows = unitSnap.docs
        .map((item) => {
          const unit = item.data();
          const unitActivities = activities.filter((activity) => activity.ma_don_vi === item.id);
          return {
            rank: 0,
            name: String(unit.ten_don_vi ?? item.id),
            activities: unitActivities.length,
            participants: unitActivities.reduce((sum, activity) => sum + Number(activity.so_luong_tham_gia ?? 0), 0),
            change: 0,
          };
        })
        .sort((a, b) => b.activities - a.activities)
        .slice(0, 5)
        .map((item, index) => ({ ...item, rank: index + 1 }));
      setRankings(rows);
    });
  }, [inputData]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <h3 className="text-gray-900">Bảng xếp hạng đơn vị</h3>
      </div>

      <div className="space-y-3">
        {rankings.map((unit) => (
          <div
            key={unit.rank}
            className={`p-4 rounded-lg border-2 transition-all ${
              unit.rank === 1
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                : unit.rank === 2
                ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300'
                : unit.rank === 3
                ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    unit.rank === 1
                      ? 'bg-yellow-500 text-white'
                      : unit.rank === 2
                      ? 'bg-gray-400 text-white'
                      : unit.rank === 3
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {unit.rank}
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">{unit.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{unit.activities} hoạt động</span>
                    <span>•</span>
                    <span>{unit.participants.toLocaleString()} lượt tham gia</span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                unit.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${unit.change < 0 ? 'rotate-180' : ''}`} />
                <span>{Math.abs(unit.change)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
