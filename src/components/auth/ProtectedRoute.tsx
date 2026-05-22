import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { paths } from "@/routes/paths";
import { AUTH_LOGOUT_FLAG, getLoginUrl } from "@/utils/externalApps";
import { isAuthResolving } from "@/utils/authState";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  anyPermissions?: string[];
  requiredRoles?: string[];
  redirectOnDenied?: string;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  anyPermissions = [],
  requiredRoles = [],
  redirectOnDenied = paths.featured,
}: ProtectedRouteProps) {
  const { user, loading, authReady, authError, hasPermission, hasAnyPermission, hasRole } =
    useAuth();
  const location = useLocation();
  const resolving = isAuthResolving(user, loading, authReady);

  useEffect(() => {
    if (loading || !user) return;
    if (user.bat_buoc_doi_mat_khau || user.trang_thai === "cho_doi_mat_khau") {
      const changePasswordUrl = new URL(
        getLoginUrl("Bạn cần đổi mật khẩu trước khi vào hệ thống."),
      );
      changePasswordUrl.pathname = "/login/doi-mat-khau";
      window.location.replace(changePasswordUrl.toString());
    }
  }, [loading, user]);

  if (resolving) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  if (!user) {
    if (authError) {
      return (
        <div className="min-h-screen grid place-items-center bg-gray-50 px-4 text-gray-700">
          <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-red-700">
              Không thể vào phân hệ quản trị
            </h1>
            <p className="mt-2 text-sm leading-6">{authError}</p>
          </div>
        </div>
      );
    }

    if (sessionStorage.getItem(AUTH_LOGOUT_FLAG)) {
      return (
        <div className="min-h-screen grid place-items-center text-gray-600">
          Đang chuyển sang trang đăng nhập...
        </div>
      );
    }
    return <Navigate to={paths.featured} replace state={{ from: location.pathname }} />;
  }

  if (user.bat_buoc_doi_mat_khau || user.trang_thai === "cho_doi_mat_khau") {
    return (
      <div className="min-h-screen grid place-items-center text-gray-600">
        Đang chuyển sang trang đổi mật khẩu...
      </div>
    );
  }

  const missingRequiredPermission = requiredPermissions.some(
    (permission) => !hasPermission(permission),
  );
  const missingAnyPermission =
    anyPermissions.length > 0 && !hasAnyPermission(anyPermissions);
  const missingRole =
    requiredRoles.length > 0 && !requiredRoles.some((role) => hasRole(role));

  if (missingRequiredPermission || missingAnyPermission || missingRole) {
    return <Navigate to={redirectOnDenied} replace />;
  }

  return <>{children}</>;
}
