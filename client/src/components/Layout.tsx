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
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0f0f0' }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#1A3BFF', borderRight: '2px solid #0a0a0a' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '2px solid rgba(255,255,255,0.15)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#C8FF00' }}>
              <CheckSquare size={15} style={{ color: '#0a0a0a' }} />
            </div>
            <span className="font-black text-lg tracking-tight text-white">TaskFlow</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1 rounded-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] px-4 mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Menu</p>
          {[
            { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
            { to: '/projects',  label: 'Projects',  Icon: FolderKanban },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive ? '' : 'hover:bg-white/10'}`
              }
              style={({ isActive }) => isActive
                ? { background: '#C8FF00', color: '#0a0a0a' }
                : { color: 'rgba(255,255,255,0.85)' }
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4" style={{ borderTop: '2px solid rgba(255,255,255,0.15)' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mt-3 mb-1" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0"
              style={{ background: '#C8FF00', color: '#0a0a0a' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user?.name}</p>
              <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold rounded-xl transition-all hover:bg-red-500"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0"
          style={{ background: '#ffffff', borderBottom: '2px solid #0a0a0a' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ border: '2px solid #0a0a0a', color: '#0a0a0a' }}>
              <Menu size={17} />
            </button>
            <div>
              <h1 className="text-sm md:text-base font-black" style={{ color: '#0a0a0a' }}>{pageTitle}</h1>
              <p className="text-[11px] hidden sm:block" style={{ color: '#888888' }}>{today}</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: '#C8FF00', color: '#0a0a0a', border: '2px solid #0a0a0a' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: '#f0f0f0' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
