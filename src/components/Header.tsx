import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  UtensilsCrossed,
  Search,
  Sparkles,
  Plus,
  Clock,
  AlertTriangle,
  ChevronDown,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { CanteenShift } from '../types';

export const Header: React.FC = () => {
  const {
    metrics,
    setShift,
    setIsSearchModalOpen,
    openNewTaskModal,
    setIsAiChatOpen,
    runAiPrioritize,
    isAiLoading,
    tasks,
    resetToDefaults,
  } = useCanteen();

  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const shifts: CanteenShift[] = ['Breakfast', 'Lunch', 'High Tea', 'Dinner'];
  const criticalCount = tasks.filter(
    (t) => t.priority === 'critical' && t.status !== 'completed'
  ).length;

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 tracking-tight text-lg">CanteenOS</span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  AI Ops
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Campus & Facility Dining Intelligence</p>
            </div>
          </div>

          {/* Shift Status & Rush Countdown Indicator */}
          <div className="relative">
            <button
              id="shift-selector-btn"
              onClick={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-700 transition"
              aria-label="Select Current Meal Shift"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-stone-900">{metrics.currentShift} Shift</span>
              <span className="text-stone-400">|</span>
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Rush in {metrics.rushCountdownMinutes}m
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {isShiftDropdownOpen && (
              <div
                id="shift-dropdown-menu"
                className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-40"
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Select Active Shift
                </div>
                {shifts.map((s) => (
                  <button
                    key={s}
                    id={`shift-option-${s.toLowerCase()}`}
                    onClick={() => {
                      setShift(s);
                      setIsShiftDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-100 ${
                      metrics.currentShift === s ? 'text-amber-700 font-semibold bg-amber-50/70' : 'text-stone-700'
                    }`}
                  >
                    <span>{s} Shift</span>
                    {metrics.currentShift === s && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Search Bar Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              id="global-search-trigger"
              onClick={() => setIsSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-stone-500 bg-stone-100/80 hover:bg-stone-100 rounded-lg border border-stone-200 transition"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-stone-400" />
                <span>Search tasks, projects, stations, staff...</span>
              </div>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-white border border-stone-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Prioritize Shift AI button */}
            <button
              id="quick-prioritize-ai-btn"
              onClick={runAiPrioritize}
              disabled={isAiLoading}
              title="AI auto-prioritize open tasks for this shift"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium border border-stone-200 transition"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>Prioritize Shift</span>
            </button>

            {/* Notification alert for critical tasks */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition"
                aria-label="Operational Notifications"
              >
                <Bell className="w-4 h-4" />
                {criticalCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 font-semibold text-stone-800">
                    <span>Shift Alerts & HACCP</span>
                    <span className="text-[11px] font-normal text-rose-600">
                      {criticalCount} Critical
                    </span>
                  </div>
                  <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                    {criticalCount > 0 ? (
                      tasks
                        .filter((t) => t.priority === 'critical' && t.status !== 'completed')
                        .map((t) => (
                          <div
                            key={t.id}
                            className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-900"
                          >
                            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>{t.station}</span>
                              <span className="ml-auto text-stone-500 font-normal">{t.dueTime}</span>
                            </div>
                            <p className="mt-0.5 text-[11px] line-clamp-1">{t.title}</p>
                          </div>
                        ))
                    ) : (
                      <p className="text-stone-500 text-center py-3">No critical bottlenecks! All systems green.</p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[11px] text-stone-400">
                    <button
                      onClick={resetToDefaults}
                      className="text-stone-500 hover:text-stone-800 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Demo Data
                    </button>
                    <span>{metrics.currentShift} Shift</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Assistant Drawer Trigger */}
            <button
              id="header-ai-chat-btn"
              onClick={() => setIsAiChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-xs font-semibold shadow-2xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>CanteenAI</span>
            </button>

            {/* New Task Button */}
            <button
              id="header-new-task-btn"
              onClick={() => openNewTaskModal()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
