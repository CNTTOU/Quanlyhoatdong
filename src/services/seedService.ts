import { doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase.ts";
import {
  ACTIVITY_TYPES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLES,
  UNITS,
} from "../constants/seedData.ts";
import { DEFAULT_REPORT_TEMPLATES } from "../constants/databaseDesign.ts";
import { addLog } from "./auditLogService.ts";

export async function seedPermissions() {
  await Promise.all(
    PERMISSIONS.map(([ma_quyen, ten_quyen, ma_he_thong, nhom_quyen, la_quyen_nguy_hiem]) =>
      setDoc(
        doc(db, "quyen", ma_quyen),
        {
          ma_quyen,
          ma_he_thong,
          ten_quyen,
          nhom_quyen,
          mo_ta: ten_quyen,
          la_quyen_nguy_hiem,
          trang_thai: "dang_hoat_dong",
        },
        { merge: true },
      ),
    ),
  );
}

export async function seedRoles() {
  await Promise.all(
    ROLES.map(([ma_vai_tro, ten_vai_tro, mo_ta, cap_do, danh_sach_he_thong]) =>
      setDoc(
        doc(db, "vai_tro", ma_vai_tro),
        {
          ma_vai_tro,
          ten_vai_tro,
          mo_ta,
          cap_do,
          la_mac_dinh: true,
          trang_thai: "dang_hoat_dong",
          danh_sach_quyen: ROLE_PERMISSIONS[ma_vai_tro],
          danh_sach_he_thong,
          ngay_tao: serverTimestamp(),
          ngay_cap_nhat: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
}

export async function seedSystems() {
  await setDoc(
    doc(db, "he_thong", "quan_ly_hoat_dong"),
    {
      ma_he_thong: "quan_ly_hoat_dong",
      ten_he_thong: "Quản lý hoạt động",
      mo_ta: "Theo dõi hoạt động, minh chứng, duyệt và báo cáo theo phân quyền.",
      duong_dan: "/hoat-dong/dashboard",
      trang_thai: "dang_su_dung",
      thu_tu: 1,
      ngay_tao: serverTimestamp(),
      ngay_cap_nhat: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function seedUnits() {
  await Promise.all(
    UNITS.map((unit) =>
      setDoc(
        doc(db, "don_vi", unit.ma_don_vi),
        {
          ...unit,
          nguoi_phu_trach: "",
          email_lien_he: "",
          so_dien_thoai: "",
          trang_thai: "dang_hoat_dong",
          ngay_tao: serverTimestamp(),
          ngay_cap_nhat: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
}

export async function seedSchoolYears() {
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
}

export async function seedActivityTypes() {
  await Promise.all(
    ACTIVITY_TYPES.map(([ma_loai, ten_loai, mau_hien_thi, icon], index) =>
      setDoc(
        doc(db, "loai_hoat_dong", ma_loai),
        {
          ma_loai,
          ten_loai,
          mo_ta: ten_loai,
          mau_hien_thi,
          icon,
          trang_thai: "dang_hoat_dong",
          thu_tu: index + 1,
        },
        { merge: true },
      ),
    ),
  );
}

export async function seedSystemSettings() {
  await setDoc(
    doc(db, "cai_dat_he_thong", "thong_tin_chung"),
    {
      ten_he_thong: "Quản lý hoạt động",
      ten_don_vi: "Đoàn - Hội Khoa Công nghệ Thông tin",
      logo_url: "",
      email_lien_he: "",
      mau_chu_dao: "#0F4C81",
      cho_phep_dang_ky: false,
      cho_phep_google_login: false,
      chi_admin_tao_tai_khoan: true,
      nam_hoc_hien_tai: "2025_2026",
      ngay_cap_nhat: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function seedReportTemplates() {
  await Promise.all(
    DEFAULT_REPORT_TEMPLATES.map((template) =>
      setDoc(
        doc(db, "mau_bao_cao", template.ma_mau),
        {
          ...template,
          don_vi_ap_dung: [
            "doan_khoa",
            "lien_chi_hoi",
            "chi_doan",
            "chi_hoi",
            "cau_lac_bo",
            "doi_nhom",
          ],
          ho_tro_word: true,
          ho_tro_pdf: true,
          ho_tro_excel: template.ma_mau !== "ket_qua_hoat_dong",
          la_mac_dinh: true,
          trang_thai: "dang_su_dung",
          nguoi_tao: auth.currentUser?.uid ?? "system",
          ngay_tao: serverTimestamp(),
          ngay_cap_nhat: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
}

export async function seedArchivePlan() {
  await setDoc(
    doc(db, "luu_tru_nam_hoc", "archive_2025_2026"),
    {
      ma_luu_tru: "archive_2025_2026",
      ma_nam_hoc: "2025_2026",
      ten_nam_hoc: "2025-2026",
      tong_hoat_dong: 0,
      tong_minh_chung: 0,
      tong_bao_cao: 0,
      tong_dung_luong_uoc_tinh: 0,
      ten_file_luu_tru: "",
      duong_dan_file_luu_tru: "",
      nguon_luu_tru: "google_drive",
      trang_thai: "chua_luu_tru",
      da_xac_nhan_sao_luu: false,
      da_xoa_du_lieu_online: false,
      nguoi_tao_goi: "",
      ngay_tao_goi: null,
      nguoi_xoa_du_lieu: "",
      ngay_xoa_du_lieu: null,
    },
    { merge: true },
  );
}

export async function seedDefaultNotification() {
  await setDoc(
    doc(db, "thong_bao", "mau_thong_bao_he_thong"),
    {
      ma_thong_bao: "mau_thong_bao_he_thong",
      tieu_de: "Chào mừng đến với hệ thống",
      noi_dung:
        "Đây là mẫu thông báo hệ thống dùng để kiểm tra collection thong_bao.",
      loai_thong_bao: "he_thong",
      ma_nguoi_nhan: "",
      da_doc: false,
      duong_dan: "/featured",
      ngay_tao: serverTimestamp(),
      la_du_lieu_mau: true,
    },
    { merge: true },
  );
}

export async function seedAll() {
  await seedSystems();
  await seedUnits();
  await seedSchoolYears();
  await seedActivityTypes();
  await seedSystemSettings();
  await seedReportTemplates();
  await seedArchivePlan();
  await seedDefaultNotification();

  if (auth.currentUser) {
    await addLog({
      hanh_dong: "seed_du_lieu_ban_dau",
      module: "he_thong",
      noi_dung: "Seed toàn bộ thiết kế cơ sở dữ liệu Firestore",
    }).catch(() => undefined);
  }
}
