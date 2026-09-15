import React from 'react';
import { useCanteen, NavigationTab } from '../context/CanteenContext';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Flame,
  BarChart3,
  Bot,
  ChefHat,
  Filter,
} from 'lucide-react';
import { CanteenStation } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    tasks,
    projects,
    metrics,
    selectedStationFilter,
    setSelectedStationFilter,
    openNewTaskModal,
    setIsAiChatOpen,
  } = useCanteen();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length;

  const navItems: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: CheckSquare,
      badge: pendingTasksCount,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'projects',
      label: 'Initiatives & Projects',
      icon: FolderKanban,
      badge: activeProjectsCount,
      badgeColor: 'bg-stone-100 text-stone-700',
    },
    {
      id: 'priorities',
      label: 'Priorities Matrix',
      icon: Flame,
      badge: 'Rush Mode',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'analytics',
      label: 'Progress Analytics',
      icon: BarChart3,
    },
    {
      id: 'assistant',
      label: 'CanteenAI Copilot',
      icon: Bot,
      badge: 'Gemini',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const stations: CanteenStation[] = [
    'Kitchen Prep',
    'Main Cooking Line',
    'Bakery & Dessert',
    'Beverage & Coffee',
    'Counter Service',
    'Hygiene & Sanitation',
    'Inventory & Storage',
  ];

  return (
    <aside id="app-sidebar" className="w-64 bg-stone-50 border-r border-stone-200 shrink-0 flex flex-col justify-between hidden md:flex h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Navigation links */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Operations Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  if (item.id === 'assistant') {
                    // Open assistant view or drawer
                    setCurrentTab('assistant');
                    setIsAiChatOpen(true);
                  } else {
                    setCurrentTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-amber-700/80 text-white' : item.badgeColor || 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Station Filter Quick Select */}
        <div className="pt-2 border-t border-stone-200">
          <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <span>Canteen Stations</span>
            {selectedStationFilter !== 'all' && (
              <button
                onClick={() => setSelectedStationFilter('all')}
                className="text-amber-700 font-semibold lowercase text-[10px] hover:underline"
              >
                clear
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => setSelectedStationFilter('all')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                selectedStationFilter === 'all'
                  ? 'bg-stone-200 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                All Stations
              </span>
              <span className="text-[10px] text-stone-400">{tasks.length}</span>
            </button>

            {stations.map((st) => {
              const stationTaskCount = tasks.filter((t) => t.station === st && t.status !== 'completed').length;
              return (
                <button
                  key={st}
                  id={`station-filter-${st.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => {
                    setSelectedStationFilter(selectedStationFilter === st ? 'all' : st);
                    if (currentTab !== 'tasks' && currentTab !== 'priorities') {
                      setCurrentTab('tasks');
                    }
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                    selectedStationFilter === st
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate">{st}</span>
                  {stationTaskCount > 0 && (
                    <span className="text-[10px] font-medium text-stone-400 bg-white px-1.5 py-0.2 rounded border border-stone-200">
                      {stationTaskCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Canteen Live Pulse widget in sidebar bottom */}
      <div className="p-3 m-3 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
          <span>Shift Pulse</span>
          <span className="text-emerald-700 text-[10px] font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
            96% SLA
          </span>
        </div>
        <div className="space-y-1.5 text-[11px] text-stone-600">
          <div className="flex justify-between">
            <span>Meals Served:</span>
            <span className="font-semibold text-stone-900">
              {metrics.mealsServedToday} / {metrics.targetMeals}
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-600 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((metrics.mealsServedToday / metrics.targetMeals) * 100))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-stone-500 text-[10px]">
            <span>Active Tokens: {metrics.activeTokens}</span>
            <span>Waste: {metrics.foodWasteKg}kg</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
