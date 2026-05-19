import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MinhChung } from '@/types/firebase';
import { addLog } from './auditLogService';

export async function addEvidence(data: Partial<MinhChung>) {
  const ref = await addDoc(collection(db, 'minh_chung'), {
    ...data,
    trang_thai: data.trang_thai ?? 'dang_hoat_dong',
    ngay_tai_len: serverTimestamp(),
  });
  await updateDoc(ref, { ma_minh_chung: ref.id });
  await addLog({ hanh_dong: 'them_minh_chung', module: 'minh_chung', ma_doi_tuong: ref.id, noi_dung: `Thêm minh chứng ${data.ten_minh_chung ?? ref.id}` });
  return ref.id;
}

export async function updateEvidence(maMinhChung: string, data: Partial<MinhChung>) {
  await updateDoc(doc(db, 'minh_chung', maMinhChung), data);
}

export async function deleteEvidence(maMinhChung: string) {
  await deleteDoc(doc(db, 'minh_chung', maMinhChung));
  await addLog({ hanh_dong: 'xoa_minh_chung', module: 'minh_chung', ma_doi_tuong: maMinhChung, noi_dung: 'Xóa minh chứng', muc_do: 'canh_bao' });
}

export async function getEvidenceByActivity(maHoatDong: string) {
  const snap = await getDocs(query(collection(db, 'minh_chung'), where('ma_hoat_dong', '==', maHoatDong)));
  return snap.docs.map((item) => ({ ma_minh_chung: item.id, ...(item.data() as MinhChung) }));
}
