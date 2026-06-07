import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiDownload,
  FiInbox,
  FiTrendingUp,
  FiActivity,
  FiClock,
  FiCheckCircle,
  FiLoader
} from 'react-icons/fi';

import StatsCard from '../components/StatsCard';
import ProductivityChart from '../components/ProductivityChart';
import KanbanBoard from '../components/KanbanBoard';
import AIInput from '../components/AIInput';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { user, refreshProfile } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    weeklyProductivity: []
  });

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('Latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('kanban'); // 'list' or 'kanban'

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        search,
        sortBy,
      };
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await API.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.data);
        setStats(res.data.analytics);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter, sortBy]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTasks();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateTask = async (taskData) => {
    try {
      const res = await API.post('/tasks', taskData);
      if (res.data.success) {
        toast.success('Task created successfully! ✨');
        setIsModalOpen(false);
        fetchTasks();
        refreshProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const res = await API.put(`/tasks/${selectedTask._id}`, taskData);
      if (res.data.success) {
        toast.success('Task updated successfully!');
        setIsModalOpen(false);
        setSelectedTask(null);
        fetchTasks();
        refreshProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Task status updated to ${newStatus}`);
        fetchTasks();
        refreshProfile();
      }
    } catch (err) {
      toast.error('Failed to change task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        const res = await API.delete(`/tasks/${taskId}`);
        if (res.data.success) {
          toast.success('Task deleted successfully');
          fetchTasks();
          refreshProfile();
        }
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const openAddModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Productivity Score circular calculation
  const productivityScore = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  // CSV Exporter
  const handleExportCSV = () => {
    if (tasks.length === 0) {
      return toast.info('No tasks to export');
    }
    const headers = ['Title', 'Description', 'Priority', 'Status', 'Due Date', 'Category'];
    const rows = tasks.map(t => [
      t.title,
      t.description || '',
      t.priority,
      t.status,
      t.dueDate ? t.dueDate.split('T')[0] : '',
      t.category
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `focushub_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully! 📂');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Productivity Score Wheel */}
        <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800 flex items-center justify-between xl:col-span-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-400 uppercase">
                Productivity Engine
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
              Your Daily Target Score
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[280px]">
              Keep completing tasks on time to boost your productivity index score and maintain your streak.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-500 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - productivityScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-50">{productivityScore}%</span>
              <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 tracking-widest uppercase">Score</span>
            </div>
          </div>
        </div>

        {/* Streak card */}
        <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden xl:col-span-2">
          {/* Flame glowing background */}
          <div className="absolute top-[-20px] right-[-20px] w-28 h-28 rounded-full filter blur-[50px] opacity-15 dark:opacity-25 bg-amber-500" />
          
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="text-xs font-bold tracking-widest uppercase">🔥 Daily Streak</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight font-sans mt-2">
              {user?.streak || 0} Days Running
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">
              {user?.streak && user.streak > 0 
                ? "Excellent! Complete at least one task tomorrow to keep the flame alive!"
                : "Complete a task today to kickstart your productivity streak!"}
            </p>
          </div>

          <div className="flex gap-1.5 mt-5">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
              const currentDay = new Date().getDay();
              const isActive = user?.streak && user.streak > 0 && idx <= currentDay;
              return (
                <div
                  key={idx}
                  className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-sm shadow-amber-500/5'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Advanced Animated Counters Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard title="Total Tasks" value={stats.totalTasks} icon={<FiActivity className="w-5 h-5" />} color="#6366F1" />
        <StatsCard title="Completed" value={stats.completedTasks} icon={<FiCheckCircle className="w-5 h-5" />} color="#22C55E" />
        <StatsCard title="In Progress" value={stats.inProgressTasks} icon={<FiLoader className="w-5 h-5" />} color="#06B6D4" />
        <StatsCard title="Pending" value={stats.pendingTasks} icon={<FiClock className="w-5 h-5" />} color="#F59E0B" />
      </div>

      {/* Smart Task Input bar */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[12px] font-bold tracking-widest text-slate-400 uppercase">AI Task Engine</span>
        </div>
        <AIInput onAddTask={handleCreateTask} />
      </div>

      {/* Task Filters & Operations Panel */}
      <div className="flex flex-col gap-5 p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left search */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <FiSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title..."
              className="w-full pl-11 pr-4 py-3 rounded-xl outline-none text-sm transition-all glass-input-light dark:glass-input-dark focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Right quick controls */}
          <div className="flex items-center gap-3.5 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Kanban Board View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-800 text-indigo-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="List View"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>

            {/* CSV export */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FiDownload className="w-4 h-4 text-indigo-500" /> Export CSV
            </button>

            {/* Create manually */}
            <button
              onClick={openAddModal}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/15 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Extended drop filters */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <FiFilter className="w-3.5 h-3.5" /> Filters
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl outline-none font-semibold text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 cursor-pointer focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl outline-none font-semibold text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 cursor-pointer focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl outline-none font-semibold text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 cursor-pointer focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
              <option value="Due Date">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Visualizations list/kanban */}
      <div>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <FiLoader className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-xs font-semibold text-slate-400">Loading your board...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-6 glass-card-light dark:glass-card-dark">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center mb-4">
              <FiInbox className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
              🚀 Ready to get productive?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-xs mt-2 leading-relaxed">
              Create your first task using the quick manual inputs or type it into the AI engine. Let's make progress!
            </p>
            <button
              onClick={openAddModal}
              className="mt-6 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
            >
              Create First Task
            </button>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={tasks}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 disabled:opacity-40 transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Productivity Charts Analytics section */}
      {!loading && (
        <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[12px] font-bold tracking-widest text-slate-400 uppercase">Productivity Analytics</span>
          </div>
          <ProductivityChart tasks={tasks} weeklyData={stats.weeklyProductivity} />
        </div>
      )}

      {/* Task form Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
