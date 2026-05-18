import { FileText } from 'lucide-react';

export function ReportPreview() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Xem trước báo cáo</h3>
        </div>
      </div>

      <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {/* Document Preview */}
        <div className="bg-white border border-gray-300 shadow-lg max-w-3xl mx-auto">
          <div className="p-12 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl uppercase mb-2">TRƯỜNG ĐẠI HỌC ABC</h1>
              <h2 className="text-xl uppercase mb-4">ĐOÀN THANH NIÊN CỘNG SẢN HỒ CHÍ MINH</h2>
              <div className="w-24 h-1 bg-gray-800 mx-auto mb-6"></div>
              <h3 className="text-xl uppercase">BÁO CÁO TỔNG HỢP</h3>
              <h4 className="text-lg">Hoạt động Đoàn - Hội năm học 2025-2026</h4>
            </div>

            {/* Content */}
            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                <strong>I. TÌNH HÌNH CHUNG</strong>
              </p>
              <p className="indent-8">
                Trong năm học 2025-2026, các cấp bộ Đoàn, Hội trong trường đã tổ chức được{' '}
                <strong>410 hoạt động</strong> với tổng số <strong>13,480 lượt</strong> sinh viên tham gia.
                Các hoạt động được triển khai đa dạng, phong phú, bám sát định hướng của Đoàn Trường và
                nhu cầu của sinh viên.
              </p>

              <p>
                <strong>II. KẾT QUẢ THỰC HIỆN</strong>
              </p>

              <p>
                <strong>1. Hoạt động học thuật</strong>
              </p>
              <p className="indent-8">
                Tổ chức được <strong>120 hoạt động</strong> học thuật, thu hút <strong>3,250 lượt</strong>{' '}
                sinh viên tham gia. Các hoạt động nổi bật bao gồm: Hội thảo khoa học sinh viên, Workshop
                về AI và Machine Learning, Olympic Tin học sinh viên...
              </p>

              <p>
                <strong>2. Hoạt động tình nguyện</strong>
              </p>
              <p className="indent-8">
                Triển khai <strong>95 hoạt động</strong> tình nguyện với <strong>2,890 lượt</strong> sinh
                viên. Điển hình: Ngày hội tình nguyện mùa hè xanh, Hiến máu tình nguyện, Chiến dịch Mùa hè
                xanh...
              </p>

              <p>
                <strong>3. Hoạt động kỹ năng</strong>
              </p>
              <p className="indent-8">
                Tổ chức <strong>80 hoạt động</strong> đào tạo kỹ năng với <strong>2,640 lượt</strong> sinh
                viên tham gia. Các hoạt động tập trung vào kỹ năng mềm, kỹ năng nghề nghiệp...
              </p>

              <p>
                <strong>III. ĐÁNH GIÁ CHUNG</strong>
              </p>
              <p className="indent-8">
                Công tác Đoàn - Hội trong năm học đã đạt được nhiều kết quả tích cực, góp phần nâng cao
                chất lượng phong trào sinh viên. Tuy nhiên, vẫn còn một số hạn chế cần khắc phục trong
                năm học tới.
              </p>

              <div className="mt-12 flex justify-end">
                <div className="text-center">
                  <p className="mb-1">
                    <em>Ngày ... tháng ... năm 2026</em>
                  </p>
                  <p className="uppercase mb-16">
                    <strong>BÍ THƯ ĐOÀN TRƯỜNG</strong>
                  </p>
                  <p>
                    <strong>(Ký và ghi rõ họ tên)</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
