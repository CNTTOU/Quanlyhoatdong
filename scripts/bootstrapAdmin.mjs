import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const email = process.env.ADMIN_EMAIL ?? "doanhoicntt@ou.edu.vn";
const password = process.env.ADMIN_PASSWORD ?? "Admin@123456";

const permissions = [
  ["xem_hoat_dong", "Xem hoạt động", "hoat_dong", false],
  ["them_hoat_dong", "Thêm hoạt động", "hoat_dong", false],
  ["sua_hoat_dong", "Sửa hoạt động", "hoat_dong", false],
  ["xoa_hoat_dong", "Xóa hoạt động", "hoat_dong", true],
  ["gui_duyet_hoat_dong", "Gửi duyệt hoạt động", "hoat_dong", false],
  ["duyet_hoat_dong", "Duyệt hoạt động", "hoat_dong", false],
  [
    "yeu_cau_bo_sung_hoat_dong",
    "Yêu cầu bổ sung hoạt động",
    "hoat_dong",
    false,
  ],
  ["tu_choi_hoat_dong", "Từ chối hoạt động", "hoat_dong", false],
  ["quan_ly_minh_chung", "Quản lý minh chứng", "minh_chung", false],
  ["xem_bao_cao", "Xem báo cáo", "bao_cao", false],
  ["tao_bao_cao", "Tạo báo cáo", "bao_cao", false],
  ["quan_ly_nguoi_dung", "Quản lý người dùng", "nguoi_dung", false],
  ["tao_tai_khoan", "Tạo tài khoản", "nguoi_dung", false],
  ["khoa_tai_khoan", "Khóa tài khoản", "nguoi_dung", true],
  ["quan_ly_don_vi", "Quản lý đơn vị", "don_vi", false],
  ["quan_ly_phan_quyen", "Quản lý phân quyền", "he_thong", true],
  ["cai_dat_he_thong", "Cài đặt hệ thống", "he_thong", true],
  ["xem_nhat_ky_he_thong", "Xem nhật ký hệ thống", "he_thong", false],
  ["tao_goi_luu_tru", "Tạo gói lưu trữ", "luu_tru", true],
  ["xoa_du_lieu_nam_hoc", "Xóa dữ liệu năm học", "luu_tru", true],
];

const roles = {
  super_admin: {
    ten_vai_tro: "Super Admin",
    mo_ta: "Toàn quyền hệ thống",
    cap_do: 100,
    danh_sach_quyen: permissions.map(([ma_quyen]) => ma_quyen),
  },
  admin_doan_hoi: {
    ten_vai_tro: "Admin Đoàn - Hội",
    mo_ta: "Quản trị nghiệp vụ Đoàn - Hội",
    cap_do: 80,
    danh_sach_quyen: [
      "xem_hoat_dong",
      "them_hoat_dong",
      "sua_hoat_dong",
      "gui_duyet_hoat_dong",
      "duyet_hoat_dong",
      "yeu_cau_bo_sung_hoat_dong",
      "tu_choi_hoat_dong",
      "quan_ly_minh_chung",
      "xem_bao_cao",
      "tao_bao_cao",
      "quan_ly_don_vi",
      "quan_ly_nguoi_dung",
      "tao_tai_khoan",
      "khoa_tai_khoan",
    ],
  },
};

function required(value, name) {
  if (!value) throw new Error(`Thiếu biến môi trường ${name}`);
  return value;
}

Object.entries(firebaseConfig).forEach(([key, value]) => required(value, key));

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let credential;
try {
  credential = await createUserWithEmailAndPassword(auth, email, password);
} catch (error) {
  if (error.code !== "auth/email-already-in-use") throw error;
  credential = await signInWithEmailAndPassword(auth, email, password);
}

const uid = credential.user.uid;

for (const [
  ma_quyen,
  ten_quyen,
  nhom_quyen,
  la_quyen_nguy_hiem,
] of permissions) {
  await setDoc(
    doc(db, "quyen", ma_quyen),
    {
      ma_quyen,
      ten_quyen,
      nhom_quyen,
      mo_ta: ten_quyen,
      la_quyen_nguy_hiem,
      trang_thai: "dang_hoat_dong",
    },
    { merge: true },
  );
}

for (const [ma_vai_tro, role] of Object.entries(roles)) {
  await setDoc(
    doc(db, "vai_tro", ma_vai_tro),
    {
      ma_vai_tro,
      ...role,
      la_mac_dinh: true,
      trang_thai: "dang_hoat_dong",
      ngay_tao: serverTimestamp(),
      ngay_cap_nhat: serverTimestamp(),
    },
    { merge: true },
  );
}

await setDoc(
  doc(db, "don_vi", "doan_khoa_cntt"),
  {
    ma_don_vi: "doan_khoa_cntt",
    ten_don_vi: "Đoàn Khoa Công nghệ Thông tin",
    loai_don_vi: "doan_khoa",
    ma_don_vi_cha: "",
    ten_don_vi_cha: "",
    nguoi_phu_trach: "",
    email_lien_he: "",
    so_dien_thoai: "",
    trang_thai: "dang_hoat_dong",
    ngay_tao: serverTimestamp(),
    ngay_cap_nhat: serverTimestamp(),
  },
  { merge: true },
);

await setDoc(
  doc(db, "nam_hoc", "2025_2026"),
  {
    ma_nam_hoc: "2025_2026",
    ten_nam_hoc: "2025-2026",
    ngay_bat_dau: Timestamp.fromDate(new Date("2025-09-01T00:00:00+07:00")),
    ngay_ket_thuc: Timestamp.fromDate(new Date("2026-08-31T23:59:59+07:00")),
    trang_thai: "dang_hoat_dong",
    la_nam_hoc_hien_tai: true,
    da_luu_tru: false,
    da_xoa_du_lieu_online: false,
    ngay_tao: serverTimestamp(),
  },
  { merge: true },
);

await setDoc(
  doc(db, "nguoi_dung", uid),
  {
    uid,
    ho_ten: "Admin Đoàn Hội",
    email,
    ten_dang_nhap: email,
    ma_don_vi: "doan_khoa_cntt",
    ten_don_vi: "Đoàn Khoa Công nghệ Thông tin",
    ma_vai_tro: "super_admin",
    ten_vai_tro: "Super Admin",
    trang_thai: "dang_hoat_dong",
    bat_buoc_doi_mat_khau: false,
    lan_dang_nhap_cuoi: null,
    ngay_tao: serverTimestamp(),
    nguoi_tao: "bootstrap_script",
    ngay_cap_nhat: serverTimestamp(),
  },
  { merge: true },
);

await signOut(auth);

console.log("Tài khoản admin đã sẵn sàng:");
console.log(`Email: ${email}`);
console.log(`Mật khẩu: ${password}`);
console.log(`UID: ${uid}`);
