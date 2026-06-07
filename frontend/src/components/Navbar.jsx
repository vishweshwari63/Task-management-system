import React, { useContext } from 'react';
import { FiMenu, FiCheckSquare, FiCalendar } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ onToggleSidebar, pageTitle }) => {
  const { user } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/50 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden text-slate-600 dark:text-slate-300 cursor-pointer"
          aria-label="Toggle menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <h1 className="font-extrabold text-[18px] md:text-[20px] text-slate-950 dark:text-slate-50 tracking-tight hidden md:block">
          {pageTitle}
        </h1>
      </div>

      {/* Stats/Greeting section */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold text-xs border border-slate-200/60 dark:border-slate-800 px-3.5 py-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
          <FiCalendar className="w-4 h-4 text-indigo-500" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* User Greeting */}
        {user && (
          <div className="text-right">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
              Welcome back
            </span>
            <span className="block font-extrabold text-[13px] md:text-sm text-slate-800 dark:text-slate-200 mt-1">
              {getGreeting()}, {user.name.split(' ')[0]} 👋
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
