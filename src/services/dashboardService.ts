import { Timestamp } from 'firebase/firestore';
import type { CurrentUserProfile, HoatDong, MinhChung } from '@/types/firebase';
import { getActivityStatusSettings } from './settingService';
import { getScopedActivities, getScopedEvidences } from './unitAccessService';

function belongsToYear(activity: HoatDong, year: number) {
  const yearText = String(year);
  return activity.ma_nam_hoc?.includes(yearText) || activity.ten_nam_hoc?.includes(yearText);
}

function toDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string' && value) return new Date(value);
  return new Date(0);
}

function toStatus(status: string, statusLabels: Record<string, string>) {
  if (status === 'da_duyet') return { status: 'approved', statusText: statusLabels.da_duyet ?? 'Đã duyệt' };
  if (status === 'cho_duyet') return { status: 'pending', statusText: statusLabels.cho_duyet ?? 'Chờ duyệt' };
  if (status === 'can_bo_sung') return { status: 'need-update', statusText: statusLabels.can_bo_sung ?? 'Cần bổ sung' };
  if (status === 'tu_choi') return { status: 'rejected', statusText: statusLabels.tu_choi ?? 'Từ chối' };
  return { status: 'draft', statusText: 'Nháp' };
}

export async function getDashboardData(user: CurrentUserProfile, year: number) {
  const [activities, evidences, statuses] = await Promise.all([getScopedActivities(user), getScopedEvidences(user), getActivityStatusSettings()]);
  const statusLabels = Object.fromEntries(statuses.map((status) => [status.ma_trang_thai, status.ten_hien_thi]));
  const yearActivities = activities.filter((activity) => belongsToYear(activity, year));
  const now = new Date();
  const monthlyActivities = yearActivities.filter((activity) => {
    const date = toDate(activity.ngay_tao ?? activity.thoi_gian_bat_dau);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const monthlyMap = Array.from({ length: 12 }, (_, index) => ({
    id: String(index + 1),
    month: `T${index + 1}`,
    activities: 0,
  }));
  yearActivities.forEach((activity) => {
    const date = toDate(activity.thoi_gian_bat_dau ?? activity.ngay_tao);
    if (date.getFullYear() === year || activity.ten_nam_hoc?.includes(String(year))) {
      monthlyMap[Math.max(0, date.getMonth())].activities += 1;
    }
  });

  const categoryStats = Object.values(
    yearActivities.reduce<Record<string, { id: string; name: string; value: number; color: string }>>((result, activity) => {
      const key = activity.ma_loai || 'khac';
      result[key] ??= { id: key, name: activity.ten_loai || key, value: 0, color: '#0ea5e9' };
      result[key].value += 1;
      return result;
    }, {}),
  );

  const recentActivities = [...yearActivities]
    .sort((a, b) => toDate(b.ngay_cap_nhat ?? b.ngay_tao).getTime() - toDate(a.ngay_cap_nhat ?? a.ngay_tao).getTime())
    .slice(0, 6)
    .map((activity) => ({
      id: activity.ma_hoat_dong,
      name: activity.ten_hoat_dong,
      unit: activity.ten_don_vi,
      time: toDate(activity.ngay_cap_nhat ?? activity.ngay_tao).toLocaleDateString('vi-VN'),
      ...toStatus(activity.trang_thai, statusLabels),
    }));

  return {
    stats: {
      totalActivities: yearActivities.length,
      monthlyActivities: monthlyActivities.length,
      participants: yearActivities.reduce((sum, activity) => sum + Number(activity.so_luong_tham_gia ?? 0), 0),
      evidence: evidences.filter((evidence) => evidence.ma_nam_hoc?.includes(String(year))).length,
      pending: yearActivities.filter((activity) => activity.trang_thai === 'cho_duyet').length,
      monthlyChange: '0%',
    },
    monthlyActivities: monthlyMap,
    categoryStats,
    recentActivities,
  };
}
