import { auth } from '@/lib/firebase';

type GatewayResponse<T> = {
  ok: boolean;
  data?: T;
  message?: string;
};

const apiBase = (import.meta.env.VITE_GATEWAY_API_BASE ?? '').replace(/\/$/, '');

export async function gatewayRequest<T>(path: string, body: unknown): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');

  const token = await user.getIdToken();
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Không thể kết nối gateway. Vui lòng kiểm tra mạng, đăng nhập lại hoặc thử tải lại trang.');
  }
  const payload = (await response.json().catch(() => ({}))) as GatewayResponse<T>;
  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || 'Gateway xử lý thất bại.');
  }
  return payload.data as T;
}
