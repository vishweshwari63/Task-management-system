import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FiGrid, FiUser, FiLogOut, FiCheckSquare, FiAward } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Maps avatar ID to CSS gradient
  const getAvatarGradient = (avatarId) => {
    switch (avatarId) {
      case 'gradient-1': return 'from-pink-500 to-rose-500';
      case 'gradient-2': return 'from-purple-600 to-indigo-600';
      case 'gradient-3': return 'from-emerald-400 to-teal-600';
      case 'gradient-4': return 'from-amber-400 to-orange-500';
      case 'gradient-5': return 'from-blue-500 to-indigo-500';
      default: return 'from-slate-600 to-slate-800';
    }
  };

  const navLinks = [
    { to: '/', name: 'Dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { to: '/profile', name: 'Profile & Badges', icon: <FiUser className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <FiCheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-[17px] text-slate-800 dark:text-slate-50 tracking-tight font-sans">
                FOCUSHUB
              </span>
              <span className="block text-[9px] font-bold text-indigo-500 dark:text-indigo-400 tracking-widest uppercase">
                SaaS PLATFORM
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200'
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card & Toggle */}
        <div className="space-y-5">
          {/* Theme Switcher & Info */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800/60">
              {/* Custom Avatar Gradient */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                  user.avatar
                )} flex items-center justify-center text-white font-black text-sm shadow-sm`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
                  {user.name}
                </span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate font-semibold">
                  {user.email}
                </span>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 text-sm font-bold transition-all cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
