import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiEdit2, FiTrash2, FiPlay, FiCheck, FiFolder, FiRotateCcw } from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-500/10 dark:bg-red-500/20 border-red-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20';
      case 'Low': return 'text-green-500 bg-green-500/10 dark:bg-green-500/20 border-green-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'border-l-green-500';
      case 'In Progress': return 'border-l-indigo-500';
      default: return 'border-l-amber-500';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dateStr, status) => {
    if (status === 'Completed' || !dateStr) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0,0,0,0);
    return dueDate < today;
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`p-5 rounded-2xl border-l-4 border bg-white dark:bg-slate-800/80 shadow-sm transition-all duration-300 ${getStatusColor(task.status)} border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full`}
    >
      <div>
        {/* Header tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority} Priority
          </span>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full flex items-center gap-1 border border-slate-200 dark:border-slate-800">
            <FiFolder className="w-3 h-3" /> {task.category || 'General'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className={`font-semibold text-slate-800 dark:text-slate-100 text-[15px] mb-1.5 leading-snug ${task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
            {task.description}
          </p>
        )}
      </div>

      <div>
        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-slate-700/50 my-3.5" />

        {/* Footer info & actions */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${isOverdue(task.dueDate, task.status) ? 'text-red-500 animate-pulse' : 'text-slate-400 dark:text-slate-500'}`}>
            <FiClock className="w-3.5 h-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Status actions */}
            {task.status === 'Pending' && (
              <button
                onClick={() => onStatusChange(task._id, 'In Progress')}
                title="Start Task"
                className="p-2 rounded-lg hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
              >
                <FiPlay className="w-4 h-4" />
              </button>
            )}
            {task.status === 'In Progress' && (
              <button
                onClick={() => onStatusChange(task._id, 'Completed')}
                title="Complete Task"
                className="p-2 rounded-lg hover:bg-green-500/10 text-slate-400 hover:text-green-500 transition-colors cursor-pointer"
              >
                <FiCheck className="w-4 h-4" />
              </button>
            )}
            {task.status === 'Completed' && (
              <button
                onClick={() => onStatusChange(task._id, 'Pending')}
                title="Reopen Task"
                className="p-2 rounded-lg hover:bg-amber-500/10 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
              >
                <FiRotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Edit */}
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <FiEdit2 className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(task._id)}
              title="Delete Task"
              className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
