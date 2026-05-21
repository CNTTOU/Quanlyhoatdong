import { collection, getDocs, query, where, type QueryConstraint } from 'firebase/firestore';
import { db, identityDb } from '@/lib/firebase';
import type { CurrentUserProfile, DonVi, HoatDong, MinhChung } from '@/types/firebase';
import { isSystemAdmin } from './permissionService';
import { getCached } from './cache';

export async function getAllUnits() {
  return getCached('units:all', 5 * 60 * 1000, async () => {
    const unitsSnap = await getDocs(collection(identityDb, 'don_vi'));
    return unitsSnap.docs.map((item) => ({ ...(item.data() as DonVi), ma_don_vi: item.id }));
  });
}

export function getDescendantUnitIds(units: DonVi[], rootUnitId: string) {
  if (!rootUnitId) return [];
  const childrenByParent = units.reduce<Record<string, DonVi[]>>((result, unit) => {
    const parentId = String(unit.ma_don_vi_cha || '');
    result[parentId] ??= [];
    result[parentId].push(unit);
    return result;
  }, {});

  const result = new Set<string>([rootUnitId]);
  const queue = [rootUnitId];
  while (queue.length) {
    const parentId = queue.shift() ?? '';
    (childrenByParent[parentId] ?? []).forEach((child) => {
      if (result.has(child.ma_don_vi)) return;
      result.add(child.ma_don_vi);
      queue.push(child.ma_don_vi);
    });
  }
  return Array.from(result);
}

export function getAncestorUnitIds(units: DonVi[], unitId: string) {
  const byId = new Map(units.map((unit) => [unit.ma_don_vi, unit]));
  const result: string[] = [];
  const seen = new Set<string>();
  let currentId = unitId;

  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    result.push(currentId);
    currentId = String(byId.get(currentId)?.ma_don_vi_cha || '');
  }

  return result;
}

export async function getAccessibleUnits(user: CurrentUserProfile) {
  const units = await getAllUnits();
  if (isSystemAdmin(user)) return units;
  const accessibleIds = new Set(getDescendantUnitIds(units, user.ma_don_vi));
  return units.filter((unit) => accessibleIds.has(unit.ma_don_vi));
}

export async function getActivityUnitPathIds(unitId: string) {
  const units = await getAllUnits();
  return getAncestorUnitIds(units, unitId);
}

export async function canAccessUnit(user: CurrentUserProfile | null | undefined, unitId: string) {
  if (!user) return false;
  if (isSystemAdmin(user)) return true;
  const units = await getAllUnits();
  return getDescendantUnitIds(units, user.ma_don_vi).includes(unitId);
}

export function hasUnitInPath(item: { ma_don_vi?: string; don_vi_path_ids?: unknown }, unitId: string) {
  if (!unitId) return false;
  const pathIds = Array.isArray(item.don_vi_path_ids) ? item.don_vi_path_ids.map(String) : [];
  return item.ma_don_vi === unitId || pathIds.includes(unitId);
}

async function getScopedCollectionRows<T extends { ma_don_vi?: string; don_vi_path_ids?: unknown }>(
  collectionName: string,
  user: CurrentUserProfile,
  extraFilters: QueryConstraint[] = [],
) {
  if (isSystemAdmin(user)) {
    const snap = await getDocs(query(collection(db, collectionName), ...extraFilters));
    return snap.docs.map((item) => ({ id: item.id, ...(item.data() as T) }));
  }

  const [pathSnap, ownSnap] = await Promise.all([
    getDocs(query(collection(db, collectionName), where('don_vi_path_ids', 'array-contains', user.ma_don_vi), ...extraFilters)),
    getDocs(query(collection(db, collectionName), where('ma_don_vi', '==', user.ma_don_vi), ...extraFilters)),
  ]);

  const rows = new Map<string, { id: string } & T>();
  [...pathSnap.docs, ...ownSnap.docs].forEach((item) => rows.set(item.id, { id: item.id, ...(item.data() as T) }));
  return Array.from(rows.values());
}

export async function getScopedActivities(user: CurrentUserProfile, extraFilters: QueryConstraint[] = []) {
  const rows = await getScopedCollectionRows<HoatDong>('hoat_dong', user, extraFilters);
  return rows.map(({ id, ...activity }) => ({ ma_hoat_dong: id, ...activity }));
}

export async function getScopedEvidences(user: CurrentUserProfile, extraFilters: QueryConstraint[] = []) {
  const rows = await getScopedCollectionRows<MinhChung>('minh_chung', user, extraFilters);
  return rows.map(({ id, ...evidence }) => ({ ma_minh_chung: id, ...evidence }));
}
