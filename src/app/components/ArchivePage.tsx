import { useState } from 'react';
import { Archive, AlertTriangle, Lock, Package, Download, CheckCircle, Trash2, Info, FileArchive, FileText, Image, Users, Clock } from 'lucide-react';

const academicYears = [
  {
    id: 1,
    name: '2025-2026',
    startDate: '01/09/2025',
    endDate: '31/08/2026',
    activities: 245,
    evidence: 1850,
    reports: 45,
    size: '3.2 GB',
    status: 'active',
  },
  {
    id: 2,
    name: '2024-2025',
    startDate: '01/09/2024',
    endDate: '31/08/2025',
    activities: 238,
    evidence: 1720,
    reports: 42,
    size: '2.8 GB',
    status: 'locked',
  },
  {
    id: 3,
    name: '2023-2024',
    startDate: '01/09/2023',
    endDate: '31/08/2024',
    activities: 225,
    evidence: 1650,
    reports: 38,
    size: '2.5 GB',
    status: 'archived-ready',
  },
  {
    id: 4,
    name: '2022-2023',
    startDate: '01/09/2022',
    endDate: '31/08/2023',
    activities: 210,
    evidence: 1580,
    reports: 35,
    size: '2.3 GB',
    status: 'archived',
  },
  {
    id: 5,
    name: '2021-2022',
    startDate: '01/09/2021',
    endDate: '31/08/2022',
    activities: 195,
    evidence: 1420,
    reports: 32,
    size: '2.1 GB',
    status: 'deleted-online',
  },
];

