import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getActivityStatusSettings, updateActivityStatusSettings, type ActivityStatusSetting } from '@/services/settingService';

export function StatusConfigTab() {
  const [statuses, setStatuses] = useState<ActivityStatusSetting[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getActivityStatusSettings()
      .then(setStatuses)
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải cấu hình trạng thái.'));
  }, []);

  function updateStatus(maTrangThai: string, field: keyof ActivityStatusSetting, value: string | number) {
    if (field === 'ma_trang_thai' || field === 'khoa_hien_thi') return;
    setStatuses((current) => current.map((status) => (
      status.ma_trang_thai === maTrangThai ? { ...status, [field]: value } : status
    )));
  }

  async function handleSave() {
    const invalidStatus = statuses.find((status) => !status.ten_hien_thi.trim() || !status.mau_hien_thi.trim());
    if (invalidStatus) {
      setMessage('Vui lòng nhập đầy đủ tên hiển thị và màu cho trạng thái.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await updateActivityStatusSettings(statuses);
      setMessage('Đã lưu cấu hình trạng thái.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu cấu hình trạng thái.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-900 mb-1">Cấu hình trạng thái duyệt</h3>
        <p className="text-sm text-gray-500">Quản lý tên hiển thị, màu sắc và thứ tự trạng thái; mã trạng thái không thay đổi.</p>
      </div>

      {message && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          {statuses.map((status) => (
            <div
              key={status.ma_trang_thai}
              className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg md:grid-cols-[1fr_160px_120px_160px]"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: status.mau_hien_thi }}
                />
                <div>
                  <label className="text-xs text-gray-500">Tên hiển thị</label>
                  <input
                    value={status.ten_hien_thi}
                    onChange={(event) => updateStatus(status.ma_trang_thai, 'ten_hien_thi', event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Mã: {status.ma_trang_thai}</p>
                </div>
              </div>

              <label className="text-xs text-gray-500">
                Màu
                <input
                  type="color"
                  value={status.mau_hien_thi}
                  onChange={(event) => updateStatus(status.ma_trang_thai, 'mau_hien_thi', event.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-2"
                />
              </label>

              <label className="text-xs text-gray-500">
                Thứ tự
                <input
                  type="number"
                  value={status.thu_tu}
                  onChange={(event) => updateStatus(status.ma_trang_thai, 'thu_tu', Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="text-xs text-gray-500">
                Trạng thái
                <select
                  value={status.trang_thai}
                  onChange={(event) => updateStatus(status.ma_trang_thai, 'trang_thai', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dang_su_dung">Đang sử dụng</option>
                  <option value="ngung_su_dung">Ngừng sử dụng</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving || statuses.length === 0} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60">
          <Save className="w-5 h-5" />
          <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
        </button>
      </div>
    </div>
  );
}
