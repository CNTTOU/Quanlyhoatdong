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
} from 'lucide-react';
import { FormCard } from '@/components/FormCard';

export function AddActivityPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Thêm hoạt động mới</h2>
        <p className="text-sm text-gray-500">
          Nhập thông tin chi tiết về hoạt động Đoàn - Hội
        </p>
      </div>

      <form>
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
                placeholder="Ví dụ: Ngày hội tình nguyện mùa hè xanh 2026"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Loại hoạt động <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Chọn loại hoạt động</option>
                <option value="hoc-thuat">Học thuật</option>
                <option value="tinh-nguyen">Tình nguyện</option>
                <option value="ky-nang">Kỹ năng</option>
                <option value="sv5t">SV5T</option>
                <option value="truyen-thong">Truyền thông</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Đơn vị tổ chức <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Chọn đơn vị</option>
                <option value="doan-cntt">Đoàn CNTT</option>
                <option value="doan-khoa-hoc">Đoàn Khoa học</option>
                <option value="hoi-svhs">Hội SVHS</option>
                <option value="hoi-chu-thap-do">Hội chữ thập đỏ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Cấp tổ chức <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Chọn cấp tổ chức</option>
                <option value="chi-hoi">Chi hội</option>
                <option value="chi-doan">Chi đoàn</option>
                <option value="lien-chi-hoi">Liên chi Hội</option>
                <option value="doan-khoa">Đoàn khoa</option>
                <option value="cap-truong">Cấp Trường</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Đối tượng tham gia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Sinh viên K66, K67"
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
                Mục tiêu hoạt động <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả mục tiêu, ý nghĩa của hoạt động..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Nội dung triển khai <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
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
                placeholder="Mô tả kết quả, hiệu quả đạt được sau hoạt động..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Số lượng sinh viên tham gia <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    placeholder="Ví dụ: 450"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Ghi chú</label>
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
                Hình ảnh hoạt động
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Kéo thả hình ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG (tối đa 10MB)</p>
                <input type="file" multiple accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  File kế hoạch (PDF, DOCX)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Chọn file kế hoạch</p>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  File báo cáo (PDF, DOCX)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Chọn file báo cáo</p>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Danh sách tham gia (Excel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Chọn file danh sách</p>
                  <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                </div>
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
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Hủy</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Lưu nháp</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30"
              >
                <Send className="w-5 h-5" />
                <span>Gửi duyệt</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
