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
  quyen_bo_sung?: string[];
  quyen_bi_chan?: string[];
  danh_sach_he_thong?: string[];
}

export interface CurrentUserProfile extends NguoiDung {
  danh_sach_quyen: string[];
  danh_sach_he_thong: string[];
}

export interface VaiTro {
  ma_vai_tro: string;
  ten_vai_tro: string;
  mo_ta: string;
  cap_do: number;
  la_mac_dinh: boolean;
  trang_thai: string;
  danh_sach_quyen: string[];
  danh_sach_he_thong?: string[];
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

export interface NamHoc {
  ma_nam_hoc: string;
  ten_nam_hoc: string;
  ngay_bat_dau: Timestamp;
  ngay_ket_thuc: Timestamp;
  trang_thai: string;
  la_nam_hoc_hien_tai: boolean;
  da_luu_tru: boolean;
  da_xoa_du_lieu_online: boolean;
}

export interface LoaiHoatDong {
  ma_loai: string;
  ten_loai: string;
  mo_ta: string;
  mau_hien_thi: string;
  icon: string;
  trang_thai: string;
  thu_tu: number;
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
  don_vi_path_ids?: string[];
  cap_to_chuc: string;
  thoi_gian_bat_dau: Timestamp;
  thoi_gian_ket_thuc: Timestamp;
  dia_diem: string;
  doi_tuong_tham_gia: string;
  so_luong_tham_gia: number;
  muc_tieu: string;
  noi_dung: string;
  ket_qua: string;
  link_bai_viet: string;
  link_thu_muc_minh_chung: string;
  anh_dai_dien: string;
  so_luong_minh_chung: number;
  trang_thai: string;
  hien_thi_noi_bat?: boolean;
  ly_do_yeu_cau_bo_sung?: string;
  nguoi_tao: string;
  ten_nguoi_tao: string;
  nguoi_duyet?: string;
  ten_nguoi_duyet?: string;
  ngay_tao?: Timestamp;
  ngay_cap_nhat?: Timestamp;
  ngay_gui_duyet?: Timestamp;
  ngay_duyet?: Timestamp;
  da_luu_tru: boolean;
  tu_khoa_tim_kiem?: string[];
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
  don_vi_path_ids?: string[];
  [key: string]: unknown;
}
