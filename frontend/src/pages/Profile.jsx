import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiAward, FiCheck, FiChevronRight } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'gradient-1');
  const [loading, setLoading] = useState(false);

  const avatars = [
    { id: 'gradient-1', name: 'Cherry Glow', class: 'from-pink-500 to-rose-500' },
    { id: 'gradient-2', name: 'Midnight Violet', class: 'from-purple-600 to-indigo-600' },
    { id: 'gradient-3', name: 'Emerald Wave', class: 'from-emerald-400 to-teal-600' },
    { id: 'gradient-4', name: 'Sunset Burst', class: 'from-amber-400 to-orange-500' },
    { id: 'gradient-5', name: 'Ocean Depth', class: 'from-blue-500 to-indigo-500' },
  ];

  const badgesList = [
    {
      title: '🏅 First Task',
      desc: 'Complete your first task on FocusHub',
      criteria: '1 completion',
      key: '🏅 First Task'
    },
    {
      title: '🔥 7 Day Streak',
      desc: 'Complete at least one task for 7 consecutive days',
      criteria: '7 day streak',
      key: '🔥 7 Day Streak'
    },
    {
      title: '⚡ 50 Tasks Completed',
      desc: 'Reach 50 completed tasks on your dashboard',
      criteria: '50 completions',
      key: '⚡ 50 Tasks Completed'
    },
    {
      title: '👑 Productivity Master',
      desc: 'Achieve a streak of 5 days and 20 tasks completed',
      criteria: '20 completions + 5 day streak',
      key: '👑 Productivity Master'
    }
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.warning('Name cannot be empty');

    try {
      setLoading(true);
      const res = await updateProfile({ name, avatar: selectedAvatar });
      if (res.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarGradient = (avatarId) => {
    const av = avatars.find(a => a.id === avatarId);
    return av ? av.class : 'from-slate-600 to-slate-800';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isBadgeUnlocked = (badgeKey) => {
    return user?.badges?.includes(badgeKey);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      {/* Overview user info */}
      <div className="p-6 md:p-8 rounded-3xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${getAvatarGradient(user?.avatar)} flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-600/10`}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-center md:text-left space-y-1.5">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            {user?.name}
          </h2>
          <p className="text-slate-400 font-semibold text-xs tracking-wider">{user?.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-400 text-xs font-semibold pt-1">
            <FiCalendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>Member since {formatDate(user?.createdAt)}</span>
          </div>
        </div>

        {/* Quick streak info box */}
        <div className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-center">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            Current Streak
          </span>
          <span className="text-2xl font-black text-amber-500">🔥 {user?.streak || 0} Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Update Profile panel */}
        <div className="p-6 rounded-3xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800 space-y-6">
          <h3 className="text-slate-800 dark:text-slate-200 font-bold text-[15px] uppercase tracking-wider">
            Edit Details
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none font-medium text-sm glass-input-light dark:glass-input-dark focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                Select Avatar Profile Style
              </label>
              <div className="grid grid-cols-5 gap-3">
                {avatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`aspect-square rounded-2xl bg-gradient-to-tr ${av.class} relative flex items-center justify-center hover:scale-105 transition-all shadow-md cursor-pointer`}
                    title={av.name}
                  >
                    {selectedAvatar === av.id && (
                      <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center shadow-sm">
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-indigo-600/10 mt-3"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Unlocked Badges / Achievement badges */}
        <div className="p-6 rounded-3xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800 space-y-6">
          <h3 className="text-slate-800 dark:text-slate-200 font-bold text-[15px] uppercase tracking-wider flex items-center gap-1.5">
            <FiAward className="w-4 h-4 text-indigo-500" /> Unlocked Achievements
          </h3>

          <div className="space-y-4">
            {badgesList.map((badge, index) => {
              const unlocked = isBadgeUnlocked(badge.key);
              return (
                <div
                  key={index}
                  className={`p-4.5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                    unlocked
                      ? 'bg-indigo-500/5 border-indigo-500/10 dark:border-indigo-500/20'
                      : 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-50'
                  }`}
                >
                  <div className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center ${
                    unlocked ? 'bg-indigo-600/10' : 'bg-slate-200 dark:bg-slate-800'
                  }`}>
                    {badge.title.split(' ')[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`block font-extrabold text-sm ${unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {badge.title.substring(badge.title.indexOf(' ') + 1)}
                    </span>
                    <span className="block text-slate-400 dark:text-slate-500 text-[11px] font-medium leading-normal mt-0.5">
                      {badge.desc}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      unlocked
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                    }`}>
                      {unlocked ? 'Unlocked' : badge.criteria}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
