import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  Utensils,
  CheckCircle2,
  Clock,
  Trash2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Plus,
  Flame,
  CheckSquare,
  FolderKanban,
  ChefHat,
} from 'lucide-react';
import { TaskStatus } from '../types';

interface DashboardViewProps {
  onOpenSummaryModal: () => void;
  onOpenDecomposeModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenSummaryModal,
  onOpenDecomposeModal,
}) => {
  const {
    tasks,
    projects,
    metrics,
    tokens,
    setCurrentTab,
    runAiPrioritize,
    isAiLoading,
    aiAlert,
    moveTaskStatus,
    openNewTaskModal,
    openEditTaskModal,
    updateTokenStatus,
    addNewToken,
  } = useCanteen();

  const [quickTokenNum, setQuickTokenNum] = useState('');
  const [quickTokenItems, setQuickTokenItems] = useState('');

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const taskCompletionRate = Math.round((completedTasks.length / (tasks.length || 1)) * 100);

  const urgentTasks = tasks
    .filter((t) => (t.priority === 'critical' || t.priority === 'high') && t.status !== 'completed')
    .slice(0, 5);

  const activeTokensList = tokens.filter((tok) => tok.status !== 'picked_up');

  const handleCreateQuickToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTokenNum.trim()) return;
    addNewToken({
      tokenNumber: quickTokenNum.toUpperCase(),
      counterName: 'Main Line Hot Buffet',
      items: quickTokenItems ? [quickTokenItems] : ['Chef Daily Special Combo'],
      status: 'preparing',
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerType: 'Staff',
    });
    setQuickTokenNum('');
    setQuickTokenItems('');
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Top Banner / Shift Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-900 via-stone-900 to-stone-800 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              {metrics.currentShift} Shift Active
            </span>
            <span className="text-xs text-stone-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Peak rush begins in <strong className="text-white">{metrics.rushCountdownMinutes} minutes</strong>
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white tracking-tight">
            Kitchen Operations & Meal Command
          </h1>
          <p className="text-stone-300 text-xs mt-0.5 max-w-xl">
            Real-time synchronization across meal counters, kitchen line prep, HACCP hygiene checks, and AI task prioritization.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="dash-ai-prioritize-btn"
            onClick={runAiPrioritize}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-xs transition"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Analyzing...' : 'AI Prioritize Shift'}</span>
          </button>

          <button
            id="dash-ai-summary-btn"
            onClick={onOpenSummaryModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur-xs transition"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Shift Handover Report</span>
          </button>
        </div>
      </div>

      {/* AI Notice Alert if exists */}
      {aiAlert && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-300">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">AI Operations Guidance: </span>
            <span>{aiAlert}</span>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Meals Served */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">Meals Served Today</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{metrics.mealsServedToday}</span>
            <span className="text-xs text-stone-500">/ {metrics.targetMeals} target</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-600 h-1.5 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((metrics.mealsServedToday / metrics.targetMeals) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>{Math.round((metrics.mealsServedToday / metrics.targetMeals) * 100)}% of daily projection</span>
            </p>
          </div>
        </div>

        {/* Card 2: Task Completion Velocity */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">Task Completion Velocity</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{completedTasks.length}</span>
            <span className="text-xs text-stone-500">/ {tasks.length} tasks</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5 flex items-center justify-between">
              <span>{taskCompletionRate}% completed</span>
              <span className="text-emerald-700 font-medium">On Schedule</span>
            </p>
          </div>
        </div>

        {/* Card 3: Live Token Queue */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">Active Meal Queue Tokens</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{activeTokensList.length}</span>
            <span className="text-xs text-stone-500">in preparation/ready</span>
          </div>
          <div className="mt-3 text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
            <span>Avg wait: <strong>{metrics.avgWaitTimeMinutes}m</strong></span>
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium">Kiosks Online</span>
          </div>
        </div>

        {/* Card 4: Food Waste Control */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">Organic Waste vs Target</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">{metrics.foodWasteKg} kg</span>
            <span className="text-xs text-stone-500">&lt; {metrics.foodWasteTargetKg} kg limit</span>
          </div>
          <div className="mt-3 text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
            <span className="text-emerald-700 font-medium">28% under ceiling</span>
            <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">Compost Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Shift Tasks vs Live Tokens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Shift Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-bold text-stone-900">Urgent Pre-Rush Task Watchlist</h2>
                <span className="text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.2 rounded-full">
                  {urgentTasks.length} Pending
                </span>
              </div>
              <button
                id="view-all-tasks-link"
                onClick={() => setCurrentTab('tasks')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>View All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {urgentTasks.length === 0 ? (
                <div className="text-center py-6 text-stone-400 text-xs">
                  All urgent shift tasks are completed! Great work team.
                </div>
              ) : (
                urgentTasks.map((task) => {
                  const isCritical = task.priority === 'critical';
                  const completedChecks = task.checklist.filter((c) => c.completed).length;
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 transition flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => moveTaskStatus(task.id, 'completed')}
                          title="Mark as completed"
                          className="mt-0.5 w-5 h-5 rounded-md border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center text-transparent hover:text-emerald-600 transition shrink-0"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">{task.station}</span>
                            <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 ml-auto">
                              <Clock className="w-3 h-3" />
                              {task.dueTime}
                            </span>
                          </div>
                          <button
                            onClick={() => openEditTaskModal(task)}
                            className="text-left font-semibold text-xs text-stone-900 mt-1 hover:text-amber-700 line-clamp-1"
                          >
                            {task.title}
                          </button>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{task.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500">
                            <div className="flex items-center gap-1.5">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span className="font-medium text-stone-700">{task.assignee.name}</span>
                            </div>
                            {task.checklist.length > 0 && (
                              <span className="text-stone-400">
                                Checklist: {completedChecks}/{task.checklist.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <select
                          value={task.status}
                          onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="text-[11px] bg-white border border-stone-200 rounded-lg px-2 py-1 text-stone-700 font-medium focus:outline-none"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="in_review">In Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-stone-500">Need new prep duties assigned?</span>
              <button
                id="dash-add-task-btn"
                onClick={() => openNewTaskModal()}
                className="text-xs font-semibold text-stone-900 hover:text-amber-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>
          </div>

          {/* Strategic Projects Overview */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-stone-700" />
                <h2 className="text-sm font-bold text-stone-900">Strategic Projects & Initiatives</h2>
              </div>
              <button
                id="view-all-projects-link"
                onClick={() => setCurrentTab('projects')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-stone-50 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-stone-500 uppercase">{p.category}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                        p.status === 'on_track'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'at_risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {p.status === 'on_track' ? 'On Track' : 'At Risk'}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 line-clamp-1">{p.title}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Progress</span>
                      <span className="font-semibold text-stone-800">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-600 h-1.5 rounded-full"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-stone-400 pt-1">
                    <span>Lead: {p.leader}</span>
                    <span>Target: {p.targetDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Meal Token Dispatch & Station Status */}
        <div className="space-y-4">
          {/* Live Token Monitor */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-stone-900">Live Pickup Tokens</h2>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Counters
              </span>
            </div>

            <p className="text-[11px] text-stone-500">
              Orders placed via RFID / Cashless Kiosks requiring pickup at counters.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activeTokensList.map((tok) => {
                const isReady = tok.status === 'ready';
                return (
                  <div
                    key={tok.id}
                    className={`p-3 rounded-xl border transition ${
                      isReady
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-stone-900 tracking-wider">
                          {tok.tokenNumber}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                            isReady
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isReady ? 'Ready for Pickup' : 'Preparing'}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">{tok.orderTime}</span>
                    </div>

                    <div className="mt-1.5 text-[11px] text-stone-700">
                      <div className="font-medium text-stone-900 line-clamp-1">{tok.items.join(', ')}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {tok.counterName} • <span className="font-semibold">{tok.customerType}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                      {isReady ? (
                        <button
                          onClick={() => updateTokenStatus(tok.id, 'picked_up')}
                          className="w-full text-center py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition shadow-2xs"
                        >
                          Mark as Collected
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTokenStatus(tok.id, 'ready')}
                          className="w-full text-center py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition shadow-2xs"
                        >
                          Signal Ready on Screen
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Token Generator Form */}
            <form onSubmit={handleCreateQuickToken} className="pt-2 border-t border-stone-100 space-y-2">
              <div className="text-[11px] font-semibold text-stone-700">Manual Order Dispatch</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Token # (e.g. A-112)"
                  value={quickTokenNum}
                  onChange={(e) => setQuickTokenNum(e.target.value)}
                  className="w-28 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Meal items..."
                  value={quickTokenItems}
                  onChange={(e) => setQuickTokenItems(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition"
              >
                + Dispatch Token
              </button>
            </form>
          </div>

          {/* AI Objective Decomposer Quick Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-100">
                AI Task Organizer
              </h3>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed">
              Have a catering event, banquet, or hygiene inspection? Let Gemini break it down into ready-to-run kitchen tasks.
            </p>
            <button
              id="open-decompose-modal-btn"
              onClick={onOpenDecomposeModal}
              className="w-full py-2 px-3 rounded-xl bg-white text-amber-950 font-bold text-xs hover:bg-amber-50 transition shadow-xs"
            >
              Organize New Kitchen Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
