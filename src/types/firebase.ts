import type { Timestamp } from 'firebase/firestore';

export type TrangThaiNguoiDung =
  | 'dang_hoat_dong'
  | 'tam_khoa'
  | 'cho_doi_mat_khau'
  | 'ngung_su_dung';

export type MaVaiTro =
  | 'super_admin'
  | 'admin_doan_hoi'
  | 'ban_chap_hanh'
  | 'can_bo_chi_doan_chi_hoi'
  | 'cong_tac_vien'
  | 'nguoi_xem';

export interface NguoiDung {
  uid: string;
  ho_ten: string;
  email: string;
  ten_dang_nhap: string;
  ma_don_vi: string;
  ten_don_vi: string;
  ma_vai_tro: MaVaiTro | string;
  ten_vai_tro: string;
  trang_thai: TrangThaiNguoiDung;
  bat_buoc_doi_mat_khau: boolean;
  lan_dang_nhap_cuoi?: Timestamp | null;
  ngay_tao?: Timestamp;
  nguoi_tao?: string;
  ngay_cap_nhat?: Timestamp;
}

export interface CurrentUserProfile extends NguoiDung {
  danh_sach_quyen: string[];
}

export interface VaiTro {
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta: string;
  cap_do: number;
  la_mac_dinh: boolean;
  trang_thai: string;
  danh_sach_quyen: string[];
}

export interface DonVi {
  ma_don_vi: string;
  ten_don_vi: string;
  loai_don_vi: string;
  ma_don_vi_cha: string;
  ten_don_vi_cha: string;
  nguoi_phu_trach: string;
  email_lien_he: string;
  so_dien_thoai: string;
  trang_thai: string;
}

export interface CreateInternalUserInput {
  ho_ten: string;
  email: string;
  mat_khau_tam_thoi: string;
  ma_don_vi: string;
  ma_vai_tro: string;
  trang_thai?: TrangThaiNguoiDung;
  bat_buoc_doi_mat_khau?: boolean;
}

export interface HoatDong {
  ma_hoat_dong: string;
  ten_hoat_dong: string;
  ma_nam_hoc: string;
  ten_nam_hoc: string;
  ma_loai: string;
  ten_loai: string;
  ma_don_vi: string;
  ten_don_vi: string;
  trang_thai: string;
  nguoi_tao: string;
  ten_nguoi_tao: string;
  [key: string]: unknown;
}

export interface MinhChung {
  ma_minh_chung: string;
  ma_hoat_dong: string;
  ten_hoat_dong: string;
  ten_minh_chung: string;
  loai_minh_chung: string;
  nguon_luu_tru: string;
  duong_dan_file: string;
  ma_nam_hoc: string;
  ma_don_vi: string;
  [key: string]: unknown;
}
