import { FormEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getActivityTypesWithCounts, lockActivityType, saveActivityType } from '@/services/activityTypeService';
import type { LoaiHoatDong } from '@/types/firebase';
import { useAuth } from '@/contexts/AuthContext';

type ActivityTypeRow = {
  id: string;
  name: string;
  color: string;
  count: number;
  raw: LoaiHoatDong;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string) {
  const hex = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toUpperCase();
  return '#2563EB';
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex).slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function hexToHsv(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let h = 0;

  if (delta) {
    if (max === red) h = ((green - blue) / delta) % 6;
    else if (max === green) h = (blue - red) / delta + 2;
    else h = (red - green) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h,
    s: max === 0 ? 0 : delta / max,
    v: max,
  };
}

function hsvToHex(h: number, s: number, v: number) {
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) [red, green, blue] = [chroma, x, 0];
  else if (h < 120) [red, green, blue] = [x, chroma, 0];
  else if (h < 180) [red, green, blue] = [0, chroma, x];
  else if (h < 240) [red, green, blue] = [0, x, chroma];
  else if (h < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return rgbToHex((red + m) * 255, (green + m) * 255, (blue + m) * 255);
}

function ColorPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const hsv = hexToHsv(value);
  const hueColor = hsvToHex(hsv.h, 1, 1);

  function updateSaturation(event: PointerEvent<HTMLDivElement>) {
    const rect = saturationRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = clamp((event.clientX - rect.left) / rect.width);
    const v = clamp(1 - (event.clientY - rect.top) / rect.height);
    onChange(hsvToHex(hsv.h, s, v));
  }

  function updateHue(event: PointerEvent<HTMLDivElement>) {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = clamp((event.clientY - rect.top) / rect.height) * 360;
    onChange(hsvToHex(h, hsv.s, hsv.v));
  }

  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-gray-700 p-3">
      <div
        ref={saturationRef}
        role="slider"
        aria-label="Chọn sắc độ màu"
        tabIndex={0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateSaturation(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons) updateSaturation(event);
        }}
        className="relative h-48 flex-1 cursor-crosshair overflow-hidden rounded-sm"
        style={{
          backgroundColor: hueColor,
          backgroundImage: 'linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)',
        }}
      >
        <div
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.7)]"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
        />
      </div>
      <div
        ref={hueRef}
        role="slider"
        aria-label="Chọn dải màu"
        tabIndex={0}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateHue(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons) updateHue(event);
        }}
        className="relative h-48 w-5 cursor-pointer rounded-sm"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        }}
      >
        <div
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white bg-gray-700 shadow"
          style={{ top: `${(hsv.h / 360) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function ActivityTypesTab() {
  const { user } = useAuth();
  const [activityTypes, setActivityTypes] = useState<ActivityTypeRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<LoaiHoatDong | null>(null);
  const [form, setForm] = useState({ ma_loai: '', ten_loai: '', mo_ta: '', mau_hien_thi: '#2563EB', icon: '', trang_thai: 'dang_su_dung', thu_tu: 1 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadActivityTypes() {
    const items = await getActivityTypesWithCounts();
    setActivityTypes(items.map((item) => ({
      id: item.ma_loai,
      name: item.ten_loai,
      color: item.mau_hien_thi || '#2563EB',
      count: item.count,
      raw: item,
    })));
  }

  useEffect(() => {
    loadActivityTypes().catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải loại hoạt động.'));
  }, []);

  function openCreateModal() {
    setEditingType(null);
    setForm({ ma_loai: '', ten_loai: '', mo_ta: '', mau_hien_thi: '#2563EB', icon: '', trang_thai: 'dang_su_dung', thu_tu: activityTypes.length + 1 });
    setIsModalOpen(true);
  }

  function openEditModal(activityType: LoaiHoatDong) {
    setEditingType(activityType);
    setForm({
      ma_loai: activityType.ma_loai,
      ten_loai: activityType.ten_loai,
      mo_ta: activityType.mo_ta,
      mau_hien_thi: activityType.mau_hien_thi,
      icon: activityType.icon,
      trang_thai: activityType.trang_thai,
      thu_tu: activityType.thu_tu,
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    if (!form.ma_loai || !form.ten_loai) {
      setMessage('Vui lòng nhập mã và tên loại hoạt động.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await saveActivityType(form, Boolean(editingType), user);
      setMessage(editingType ? 'Cập nhật loại hoạt động thành công.' : 'Thêm loại hoạt động thành công.');
      setIsModalOpen(false);
      await loadActivityTypes();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu loại hoạt động.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLock(activityType: LoaiHoatDong) {
    if (!user) return;
    if (!window.confirm(`Ngừng sử dụng loại hoạt động ${activityType.ten_loai}?`)) return;
    await lockActivityType(activityType, user);
    setMessage(`Đã ngừng sử dụng loại hoạt động ${activityType.ten_loai}.`);
    await loadActivityTypes();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-900 mb-1">Quản lý loại hoạt động</h3>
          <p className="text-sm text-gray-500">Thêm, sửa hoặc xóa các loại hoạt động</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
          <Plus className="w-4 h-4" />
          <span>Thêm loại</span>
        </button>
      </div>

      {message && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-6 text-sm text-gray-600">Tên loại</th>
              <th className="text-left py-3 px-6 text-sm text-gray-600">Màu sắc</th>
              <th className="text-center py-3 px-6 text-sm text-gray-600">Số hoạt động</th>
              <th className="text-center py-3 px-6 text-sm text-gray-600">Trạng thái</th>
              <th className="text-center py-3 px-6 text-sm text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {activityTypes.map((type) => (
              <tr key={type.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-900">{type.name}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm text-gray-600">{type.color}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center text-sm text-gray-900">{type.count}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${type.raw.trang_thai === 'ngung_su_dung' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                    {type.raw.trang_thai === 'ngung_su_dung' ? 'Ngừng sử dụng' : 'Đang sử dụng'}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEditModal(type.raw)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                      <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </button>
                    <button onClick={() => handleLock(type.raw)} className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-gray-900">{editingType ? 'Sửa loại hoạt động' : 'Thêm loại hoạt động'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Mã loại</span>
                <input disabled={Boolean(editingType)} value={form.ma_loai} onChange={(event) => setForm({ ...form, ma_loai: event.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Tên loại</span>
                <input value={form.ten_loai} onChange={(event) => setForm({ ...form, ten_loai: event.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Màu sắc</span>
                <ColorPicker
                  value={form.mau_hien_thi}
                  onChange={(color) => setForm({ ...form, mau_hien_thi: color })}
                />
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border border-gray-200"
                    style={{ backgroundColor: normalizeHex(form.mau_hien_thi) }}
                  />
                  <input
                    value={form.mau_hien_thi}
                    onChange={(event) => setForm({ ...form, mau_hien_thi: event.target.value })}
                    onBlur={() => setForm((current) => ({ ...current, mau_hien_thi: normalizeHex(current.mau_hien_thi) }))}
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Thứ tự</span>
                <input type="number" value={form.thu_tu} onChange={(event) => setForm({ ...form, thu_tu: Number(event.target.value) })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Trạng thái</span>
                <select value={form.trang_thai} onChange={(event) => setForm({ ...form, trang_thai: event.target.value })} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="dang_su_dung">Đang sử dụng</option>
                  <option value="ngung_su_dung">Ngừng sử dụng</option>
                </select>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">Hủy</button>
                <button disabled={saving} type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Đang lưu...' : 'Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
