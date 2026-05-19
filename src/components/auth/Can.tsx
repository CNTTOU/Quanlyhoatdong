import { useAuth } from '@/contexts/AuthContext';

interface CanProps {
  permission?: string;
  any?: string[];
  role?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ permission, any = [], role, children, fallback = null }: CanProps) {
  const auth = useAuth();
  const allowed =
    (!permission || auth.hasPermission(permission)) &&
    (any.length === 0 || auth.hasAnyPermission(any)) &&
    (!role || auth.hasRole(role));

  return allowed ? <>{children}</> : <>{fallback}</>;
}
