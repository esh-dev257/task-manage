import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, CheckSquare, Bell, Menu, X } from 'lucide-react';

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
    <div className="flex h-screen overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'rgba(12, 4, 30, 0.98)', borderRight: '1px solid rgba(139,92,246,0.15)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>
              <CheckSquare size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">TaskFlow</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-purple-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="text-[10px] font-bold text-purple-700 uppercase tracking-[0.15em] px-3 mb-4">Navigation</p>
          {[
            { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
            { to: '/projects',  label: 'Projects',  Icon: FolderKanban },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'text-white' : 'text-purple-400 hover:text-purple-200 hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.45), rgba(168,85,247,0.25))', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 4px 15px rgba(124,58,237,0.2)' }
                : { border: '1px solid transparent' }
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(139,92,246,0.12)' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mt-3 mb-1" style={{ background: 'rgba(88,28,135,0.18)', border: '1px solid rgba(139,92,246,0.12)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-purple-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-purple-400 hover:text-red-400 rounded-xl transition-all hover:bg-red-500/8"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0" style={{ background: 'rgba(12, 4, 30, 0.92)', borderBottom: '1px solid rgba(139,92,246,0.12)', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors"
              style={{ background: 'rgba(88,28,135,0.2)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <Menu size={17} />
            </button>
            <div>
              <h1 className="text-sm md:text-base font-bold text-white">{pageTitle}</h1>
              <p className="text-[11px] text-purple-500 hidden sm:block">{today}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors relative"
              style={{ background: 'rgba(88,28,135,0.2)', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-default"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(160deg, #0a0218 0%, #150430 50%, #0a0218 100%)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
