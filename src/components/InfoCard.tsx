import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

export function InfoCard({ title, icon: Icon, children, className = '' }: InfoCardProps) {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <h3 className="text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
