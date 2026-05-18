import {
  Eye,
  Download,
  Copy,
  Image as ImageIcon,
  Video,
  FileText,
  Link as LinkIcon,
  File,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Evidence {
  id: number;
  name: string;
  type: 'image' | 'video' | 'pdf' | 'word' | 'excel' | 'link' | 'drive';
  thumbnail?: string;
  activity: string;
  uploadDate: string;
  size?: string;
  url?: string;
}

interface EvidenceCardProps {
  evidence: Evidence;
}

const typeConfig = {
  image: {
    icon: ImageIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    label: 'Hình ảnh',
  },
  video: {
    icon: Video,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    label: 'Video',
  },
  pdf: {
    icon: FileText,
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'PDF',
  },
  word: {
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    label: 'Word',
  },
  excel: {
    icon: File,
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: 'Excel',
  },
  link: {
    icon: LinkIcon,
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
    label: 'Link',
  },
  drive: {
    icon: LinkIcon,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    label: 'Drive',
  },
};

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  const config = typeConfig[evidence.type];
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Thumbnail or Icon */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {evidence.thumbnail ? (
          <ImageWithFallback
            src={evidence.thumbnail}
            alt={evidence.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${config.bg}`}>
            <Icon className={`w-16 h-16 ${config.color}`} />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 ${config.bg} ${config.color} rounded-full text-xs backdrop-blur-sm border border-white/50`}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">{evidence.name}</h4>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Hoạt động:</span>
            <span className="text-xs text-gray-700 line-clamp-1">{evidence.activity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{evidence.uploadDate}</span>
            {evidence.size && <span className="text-xs text-gray-500">{evidence.size}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            <Eye className="w-4 h-4" />
            <span>Xem</span>
          </button>
          <button className="flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
