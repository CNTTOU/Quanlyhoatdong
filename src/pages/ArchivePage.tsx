import { FormEvent, useEffect, useState } from 'react';
import { Archive, AlertTriangle, Lock, Package, Download, CheckCircle, Trash2, Info, FileArchive, FileText, Image, Users, Clock, Plus, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { deleteSchoolYear, getSchoolYears, lockSchoolYear, saveSchoolYear, type SchoolYearDisplay, type SchoolYearFormInput } from '@/services/schoolYearService';

const emptyForm: SchoolYearFormInput = {
  ma_nam_hoc: '',
  ten_nam_hoc: '',
  ngay_bat_dau: '',
  ngay_ket_thuc: '',
  trang_thai: 'dang_hoat_dong',
  la_nam_hoc_hien_tai: false,
  da_luu_tru: false,
  da_xoa_du_lieu_online: false,
};

function toInputDate(value: SchoolYearDisplay['ngay_bat_dau']) {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value instanceof Date ? value : value.toDate();
  return date.toISOString().slice(0, 10);
}

export function ArchivePage() {
  const { user, hasPermission } = useAuth();
  const [academicYears, setAcademicYears] = useState<SchoolYearDisplay[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [archiveStep, setArchiveStep] = useState(2);
  const [form, setForm] = useState<SchoolYearFormInput>(emptyForm);
  const [editingYear, setEditingYear] = useState<SchoolYearDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const canCreateArchive = hasPermission('tao_goi_luu_tru');
  const canDeleteArchive = hasPermission('xoa_du_lieu_nam_hoc');
  const canManage = canCreateArchive;

  async function loadSchoolYears() {
    setLoading(true);
    try {
      const items = await getSchoolYears();
      setAcademicYears(items);
      setSelectedYear((current) => current ?? items.find((item) => item.la_nam_hoc_hien_tai)?.id ?? items[0]?.id ?? null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải danh sách năm học.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchoolYears();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'dang_hoat_dong':
        return { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700' };
      case 'locked':
      case 'da_khoa':
        return { label: 'Đã khóa', color: 'bg-orange-100 text-orange-700' };
      case 'archived-ready':
        return { label: 'Đã tạo gói lưu trữ', color: 'bg-blue-100 text-blue-700' };
      case 'archived':
      case 'da_luu_tru_offline':
        return { label: 'Đã lưu trữ offline', color: 'bg-purple-100 text-purple-700' };
      case 'deleted-online':
      case 'da_xoa_du_lieu_online':
        return { label: 'Đã xóa dữ liệu online', color: 'bg-gray-100 text-gray-700' };
      default:
        return { label: 'Chờ lưu trữ', color: 'bg-yellow-100 text-yellow-700' };
    }
  };

  const selected = academicYears.find(y => y.id === selectedYear);

  function openCreateModal() {
    setEditingYear(null);
    setForm(emptyForm);
    setMessage('');
    setShowFormModal(true);
  }

  function openEditModal(year: SchoolYearDisplay) {
    setEditingYear(year);
    setForm({
      ma_nam_hoc: year.ma_nam_hoc,
      ten_nam_hoc: year.ten_nam_hoc,
      ngay_bat_dau: toInputDate(year.ngay_bat_dau),
      ngay_ket_thuc: toInputDate(year.ngay_ket_thuc),
      trang_thai: year.trang_thai,
      la_nam_hoc_hien_tai: year.la_nam_hoc_hien_tai,
      da_luu_tru: year.da_luu_tru,
      da_xoa_du_lieu_online: year.da_xoa_du_lieu_online,
    });
    setMessage('');
    setShowFormModal(true);
  }

  function validateForm() {
    if (!form.ma_nam_hoc || !form.ten_nam_hoc || !form.ngay_bat_dau || !form.ngay_ket_thuc) return 'Vui lòng nhập đầy đủ mã, tên và thời gian năm học.';
    if (new Date(String(form.ngay_bat_dau)) > new Date(String(form.ngay_ket_thuc))) return 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.';
    return '';
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canManage) return;
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      if (!user) return;
      await saveSchoolYear(form, Boolean(editingYear), user);
      setMessage(editingYear ? 'Cập nhật năm học thành công.' : 'Thêm năm học thành công.');
      setShowFormModal(false);
      await loadSchoolYears();
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : 'Không thể lưu năm học.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLockYear(year: SchoolYearDisplay) {
    if (!canManage) return;
    if (!window.confirm(`Khóa năm học ${year.name}? Hoạt động thuộc năm học này sẽ không được sửa, trừ super_admin.`)) return;
    if (!user) return;
    await lockSchoolYear(year, user);
    setMessage(`Đã khóa năm học ${year.name}.`);
    await loadSchoolYears();
  }

  async function handleDeleteYear() {
    if (!selected || !canDeleteArchive) return;
    if (!confirmChecked || confirmText !== selected.name || deleteConfirmText !== 'XOA DU LIEU') return;
    if (!user) return;
    await deleteSchoolYear(selected, user);
    setMessage(`Đã xóa năm học ${selected.name}.`);
    setShowDeleteModal(false);
    setConfirmChecked(false);
    setConfirmText('');
    setDeleteConfirmText('');
    setSelectedYear(null);
    await loadSchoolYears();
  }

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
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Xuất và lưu trữ dữ liệu năm học offline, giải phóng dung lượng database cho năm học mới
          </p>
          {canManage && (
            <button onClick={openCreateModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Thêm năm học</span>
            </button>
          )}
        </div>
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

      {message && <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Years List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Danh sách năm học</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-4 text-sm text-gray-500">Đang tải năm học...</div>
              ) : academicYears.map((year) => {
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
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">Chi tiết năm học {selected.name}</h3>
                  {(canManage || canDeleteArchive) && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(selected)} className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        <span>Sửa</span>
                      </button>
                      {canDeleteArchive && (
                        <button onClick={() => setShowDeleteModal(true)} className="px-3 py-2 bg-white text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <p className="text-xs text-blue-700">Hoạt động</p>
                    </div>
                    <p className="text-2xl font-semibold text-blue-900">{selected.activities}</p>
                    <p className="text-xs text-blue-600 mt-1">Đã duyệt: {selected.approvedActivities}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="w-5 h-5 text-purple-600" />
                      <p className="text-xs text-purple-700">Minh chứng</p>
                    </div>
                    <p className="text-2xl font-semibold text-purple-900">{selected.evidence}</p>
                    <p className="text-xs text-purple-600 mt-1">{selected.evidence} mục dữ liệu</p>
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
                    <p className="text-2xl font-semibold text-cyan-900">{selected.participants.toLocaleString()}</p>
                    <p className="text-xs text-cyan-600 mt-1">Lượt sinh viên</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Lần cập nhật cuối:</span>
                    <span className="text-gray-900">{selected.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Năm học hiện tại:</span>
                    <span className="text-gray-900">{selected.la_nam_hoc_hien_tai ? 'Có' : 'Không'}</span>
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
                {(selected.status === 'active' || selected.status === 'dang_hoat_dong') && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-orange-900 mb-1">Bước 1: Khóa năm học</h4>
                        <p className="text-sm text-orange-700 mb-3">
                          Sau khi khóa, người dùng không thể thêm, sửa, xóa hoạt động thuộc năm học này.
                        </p>
                        {canCreateArchive && (
                          <button onClick={() => handleLockYear(selected)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            <span>Khóa năm học {selected.name}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Create Archive Package */}
                {(selected.status === 'locked' || selected.status === 'da_khoa' || archiveStep >= 2) && (
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

                        {canCreateArchive && archiveStep === 2 && (
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
                                <p className="text-sm font-medium text-gray-900">archive_{selected.id}</p>
                                <p className="text-xs text-gray-500">Dung lượng ước tính: {selected.size} • Ngày tạo: {new Date().toLocaleString('vi-VN')}</p>
                                <p className="text-xs text-gray-500">Người tạo: {user?.ho_ten || user?.email || 'Người dùng hiện tại'}</p>
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
                {canDeleteArchive && archiveStep >= 3 && confirmChecked && confirmText === selected.name && (
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
                        <span className="font-medium">{user?.ho_ten || user?.email || 'Người dùng hiện tại'}</span> đã tạo gói lưu trữ
                      </p>
                      <p className="text-xs text-gray-500">{new Date().toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{user?.ho_ten || user?.email || 'Người dùng hiện tại'}</span> đã khóa năm học
                      </p>
                      <p className="text-xs text-gray-500">{new Date().toLocaleString('vi-VN')}</p>
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

            <label className="flex items-start gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-700">
                Tôi xác nhận đã tải xuống và kiểm tra gói lưu trữ dữ liệu của năm học này.
              </span>
            </label>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Nhập lại tên năm học: <span className="font-semibold">{selected.name}</span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={selected.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">
                Để xác nhận, vui lòng nhập: <span className="font-mono font-semibold text-red-600">XOA DU LIEU</span>
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
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
              <button
                onClick={handleDeleteYear}
                disabled={!confirmChecked || confirmText !== selected.name || deleteConfirmText !== 'XOA DU LIEU'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-60"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{editingYear ? 'Sửa năm học' : 'Thêm năm học'}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">Đóng</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm text-gray-700 mb-2">Mã năm học</span>
                <input disabled={Boolean(editingYear)} value={form.ma_nam_hoc} onChange={(e) => setForm({ ...form, ma_nam_hoc: e.target.value })} placeholder="2025_2026" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-700 mb-2">Tên năm học</span>
                <input value={form.ten_nam_hoc} onChange={(e) => setForm({ ...form, ten_nam_hoc: e.target.value })} placeholder="2025-2026" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-700 mb-2">Ngày bắt đầu</span>
                <input type="date" value={String(form.ngay_bat_dau)} onChange={(e) => setForm({ ...form, ngay_bat_dau: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-700 mb-2">Ngày kết thúc</span>
                <input type="date" value={String(form.ngay_ket_thuc)} onChange={(e) => setForm({ ...form, ngay_ket_thuc: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block">
                <span className="block text-sm text-gray-700 mb-2">Trạng thái</span>
                <select value={form.trang_thai} onChange={(e) => setForm({ ...form, trang_thai: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="dang_hoat_dong">Đang hoạt động</option>
                  <option value="da_khoa">Đã khóa</option>
                  <option value="cho_luu_tru">Chờ lưu trữ</option>
                  <option value="da_luu_tru_offline">Đã lưu trữ offline</option>
                  <option value="da_xoa_du_lieu_online">Đã xóa dữ liệu online</option>
                </select>
              </label>
              <div className="space-y-3 pt-7">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.la_nam_hoc_hien_tai} onChange={(e) => setForm({ ...form, la_nam_hoc_hien_tai: e.target.checked })} />
                  Là năm học hiện tại
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.da_luu_tru} onChange={(e) => setForm({ ...form, da_luu_tru: e.target.checked })} />
                  Đã lưu trữ
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.da_xoa_du_lieu_online} onChange={(e) => setForm({ ...form, da_xoa_du_lieu_online: e.target.checked })} />
                  Đã xóa dữ liệu online
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Hủy
                </button>
                <button disabled={saving} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-60">
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
