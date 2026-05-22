import { useEffect, useMemo, useState } from 'react';
import { FileUp, Save, Search, Upload, X } from 'lucide-react';
import { EvidenceTabs, evidenceTabConfig } from '@/components/EvidenceTabs';
import { EvidenceFilters, type EvidenceFiltersState } from '@/components/EvidenceFilters';
import { EvidenceCard } from '@/components/EvidenceCard';
import { EvidencePreviewModal, getEvidenceDownloadUrl } from '@/components/EvidencePreviewModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  addEvidence,
  defaultEvidenceFormInput,
  deleteEvidence,
  evidenceStorageOptions,
  evidenceTypeOptions,
  getEvidenceFormOptions,
  getEvidenceFilterOptions,
  getEvidenceRowsByCurrentUser,
  toEvidenceFormInput,
  uploadEvidenceFile,
  updateEvidence,
  validateEvidenceForm,
  type EvidenceFilterOptions,
  type EvidenceFormInput,
  type EvidenceFormOptions,
  type EvidenceRow,
  type EvidenceType,
} from '@/services/evidenceService';

const initialFilters: EvidenceFiltersState = {
  loai_minh_chung: '',
  ma_nam_hoc: '',
  ma_don_vi: '',
  ma_loai: '',
  ngay_tai_len: '',
};

const emptyOptions: EvidenceFilterOptions = {
  years: [],
  units: [],
  activityTypes: [],
};

const emptyFormOptions: EvidenceFormOptions = {
  ...emptyOptions,
  activities: [],
};

const tabTypeMap: Record<string, EvidenceType[]> = {
  images: ['image'],
  videos: ['video'],
  reports: ['pdf', 'word'],
  links: ['link'],
  attendance: ['excel'],
  drive: ['drive'],
};

function isWithinUploadRange(uploadTime: number, range: string) {
  if (!range) return true;
  if (!uploadTime) return false;
  const now = new Date();
  const start = new Date(now);
  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (range === 'week') {
    start.setDate(now.getDate() - 7);
  } else if (range === 'month') {
    start.setDate(now.getDate() - 30);
  }
  return uploadTime >= start.getTime();
}

function matchesTypeFilter(evidence: EvidenceRow, typeFilter: string) {
  if (!typeFilter) return true;
  if (typeFilter === 'document') return ['pdf', 'word', 'excel'].includes(evidence.type);
  if (typeFilter === 'attendance') return evidence.type === 'excel';
  return evidence.type === typeFilter;
}

