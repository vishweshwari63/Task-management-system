import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  Legend
} from 'recharts';

const ProductivityChart = ({ tasks, weeklyData }) => {
  // 1. Pie Chart: Completed vs Pending (Active)
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;

  const pieData = [
    { name: 'Completed', value: completed, color: '#22C55E' },
    { name: 'In Progress', value: inProgress, color: '#6366F1' },
    { name: 'Pending', value: pending, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  // 2. Bar Chart: Tasks by Priority
  const highPriority = tasks.filter(t => t.priority === 'High').length;
  const medPriority = tasks.filter(t => t.priority === 'Medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'Low').length;

  const barData = [
    { name: 'High', count: highPriority, fill: '#EF4444' },
    { name: 'Medium', count: medPriority, fill: '#F59E0B' },
    { name: 'Low', count: lowPriority, fill: '#22C55E' }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
        {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weekly Area Chart */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800 lg:col-span-2">
        <h3 className="text-slate-800 dark:text-slate-200 font-bold text-[15px] uppercase tracking-wider mb-5">
          Weekly Productivity (Completed Tasks)
        </h3>
        <div className="h-64 w-full">
          {weeklyData && weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Area type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" name="Tasks Completed" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium text-sm">
              No completion history this week.
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart: Status Breakdown */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800">
        <h3 className="text-slate-800 dark:text-slate-200 font-bold text-[15px] uppercase tracking-wider mb-5">
          Tasks by Status
        </h3>
        <div className="h-64 w-full flex flex-col justify-center items-center">
          {pieData.length > 0 ? (
            <>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-3 flex-wrap justify-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-slate-400 font-medium text-sm">No task data available.</div>
          )}
        </div>
      </div>

      {/* Bar Chart: Priority Breakdown */}
      <div className="p-6 rounded-2xl glass-card-light dark:glass-card-dark border border-slate-200/50 dark:border-slate-800 lg:col-span-3">
        <h3 className="text-slate-800 dark:text-slate-200 font-bold text-[15px] uppercase tracking-wider mb-5">
          Tasks by Priority
        </h3>
        <div className="h-64 w-full">
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Tasks Count">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium text-sm">
              No priority data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;
