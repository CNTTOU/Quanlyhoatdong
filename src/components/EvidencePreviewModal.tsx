import { Download, ExternalLink, FileText, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { EvidenceType } from '@/services/evidenceService';

type PreviewEvidence = {
  name: string;
  type: EvidenceType;
  url?: string;
  size?: string;
};

type EvidencePreviewModalProps = {
  evidence: PreviewEvidence | null;
  onClose: () => void;
  onDownload: (evidence: PreviewEvidence) => void;
};

function getFileExtension(evidence: PreviewEvidence) {
  const urlPath = evidence.url?.split('?')[0] || '';
  const namePath = evidence.name || '';
  return `${namePath}.${urlPath}`.toLowerCase();
}

function getOfficeViewerUrl(url: string) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
}

export function getEvidenceDownloadUrl(url: string) {
  if (!url.includes('res.cloudinary.com') || url.includes('/upload/fl_attachment/')) return url;
  return url.replace('/upload/', '/upload/fl_attachment/');
}

function getPreviewKind(evidence: PreviewEvidence) {
  const extensionSource = getFileExtension(evidence);
  if (evidence.type === 'image') return 'image';
  if (evidence.type === 'pdf' || extensionSource.includes('.pdf')) return 'pdf';
  if (evidence.type === 'word' || /\.(doc|docx)\b/.test(extensionSource)) return 'office';
  if (evidence.type === 'excel' || /\.(xls|xlsx)\b/.test(extensionSource)) return 'office';
  if (extensionSource.includes('.csv')) return 'text';
  return 'external';
}

export function EvidencePreviewModal({ evidence, onClose, onDownload }: EvidencePreviewModalProps) {
  if (!evidence?.url) return null;

  const previewKind = getPreviewKind(evidence);
  const previewUrl = previewKind === 'office' ? getOfficeViewerUrl(evidence.url) : evidence.url;
  const downloadUrl = getEvidenceDownloadUrl(evidence.url);
  const canEmbed = ['pdf', 'office', 'text'].includes(previewKind);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 p-4">
      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-gray-900">{evidence.name || 'Minh chứng'}</h3>
            <p className="mt-1 text-xs text-gray-500">{evidence.size || 'Không rõ dung lượng'}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onDownload({ ...evidence, url: downloadUrl })}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <Download className="h-4 w-4" />
              <span>Tải về</span>
            </button>
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Mở gốc</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-gray-100">
          {previewKind === 'image' ? (
            <div className="flex h-full items-center justify-center p-4">
              <ImageWithFallback
                src={evidence.url}
                alt={evidence.name}
                className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
              />
            </div>
          ) : canEmbed ? (
            <iframe
              title={evidence.name}
              src={previewUrl}
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                <FileText className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                <h4 className="mb-2 text-gray-900">Không có bản xem trước</h4>
                <p className="text-sm text-gray-500">File này cần mở ở tab mới hoặc tải về để xem.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