export function EvidenceLibraryPage() {
  const { user } = useAuth();
  const [evidences, setEvidences] = useState<EvidenceRow[]>([]);
  const [filterOptions, setFilterOptions] = useState<EvidenceFilterOptions>(emptyOptions);
  const [formOptions, setFormOptions] = useState<EvidenceFormOptions>(emptyFormOptions);
  const [filters, setFilters] = useState<EvidenceFiltersState>(initialFilters);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewEvidence, setPreviewEvidence] = useState<EvidenceRow | null>(null);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceRow | null>(null);
  const [form, setForm] = useState<EvidenceFormInput>(defaultEvidenceFormInput);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function loadEvidenceData() {
    if (!user) return;
    setLoading(true);
    try {
      const [evidenceRows, options, nextFormOptions] = await Promise.all([
        getEvidenceRowsByCurrentUser(user),
        getEvidenceFilterOptions(user),
        getEvidenceFormOptions(user),
      ]);
      setEvidences(evidenceRows);
      setFilterOptions(options);
      setFormOptions(nextFormOptions);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải minh chứng.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvidenceData();
  }, [user]);

  const selectedActivity = useMemo(
    () => formOptions.activities.find((activity) => activity.id === form.ma_hoat_dong),
    [form.ma_hoat_dong, formOptions.activities],
  );

  const baseFilteredEvidences = useMemo(() => evidences.filter((evidence) => {
    const keyword = searchQuery.toLowerCase().trim();
    if (keyword && !`${evidence.name} ${evidence.activity}`.toLowerCase().includes(keyword)) return false;
    if (!matchesTypeFilter(evidence, filters.loai_minh_chung)) return false;
    if (filters.ma_nam_hoc && evidence.ma_nam_hoc !== filters.ma_nam_hoc) return false;
    if (filters.ma_don_vi && evidence.ma_don_vi !== filters.ma_don_vi) return false;
    if (filters.ma_loai && evidence.ma_loai !== filters.ma_loai) return false;
    if (!isWithinUploadRange(evidence.uploadTime, filters.ngay_tai_len)) return false;
    return true;
  }), [evidences, filters, searchQuery]);

  const tabs = useMemo(() => evidenceTabConfig.map((tab) => ({
    ...tab,
    count: tab.id === 'all'
      ? baseFilteredEvidences.length
      : baseFilteredEvidences.filter((evidence) => tabTypeMap[tab.id]?.includes(evidence.type)).length,
  })), [baseFilteredEvidences]);

  const filteredEvidences = baseFilteredEvidences.filter((evidence) => {
    if (activeTab === 'all') return true;
    return tabTypeMap[activeTab]?.includes(evidence.type);
  });

  const previewEvidenceUrl = (evidence: EvidenceRow) => {
    if (!evidence.url) return;
    setPreviewEvidence(evidence);
  };

  const openEvidenceUrl = (evidence: Pick<EvidenceRow, 'url'>) => {
    if (!evidence.url) return;
    window.open(evidence.url, '_blank', 'noopener,noreferrer');
  };

  const downloadEvidenceUrl = (evidence: Pick<EvidenceRow, 'url'>) => {
    if (!evidence.url) return;
    window.open(getEvidenceDownloadUrl(evidence.url), '_blank', 'noopener,noreferrer');
  };

  const copyEvidenceUrl = async (evidence: EvidenceRow) => {
    if (!evidence.url) return;
    try {
      await navigator.clipboard.writeText(evidence.url);
      setMessage('Đã sao chép link minh chứng.');
    } catch {
      setMessage('Không thể sao chép link minh chứng trên trình duyệt hiện tại.');
    }
  };

  function openCreateModal() {
    setEditingEvidence(null);
    setForm(defaultEvidenceFormInput);
    setSelectedFile(null);
    setMessage('');
    setIsModalOpen(true);
  }

  function openEditModal(evidence: EvidenceRow) {
    setEditingEvidence(evidence);
    setForm(toEvidenceFormInput(evidence.raw));
    setSelectedFile(null);
    setMessage('');
    setIsModalOpen(true);
  }

  async function handleSaveEvidence() {
    if (!user) return;
    if (!form.ma_hoat_dong) {
      setMessage('Vui lòng chọn hoạt động.');
      return;
    }

    let nextForm = form;
    if (selectedFile) {
      setSaving(true);
      setMessage('Đang upload file minh chứng...');
      try {
        const uploaded = await uploadEvidenceFile(selectedFile, form.ma_hoat_dong);
        nextForm = {
          ...form,
          ten_minh_chung: form.ten_minh_chung.trim() || selectedFile.name,
          loai_minh_chung: uploaded.loai_minh_chung || form.loai_minh_chung,
          nguon_luu_tru: uploaded.nguon_luu_tru || form.nguon_luu_tru,
          duong_dan_file: uploaded.url,
          ten_file: uploaded.ten_file || selectedFile.name,
          dinh_dang_file: uploaded.dinh_dang_file || form.dinh_dang_file,
          dung_luong_file: uploaded.dung_luong_file || selectedFile.size,
          mime_type: uploaded.mime_type,
        };
        setForm(nextForm);
      } catch (uploadError) {
        setMessage(uploadError instanceof Error ? uploadError.message : 'Không thể upload file minh chứng.');
        setSaving(false);
        return;
      }
    }

    const error = validateEvidenceForm(nextForm);
    if (error) {
      setMessage(error);
      setSaving(false);
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      if (editingEvidence) {
        await updateEvidence(editingEvidence.id, nextForm, selectedActivity);
        setMessage('Đã cập nhật minh chứng.');
      } else {
        await addEvidence(nextForm, selectedActivity);
        setMessage('Đã thêm minh chứng.');
      }
      setIsModalOpen(false);
      setSelectedFile(null);
      await loadEvidenceData();
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : 'Không thể lưu minh chứng.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvidence(evidence: EvidenceRow) {
    if (!window.confirm(`Xóa minh chứng "${evidence.name}"?`)) return;
    setMessage('');
    try {
      await deleteEvidence(evidence.id);
      setMessage('Đã xóa minh chứng.');
      await loadEvidenceData();
    } catch (deleteError) {
      setMessage(deleteError instanceof Error ? deleteError.message : 'Không thể xóa minh chứng.');
    }
  }

  function updateField(field: keyof EvidenceFormInput, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSelectFile(file?: File) {
    if (!file) return;
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Chỉ hỗ trợ ảnh JPG/PNG/WebP/GIF hoặc file PDF/Word/Excel/CSV.');
      return;
    }
    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? 15 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage(isImage ? 'Ảnh tối đa 15MB.' : 'File tài liệu tối đa 25MB.');
      return;
    }
    setSelectedFile(file);
    setMessage('');
    if (!form.ten_minh_chung.trim()) updateField('ten_minh_chung', file.name);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Kho minh chứng</h2>
        <p className="text-sm text-gray-500">
          Thư viện lưu trữ tất cả minh chứng hoạt động Đoàn - Hội
        </p>
      </div>

      {message && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm hình ảnh, file, link minh chứng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
          >
            <Upload className="w-5 h-5" />
            <span>Tải lên</span>
          </button>
        </div>
      </div>

      <EvidenceTabs activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} />

      <EvidenceFilters
        filters={filters}
        options={filterOptions}
        onFilterChange={(nextFilters) => setFilters((current) => ({ ...current, ...nextFilters }))}
      />

      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {loading ? 'Đang tải minh chứng...' : <>Hiển thị <span className="text-gray-900">{filteredEvidences.length}</span> minh chứng</>}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvidences.map((evidence) => (
          <EvidenceCard
            key={evidence.id}
            evidence={evidence}
            onView={previewEvidenceUrl}
            onDownload={downloadEvidenceUrl}
            onCopy={copyEvidenceUrl}
            onEdit={openEditModal}
            onDelete={handleDeleteEvidence}
          />
        ))}
      </div>

      {!loading && filteredEvidences.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">Không tìm thấy minh chứng</h3>
          <p className="text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h3 className="text-gray-900">{editingEvidence ? 'Chỉnh sửa minh chứng' : 'Thêm minh chứng'}</h3>
                <p className="mt-1 text-sm text-gray-500">Lưu link ảnh, video, file hoặc thư mục minh chứng theo hoạt động.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Hoạt động <span className="text-red-500">*</span></span>
                <select value={form.ma_hoat_dong} onChange={(event) => updateField('ma_hoat_dong', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn hoạt động</option>
                  {formOptions.activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>{activity.name}</option>
                  ))}
                </select>
              </label>

              {selectedActivity && (
                <div className="grid grid-cols-1 gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 md:grid-cols-3">
                  <div><span className="text-blue-500">Đơn vị:</span> {selectedActivity.ten_don_vi}</div>
                  <div><span className="text-blue-500">Loại:</span> {selectedActivity.ten_loai}</div>
                  <div><span className="text-blue-500">Năm học:</span> {selectedActivity.ma_nam_hoc}</div>
                </div>
              )}

              <label className="block rounded-lg border border-dashed border-blue-200 bg-blue-50/60 p-4">
                <span className="mb-3 flex items-center gap-2 text-sm text-blue-800">
                  <FileUp className="h-4 w-4" />
                  Upload file minh chứng
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                  onChange={(event) => handleSelectFile(event.target.files?.[0])}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-blue-700"
                />
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blue-700">
                  <span>Ảnh: JPG, PNG, WebP, GIF tối đa 15MB</span>
                  <span>PDF/Word/Excel/CSV: tối đa 25MB</span>
                </div>
                {selectedFile && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm text-gray-700">
                    <span className="truncate">{selectedFile.name}</span>
                    <button type="button" onClick={() => setSelectedFile(null)} className="ml-3 text-xs text-red-600 hover:text-red-700">Bỏ chọn</button>
                  </div>
                )}
              </label>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm text-gray-700">Tên minh chứng <span className="text-red-500">*</span></span>
                  <input value={form.ten_minh_chung} onChange={(event) => updateField('ten_minh_chung', event.target.value)} placeholder="Ví dụ: Hình ảnh tổng kết hoạt động" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-gray-700">Loại minh chứng</span>
                  <select value={form.loai_minh_chung} onChange={(event) => updateField('loai_minh_chung', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {evidenceTypeOptions.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-gray-700">Nguồn lưu trữ</span>
                  <select value={form.nguon_luu_tru} onChange={(event) => updateField('nguon_luu_tru', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {evidenceStorageOptions.map((storage) => <option key={storage.value} value={storage.value}>{storage.label}</option>)}
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm text-gray-700">URL file / link minh chứng</span>
                  <input value={form.duong_dan_file} onChange={(event) => updateField('duong_dan_file', event.target.value)} placeholder="https://..." className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm text-gray-700">URL thư mục minh chứng</span>
                  <input value={form.duong_dan_thu_muc} onChange={(event) => updateField('duong_dan_thu_muc', event.target.value)} placeholder="https://drive.google.com/..." className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-gray-700">Tên file gốc</span>
                  <input value={form.ten_file} onChange={(event) => updateField('ten_file', event.target.value)} placeholder="ten-file.pdf" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-2 block text-sm text-gray-700">Định dạng</span>
                    <input value={form.dinh_dang_file} onChange={(event) => updateField('dinh_dang_file', event.target.value)} placeholder="pdf, jpg, xlsx..." className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-gray-700">Dung lượng (byte)</span>
                    <input type="number" min={0} value={form.dung_luong_file || ''} onChange={(event) => updateField('dung_luong_file', Number(event.target.value))} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </label>
                </div>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm text-gray-700">Ghi chú</span>
                  <textarea value={form.ghi_chu} onChange={(event) => updateField('ghi_chu', event.target.value)} rows={3} className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Hủy</button>
              <button onClick={handleSaveEvidence} disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60">
                <Save className="h-4 w-4" />
                {saving ? 'Đang lưu...' : 'Lưu minh chứng'}
              </button>
            </div>
          </div>
        </div>
      )}

      <EvidencePreviewModal
        evidence={previewEvidence}
        onClose={() => setPreviewEvidence(null)}
        onDownload={downloadEvidenceUrl}
      />
    </div>
  );
}
