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
    <div className="flex h-screen overflow-hidden" style={{ background: '#f5f3ff' }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(30,16,70,0.4)', backdropFilter: 'blur(4px)' }} onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#ffffff', borderRight: '1px solid #ede9fe', boxShadow: '4px 0 24px rgba(124,58,237,0.06)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #ede9fe' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}>
              <CheckSquare size={15} className="text-white" />
            </div>
            <span className="font-black text-lg tracking-tight" style={{ color: '#1e1038' }}>TaskFlow</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-1 rounded-lg transition-colors hover:bg-purple-50" style={{ color: '#a78bfa' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] px-4 mb-4" style={{ color: '#c4b5fd' }}>Menu</p>
          {[
            { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
            { to: '/projects',  label: 'Projects',  Icon: FolderKanban },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? 'text-white' : 'hover:bg-purple-50'}`
              }
              style={({ isActive }) => isActive
                ? { background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: 'white', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }
                : { color: '#7c3aed' }
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid #ede9fe' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mt-3 mb-1" style={{ background: '#f5f3ff' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: '#1e1038' }}>{user?.name}</p>
              <p className="text-[11px] truncate" style={{ color: '#a78bfa' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all hover:bg-red-50"
            style={{ color: '#a78bfa' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0" style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #ede9fe', backdropFilter: 'blur(16px)', boxShadow: '0 1px 12px rgba(124,58,237,0.06)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-purple-50"
              style={{ border: '1px solid #ede9fe', color: '#7c3aed' }}
            >
              <Menu size={17} />
            </button>
            <div>
              <h1 className="text-sm md:text-base font-bold" style={{ color: '#1e1038' }}>{pageTitle}</h1>
              <p className="text-[11px] hidden sm:block" style={{ color: '#c4b5fd' }}>{today}</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: '#f5f3ff' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
