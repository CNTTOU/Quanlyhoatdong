import { ArrowDown, ArrowUp, Save, Star, StarOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { updateActivityFeatured } from '@/services/activityService';
import {
  defaultFeaturedActivitySettings,
  getFeaturedActivitySettings,
  updateFeaturedActivitySettings,
  type FeaturedActivitySettings,
} from '@/services/settingService';

type FeaturedActivityOption = {
  id: string;
  title: string;
  unit: string;
  category: string;
  isFeatured: boolean;
};

function moveItem(items: string[], index: number, direction: -1 | 1) {
  const next = [...items];
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= next.length) return next;
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

export function FeaturedActivitiesSettingsTab() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<FeaturedActivitySettings>(defaultFeaturedActivitySettings);
  const [activities, setActivities] = useState<FeaturedActivityOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadData() {
    const [loadedSettings, activitySnap] = await Promise.all([
      getFeaturedActivitySettings(),
      getDocs(query(collection(db, 'hoat_dong'), where('trang_thai', '==', 'da_duyet'))),
    ]);

    const loadedActivities = activitySnap.docs
      .map((item) => {
        const data = item.data();
        return {
          id: item.id,
          title: String(data.ten_hoat_dong ?? ''),
          unit: String(data.ten_don_vi ?? ''),
          category: String(data.ten_loai ?? ''),
          isFeatured: Boolean(data.hien_thi_noi_bat),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title, 'vi'));

    const featuredIds = loadedActivities.filter((activity) => activity.isFeatured).map((activity) => activity.id);
    const orderedIds = [...loadedSettings.danh_sach_hoat_dong_tieu_bieu, ...featuredIds].filter((id, index, list) => list.indexOf(id) === index);

    setSettings({
      ...loadedSettings,
      danh_sach_hoat_dong_tieu_bieu: orderedIds.filter((id) => loadedActivities.some((activity) => activity.id === id)),
    });
    setActivities(loadedActivities);
  }

  useEffect(() => {
    loadData().catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải cấu hình hoạt động nổi bật.'));
  }, []);

  const featuredActivities = useMemo(() => activities.filter((activity) => activity.isFeatured), [activities]);
  const orderedOtherActivities = useMemo(() => {
    const featuredMap = new Map(featuredActivities.map((activity) => [activity.id, activity]));
    return settings.danh_sach_hoat_dong_tieu_bieu
      .map((id) => featuredMap.get(id))
      .filter((activity): activity is FeaturedActivityOption => Boolean(activity) && activity.id !== settings.ma_hoat_dong_noi_bat_nhat);
  }, [featuredActivities, settings.danh_sach_hoat_dong_tieu_bieu, settings.ma_hoat_dong_noi_bat_nhat]);

  function updateField(field: keyof FeaturedActivitySettings, value: string | number | boolean | string[]) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  async function toggleFeatured(activity: FeaturedActivityOption) {
    if (!user) return;
    const nextFeatured = !activity.isFeatured;
    setMessage('');
    try {
      await updateActivityFeatured(activity.id, nextFeatured, user);
      setActivities((current) => current.map((item) => (item.id === activity.id ? { ...item, isFeatured: nextFeatured } : item)));
      setSettings((current) => ({
        ...current,
        ma_hoat_dong_noi_bat_nhat: nextFeatured || current.ma_hoat_dong_noi_bat_nhat !== activity.id ? current.ma_hoat_dong_noi_bat_nhat : '',
        danh_sach_hoat_dong_tieu_bieu: nextFeatured
          ? [...current.danh_sach_hoat_dong_tieu_bieu, activity.id].filter((id, index, list) => list.indexOf(id) === index)
          : current.danh_sach_hoat_dong_tieu_bieu.filter((id) => id !== activity.id),
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái nổi bật.');
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await updateFeaturedActivitySettings(settings);
      setMessage('Đã lưu cấu hình hoạt động nổi bật.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu cấu hình hoạt động nổi bật.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-900 mb-1">Thiết lập hoạt động nổi bật</h3>
        <p className="text-sm text-gray-500">Chọn hoạt động nổi bật nhất và sắp xếp các hoạt động tiêu biểu khác</p>
      </div>

      {message && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-gray-900">Nội dung hiển thị chung</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-gray-700">Tiêu đề trang</span>
                <input value={settings.tieu_de} onChange={(event) => updateField('tieu_de', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-gray-700">Mô tả</span>
                <textarea value={settings.mo_ta} onChange={(event) => updateField('mo_ta', event.target.value)} rows={3} className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Tiêu đề thống kê</span>
                <input value={settings.tieu_de_thong_ke} onChange={(event) => updateField('tieu_de_thong_ke', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-gray-700">Số hoạt động tiêu biểu</span>
                <input type="number" min={0} value={settings.so_luong_tieu_bieu} onChange={(event) => updateField('so_luong_tieu_bieu', Number(event.target.value))} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="text-sm text-gray-900">Hiển thị bộ lọc</span>
                <input type="checkbox" checked={settings.hien_thi_bo_loc} onChange={(event) => updateField('hien_thi_bo_loc', event.target.checked)} className="h-4 w-4 accent-blue-600" />
              </label>
              <label className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="text-sm text-gray-900">Hiển thị khối thống kê</span>
                <input type="checkbox" checked={settings.hien_thi_thong_ke} onChange={(event) => updateField('hien_thi_thong_ke', event.target.checked)} className="h-4 w-4 accent-blue-600" />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-gray-900">Danh sách hoạt động được phép hiển thị</h4>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-gray-900">{activity.title}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{activity.category} · {activity.unit}</p>
                  </div>
                  <button onClick={() => toggleFeatured(activity)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${activity.isFeatured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'}`}>
                    {activity.isFeatured ? <Star className="h-4 w-4 fill-yellow-400" /> : <StarOff className="h-4 w-4" />}
                    <span>{activity.isFeatured ? 'Đang hiển thị' : 'Hiển thị'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-gray-900">Hoạt động nổi bật nhất</h4>
            <select value={settings.ma_hoat_dong_noi_bat_nhat} onChange={(event) => updateField('ma_hoat_dong_noi_bat_nhat', event.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tự động chọn hoạt động đầu tiên</option>
              {featuredActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>{activity.title}</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-gray-900">Thứ tự hoạt động tiêu biểu khác</h4>
            <div className="space-y-3">
              {orderedOtherActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => updateField('danh_sach_hoat_dong_tieu_bieu', moveItem(settings.danh_sach_hoat_dong_tieu_bieu, settings.danh_sach_hoat_dong_tieu_bieu.indexOf(activity.id), -1))} className="rounded bg-white p-1 text-gray-500 ring-1 ring-gray-200 hover:text-blue-600">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => updateField('danh_sach_hoat_dong_tieu_bieu', moveItem(settings.danh_sach_hoat_dong_tieu_bieu, settings.danh_sach_hoat_dong_tieu_bieu.indexOf(activity.id), 1))} className="rounded bg-white p-1 text-gray-500 ring-1 ring-gray-200 hover:text-blue-600">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-gray-900">{activity.title}</p>
                    <p className="truncate text-xs text-gray-500">{activity.unit}</p>
                  </div>
                </div>
              ))}
              {orderedOtherActivities.length === 0 && <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">Chưa có hoạt động tiêu biểu nào được bật hiển thị.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-cyan-700 disabled:opacity-60">
          <Save className="h-5 w-5" />
          <span>{saving ? 'Đang lưu...' : 'Lưu thiết lập'}</span>
        </button>
      </div>
    </div>
  );
}
