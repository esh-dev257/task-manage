import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, CheckSquare, Menu, X } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'TaskFlow';

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFC' }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(15,23,42,0.4)' }} onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0F172A', borderRight: '1px solid #1E293B' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #1E293B' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#2563EB' }}>
              <CheckSquare size={14} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">TaskFlow</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1 rounded-md transition-colors hover:bg-white/10" style={{ color: '#64748B' }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 mb-3" style={{ color: '#475569' }}>Navigation</p>
          {[
            { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
            { to: '/projects',  label: 'Projects',  Icon: FolderKanban },
          ].map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-white' : 'hover:bg-white/5'}`
              }
              style={({ isActive }) => isActive
                ? { background: '#1E293B', color: '#ffffff' }
                : { color: '#94A3B8' }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} style={{ color: isActive ? '#2563EB' : '#64748B' }} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid #1E293B' }}>
          <div className="flex items-center gap-2.5 px-3 py-3 rounded-lg mt-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 text-white"
              style={{ background: '#2563EB' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-[11px] truncate" style={{ color: '#64748B' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all hover:bg-white/5"
            style={{ color: '#64748B' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F87171'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0"
          style={{ background: '#ffffff', borderBottom: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-50"
              style={{ border: '1px solid #E2E8F0', color: '#64748B' }}>
              <Menu size={15} />
            </button>
            <div>
              <h1 className="text-sm font-semibold" style={{ color: '#0F172A' }}>{pageTitle}</h1>
              <p className="text-[11px] hidden sm:block" style={{ color: '#94A3B8' }}>{today}</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white"
            style={{ background: '#2563EB' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
