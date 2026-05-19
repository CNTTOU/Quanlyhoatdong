import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  MapPin,
  Users,
  Building2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Download,
  Eye,
  Clock,
} from 'lucide-react';
import { useState } from 'react';

interface Activity {
  id: number;
  name: string;
  category: string;
  unit: string;
  level: string;
  startDate: string;
  endDate: string;
  location: string;
  participants: number;
  objective: string;
  content: string;
  evidences: {
    images: number;
    files: number;
    links: string[];
  };
  history: {
    date: string;
    action: string;
    by: string;
    comment?: string;
  }[];
  status: 'pending' | 'approved' | 'need-update' | 'rejected';
}

interface ApprovalDetailPanelProps {
  activity: Activity | null;
  onApprove: (comment: string) => void;
  onRequestUpdate: (comment: string) => void;
  onReject: (comment: string) => void;
}

export function ApprovalDetailPanel({
  activity,
  onApprove,
  onRequestUpdate,
  onReject,
}: ApprovalDetailPanelProps) {
  const [comment, setComment] = useState('');

  if (!activity) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">Chọn hoạt động để xem chi tiết</h3>
          <p className="text-sm text-gray-500">Chọn một hoạt động từ danh sách bên trái</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl text-gray-900 mb-2">{activity.name}</h3>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            {activity.category}
          </span>
          <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
            {activity.unit}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Thông tin cơ bản */}
        <div>
          <h4 className="text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Thông tin cơ bản
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs">Thời gian</p>
                <p className="text-gray-900">{activity.startDate} - {activity.endDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs">Địa điểm</p>
                <p className="text-gray-900">{activity.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs">Cấp tổ chức</p>
                <p className="text-gray-900">{activity.level}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500 text-xs">Số lượng tham gia</p>
                <p className="text-gray-900">{activity.participants} người</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mục tiêu */}
        <div>
          <h4 className="text-gray-900 mb-3">Mục tiêu hoạt động</h4>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {activity.objective}
          </p>
        </div>

        {/* Nội dung */}
        <div>
          <h4 className="text-gray-900 mb-3">Nội dung triển khai</h4>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {activity.content}
          </p>
        </div>

        {/* Minh chứng */}
        <div>
          <h4 className="text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Minh chứng đã nộp
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-900">{activity.evidences.images} hình ảnh</span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Xem
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-900">{activity.evidences.files} file tài liệu</span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Download className="w-4 h-4" />
                Tải
              </button>
            </div>
            {activity.evidences.links.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-900 truncate">{link}</span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">Mở</button>
              </div>
            ))}
          </div>
        </div>

        {/* Lịch sử phản hồi */}
        {activity.history.length > 0 && (
          <div>
            <h4 className="text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Lịch sử phản hồi
            </h4>
            <div className="space-y-3">
              {activity.history.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-900">{item.action}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Bởi {item.by}</p>
                  {item.comment && (
                    <p className="text-sm text-gray-700 bg-white p-3 rounded mt-2">
                      {item.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nhận xét */}
        {activity.status === 'pending' && (
          <div>
            <h4 className="text-gray-900 mb-3">Nhận xét của bạn</h4>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập nhận xét, góp ý cho hoạt động..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      {activity.status === 'pending' && (
        <div className="p-6 border-t border-gray-100 space-y-3">
          <button
            onClick={() => {
              onApprove(comment);
              setComment('');
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/30"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Duyệt hoạt động</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onRequestUpdate(comment);
                setComment('');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Yêu cầu bổ sung</span>
            </button>

            <button
              onClick={() => {
                onReject(comment);
                setComment('');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              <XCircle className="w-4 h-4" />
              <span>Từ chối</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