export function ArchivePage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(2);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [archiveStep, setArchiveStep] = useState(2);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700' };
      case 'locked':
        return { label: 'Đã khóa', color: 'bg-orange-100 text-orange-700' };
      case 'archived-ready':
        return { label: 'Đã tạo gói lưu trữ', color: 'bg-blue-100 text-blue-700' };
      case 'archived':
        return { label: 'Đã lưu trữ offline', color: 'bg-purple-100 text-purple-700' };
      case 'deleted-online':
        return { label: 'Đã xóa dữ liệu online', color: 'bg-gray-100 text-gray-700' };
      default:
        return { label: 'Chờ lưu trữ', color: 'bg-yellow-100 text-yellow-700' };
    }
  };

  const selected = academicYears.find(y => y.id === selectedYear);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>Cài đặt hệ thống</span>
          <span>/</span>
          <span className="text-gray-900">Lưu trữ năm học</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Archive className="w-8 h-8 text-blue-600" />
          <h2 className="text-gray-900">Lưu trữ năm học</h2>
        </div>
        <p className="text-sm text-gray-500">
          Xuất và lưu trữ dữ liệu năm học offline, giải phóng dung lượng database cho năm học mới
        </p>
      </div>

      {/* Security Warning */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-amber-900 mb-1">Lưu ý quan trọng</h4>
          <p className="text-sm text-amber-700">
            Chức năng này cho phép xóa dữ liệu chi tiết của năm học khỏi database online. Hãy đảm bảo bạn đã tải xuống và kiểm tra gói lưu trữ trước khi xóa. Dữ liệu đã xóa không thể khôi phục từ hệ thống online.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Years List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Danh sách năm học</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {academicYears.map((year) => {
                const statusBadge = getStatusBadge(year.status);
                const isSelected = selectedYear === year.id;
                return (
                  <div
                    key={year.id}
                    onClick={() => setSelectedYear(year.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">{year.name}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{year.startDate} - {year.endDate}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FileText className="w-3 h-3" />
                        <span>{year.activities} hoạt động</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Image className="w-3 h-3" />
                        <span>{year.evidence} minh chứng</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <FileArchive className="w-3 h-3" />
                        <span>{year.reports} báo cáo</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Archive className="w-3 h-3" />
                        <span>{year.size}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details & Archive Process */}
        <div className="lg:col-span-2 space-y-6">
          {selected ? (
            <>
              {/* Year Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Chi tiết năm học {selected.name}</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <p className="text-xs text-blue-700">Hoạt động</p>
                    </div>
                    <p className="text-2xl font-semibold text-blue-900">{selected.activities}</p>
                    <p className="text-xs text-blue-600 mt-1">Đã duyệt: {Math.floor(selected.activities * 0.85)}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="w-5 h-5 text-purple-600" />
                      <p className="text-xs text-purple-700">Minh chứng</p>
                    </div>
                    <p className="text-2xl font-semibold text-purple-900">{selected.evidence}</p>
                    <p className="text-xs text-purple-600 mt-1">{selected.size} dữ liệu</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileArchive className="w-5 h-5 text-green-600" />
                      <p className="text-xs text-green-700">Báo cáo</p>
                    </div>
                    <p className="text-2xl font-semibold text-green-900">{selected.reports}</p>
                    <p className="text-xs text-green-600 mt-1">Đã xuất file</p>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-cyan-600" />
                      <p className="text-xs text-cyan-700">Tham gia</p>
                    </div>
                    <p className="text-2xl font-semibold text-cyan-900">{(selected.activities * 12).toLocaleString()}</p>
                    <p className="text-xs text-cyan-600 mt-1">Lượt sinh viên</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Lần cập nhật cuối:</span>
                    <span className="text-gray-900">15/05/2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Người phụ trách:</span>
                    <span className="text-gray-900">Admin Đoàn - Hội</span>
                  </div>
                </div>
              </div>

              {/* Archive Process */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-6">Quy trình lưu trữ</h3>

                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 ${
                              step <= archiveStep
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {step < archiveStep ? <CheckCircle className="w-5 h-5" /> : step}
                          </div>
                          <p className={`text-xs text-center ${step <= archiveStep ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step === 1 && 'Khóa năm học'}
                            {step === 2 && 'Tạo gói lưu trữ'}
                            {step === 3 && 'Tải file ZIP'}
                            {step === 4 && 'Xác nhận sao lưu'}
                            {step === 5 && 'Xóa dữ liệu'}
                          </p>
                        </div>
                        {step < 5 && (
                          <div
                            className={`absolute top-5 left-1/2 w-full h-0.5 ${
                              step < archiveStep ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                            style={{ zIndex: -1 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1: Lock Year */}
                {selected.status === 'active' && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-orange-900 mb-1">Bước 1: Khóa năm học</h4>
                        <p className="text-sm text-orange-700 mb-3">
                          Sau khi khóa, người dùng không thể thêm, sửa, xóa hoạt động thuộc năm học này.
                        </p>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          <span>Khóa năm học {selected.name}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Create Archive Package */}
                {(selected.status === 'locked' || archiveStep >= 2) && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Bước 2: Tạo gói lưu trữ</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Xuất toàn bộ dữ liệu năm học thành file nén để tải về.
                        </p>

                        <div className="bg-white rounded-lg p-3 mb-3">
                          <p className="text-xs text-gray-600 mb-2">Dữ liệu sẽ được xuất:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-gray-700">Hoạt động (CSV, Excel)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-gray-700">Minh chứng (Files + index)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-gray-700">Báo cáo (PDF)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-gray-700">Lịch sử duyệt</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-gray-700">Danh sách tham gia</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-gray-700">Metadata JSON</span>
                            </div>
                          </div>
                        </div>

                        {archiveStep === 2 && (
                          <button
                            onClick={() => setArchiveStep(3)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                          >
                            <Package className="w-4 h-4" />
                            <span>Tạo gói lưu trữ</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Download ZIP */}
                {archiveStep >= 3 && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-green-900 mb-1">Bước 3: Tải file ZIP</h4>
                        <p className="text-sm text-green-700 mb-3">
                          Gói lưu trữ đã được tạo thành công. Tải xuống và lưu trữ ở nơi an toàn.
                        </p>

                        <div className="bg-white rounded-lg p-4 mb-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <FileArchive className="w-10 h-10 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">ARCHIVE_{selected.name}.zip</p>
                                <p className="text-xs text-gray-500">Dung lượng: {selected.size} • Ngày tạo: 15/05/2026 10:30</p>
                                <p className="text-xs text-gray-500">Người tạo: Admin Đoàn - Hội</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all text-sm flex items-center justify-center gap-2">
                              <Download className="w-4 h-4" />
                              <span>Tải xuống</span>
                            </button>
                            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                              Tải lại gói
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm Backup */}
                {archiveStep >= 3 && (
                  <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-purple-900 mb-1">Bước 4: Xác nhận đã sao lưu</h4>
                        <p className="text-sm text-purple-700 mb-3">
                          Xác nhận bạn đã tải xuống và kiểm tra gói lưu trữ.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800">
                            Khuyến nghị lưu file ở ít nhất 2 nơi: máy tính cá nhân và Google Drive/ổ cứng ngoài.
                          </p>
                        </div>

                        <label className="flex items-start gap-2 mb-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={confirmChecked}
                            onChange={(e) => setConfirmChecked(e.target.checked)}
                            className="mt-0.5"
                          />
                          <span className="text-sm text-gray-700">
                            Tôi xác nhận đã tải xuống và kiểm tra gói lưu trữ dữ liệu.
                          </span>
                        </label>

                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Nhập lại tên năm học để xác nhận: <span className="font-medium">{selected.name}</span>
                          </label>
                          <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={selected.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Delete Online Data */}
                {archiveStep >= 3 && confirmChecked && confirmText === selected.name && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-900 mb-1">Bước 5: Xóa dữ liệu online</h4>
                        <p className="text-sm text-red-700 mb-3">
                          Thao tác này sẽ xóa dữ liệu chi tiết của năm học khỏi database online. Hệ thống chỉ giữ lại thông tin năm học và lịch sử lưu trữ.
                        </p>

                        <div className="bg-white rounded-lg p-3 mb-3">
                          <p className="text-xs font-medium text-gray-900 mb-2">Dữ liệu sẽ bị xóa:</p>
                          <ul className="space-y-1 text-xs text-gray-700">
                            <li className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-red-600"></div>
                              <span>{selected.activities} hoạt động và chi tiết nội dung</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-red-600"></div>
                              <span>{selected.evidence} file minh chứng</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-red-600"></div>
                              <span>{selected.reports} báo cáo đã tạo</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-red-600"></div>
                              <span>Lịch sử duyệt hoạt động</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-red-600"></div>
                              <span>Danh sách sinh viên tham gia</span>
                            </li>
                          </ul>
                          <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                            <span className="font-medium">Không xóa:</span> Tài khoản người dùng, vai trò, đơn vị, mẫu báo cáo, cài đặt hệ thống
                          </p>
                        </div>

                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa dữ liệu năm học khỏi database online</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Archive Log */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Nhật ký thao tác lưu trữ</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">Admin Đoàn - Hội</span> đã tạo gói lưu trữ
                      </p>
                      <p className="text-xs text-gray-500">15/05/2026 10:30</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">Admin Đoàn - Hội</span> đã khóa năm học
                      </p>
                      <p className="text-xs text-gray-500">15/05/2026 09:15</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chọn một năm học để xem chi tiết và thao tác lưu trữ</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa dữ liệu năm học</h3>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              Bạn đang chuẩn bị xóa dữ liệu chi tiết của năm học <span className="font-semibold">{selected.name}</span> khỏi database online.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-red-900 mb-2">Dữ liệu sau sẽ bị xóa vĩnh viễn:</p>
              <ul className="space-y-1 text-xs text-red-800">
                <li>• {selected.activities} hoạt động</li>
                <li>• {selected.evidence} minh chứng</li>
                <li>• {selected.reports} báo cáo đã tạo</li>
                <li>• Lịch sử duyệt hoạt động</li>
                <li>• Danh sách tham gia</li>
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Để xác nhận, vui lòng nhập: <span className="font-mono font-semibold text-red-600">XOA DU LIEU</span>
              </label>
              <input
                type="text"
                placeholder="XOA DU LIEU"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Hủy
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
