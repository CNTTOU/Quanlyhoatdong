import type { CurrentUserProfile } from '@/types/firebase';

export function isAuthResolving(
  user: CurrentUserProfile | null,
  loading: boolean,
  authReady: boolean,
) {
  return !authReady || loading;
}
