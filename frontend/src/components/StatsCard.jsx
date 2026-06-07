import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="p-5 rounded-2xl relative overflow-hidden transition-all duration-300 shadow-sm glass-card-light dark:glass-card-dark flex items-center justify-between border border-slate-200/50 dark:border-slate-800"
    >
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[40px] opacity-10 dark:opacity-20 bg-${color}-500`} style={{ background: color }} />

      <div className="flex flex-col gap-1 z-10">
        <span className="text-[12px] font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-sans mt-1">
          {value}
        </span>
      </div>

      <div className="p-3.5 rounded-xl z-10 text-white flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)` }}>
        {icon}
      </div>
    </motion.div>
  );
};

export default StatsCard;
