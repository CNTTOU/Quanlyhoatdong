import { Save, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSystemSettings, updateSystemSettings, type SystemSettings } from '@/services/settingService';

function getGoogleDriveFileId(url: string) {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/) ?? url.match(/[?&]id=([^&]+)/);
  return match?.[1] ?? '';
}

function normalizeImageUrl(url: string) {
  const trimmedUrl = url.trim();
  const driveFileId = getGoogleDriveFileId(trimmedUrl);
  if (driveFileId) return `https://lh3.googleusercontent.com/d/${driveFileId}=w1000`;
  return trimmedUrl;
}

function getImageUrlCandidates(url: string) {
  const trimmedUrl = url.trim();
  const driveFileId = getGoogleDriveFileId(trimmedUrl);
  if (!driveFileId) return [trimmedUrl];
  return [
    `https://lh3.googleusercontent.com/d/${driveFileId}=w1000`,
    `https://drive.google.com/uc?export=view&id=${driveFileId}`,
    `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1000`,
  ];
}

function LogoPreview({ logoUrl }: { logoUrl: string }) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const candidates = getImageUrlCandidates(logoUrl);
  const src = candidates[candidateIndex] ?? '';

  useEffect(() => {
    setCandidateIndex(0);
  }, [logoUrl]);

  if (!src) return <ImageIcon className="w-12 h-12 text-white" />;

  return (
    <img
      src={src}
      alt="Logo hệ thống"
      className="h-full w-full object-contain"
      onError={() => setCandidateIndex((current) => current + 1)}
    />
  );
}

export function SystemInfoTab() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSystemSettings()
      .then(setSettings)
      .catch((error) => setMessage(error instanceof Error ? error.message : 'Không thể tải cài đặt hệ thống.'));
  }, []);

  function updateField(field: keyof SystemSettings, value: string) {
    setSettings((current) => current ? { ...current, [field]: value } : current);
  }

  async function handleSave() {
    if (!settings) return;
    if (!settings.ten_he_thong || !settings.ten_don_vi) {
      setMessage('Vui lòng nhập tên hệ thống và tên đơn vị.');
      return;
    }
    if (!settings.email_lien_he) {
      setMessage('Vui lòng nhập email liên hệ.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await updateSystemSettings({
        ...settings,
        logo_url: normalizeImageUrl(settings.logo_url),
      });
      setSettings((current) => current ? { ...current, logo_url: normalizeImageUrl(current.logo_url) } : current);
      setMessage('Đã lưu cài đặt hệ thống.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu cài đặt hệ thống.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {message && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{message}</div>}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-gray-900 mb-6">Thông tin cơ bản</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Tên hệ thống <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={settings?.ten_he_thong ?? ''}
              onChange={(event) => updateField('ten_he_thong', event.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Logo hệ thống</label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 flex items-center justify-center">
                {settings?.logo_url ? (
                  <LogoPreview logoUrl={settings.logo_url} />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <input
                type="url"
                value={settings?.logo_url ?? ''}
                onChange={(event) => updateField('logo_url', event.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Tên đơn vị <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={settings?.ten_don_vi ?? ''}
              onChange={(event) => updateField('ten_don_vi', event.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email liên hệ <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={settings?.email_lien_he ?? ''}
              onChange={(event) => updateField('email_lien_he', event.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Mô tả ngắn</label>
            <textarea
              rows={3}
              value={settings?.mo_ta ?? ''}
              onChange={(event) => updateField('mo_ta', event.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving || !settings} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60">
          <Save className="w-5 h-5" />
          <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
        </button>
      </div>
    </div>
  );
}
