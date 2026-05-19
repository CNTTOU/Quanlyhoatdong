export const AUTH_LOGOUT_FLAG = "auth_logout";

function normalizeLoginBase(loginAppUrl: string) {
  const trimmed = loginAppUrl.replace(/\/+$/, "");
  return `${trimmed}/`;
}

export function getLoginUrl(
  reason?: string,
  redirectOverride?: string | false,
) {
  const loginAppUrl = normalizeLoginBase(
    import.meta.env.VITE_LOGIN_APP_URL || "/login",
  );
  const url = new URL(loginAppUrl, window.location.origin);

  if (redirectOverride === false) {
    // Không gắn redirect (dùng khi đăng xuất).
  } else if (redirectOverride !== undefined) {
    if (redirectOverride) url.searchParams.set("redirect", redirectOverride);
  } else {
    const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    url.searchParams.set("redirect", redirect);
  }

  if (reason) url.searchParams.set("reason", reason);
  return url.toString();
}

export function goToLogin(reason?: string, redirectOverride?: string | false) {
  window.location.replace(getLoginUrl(reason, redirectOverride));
}

export function goToLoginAfterLogout() {
  sessionStorage.setItem(AUTH_LOGOUT_FLAG, "1");
  const url = new URL(
    normalizeLoginBase(import.meta.env.VITE_LOGIN_APP_URL || "/login"),
    window.location.origin,
  );
  url.searchParams.set("logout", "1");
  url.searchParams.set("reason", "Bạn đã đăng xuất.");
  window.location.replace(url.toString());
}
