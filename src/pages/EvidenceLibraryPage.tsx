import { useEffect, useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { EvidenceTabs } from '@/components/EvidenceTabs';
import { EvidenceFilters } from '@/components/EvidenceFilters';
import { EvidenceCard } from '@/components/EvidenceCard';
import { getInterfaceList } from '@/services/interfaceDataService';

type EvidenceRow = Parameters<typeof EvidenceCard>[0]['evidence'];

export function EvidenceLibraryPage() {
  const [evidences, setEvidences] = useState<EvidenceRow[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getInterfaceList<EvidenceRow>('kho_minh_chung').then(setEvidences);
  }, []);

  const filteredEvidences = evidences.filter((evidence) => {
    if (activeTab !== 'all') {
      const tabTypeMap: { [key: string]: string[] } = {
        images: ['image'],
        videos: ['video'],
        reports: ['pdf', 'word'],
        links: ['link'],
        attendance: ['excel'],
        drive: ['drive'],
      };
      if (!tabTypeMap[activeTab]?.includes(evidence.type)) {
        return false;
      }
    }
    if (searchQuery && !evidence.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Kho minh chứng</h2>
        <p className="text-sm text-gray-500">
          Thư viện lưu trữ tất cả minh chứng hoạt động Đoàn - Hội
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm hình ảnh, file, link minh chứng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap">
            <Upload className="w-5 h-5" />
            <span>Tải lên</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <EvidenceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filters */}
      <EvidenceFilters onFilterChange={() => {}} />

      {/* Stats */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Hiển thị <span className="text-gray-900">{filteredEvidences.length}</span> minh chứng
        </p>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvidences.map((evidence) => (
          <EvidenceCard key={evidence.id} evidence={evidence} />
        ))}
      </div>

      {filteredEvidences.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">Không tìm thấy minh chứng</h3>
          <p className="text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
