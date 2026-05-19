import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function getPublicInterfaceData<T>(documentId: string, fallback: T): Promise<T> {
  const snap = await getDoc(doc(db, 'du_lieu_cong_khai', documentId));
  return snap.exists() ? ({ ...fallback, ...snap.data() } as T) : fallback;
}

export async function getInterfaceList<T>(documentId: string): Promise<T[]> {
  const snap = await getDoc(doc(db, 'du_lieu_hien_thi', documentId));
  if (!snap.exists()) {
    return [];
  }

  const data = snap.data();
  return Array.isArray(data.items) ? (data.items as T[]) : [];
}

export async function getInterfaceDocument<T>(documentId: string, fallback: T): Promise<T> {
  const snap = await getDoc(doc(db, 'du_lieu_hien_thi', documentId));
  return snap.exists() ? ({ ...fallback, ...snap.data() } as T) : fallback;
}
