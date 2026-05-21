import { FileText } from 'lucide-react';
import type { ReportBuilderOptionsState, ReportPreviewData, ReportTemplate } from '@/services/reportBuilderService';

interface ReportPreviewProps {
  template: ReportTemplate | null;
  data: ReportPreviewData | null;
  options: ReportBuilderOptionsState;
  loading?: boolean;
}

export function ReportPreview({ template, data, options, loading }: ReportPreviewProps) {
  const sections = template?.cau_truc?.length ? template.cau_truc : [
    { tieu_de: 'Tình hình chung', kieu: 'section' },
    { tieu_de: 'Kết quả thực hiện', kieu: 'table' },
    { tieu_de: 'Đánh giá chung', kieu: 'section' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="border-b border-gray-200 p-5">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Xem trước báo cáo</h3>
        </div>
      </div>

      <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <div className="bg-white border border-gray-300 shadow-lg max-w-3xl mx-auto">
          <div className="p-12 space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl uppercase mb-2">TRƯỜNG ĐẠI HỌC ABC</h1>
              <h2 className="text-xl uppercase mb-4">ĐOÀN THANH NIÊN CỘNG SẢN HỒ CHÍ MINH</h2>
              <div className="w-24 h-1 bg-gray-800 mx-auto mb-6"></div>
              <h3 className="text-xl uppercase">{data?.title || 'BÁO CÁO TỔNG HỢP'}</h3>
              <h4 className="text-lg">{data?.subtitle || 'Hoạt động Đoàn - Hội'}</h4>
            </div>

            {loading ? (
              <p className="text-center text-sm text-gray-500">Đang tổng hợp dữ liệu báo cáo...</p>
            ) : !data ? (
              <p className="text-center text-sm text-gray-500">Chọn mẫu báo cáo để xem trước nội dung.</p>
            ) : (
              <div className="space-y-5 text-justify leading-relaxed">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Ngày tạo: {data.generatedAt}</p>
                  <p>Bộ lọc: {data.filtersText}</p>
                </div>

                {options.showStats && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-500">Tổng hoạt động</p>
                      <p className="text-xl font-semibold text-gray-900">{data.stats.totalActivities}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-500">Lượt tham gia</p>
                      <p className="text-xl font-semibold text-gray-900">{data.stats.participants}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-500">Minh chứng</p>
                      <p className="text-xl font-semibold text-gray-900">{data.stats.evidence}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-500">Đã duyệt</p>
                      <p className="text-xl font-semibold text-gray-900">{data.stats.approved}</p>
                    </div>
                  </div>
                )}

                {sections.map((section, index) => (
                  <div key={`${section.tieu_de}-${index}`} className="space-y-3">
                    <p>
                      <strong>{index + 1}. {section.tieu_de.toUpperCase()}</strong>
                    </p>
                    {section.kieu === 'table' ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300 text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="border border-gray-300 p-2 text-left">Hoạt động</th>
                              <th className="border border-gray-300 p-2 text-left">Đơn vị</th>
                              <th className="border border-gray-300 p-2 text-left">Thời gian</th>
                              <th className="border border-gray-300 p-2 text-left">Tham gia</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.activities.map((activity) => (
                              <tr key={activity.id}>
                                <td className="border border-gray-300 p-2">{activity.name}</td>
                                <td className="border border-gray-300 p-2">{activity.unit}</td>
                                <td className="border border-gray-300 p-2">{activity.date}</td>
                                <td className="border border-gray-300 p-2">{activity.participants}</td>
                              </tr>
                            ))}
                            {data.activities.length === 0 && (
                              <tr>
                                <td colSpan={4} className="border border-gray-300 p-3 text-center text-gray-500">Không có hoạt động phù hợp</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="indent-8">
                        Tổng hợp {data.activities.length} hoạt động với {data.stats.participants} lượt tham gia theo bộ lọc hiện tại.
                      </p>
                    )}
                  </div>
                ))}

                {options.showLinks && data.activities.some((activity) => activity.links.length > 0) && (
                  <div>
                    <p><strong>Liên kết minh chứng</strong></p>
                    <ul className="list-disc list-inside text-sm text-blue-700">
                      {data.activities.flatMap((activity) => activity.links).map((link) => (
                        <li key={link}>{link}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {options.showImages && data.evidences.length > 0 && (
                  <div>
                    <p><strong>Minh chứng đã nộp</strong></p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {data.evidences.map((evidence) => (
                        <li key={evidence.id}>{evidence.name} - {evidence.activity}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {options.showComments && (
                  <p className="indent-8">
                    Nhận xét: dữ liệu báo cáo được tổng hợp tự động từ hoạt động và minh chứng đang có trên hệ thống.
                  </p>
                )}

              <div className="mt-12 flex justify-end">
                <div className="text-center">
                  <p className="mb-1">
                    <em>Ngày ... tháng ... năm ...</em>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
