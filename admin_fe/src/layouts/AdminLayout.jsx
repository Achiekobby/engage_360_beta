import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import AdminFooter from '../components/layout/AdminFooter';
import AdminNavbar from '../components/layout/AdminNavbar';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeMobileMenu, toggleMobileMenu, toggleSidebar } from '../store/slices/navSlice';

export default function AdminLayout({ children }) {
  const dispatch = useAppDispatch();
  const mobileMenuOpen = useAppSelector((state) => state.nav.mobileMenuOpen);
  const sidebarCollapsed = useAppSelector((state) => state.nav.sidebarCollapsed);
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [pathname, dispatch]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#F6F7FB] text-foreground">
      <AdminNavbar
        menuOpen={mobileMenuOpen}
        onToggleMenu={() => dispatch(toggleMobileMenu())}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={clsx(
            'hidden h-full shrink-0 overflow-hidden border-r border-[#EEF0F4] transition-[width] duration-300 ease-out motion-reduce:transition-none lg:block',
            sidebarCollapsed ? 'w-[76px]' : 'w-[272px]',
          )}
        >
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => dispatch(toggleSidebar())}
          />
        </aside>

        {mobileMenuOpen ? (
          <div className="fixed inset-x-0 bottom-0 top-16 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-[#0B1354]/40"
              aria-label="Close menu"
              onClick={() => dispatch(closeMobileMenu())}
            />
            <div className="relative flex h-full w-[min(100%,288px)] flex-col bg-white shadow-xl">
              <AdminSidebar onNavigate={() => dispatch(closeMobileMenu())} />
            </div>
          </div>
        ) : null}

        <main data-admin-scroll className="scrollbar-thin min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full flex-col">
            <div className="flex-1">{children}</div>
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
