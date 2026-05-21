import { useEffect, useMemo, useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { EvidenceTabs, evidenceTabConfig } from '@/components/EvidenceTabs';
import { EvidenceFilters, type EvidenceFiltersState } from '@/components/EvidenceFilters';
import { EvidenceCard } from '@/components/EvidenceCard';
import { useAuth } from '@/contexts/AuthContext';
import {
  getEvidenceFilterOptions,
  getEvidenceRowsByCurrentUser,
  type EvidenceFilterOptions,
  type EvidenceRow,
  type EvidenceType,
} from '@/services/evidenceService';

const initialFilters: EvidenceFiltersState = {
  loai_minh_chung: '',
  ma_nam_hoc: '',
  ma_don_vi: '',
  ma_loai: '',
  ngay_tai_len: '',
};

const emptyOptions: EvidenceFilterOptions = {
  years: [],
  units: [],
  activityTypes: [],
};

const tabTypeMap: Record<string, EvidenceType[]> = {
  images: ['image'],
  videos: ['video'],
  reports: ['pdf', 'word'],
  links: ['link'],
  attendance: ['excel'],
  drive: ['drive'],
};

function isWithinUploadRange(uploadTime: number, range: string) {
  if (!range) return true;
  if (!uploadTime) return false;
  const now = new Date();
  const start = new Date(now);
  if (range === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (range === 'week') {
    start.setDate(now.getDate() - 7);
  } else if (range === 'month') {
    start.setDate(now.getDate() - 30);
  }
  return uploadTime >= start.getTime();
}

function matchesTypeFilter(evidence: EvidenceRow, typeFilter: string) {
  if (!typeFilter) return true;
  if (typeFilter === 'document') return ['pdf', 'word', 'excel'].includes(evidence.type);
  if (typeFilter === 'attendance') return evidence.type === 'excel';
  return evidence.type === typeFilter;
}

export function EvidenceLibraryPage() {
  const { user } = useAuth();
  const [evidences, setEvidences] = useState<EvidenceRow[]>([]);
  const [filterOptions, setFilterOptions] = useState<EvidenceFilterOptions>(emptyOptions);
  const [filters, setFilters] = useState<EvidenceFiltersState>(initialFilters);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([getEvidenceRowsByCurrentUser(user), getEvidenceFilterOptions(user)])
      .then(([evidenceRows, options]) => {
        setEvidences(evidenceRows);
        setFilterOptions(options);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải minh chứng.'))
      .finally(() => setLoading(false));
  }, [user]);

  const baseFilteredEvidences = useMemo(() => evidences.filter((evidence) => {
    const keyword = searchQuery.toLowerCase().trim();
    if (keyword && !`${evidence.name} ${evidence.activity}`.toLowerCase().includes(keyword)) return false;
    if (!matchesTypeFilter(evidence, filters.loai_minh_chung)) return false;
    if (filters.ma_nam_hoc && evidence.ma_nam_hoc !== filters.ma_nam_hoc) return false;
    if (filters.ma_don_vi && evidence.ma_don_vi !== filters.ma_don_vi) return false;
    if (filters.ma_loai && evidence.ma_loai !== filters.ma_loai) return false;
    if (!isWithinUploadRange(evidence.uploadTime, filters.ngay_tai_len)) return false;
    return true;
  }), [evidences, filters, searchQuery]);

  const tabs = useMemo(() => evidenceTabConfig.map((tab) => ({
    ...tab,
    count: tab.id === 'all'
      ? baseFilteredEvidences.length
      : baseFilteredEvidences.filter((evidence) => tabTypeMap[tab.id]?.includes(evidence.type)).length,
  })), [baseFilteredEvidences]);

  const filteredEvidences = baseFilteredEvidences.filter((evidence) => {
    if (activeTab === 'all') return true;
    return tabTypeMap[activeTab]?.includes(evidence.type);
  });

  const openEvidenceUrl = (evidence: EvidenceRow) => {
    if (!evidence.url) return;
    window.open(evidence.url, '_blank', 'noopener,noreferrer');
  };

  const copyEvidenceUrl = async (evidence: EvidenceRow) => {
    if (!evidence.url) return;
    try {
      await navigator.clipboard.writeText(evidence.url);
      setMessage('Đã sao chép link minh chứng.');
    } catch {
      setMessage('Không thể sao chép link minh chứng trên trình duyệt hiện tại.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Kho minh chứng</h2>
        <p className="text-sm text-gray-500">
          Thư viện lưu trữ tất cả minh chứng hoạt động Đoàn - Hội
        </p>
      </div>

      {message && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

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
          <button
            onClick={() => setMessage('Chức năng tải lên minh chứng sẽ được thực hiện ở bước sau.')}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
          >
            <Upload className="w-5 h-5" />
            <span>Tải lên</span>
          </button>
        </div>
      </div>

      <EvidenceTabs activeTab={activeTab} tabs={tabs} onTabChange={setActiveTab} />

      <EvidenceFilters
        filters={filters}
        options={filterOptions}
        onFilterChange={(nextFilters) => setFilters((current) => ({ ...current, ...nextFilters }))}
      />

      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {loading ? 'Đang tải minh chứng...' : <>Hiển thị <span className="text-gray-900">{filteredEvidences.length}</span> minh chứng</>}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEvidences.map((evidence) => (
          <EvidenceCard
            key={evidence.id}
            evidence={evidence}
            onView={openEvidenceUrl}
            onDownload={openEvidenceUrl}
            onCopy={copyEvidenceUrl}
          />
        ))}
      </div>

      {!loading && filteredEvidences.length === 0 && (
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
