export const PERMISSIONS = [
  ['xem_hoat_dong', 'Xem hoạt động', 'hoat_dong', false],
  ['them_hoat_dong', 'Thêm hoạt động', 'hoat_dong', false],
  ['sua_hoat_dong', 'Sửa hoạt động', 'hoat_dong', false],
  ['xoa_hoat_dong', 'Xóa hoạt động', 'hoat_dong', true],
  ['gui_duyet_hoat_dong', 'Gửi duyệt hoạt động', 'hoat_dong', false],
  ['duyet_hoat_dong', 'Duyệt hoạt động', 'hoat_dong', false],
  ['yeu_cau_bo_sung_hoat_dong', 'Yêu cầu bổ sung hoạt động', 'hoat_dong', false],
  ['tu_choi_hoat_dong', 'Từ chối hoạt động', 'hoat_dong', false],
  ['quan_ly_minh_chung', 'Quản lý minh chứng', 'minh_chung', false],
  ['xem_bao_cao', 'Xem báo cáo', 'bao_cao', false],
  ['tao_bao_cao', 'Tạo báo cáo', 'bao_cao', false],
  ['quan_ly_nguoi_dung', 'Quản lý người dùng', 'nguoi_dung', false],
  ['tao_tai_khoan', 'Tạo tài khoản', 'nguoi_dung', false],
  ['khoa_tai_khoan', 'Khóa tài khoản', 'nguoi_dung', true],
  ['quan_ly_don_vi', 'Quản lý đơn vị', 'don_vi', false],
  ['quan_ly_phan_quyen', 'Quản lý phân quyền', 'he_thong', true],
  ['cai_dat_he_thong', 'Cài đặt hệ thống', 'he_thong', true],
  ['xem_nhat_ky_he_thong', 'Xem nhật ký hệ thống', 'he_thong', false],
  ['tao_goi_luu_tru', 'Tạo gói lưu trữ', 'luu_tru', true],
  ['xoa_du_lieu_nam_hoc', 'Xóa dữ liệu năm học', 'luu_tru', true],
] as const;

export const ROLE_PERMISSIONS = {
  super_admin: PERMISSIONS.map(([ma_quyen]) => ma_quyen),
  admin_doan_hoi: [
    'xem_hoat_dong',
    'them_hoat_dong',
    'sua_hoat_dong',
    'gui_duyet_hoat_dong',
    'duyet_hoat_dong',
    'yeu_cau_bo_sung_hoat_dong',
    'tu_choi_hoat_dong',
    'quan_ly_minh_chung',
    'xem_bao_cao',
    'tao_bao_cao',
    'quan_ly_don_vi',
    'quan_ly_nguoi_dung',
    'tao_tai_khoan',
    'khoa_tai_khoan',
  ],
  ban_chap_hanh: [
    'xem_hoat_dong',
    'them_hoat_dong',
    'sua_hoat_dong',
    'gui_duyet_hoat_dong',
    'quan_ly_minh_chung',
    'xem_bao_cao',
  ],
  can_bo_chi_doan_chi_hoi: [
    'xem_hoat_dong',
    'them_hoat_dong',
    'sua_hoat_dong',
    'gui_duyet_hoat_dong',
    'quan_ly_minh_chung',
  ],
  cong_tac_vien: ['xem_hoat_dong', 'them_hoat_dong'],
  nguoi_xem: ['xem_hoat_dong'],
};

export const ROLES = [
  ['super_admin', 'Super Admin', 'Toàn quyền hệ thống', 100],
  ['admin_doan_hoi', 'Admin Đoàn - Hội', 'Quản trị nghiệp vụ Đoàn - Hội', 80],
  ['ban_chap_hanh', 'Ban Chấp hành', 'Quản lý hoạt động đơn vị', 60],
  ['can_bo_chi_doan_chi_hoi', 'Cán bộ Chi đoàn/Chi hội', 'Tạo hoạt động và minh chứng đơn vị', 40],
  ['cong_tac_vien', 'Cộng tác viên', 'Nhập nháp hoạt động được phân công', 20],
  ['nguoi_xem', 'Người xem', 'Chỉ xem dữ liệu được duyệt', 10],
] as const;

export const UNITS = [
  {
    ma_don_vi: 'doan_khoa_cntt',
    ten_don_vi: 'Đoàn Khoa Công nghệ Thông tin',
    loai_don_vi: 'doan_khoa',
    ma_don_vi_cha: '',
    ten_don_vi_cha: '',
  },
  {
    ma_don_vi: 'lch_cntt',
    ten_don_vi: 'Liên chi Hội Khoa Công nghệ Thông tin',
    loai_don_vi: 'lien_chi_hoi',
    ma_don_vi_cha: 'doan_khoa_cntt',
    ten_don_vi_cha: 'Đoàn Khoa Công nghệ Thông tin',
  },
];

export const ACTIVITY_TYPES = [
  ['hoc_thuat', 'Học thuật', '#2563eb', 'graduation-cap'],
  ['tinh_nguyen', 'Tình nguyện', '#16a34a', 'heart-handshake'],
  ['phong_trao', 'Phong trào', '#dc2626', 'flag'],
  ['sinh_vien_5_tot', 'Sinh viên 5 tốt', '#ca8a04', 'award'],
  ['tuyen_truyen', 'Tuyên truyền', '#9333ea', 'megaphone'],
  ['huong_nghiep', 'Hướng nghiệp', '#0891b2', 'briefcase'],
  ['tap_huan', 'Tập huấn', '#4f46e5', 'presentation'],
  ['van_hoa_the_thao', 'Văn hóa thể thao', '#ea580c', 'trophy'],
  ['khac', 'Khác', '#64748b', 'circle'],
] as const;
