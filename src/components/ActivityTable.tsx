import { Eye, Edit, Trash2, FileText, Users, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { defaultActivityStatuses, getActivityStatusSettings, type ActivityStatusSetting } from '@/services/settingService';

interface Activity {
  id: string;
  name: string;
  category: string;
  unit: string;
  date: string;
  month?: string;
  participants: number;
  evidence: number;
  status: 'draft' | 'pending' | 'approved' | 'need-update';
  isFeatured?: boolean;
  ma_nam_hoc?: string;
  ma_loai?: string;
  ma_don_vi?: string;
}

interface ActivityTableProps {
  activities: Activity[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, nextFeatured: boolean) => void;
}

function getStatusConfig(statuses: ActivityStatusSetting[], status: Activity['status']) {
  const config = statuses.find((item) => item.khoa_hien_thi === status);
  return {
    label: config?.ten_hien_thi ?? status,
    color: config?.mau_hien_thi ?? '#6B7280',
  };
}

export function ActivityTable({ activities, currentPage, totalPages, onPageChange, onViewDetail, onEdit, onDelete, onToggleFeatured }: ActivityTableProps) {
  const [statuses, setStatuses] = useState<ActivityStatusSetting[]>(defaultActivityStatuses);
  const hasActions = Boolean(onViewDetail || onEdit || onDelete || onToggleFeatured);

  useEffect(() => {
    getActivityStatusSettings().then(setStatuses).catch(() => undefined);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-sm text-gray-600">Tên hoạt động</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Loại hoạt động</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Đơn vị</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Thời gian</th>
              <th className="text-center py-4 px-6 text-sm text-gray-600">Tham gia</th>
              <th className="text-center py-4 px-6 text-sm text-gray-600">Minh chứng</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Trạng thái</th>
              <th className="text-left py-4 px-6 text-sm text-gray-600">Nổi bật</th>
              {hasActions && <th className="text-center py-4 px-6 text-sm text-gray-600">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900 max-w-xs">{activity.name}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600">{activity.category}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600">{activity.unit}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600">{activity.date}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{activity.participants}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-1.5">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{activity.evidence}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {(() => {
                    const status = getStatusConfig(statuses, activity.status);
                    return (
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs"
                    style={{ backgroundColor: `${status.color}1A`, color: status.color }}
                  >
                    {status.label}
                  </span>
                    );
                  })()}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${activity.isFeatured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {activity.isFeatured ? 'Đang hiển thị' : 'Không hiển thị'}
                  </span>
                </td>
                {hasActions && (
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      {onToggleFeatured && activity.status === 'approved' && (
                        <button
                          onClick={() => onToggleFeatured(activity.id, !activity.isFeatured)}
                          className="p-2 hover:bg-yellow-50 rounded-lg transition-colors group"
                          title={activity.isFeatured ? 'Ẩn khỏi hoạt động nổi bật' : 'Hiển thị ở hoạt động nổi bật'}
                        >
                          <Star className={`w-4 h-4 ${activity.isFeatured ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400 group-hover:text-yellow-500'}`} />
                        </button>
                      )}
                      {onViewDetail && (
                        <button
                          onClick={() => onViewDetail(activity.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(activity.id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(activity.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Trước
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
