import { useEffect, useMemo, useState } from 'react';
import { Copy, Edit, Plus, Save, Search, Star, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  deactivateReportTemplate,
  deleteReportTemplate,
  getReportTemplates,
  saveReportTemplate,
  setDefaultReportTemplate,
  type ReportTemplate,
} from '@/services/reportBuilderService';

const emptyTemplate: ReportTemplate = {
  ma_mau: '',
  ten_mau: '',
  loai_bao_cao: 'tong_hop_hoat_dong',
  mo_ta: '',
  don_vi_ap_dung: [],
  cau_truc: [
    { thu_tu: 1, tieu_de: 'Tình hình chung', kieu: 'section' },
    { thu_tu: 2, tieu_de: 'Kết quả thực hiện', kieu: 'table' },
    { thu_tu: 3, tieu_de: 'Đánh giá chung', kieu: 'section' },
  ],
  truong_du_lieu_dong: ['ten_hoat_dong', 'ten_don_vi', 'thoi_gian', 'so_luong_tham_gia'],
  ho_tro_word: true,
  ho_tro_pdf: true,
  ho_tro_excel: true,
  la_mac_dinh: false,
  trang_thai: 'dang_su_dung',
};

function templateToForm(template: ReportTemplate) {
  return {
    ...template,
    don_vi_ap_dung_text: template.don_vi_ap_dung.join(', '),
    cau_truc_text: template.cau_truc.map((section) => `${section.tieu_de}|${section.kieu}`).join('\n'),
    truong_du_lieu_dong_text: template.truong_du_lieu_dong.join(', '),
  };
}

type TemplateForm = ReturnType<typeof templateToForm>;

