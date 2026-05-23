import {
  FileText,
  BookOpen,
  ImagePlus,
  Save,
  Send,
  X,
  Calendar,
  MapPin,
  Users,
  Upload,
  Link as LinkIcon,
  FileSpreadsheet,
  Plus,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FormCard } from "@/components/FormCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  createActivityWithId,
  getActivityById,
  getActivityFormOptions,
  submitActivity,
  updateActivity,
  type ActivityFormInput,
} from "@/services/activityService";
import {
  addEvidence,
  uploadEvidenceFile,
  type EvidenceActivityOption,
  type EvidenceFormInput,
} from "@/services/evidenceService";
import { identityDb } from "@/lib/firebase";
import { getCached } from "@/services/cache";

type UnitTypeOption = { value: string; label: string };
type DocumentSlot = "plan" | "report" | "attendance";
type FundingInput = { nguon: string; so_tien: number };

const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const documentMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const spreadsheetMimeTypes = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];
const extensionByMime: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "application/pdf": ["pdf"],
  "application/msword": ["doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    "docx",
  ],
  "application/vnd.ms-excel": ["xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
  "text/csv": ["csv"],
};

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() || "";
}

function isAllowedFile(file: File, mimeTypes: string[]) {
  const extension = getFileExtension(file);
  return mimeTypes.some(
    (type) => file.type === type || extensionByMime[type]?.includes(extension),
  );
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function normalizeFundingRows(rows: FundingInput[]) {
  return rows
    .map((row) => ({
      nguon: row.nguon.trim(),
      so_tien: Number(row.so_tien || 0),
    }))
    .filter((row) => row.nguon || row.so_tien > 0);
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>,
) {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        results[currentIndex] = await task(items[currentIndex], currentIndex);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

function formatUnitTypeLabel(value: string) {
  if (!value) return "";
  const specialLabels: Record<string, string> = {
    clb: "CLB",
    cau_lac_bo: "Câu lạc bộ",
    doi_nhom: "Đội/Nhóm",
    chi_doan: "Chi đoàn",
    chi_hoi: "Chi hội",
    chi_doan_chi_hoi: "Chi Đoàn - Chi Hội",
    doan_khoa: "Đoàn khoa",
    lien_chi_hoi: "Liên chi Hội",
    "doan-hoi-khoa": "Đoàn - Hội Khoa",
  };
  if (specialLabels[value]) return specialLabels[value];
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toDateTimeLocal(value: unknown) {
  const date =
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
      ? (value.toDate() as Date)
      : typeof value === "string" && value
        ? new Date(value)
        : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return offsetDate.toISOString().slice(0, 16);
}

function formatVNDInput(value: string) {
  const numberOnly = value.replace(/\D/g, "");

  if (!numberOnly) return "";

  return new Intl.NumberFormat("vi-VN").format(Number(numberOnly));
}

function parseVNDToNumber(value: string) {
  const numberOnly = value.replace(/\D/g, "");

  return numberOnly ? Number(numberOnly) : 0;
}

const emptyForm: ActivityFormInput = {
  ten_hoat_dong: "",
  ma_nam_hoc: "",
  ma_loai: "",
  ma_don_vi: "",
  cap_to_chuc: "",
  thoi_gian_bat_dau: "",
  thoi_gian_ket_thuc: "",
  dia_diem: "",
  doi_tuong_tham_gia: "",
  so_luong_tham_gia: 0,
  kinh_phi_hoat_dong: [{ nguon: "", so_tien: 0 }],
  noi_dung: "",
  ket_qua: "",
  link_bai_viet: "",
  link_thu_muc_minh_chung: "",
  anh_dai_dien: "",
};

export function AddActivityPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState<ActivityFormInput>(emptyForm);
  const [years, setYears] = useState<
    Array<{
      ma_nam_hoc: string;
      ten_nam_hoc: string;
      la_nam_hoc_hien_tai?: boolean;
    }>
  >([]);
  const [activityTypes, setActivityTypes] = useState<
    Array<{ ma_loai: string; ten_loai: string }>
  >([]);
  const [units, setUnits] = useState<
    Array<{ ma_don_vi: string; ten_don_vi: string; loai_don_vi: string }>
  >([]);
  const [unitTypes, setUnitTypes] = useState<UnitTypeOption[]>([]);
  const [canEditUnit, setCanEditUnit] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<
    Record<DocumentSlot, File | null>
  >({
    plan: null,
    report: null,
    attendance: null,
  });
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getActivityFormOptions(user),
      getCached("unit-types:all", 5 * 60 * 1000, async () =>
        getDocs(
          query(
            collection(identityDb, "loai_don_vi"),
            orderBy("ten_loai", "asc"),
          ),
        ),
      ),
      id ? getActivityById(id) : Promise.resolve(null),
    ])
      .then(([options, unitTypeSnap, activity]) => {
        const loadedUnitTypes = unitTypeSnap.docs
          .map((item) => {
            const data = item.data();
            const value = String(data.ma_loai ?? item.id);
            return {
              value,
              label: String(data.ten_loai || formatUnitTypeLabel(value)),
              trang_thai: String(data.trang_thai ?? "dang_hoat_dong"),
            };
          })
          .filter((item) => item.trang_thai !== "ngung_hoat_dong")
          .map(({ value, label }) => ({ value, label }));
        const unitTypeFallbacks = options.units
          .map((unit) => ({
            value: unit.loai_don_vi,
            label: formatUnitTypeLabel(unit.loai_don_vi),
          }))
          .filter((item) => item.value);
        const nextUnitTypes = Array.from(
          new Map(
            [...unitTypeFallbacks, ...loadedUnitTypes].map((item) => [
              item.value,
              item,
            ]),
          ).values(),
        );

        setYears(options.years);
        setActivityTypes(options.activityTypes);
        setUnits(options.units);
        setCanEditUnit(Boolean(options.canEditUnit));
        setUnitTypes(nextUnitTypes);
        if (activity) {
          setCurrentStatus(String(activity.trang_thai || ""));
          setForm({
            ten_hoat_dong: String(activity.ten_hoat_dong || ""),
            ma_nam_hoc: String(activity.ma_nam_hoc || ""),
            ma_loai: String(activity.ma_loai || ""),
            ma_don_vi: String(activity.ma_don_vi || ""),
            cap_to_chuc: String(activity.cap_to_chuc || ""),
            thoi_gian_bat_dau: toDateTimeLocal(activity.thoi_gian_bat_dau),
            thoi_gian_ket_thuc: toDateTimeLocal(activity.thoi_gian_ket_thuc),
            dia_diem: String(activity.dia_diem || ""),
            doi_tuong_tham_gia: String(activity.doi_tuong_tham_gia || ""),
            so_luong_tham_gia: Number(activity.so_luong_tham_gia || 0),
            kinh_phi_hoat_dong:
              Array.isArray(activity.kinh_phi_hoat_dong) &&
              activity.kinh_phi_hoat_dong.length > 0
                ? activity.kinh_phi_hoat_dong.map((item) => ({
                    nguon: String((item as FundingInput).nguon || ""),
                    so_tien: Number((item as FundingInput).so_tien || 0),
                  }))
                : [{ nguon: "", so_tien: 0 }],
            noi_dung: String(activity.noi_dung || ""),
            ket_qua: String(activity.ket_qua || ""),
            link_bai_viet: String(activity.link_bai_viet || ""),
            link_thu_muc_minh_chung: String(
              activity.link_thu_muc_minh_chung || "",
            ),
            anh_dai_dien: String(activity.anh_dai_dien || ""),
          });
          return;
        }

        const defaultUnit =
          options.units.length === 1
            ? options.units[0]
            : options.units.find((unit) => unit.ma_don_vi === user.ma_don_vi);
        setForm((current) => ({
          ...current,
          ma_nam_hoc: "",
          ma_loai: "",
          ma_don_vi: defaultUnit?.ma_don_vi ?? "",
          cap_to_chuc: defaultUnit?.loai_don_vi ?? "",
        }));
      })
      .catch((error) =>
        setMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu form.",
        ),
      );
  }, [id, user]);

  function updateField(field: keyof ActivityFormInput, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateUnit(maDonVi: string) {
    const selectedUnit = units.find((unit) => unit.ma_don_vi === maDonVi);
    setForm((current) => ({
      ...current,
      ma_don_vi: maDonVi,
      cap_to_chuc: selectedUnit?.loai_don_vi ?? "",
    }));
  }

  function validateForm() {
    if (
      !form.ten_hoat_dong ||
      !form.ma_nam_hoc ||
      !form.ma_loai ||
      !form.ma_don_vi
    )
      return "Vui lòng nhập đầy đủ tên, năm học, loại và đơn vị.";
    if (
      !form.cap_to_chuc ||
      !form.thoi_gian_bat_dau ||
      !form.thoi_gian_ket_thuc ||
      !form.dia_diem
    )
      return "Vui lòng nhập đầy đủ cấp tổ chức, thời gian và địa điểm.";
    if (!form.noi_dung || !form.ket_qua)
      return "Vui lòng nhập nội dung và kết quả.";
    const invalidFunding = normalizeFundingRows(form.kinh_phi_hoat_dong).find(
      (row) => !row.nguon || row.so_tien <= 0,
    );
    if (invalidFunding)
      return "Vui lòng nhập đầy đủ nguồn kinh phí và số tiền lớn hơn 0.";
    if (new Date(form.thoi_gian_bat_dau) > new Date(form.thoi_gian_ket_thuc))
      return "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.";
    if (imageFiles.length > 0 && imageFiles.length < 3)
      return "Vui lòng chọn tối thiểu 3 hình ảnh hoặc không chọn hình ảnh.";
    if (imageFiles.length > 10) return "Chỉ được chọn tối đa 10 hình ảnh.";
    return "";
  }

  function getEvidenceActivityOption(
    activityId: string,
  ): EvidenceActivityOption {
    const year = years.find((item) => item.ma_nam_hoc === form.ma_nam_hoc);
    const type = activityTypes.find((item) => item.ma_loai === form.ma_loai);
    const unit = units.find((item) => item.ma_don_vi === form.ma_don_vi);
    return {
      id: activityId,
      name: form.ten_hoat_dong,
      ma_nam_hoc: form.ma_nam_hoc,
      ma_loai: form.ma_loai,
      ten_loai: type?.ten_loai ?? "",
      ma_don_vi: form.ma_don_vi,
      ten_don_vi: unit?.ten_don_vi ?? "",
    };
  }

  function toEvidenceInput(
    activityId: string,
    uploaded: Awaited<ReturnType<typeof uploadEvidenceFile>>,
    overrides: Partial<EvidenceFormInput>,
  ): EvidenceFormInput {
    return {
      ma_hoat_dong: activityId,
      ten_minh_chung: overrides.ten_minh_chung || uploaded.ten_file,
      loai_minh_chung: overrides.loai_minh_chung || uploaded.loai_minh_chung,
      nguon_luu_tru: uploaded.nguon_luu_tru,
      duong_dan_file: uploaded.url,
      duong_dan_thu_muc: "",
      ten_file: uploaded.ten_file,
      dinh_dang_file: uploaded.dinh_dang_file,
      dung_luong_file: uploaded.dung_luong_file,
      mime_type: uploaded.mime_type,
      ghi_chu: overrides.ghi_chu || "",
    };
  }

  async function uploadSelectedEvidence(activityId: string) {
    const activityOption = getEvidenceActivityOption(activityId);
    let firstImageUrl = "";

    if (imageFiles.length > 0) {
      let completedImages = 0;
      setMessage(`Đang upload ${imageFiles.length} hình ảnh...`);
      const uploadedImages = await mapWithConcurrency(
        imageFiles,
        3,
        async (file, index) => {
          const uploaded = await uploadEvidenceFile(file, activityId);
          completedImages += 1;
          setMessage(
            `Đã upload ${completedImages}/${imageFiles.length} hình ảnh...`,
          );
          return { uploaded, index };
        },
      );

      firstImageUrl = uploadedImages[0]?.uploaded.url || "";
      setMessage("Đang lưu thông tin hình ảnh minh chứng...");
      await Promise.all(
        uploadedImages.map(({ uploaded, index }) =>
          addEvidence(
            toEvidenceInput(activityId, uploaded, {
              ten_minh_chung: `Hình ảnh hoạt động ${index + 1}`,
              loai_minh_chung: "hinh_anh",
            }),
            activityOption,
          ),
        ),
      );
    }

    const documentConfigs: Array<{
      slot: DocumentSlot;
      title: string;
      type: string;
    }> = [
      { slot: "plan", title: "File kế hoạch hoạt động", type: "file_ke_hoach" },
      { slot: "report", title: "File báo cáo hoạt động", type: "file_bao_cao" },
      {
        slot: "attendance",
        title: "Danh sách tham gia",
        type: "danh_sach_tham_gia",
      },
    ];

    for (const config of documentConfigs) {
      const file = documentFiles[config.slot];
      if (!file) continue;
      setMessage(`Đang upload ${config.title.toLowerCase()}...`);
      const uploaded = await uploadEvidenceFile(file, activityId);
      await addEvidence(
        toEvidenceInput(activityId, uploaded, {
          ten_minh_chung: config.title,
          loai_minh_chung: config.type,
        }),
        activityOption,
      );
    }

    if (firstImageUrl && user) {
      await updateActivity(
        activityId,
        {
          anh_dai_dien: firstImageUrl,
          anh_dai_dien_tu_dong: false,
          nguon_anh_dai_dien: "upload_minh_chung",
        },
        user,
      );
    }
  }

  function handleImageFiles(files: FileList | null) {
    const selected = Array.from(files ?? []);
    if (!selected.length) return;
    if (selected.length > 10) {
      setMessage("Chỉ được chọn tối đa 10 hình ảnh.");
      return;
    }
    const invalid = selected.find(
      (file) => !isAllowedFile(file, imageMimeTypes),
    );
    if (invalid) {
      setMessage(`File "${invalid.name}" không phải hình ảnh hợp lệ.`);
      return;
    }
    const oversized = selected.find((file) => file.size > 15 * 1024 * 1024);
    if (oversized) {
      setMessage(`Ảnh "${oversized.name}" vượt quá 15MB.`);
      return;
    }
    setImageFiles(selected);
    setMessage("");
  }

  function handleDocumentFile(slot: DocumentSlot, file?: File) {
    if (!file) return;
    const allowed =
      slot === "attendance" ? spreadsheetMimeTypes : documentMimeTypes;
    if (!isAllowedFile(file, allowed)) {
      setMessage(
        slot === "attendance"
          ? "Danh sách tham gia chỉ nhận file XLS, XLSX hoặc CSV."
          : "File kế hoạch/báo cáo chỉ nhận PDF, DOC hoặc DOCX.",
      );
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setMessage(`File "${file.name}" vượt quá 25MB.`);
      return;
    }
    setDocumentFiles((current) => ({ ...current, [slot]: file }));
    setMessage("");
  }

  function removeDocumentFile(slot: DocumentSlot) {
    setDocumentFiles((current) => ({ ...current, [slot]: null }));
  }

  function updateFundingRow(
    index: number,
    field: keyof FundingInput,
    value: string | number,
  ) {
    setForm((current) => ({
      ...current,
      kinh_phi_hoat_dong: current.kinh_phi_hoat_dong.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  }

  function addFundingRow() {
    setForm((current) => ({
      ...current,
      kinh_phi_hoat_dong: [
        ...current.kinh_phi_hoat_dong,
        { nguon: "", so_tien: 0 },
      ],
    }));
  }

  function removeFundingRow(index: number) {
    setForm((current) => ({
      ...current,
      kinh_phi_hoat_dong:
        current.kinh_phi_hoat_dong.length > 1
          ? current.kinh_phi_hoat_dong.filter(
              (_, rowIndex) => rowIndex !== index,
            )
          : [{ nguon: "", so_tien: 0 }],
    }));
  }

  async function save(status: "ban_nhap" | "cho_duyet") {
    if (!user) return;
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      if (id) {
        const updateData = {
          ...form,
          kinh_phi_hoat_dong: normalizeFundingRows(form.kinh_phi_hoat_dong),
          ...(status === "cho_duyet" ? { ly_do_yeu_cau_bo_sung: "" } : {}),
        };
        await updateActivity(id, updateData, user);
        await uploadSelectedEvidence(id);
        if (status === "cho_duyet") {
          await submitActivity(id, user);
        }
        navigate(`/activities/${id}`);
        return;
      }

      const newId = await createActivityWithId(
        {
          ...form,
          kinh_phi_hoat_dong: normalizeFundingRows(form.kinh_phi_hoat_dong),
        },
        user,
        status,
      );
      await uploadSelectedEvidence(newId);
      navigate(`/activities/${newId}`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Không thể lưu hoạt động.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    save("cho_duyet");
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">
          {isEditing ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
        </h2>
        <p className="text-sm text-gray-500">
          {currentStatus === "can_bo_sung"
            ? "Bổ sung thông tin, minh chứng và gửi duyệt lại"
            : "Nhập thông tin chi tiết về hoạt động Đoàn - Hội"}
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Card 1: Thông tin cơ bản */}
        <FormCard
          icon={FileText}
          title="Thông tin cơ bản"
          description="Nhập thông tin chung về hoạt động"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">
                Tên hoạt động <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.ten_hoat_dong}
                onChange={(event) =>
                  updateField("ten_hoat_dong", event.target.value)
                }
                placeholder="Nhập tên hoạt động"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Năm học <span className="text-red-500">*</span>
              </label>
              <select
                value={form.ma_nam_hoc}
                onChange={(event) =>
                  updateField("ma_nam_hoc", event.target.value)
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn năm học</option>
                {years.map((year) => (
                  <option key={year.ma_nam_hoc} value={year.ma_nam_hoc}>
                    {year.ten_nam_hoc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Loại hoạt động <span className="text-red-500">*</span>
              </label>
              <select
                value={form.ma_loai}
                onChange={(event) => updateField("ma_loai", event.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn loại hoạt động</option>
                {activityTypes.map((type) => (
                  <option key={type.ma_loai} value={type.ma_loai}>
                    {type.ten_loai}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Đơn vị tổ chức <span className="text-red-500">*</span>
              </label>
              <select
                value={form.ma_don_vi}
                onChange={(event) => updateUnit(event.target.value)}
                disabled={!canEditUnit}
                className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${canEditUnit ? "bg-gray-50" : "bg-gray-100 text-gray-700 cursor-not-allowed"}`}
              >
                <option value="">Chọn đơn vị</option>
                {units.map((unit) => (
                  <option key={unit.ma_don_vi} value={unit.ma_don_vi}>
                    {unit.ten_don_vi}
                  </option>
                ))}
              </select>
              {!canEditUnit && (
                <p className="mt-1 text-xs text-gray-500">
                  Đơn vị được lấy theo tài khoản đang đăng nhập.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Cấp tổ chức <span className="text-red-500">*</span>
              </label>
              <select
                value={form.cap_to_chuc}
                disabled={!canEditUnit}
                onChange={(event) =>
                  updateField("cap_to_chuc", event.target.value)
                }
                className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${canEditUnit ? "bg-gray-50" : "bg-gray-100 text-gray-700 cursor-not-allowed"}`}
              >
                <option value="">Tự động theo đơn vị tổ chức</option>
                {unitTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {!canEditUnit && (
                <p className="mt-1 text-xs text-gray-500">
                  Cấp tổ chức được khóa theo loại đơn vị của tài khoản.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Đối tượng tham gia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.doi_tuong_tham_gia}
                onChange={(event) =>
                  updateField("doi_tuong_tham_gia", event.target.value)
                }
                placeholder="Ví dụ: Sinh viên Khoa Công nghệ Thông tin"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Thời gian bắt đầu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="datetime-local"
                  value={form.thoi_gian_bat_dau}
                  onChange={(event) =>
                    updateField("thoi_gian_bat_dau", event.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Thời gian kết thúc <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="datetime-local"
                  value={form.thoi_gian_ket_thuc}
                  onChange={(event) =>
                    updateField("thoi_gian_ket_thuc", event.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.dia_diem}
                  onChange={(event) =>
                    updateField("dia_diem", event.target.value)
                  }
                  placeholder="Ví dụ: Hội trường A, Giảng đường B"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </FormCard>

        {/* Card 2: Nội dung hoạt động */}
        <FormCard
          icon={BookOpen}
          title="Nội dung hoạt động"
          description="Mô tả chi tiết về hoạt động"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Nội dung triển khai <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={form.noi_dung}
                onChange={(event) =>
                  updateField("noi_dung", event.target.value)
                }
                placeholder="Mô tả cách thức tổ chức, các hoạt động cụ thể..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Kết quả đạt được <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.ket_qua}
                onChange={(event) => updateField("ket_qua", event.target.value)}
                placeholder="Mô tả kết quả, hiệu quả đạt được sau hoạt động..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Số lượng sinh viên tham gia{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={form.so_luong_tham_gia || ""}
                    onChange={(event) =>
                      updateField(
                        "so_luong_tham_gia",
                        Number(event.target.value),
                      )
                    }
                    placeholder="Ví dụ: 450"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="block text-sm text-gray-700">
                    Kinh phí hoạt động
                  </label>
                  <button
                    type="button"
                    onClick={addFundingRow}
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Thêm nguồn</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {form.kinh_phi_hoat_dong.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 md:grid-cols-[1fr_220px_auto]"
                    >
                      <input
                        type="text"
                        value={row.nguon}
                        onChange={(event) =>
                          updateFundingRow(index, "nguon", event.target.value)
                        }
                        placeholder="Ví dụ: Cấp trường"
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <div className="relative">
                        <input
                          type="text"
                          min={0}
                          step={1000}
                          value={
                            row.so_tien
                              ? formatVNDInput(String(row.so_tien))
                              : ""
                          }
                          onChange={(event) =>
                            updateFundingRow(
                              index,
                              "so_tien",
                              parseVNDToNumber(event.target.value),
                            )
                          }
                          placeholder="3.000.000đ"
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {row.so_tien > 0 && (
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            đ
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFundingRow(index)}
                        className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Bỏ
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Ghi chú
                </label>
                <input
                  type="text"
                  placeholder="Thông tin bổ sung (nếu có)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </FormCard>

        {/* Card 3: Minh chứng */}
        <FormCard
          icon={ImagePlus}
          title="Minh chứng hoạt động"
          description="Tải lên các tài liệu, hình ảnh minh chứng"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Hình ảnh hoạt động{" "}
                <span className="text-xs text-gray-500">
                  (3-10 ảnh nếu chọn upload)
                </span>
              </label>
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Kéo thả hình ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, WebP, GIF (tối đa 15MB/ảnh)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => handleImageFiles(event.target.files)}
                  className="hidden"
                />
              </label>
              {imageFiles.length > 0 && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      Đã chọn {imageFiles.length} ảnh
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageFiles([])}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {imageFiles.map((file) => (
                      <div
                        key={`${file.name}-${file.size}`}
                        className="truncate rounded-md bg-white px-3 py-2 text-xs text-gray-600"
                      >
                        {file.name} · {formatFileSize(file.size)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  File kế hoạch (PDF, DOCX)
                </label>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Chọn file kế hoạch</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) =>
                      handleDocumentFile("plan", event.target.files?.[0])
                    }
                    className="hidden"
                  />
                </label>
                {documentFiles.plan && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    <span className="truncate">
                      {documentFiles.plan.name} ·{" "}
                      {formatFileSize(documentFiles.plan.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocumentFile("plan")}
                      className="ml-3 text-red-600"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  File báo cáo (PDF, DOCX)
                </label>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Chọn file báo cáo</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) =>
                      handleDocumentFile("report", event.target.files?.[0])
                    }
                    className="hidden"
                  />
                </label>
                {documentFiles.report && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    <span className="truncate">
                      {documentFiles.report.name} ·{" "}
                      {formatFileSize(documentFiles.report.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocumentFile("report")}
                      className="ml-3 text-red-600"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Danh sách tham gia (Excel)
                </label>
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <FileSpreadsheet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Chọn file danh sách</p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                    onChange={(event) =>
                      handleDocumentFile("attendance", event.target.files?.[0])
                    }
                    className="hidden"
                  />
                </label>
                {documentFiles.attendance && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    <span className="truncate">
                      {documentFiles.attendance.name} ·{" "}
                      {formatFileSize(documentFiles.attendance.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDocumentFile("attendance")}
                      className="ml-3 text-red-600"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Link bài truyền thông Facebook
                </label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={form.link_bai_viet}
                    onChange={(event) =>
                      updateField("link_bai_viet", event.target.value)
                    }
                    placeholder="https://facebook.com/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Link Google Drive minh chứng
                </label>
                <div className="relative">
                  <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={form.link_thu_muc_minh_chung}
                    onChange={(event) =>
                      updateField("link_thu_muc_minh_chung", event.target.value)
                    }
                    placeholder="https://drive.google.com/..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </FormCard>

        {/* Card 4: Hành động */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate("/activities")}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Hủy</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => save("ban_nhap")}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{isEditing ? "Lưu cập nhật" : "Lưu nháp"}</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
                <span>{isEditing ? "Gửi duyệt lại" : "Gửi duyệt"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
