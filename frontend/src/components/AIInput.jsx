import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiCpu, FiPlus } from 'react-icons/fi';

const parseSmartTask = (input) => {
  let text = input.trim();
  let priority = 'Medium';
  let dueDate = null;
  const today = new Date();

  // 1. Priority parsing
  const lowRegex = /\b(low|easy|minor|backlog)\b/i;
  const highRegex = /\b(high|urgent|asap|critical|important)\b/i;
  const mediumRegex = /\b(medium|normal|moderate)\b/i;

  if (highRegex.test(text)) {
    priority = 'High';
    text = text.replace(highRegex, '');
  } else if (lowRegex.test(text)) {
    priority = 'Low';
    text = text.replace(lowRegex, '');
  } else if (mediumRegex.test(text)) {
    priority = 'Medium';
    text = text.replace(mediumRegex, '');
  }

  // Clean priority helper phrases
  text = text.replace(/\b(priority)\b/i, '');

  // 2. Date parsing
  if (/\btomorrow\b/i.test(text)) {
    const d = new Date();
    d.setDate(today.getDate() + 1);
    dueDate = d;
    text = text.replace(/\btomorrow\b/i, '');
  } else if (/\btoday\b/i.test(text)) {
    dueDate = today;
    text = text.replace(/\btoday\b/i, '');
  } else {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayMatch = text.match(/\b(next|by|on)?\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i);
    if (dayMatch) {
      const dayName = dayMatch[2].toLowerCase();
      const targetDayIndex = daysOfWeek.indexOf(dayName);
      const currentDayIndex = today.getDay();
      
      let daysToAdd = targetDayIndex - currentDayIndex;
      if (daysToAdd <= 0) daysToAdd += 7;
      
      const d = new Date();
      d.setDate(today.getDate() + daysToAdd);
      dueDate = d;
      
      text = text.replace(dayMatch[0], '');
    }
  }

  // Default to tomorrow if not found
  if (!dueDate) {
    const d = new Date();
    d.setDate(today.getDate() + 1);
    dueDate = d;
  }

  // Cleaning prepositions
  text = text.replace(/\s+(by|on|at|for|in|as)\s*$/i, '');
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  } else {
    text = "New Focus Task";
  }

  return {
    title: text,
    priority,
    dueDate: dueDate.toISOString().split('T')[0]
  };
};

const AIInput = ({ onAddTask }) => {
  const [inputVal, setInputVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const parsed = inputVal ? parseSmartTask(inputVal) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    const taskDetails = parseSmartTask(inputVal);
    onAddTask({
      ...taskDetails,
      description: 'Created using FocusHub AI Smart Task Creator.',
      category: 'Work',
      status: 'Pending'
    });
    setInputVal('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-indigo-500 dark:text-indigo-400">
            <FiCpu className="w-5 h-5 animate-pulse" />
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="AI Smart Task Creator: 'Launch marketing plan by Friday as high priority'..."
            className="w-full pl-12 pr-28 py-4 rounded-2xl outline-none transition-all duration-300 font-medium text-[15px] shadow-sm glass-input-light dark:glass-input-dark focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <FiPlus className="w-4 h-4" /> Create
          </button>
        </div>
      </form>

      <AnimatePresence>
        {inputVal.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <span>✨ AI Assisted Preview</span>
                </div>
                <h4 className="text-slate-800 dark:text-slate-200 font-semibold text-sm line-clamp-1">
                  {parsed?.title}
                </h4>
              </div>

              <div className="flex items-center gap-3">
                {/* Priority badge */}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-medium">Priority</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                    parsed?.priority === 'High' ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20' :
                    parsed?.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20' :
                    'bg-green-500/10 text-green-500 dark:bg-green-500/20'
                  }`}>
                    {parsed?.priority}
                  </span>
                </div>

                {/* Due Date badge */}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-medium">Due Date</span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full mt-0.5">
                    {parsed?.dueDate}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInput;