export function ReportTemplatesTab() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<TemplateForm>(() => templateToForm(emptyTemplate));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTemplates = () => {
    setLoading(true);
    getReportTemplates(false)
      .then((data) => {
        setTemplates(data.filter((template) => template.trang_thai !== 'da_xoa'));
        setSelectedTemplateId((current) => current || data[0]?.ma_mau || '');
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải mẫu báo cáo.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.ma_mau === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  );

  const filteredTemplates = templates.filter((template) => {
    const keyword = searchQuery.toLowerCase();
    return !keyword || template.ten_mau.toLowerCase().includes(keyword) || template.ma_mau.toLowerCase().includes(keyword);
  });

  const startCreate = () => {
    setSelectedTemplateId('');
    setForm(templateToForm(emptyTemplate));
    setMessage('');
  };

  const startEdit = (template: ReportTemplate) => {
    setSelectedTemplateId(template.ma_mau);
    setForm(templateToForm(template));
    setMessage('');
  };

  const duplicateTemplate = (template: ReportTemplate) => {
    const ma_mau = `${template.ma_mau}_copy_${Date.now()}`;
    setSelectedTemplateId('');
    setForm(templateToForm({
      ...template,
      ma_mau,
      ten_mau: `${template.ten_mau} - bản sao`,
      la_mac_dinh: false,
    }));
  };

  const parseForm = (): ReportTemplate => ({
    ma_mau: form.ma_mau.trim(),
    ten_mau: form.ten_mau.trim(),
    loai_bao_cao: form.loai_bao_cao.trim(),
    mo_ta: form.mo_ta.trim(),
    don_vi_ap_dung: form.don_vi_ap_dung_text.split(',').map((item) => item.trim()).filter(Boolean),
    cau_truc: form.cau_truc_text.split('\n').map((line, index) => {
      const [tieu_de, kieu] = line.split('|').map((item) => item.trim());
      return { thu_tu: index + 1, tieu_de: tieu_de || `Phần ${index + 1}`, kieu: kieu || 'section' };
    }).filter((section) => section.tieu_de),
    truong_du_lieu_dong: form.truong_du_lieu_dong_text.split(',').map((item) => item.trim()).filter(Boolean),
    ho_tro_word: form.ho_tro_word,
    ho_tro_pdf: form.ho_tro_pdf,
    ho_tro_excel: form.ho_tro_excel,
    la_mac_dinh: form.la_mac_dinh,
    trang_thai: form.trang_thai,
  });

  const handleSave = async () => {
    if (!user) return;
    const nextTemplate = parseForm();
    if (!nextTemplate.ma_mau || !nextTemplate.ten_mau) {
      setMessage('Vui lòng nhập mã mẫu và tên mẫu báo cáo.');
      return;
    }
    if (!nextTemplate.loai_bao_cao) {
      setMessage('Vui lòng nhập loại báo cáo.');
      return;
    }
    if (!selectedTemplateId && templates.some((template) => template.ma_mau === nextTemplate.ma_mau)) {
      setMessage('Mã mẫu báo cáo đã tồn tại.');
      return;
    }
    if (nextTemplate.cau_truc.length === 0) {
      setMessage('Vui lòng nhập ít nhất một phần trong cấu trúc báo cáo.');
      return;
    }

    try {
      await saveReportTemplate(nextTemplate, user);
      if (nextTemplate.la_mac_dinh) {
        await setDefaultReportTemplate(nextTemplate, user);
      }
      setMessage('Đã lưu mẫu báo cáo.');
      setSelectedTemplateId(nextTemplate.ma_mau);
      loadTemplates();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu mẫu báo cáo.');
    }
  };

  const handleDeactivate = async (template: ReportTemplate) => {
    if (!user) return;
    if (!window.confirm('Ngừng sử dụng mẫu báo cáo này?')) return;
    await deactivateReportTemplate(template.ma_mau, user);
    setMessage('Đã ngừng sử dụng mẫu báo cáo.');
    loadTemplates();
  };

  const handleDelete = async (template: ReportTemplate) => {
    if (!user) return;
    if (!window.confirm('Xóa mẫu báo cáo này khỏi danh sách?')) return;
    await deleteReportTemplate(template.ma_mau, user);
    setMessage('Đã xóa mẫu báo cáo.');
    loadTemplates();
  };

  const handleSetDefault = async (template: ReportTemplate) => {
    if (!user) return;
    await setDefaultReportTemplate(template, user);
    setMessage('Đã đặt mẫu mặc định.');
    loadTemplates();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-gray-900 mb-1">Cấu hình mẫu báo cáo</h3>
          <p className="text-sm text-gray-500">Quản lý mẫu dùng trong module Tạo báo cáo.</p>
        </div>
        <button onClick={startCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          <Plus className="w-4 h-4" />
          Thêm mẫu
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mã hoặc tên mẫu báo cáo..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Mẫu báo cáo</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Loại</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Định dạng</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600">Trạng thái</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => (
                  <tr key={template.ma_mau} className={`border-b border-gray-100 hover:bg-blue-50 ${selectedTemplateId === template.ma_mau ? 'bg-blue-50' : ''}`}>
                    <td className="py-3 px-4">
                      <button onClick={() => startEdit(template)} className="text-left">
                        <p className="text-sm text-gray-900 font-medium">{template.ten_mau}</p>
                        <p className="text-xs text-gray-500">{template.ma_mau}</p>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">{template.loai_bao_cao}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {template.ho_tro_word && <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">Word</span>}
                        {template.ho_tro_pdf && <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs">PDF</span>}
                        {template.ho_tro_excel && <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs">Excel</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${template.trang_thai === 'dang_su_dung' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {template.trang_thai === 'dang_su_dung' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                      </span>
                      {template.la_mac_dinh && <span className="ml-2 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">Mặc định</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => startEdit(template)} className="p-1.5 hover:bg-green-50 rounded" title="Sửa">
                          <Edit className="w-4 h-4 text-green-600" />
                        </button>
                        <button onClick={() => duplicateTemplate(template)} className="p-1.5 hover:bg-purple-50 rounded" title="Nhân bản">
                          <Copy className="w-4 h-4 text-purple-600" />
                        </button>
                        <button onClick={() => handleSetDefault(template)} className="p-1.5 hover:bg-amber-50 rounded" title="Đặt mặc định">
                          <Star className="w-4 h-4 text-amber-600" />
                        </button>
                        <button onClick={() => handleDeactivate(template)} className="p-1.5 hover:bg-gray-50 rounded" title="Ngừng sử dụng">
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(template)} className="p-1.5 hover:bg-red-50 rounded" title="Xóa">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredTemplates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-gray-500">Chưa có mẫu báo cáo</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Thông tin mẫu</h4>
            {selectedTemplate && <p className="text-xs text-gray-500 mt-1">Đang sửa: {selectedTemplate.ten_mau}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <label className="text-xs text-gray-600">
              Mã mẫu
              <input value={form.ma_mau} onChange={(event) => setForm({ ...form, ma_mau: event.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </label>
            <label className="text-xs text-gray-600">
              Tên mẫu
              <input value={form.ten_mau} onChange={(event) => setForm({ ...form, ten_mau: event.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </label>
            <label className="text-xs text-gray-600">
              Loại báo cáo
              <input value={form.loai_bao_cao} onChange={(event) => setForm({ ...form, loai_bao_cao: event.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </label>
            <label className="text-xs text-gray-600">
              Mô tả
              <textarea value={form.mo_ta} onChange={(event) => setForm({ ...form, mo_ta: event.target.value })} rows={2} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </label>
            <label className="text-xs text-gray-600">
              Đơn vị áp dụng
              <input value={form.don_vi_ap_dung_text} onChange={(event) => setForm({ ...form, don_vi_ap_dung_text: event.target.value })} placeholder="ma_don_vi_1, ma_don_vi_2" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </label>
            <label className="text-xs text-gray-600">
              Cấu trúc báo cáo
              <textarea value={form.cau_truc_text} onChange={(event) => setForm({ ...form, cau_truc_text: event.target.value })} rows={5} placeholder="Tiêu đề phần|section" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
            </label>
            <label className="text-xs text-gray-600">
              Trường dữ liệu động
              <input value={form.truong_du_lieu_dong_text} onChange={(event) => setForm({ ...form, truong_du_lieu_dong_text: event.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </label>
            <label className="text-xs text-gray-600">
              Trạng thái
              <select value={form.trang_thai} onChange={(event) => setForm({ ...form, trang_thai: event.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="dang_su_dung">Đang sử dụng</option>
                <option value="ngung_su_dung">Ngừng sử dụng</option>
              </select>
            </label>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.ho_tro_word} onChange={(event) => setForm({ ...form, ho_tro_word: event.target.checked })} /> Hỗ trợ Word</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.ho_tro_pdf} onChange={(event) => setForm({ ...form, ho_tro_pdf: event.target.checked })} /> Hỗ trợ PDF</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.ho_tro_excel} onChange={(event) => setForm({ ...form, ho_tro_excel: event.target.checked })} /> Hỗ trợ Excel</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.la_mac_dinh} onChange={(event) => setForm({ ...form, la_mac_dinh: event.target.checked })} /> Đặt làm mặc định</label>
          </div>

          <button onClick={handleSave} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <Save className="w-4 h-4" />
            Lưu mẫu báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
