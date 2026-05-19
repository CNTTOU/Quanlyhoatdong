import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  requiredPermissions?: string[];
  anyPermissions?: string[];
}
