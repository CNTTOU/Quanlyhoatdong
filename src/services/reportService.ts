import type { CurrentUserProfile, DonVi, HoatDong, MinhChung } from '@/types/firebase';
import { Timestamp } from 'firebase/firestore';
import { getAccessibleUnits, getScopedActivities, getScopedEvidences } from './unitAccessService';

export type ReportFilterState = {
  ma_nam_hoc: string;
  hoc_ky: string;
  thang: string;
  ma_don_vi: string;
  ma_loai: string;
};

export type ReportData = Awaited<ReturnType<typeof getReportData>>;

function toDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string' && value) return new Date(value);
  return null;
}

function getSemester(date: Date | null) {
  if (!date) return '';
  const month = date.getMonth() + 1;
  if (month >= 9 || month <= 1) return '1';
  if (month >= 2 && month <= 6) return '2';
  return '3';
}

function matchesFilters(activity: HoatDong, filters: ReportFilterState) {
  const date = toDate(activity.thoi_gian_bat_dau ?? activity.ngay_tao);
  if (filters.ma_nam_hoc && activity.ma_nam_hoc !== filters.ma_nam_hoc) return false;
  if (filters.ma_don_vi && activity.ma_don_vi !== filters.ma_don_vi) return false;
  if (filters.ma_loai && activity.ma_loai !== filters.ma_loai) return false;
  if (filters.thang && String(date ? date.getMonth() + 1 : '') !== filters.thang) return false;
  if (filters.hoc_ky && getSemester(date) !== filters.hoc_ky) return false;
  return true;
}

function matchesPreviousPeriod(activity: HoatDong, filters: ReportFilterState) {
  const date = toDate(activity.thoi_gian_bat_dau ?? activity.ngay_tao);
  if (!date) return false;
  if (filters.ma_don_vi && activity.ma_don_vi !== filters.ma_don_vi) return false;
  if (filters.ma_loai && activity.ma_loai !== filters.ma_loai) return false;

  if (filters.thang) {
    const month = Number(filters.thang);
    const previousMonth = month === 1 ? 12 : month - 1;
    return String(date.getMonth() + 1) === String(previousMonth);
  }

  if (filters.hoc_ky) {
    const semester = Number(filters.hoc_ky);
    const previousSemester = semester === 1 ? 3 : semester - 1;
    return getSemester(date) === String(previousSemester);
  }

  const selectedYear = filters.ma_nam_hoc.match(/\d{4}/)?.[0];
  if (selectedYear) {
    const previousYear = String(Number(selectedYear) - 1);
    return activity.ma_nam_hoc?.includes(previousYear) || activity.ten_nam_hoc?.includes(previousYear);
  }

  const currentYear = new Date().getFullYear();
  return date.getFullYear() === currentYear - 1;
}

function createMonthlyRows(activities: HoatDong[]) {
  const rows = Array.from({ length: 12 }, (_, index) => ({
    id: String(index + 1),
    month: `T${index + 1}`,
    activities: 0,
    participants: 0,
  }));

  activities.forEach((activity) => {
    const date = toDate(activity.thoi_gian_bat_dau ?? activity.ngay_tao);
    if (!date) return;
    const row = rows[date.getMonth()];
    row.activities += 1;
    row.participants += Number(activity.so_luong_tham_gia ?? 0);
  });

  return rows;
}

function createCategoryRows(activities: HoatDong[]) {
  const colors = ['#0ea5e9', '#22c55e', '#f97316', '#8b5cf6', '#ef4444', '#14b8a6'];
  return Object.values(
    activities.reduce<Record<string, { id: string; name: string; value: number; color: string }>>((result, activity) => {
      const key = activity.ma_loai || 'khac';
      result[key] ??= {
        id: key,
        name: activity.ten_loai || key,
        value: 0,
        color: colors[Object.keys(result).length % colors.length],
      };
      result[key].value += 1;
      return result;
    }, {}),
  );
}

function createUnitRanking(activities: HoatDong[], previousActivities: HoatDong[], units: DonVi[]) {
  return units
    .map((unit) => {
      const unitActivities = activities.filter((activity) => activity.ma_don_vi === unit.ma_don_vi);
      const previousUnitActivities = previousActivities.filter((activity) => activity.ma_don_vi === unit.ma_don_vi);
      const previousCount = previousUnitActivities.length;
      const change = previousCount === 0
        ? unitActivities.length > 0 ? 100 : 0
        : Math.round(((unitActivities.length - previousCount) / previousCount) * 100);
      return {
        rank: 0,
        name: unit.ten_don_vi || unit.ma_don_vi,
        activities: unitActivities.length,
        participants: unitActivities.reduce((sum, activity) => sum + Number(activity.so_luong_tham_gia ?? 0), 0),
        change,
      };
    })
    .filter((unit) => unit.activities > 0)
    .sort((a, b) => b.activities - a.activities)
    .slice(0, 5)
    .map((unit, index) => ({ ...unit, rank: index + 1 }));
}

export async function getReportData(user: CurrentUserProfile, filters: ReportFilterState) {
  const [activities, evidences, units] = await Promise.all([
    getScopedActivities(user),
    getScopedEvidences(user),
    getAccessibleUnits(user),
  ]);
  const filteredActivities = activities.filter((activity) => matchesFilters(activity, filters));
  const previousActivities = activities.filter((activity) => matchesPreviousPeriod(activity, filters));
  const filteredActivityIds = new Set(filteredActivities.map((activity) => activity.ma_hoat_dong));
  const filteredEvidences = evidences.filter((evidence) => filteredActivityIds.has(String(evidence.ma_hoat_dong)));
  const monthlyRows = createMonthlyRows(filteredActivities);

  return {
    stats: {
      totalActivities: filteredActivities.length,
      participants: filteredActivities.reduce((sum, activity) => sum + Number(activity.so_luong_tham_gia ?? 0), 0),
      evidenceComplete: filteredActivities.filter((activity) => Number(activity.so_luong_minh_chung ?? 0) > 0 || filteredEvidences.some((evidence) => evidence.ma_hoat_dong === activity.ma_hoat_dong)).length,
      facultyActivities: filteredActivities.filter((activity) => String(activity.cap_to_chuc ?? '').includes('khoa')).length,
      branchActivities: filteredActivities.filter((activity) => String(activity.cap_to_chuc ?? '').includes('chi')).length,
    },
    monthlyActivities: monthlyRows.map((row) => ({ id: row.id, month: row.month, activities: row.activities })),
    participantTrend: monthlyRows.map((row) => ({ id: row.id, month: row.month, participants: row.participants })),
    categoryStats: createCategoryRows(filteredActivities),
    unitRanking: createUnitRanking(filteredActivities, previousActivities, units),
  };
}
