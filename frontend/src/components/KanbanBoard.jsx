import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowRight, FiArrowLeft, FiCheck, FiFolder } from 'react-icons/fi';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const columns = [
    { id: 'Pending', name: 'Pending', color: 'border-t-amber-500 bg-amber-500/5', titleColor: 'text-amber-500 bg-amber-500/10' },
    { id: 'In Progress', name: 'In Progress', color: 'border-t-indigo-500 bg-indigo-500/5', titleColor: 'text-indigo-500 bg-indigo-500/10' },
    { id: 'Completed', name: 'Completed', color: 'border-t-green-500 bg-green-500/5', titleColor: 'text-green-500 bg-green-500/10' }
  ];

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, targetStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onStatusChange(taskId, targetStatus);
    }
  };

  const getColTasks = (colId) => tasks.filter(t => t.status === colId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(col => {
        const colTasks = getColTasks(col.id);

        return (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col min-h-[500px] rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/20 backdrop-blur-md p-4 transition-all duration-200`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${col.titleColor}`}>
                  {col.name}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Tasks Area */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-1">
              {colTasks.length > 0 ? (
                colTasks.map(task => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                ))
              ) : (
                <div className="h-44 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center p-4">
                  <FiAlertCircle className="w-5 h-5 text-slate-400 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Drag tasks here
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
