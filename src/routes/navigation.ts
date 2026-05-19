import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Database,
  CheckSquare,
  BarChart3,
  Settings,
  Award,
  FileEdit,
  Archive,
} from 'lucide-react';
import type { NavigationItem } from '@/types/navigation';
import { paths } from './paths';

export const navigationItems: NavigationItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan', path: paths.dashboard },
  { id: 'featured', icon: Award, label: 'Hoạt động nổi bật', path: paths.featured },
  { id: 'calendar', icon: Calendar, label: 'Lịch hoạt động', path: paths.calendar, requiredPermissions: ['xem_hoat_dong'] },
  { id: 'activities', icon: Calendar, label: 'Quản lý hoạt động', path: paths.activities, requiredPermissions: ['xem_hoat_dong'] },
  { id: 'add', icon: PlusCircle, label: 'Thêm hoạt động', path: paths.activityNew, requiredPermissions: ['them_hoat_dong'] },
  { id: 'evidence', icon: Database, label: 'Kho minh chứng', path: paths.evidences, requiredPermissions: ['quan_ly_minh_chung'] },
  { id: 'approval', icon: CheckSquare, label: 'Duyệt hoạt động', path: paths.approval, requiredPermissions: ['duyet_hoat_dong'] },
  { id: 'reports', icon: BarChart3, label: 'Thống kê báo cáo', path: paths.reports, anyPermissions: ['xem_bao_cao', 'tao_bao_cao'] },
  { id: 'report-builder', icon: FileEdit, label: 'Tạo báo cáo', path: paths.reportBuilder, requiredPermissions: ['tao_bao_cao'] },
  { id: 'archive', icon: Archive, label: 'Lưu trữ năm học', path: paths.archive, anyPermissions: ['tao_goi_luu_tru', 'xoa_du_lieu_nam_hoc'] },
  { id: 'settings', icon: Settings, label: 'Cài đặt', path: paths.settings, requiredPermissions: ['cai_dat_he_thong'] },
];
