import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { navigationItems } from '@/routes/navigation';

function getActivePage(pathname: string) {
  const activeItem = navigationItems
    .filter((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];

  return activeItem?.id ?? 'dashboard';
}

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageId: string) => {
    const item = navigationItems.find((navItem) => navItem.id === pageId);

    if (item) {
      navigate(item.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activePage={getActivePage(location.pathname)} onPageChange={handlePageChange} />
      <Header />

      <main className="ml-64 pt-16">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
