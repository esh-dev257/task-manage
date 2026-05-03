import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, CheckSquare, Bell, Search } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'TaskFlow';

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col shrink-0" style={{ background: 'rgba(20, 6, 46, 0.95)', borderRight: '1px solid rgba(139,92,246,0.15)' }}>
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <CheckSquare size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">TaskFlow</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="text-[10px] font-semibold text-purple-600 uppercase tracking-widest px-3 mb-3">Menu</p>
          {[
            { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
            { to: '/projects',  label: 'Projects',  Icon: FolderKanban },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-purple-400 hover:text-purple-200'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.3))', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 4px 15px rgba(124,58,237,0.2)' }
                : { border: '1px solid transparent' }
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2" style={{ background: 'rgba(88,28,135,0.2)' }}>
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
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-purple-400 hover:text-red-400 rounded-xl transition-colors"
            style={{ border: '1px solid transparent' }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 shrink-0" style={{ background: 'rgba(15, 5, 32, 0.9)', borderBottom: '1px solid rgba(139,92,246,0.15)', backdropFilter: 'blur(10px)' }}>
          <div>
            <h1 className="text-base font-bold text-white">{pageTitle}</h1>
            <p className="text-xs text-purple-500">{today}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors" style={{ background: 'rgba(88,28,135,0.2)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <Search size={15} />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-400 hover:text-purple-200 transition-colors relative" style={{ background: 'rgba(88,28,135,0.2)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(160deg, #0f0520 0%, #1a0535 50%, #0f0520 100%)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
