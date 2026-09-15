import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  HOURLY_MEALS_DATA,
  STATION_WORKLOAD_DATA,
  WASTE_TRACKING_DATA,
} from '../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { tasks, metrics, projects } = useCanteen();

  // Calculate task status counts
  const statusCounts = [
    { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length, color: '#a8a29e' },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length, color: '#d97706' },
    { name: 'In Review', value: tasks.filter((t) => t.status === 'in_review').length, color: '#2563eb' },
    { name: 'Completed', value: tasks.filter((t) => t.status === 'completed').length, color: '#059669' },
  ];

  const totalTasks = tasks.length || 1;
  const completionPercent = Math.round(
    (tasks.filter((t) => t.status === 'completed').length / totalTasks) * 100
  );

  return (
    <div id="analytics-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <span>Canteen Performance & Progress Analytics</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Operational metrics tracking meal velocity, HACCP task compliance, station workloads, and organic food waste curves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>HACCP Compliance: 99.4%</span>
          </div>
        </div>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase">Today's Meal Volume</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {metrics.mealsServedToday} <span className="text-xs font-normal text-stone-500">servings</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% vs same shift yesterday
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase">Shift Task Velocity</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {completionPercent}% <span className="text-xs font-normal text-stone-500">done</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {tasks.filter((t) => t.status === 'completed').length} of {tasks.length} signed off
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase">Avg Queue Turnaround</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {metrics.avgWaitTimeMinutes} <span className="text-xs font-normal text-stone-500">minutes</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Target SLA &lt; 5.0m achieved
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase">Food Waste Audit</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {metrics.foodWasteKg} <span className="text-xs font-normal text-stone-500">kg plate loss</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            3.4kg lower than daily target
          </p>
        </div>
      </div>

      {/* Chart Row 1: Hourly Meal Demand vs Capacity Curve & Food Waste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Meals Curve */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Hourly Meal Demand vs Kitchen Capacity</h2>
              <p className="text-[11px] text-stone-500">Identify lunch rush bottlenecks & counter staffing</p>
            </div>
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
              Peak: 12:15 PM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_MEALS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#78716c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#78716c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#78716c' }} />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="capacity"
                  name="Max Capacity"
                  stroke="#a8a29e"
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorCap)"
                />
                <Area
                  type="monotone"
                  dataKey="meals"
                  name="Meals Served"
                  stroke="#d97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMeals)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Food Waste Reduction Progress */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Weekly Food Waste vs Daily 12kg Limit</h2>
              <p className="text-[11px] text-stone-500">Zero-waste initiative tracking & plate trimming</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              -38% Waste Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WASTE_TRACKING_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#78716c' }} />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="wasteKg" name="Actual Waste (kg)" fill="#d97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Max Limit (kg)" fill="#e7e5e4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Row 2: Station Workload Distribution & Task Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Station Workload */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Station Workload & Task Distribution</h2>
              <p className="text-[11px] text-stone-500">Active vs completed tasks by kitchen section</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={STATION_WORKLOAD_DATA}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f4" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#78716c' }} />
                <YAxis dataKey="station" type="category" tick={{ fontSize: 11, fill: '#78716c' }} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="completed" name="Completed" fill="#059669" stackId="a" />
                <Bar dataKey="activeTasks" name="Active Prep" fill="#f59e0b" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Task Velocity Status</h2>
            <p className="text-[11px] text-stone-500">Current shift pipeline breakdown</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
            {statusCounts.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-stone-600 truncate">{s.name}:</span>
                <span className="font-bold text-stone-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance Recommendations */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Gemini AI Operations Insight & Optimization</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-amber-950">
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 space-y-1">
            <span className="font-bold text-amber-900">1. Pre-Rush Counter Flow:</span>
            <p className="leading-relaxed text-stone-600">
              Between 11:45 AM and 12:45 PM, shift 1 barista staff member to Counter Service Station A to keep RFID checkout queue times under 45 seconds.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 space-y-1">
            <span className="font-bold text-amber-900">2. Food Waste Trimming:</span>
            <p className="leading-relaxed text-stone-600">
              Salad Bar prep is generating ~2.1kg trimmed vegetable scrap. Route clean celery, carrot, and onion ends directly to the stockpot for tonight's soup base.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-amber-200/60 space-y-1">
            <span className="font-bold text-amber-900">3. HACCP Sensor Audit:</span>
            <p className="leading-relaxed text-stone-600">
              Walk-in Chiller 2 logged 4.2°C at 10:15 AM (near limit). Keep door latched firmly during delivery unloading to ensure cold chain compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
