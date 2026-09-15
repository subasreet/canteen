import React, { useState, useEffect, useRef } from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  Search,
  X,
  CheckSquare,
  FolderKanban,
  ChefHat,
  Sparkles,
  ArrowRight,
  Clock,
  User,
} from 'lucide-react';
import { Task, Project } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    tasks,
    projects,
    setCurrentTab,
    openEditTaskModal,
    openNewTaskModal,
    setIsAiChatOpen,
    setSelectedStationFilter,
  } = useCanteen();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.station.toLowerCase().includes(q) ||
          t.assignee.name.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    : tasks.slice(0, 4);

  const matchingProjects = q
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.leader.toLowerCase().includes(q)
      )
    : projects.slice(0, 2);

  const stations = [
    'Kitchen Prep',
    'Main Cooking Line',
    'Bakery & Dessert',
    'Beverage & Coffee',
    'Counter Service',
    'Hygiene & Sanitation',
    'Inventory & Storage',
  ];

  const matchingStations = q
    ? stations.filter((s) => s.toLowerCase().includes(q))
    : [];

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-2xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150"
      onClick={() => setIsSearchModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-stone-200 flex items-center gap-3 bg-stone-50/50">
          <Search className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            id="omni-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search kitchen tasks, initiatives, stations, staff..."
            className="w-full text-sm bg-transparent focus:outline-none placeholder:text-stone-400 text-stone-900"
          />
          <kbd className="text-[10px] font-mono text-stone-400 bg-white border border-stone-200 px-1.5 py-0.5 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {/* Quick Actions if query is empty */}
          {!q && (
            <div className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Quick Jump
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    openNewTaskModal();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-left transition font-medium"
                >
                  <CheckSquare className="w-4 h-4 text-amber-600" />
                  <span>+ Create New Task</span>
                </button>
                <button
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setIsAiChatOpen(true);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-left transition font-medium"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Ask CanteenAI</span>
                </button>
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {matchingTasks.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider flex justify-between">
                <span>Tasks ({matchingTasks.length})</span>
                <span className="text-stone-400">Click to inspect</span>
              </div>
              {matchingTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    openEditTaskModal(t);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckSquare className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-stone-900 group-hover:text-amber-700 truncate">
                        {t.title}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate">
                        {t.station} • Due: {t.dueTime} • {t.assignee.name}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      t.priority === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {t.priority}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Projects Results */}
          {matchingProjects.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Initiatives & Projects
              </div>
              {matchingProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setCurrentTab('projects');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderKanban className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-stone-900 group-hover:text-amber-700 truncate">
                        {p.title}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {p.category} • {p.progress}% Complete
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>
          )}

          {/* Stations Results */}
          {matchingStations.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Kitchen Stations
              </div>
              {matchingStations.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedStationFilter(st);
                    setCurrentTab('tasks');
                    setIsSearchModalOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-stone-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 font-medium text-stone-800">
                    <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                    {st}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">Filter Station</span>
                </button>
              ))}
            </div>
          )}

          {q && matchingTasks.length === 0 && matchingProjects.length === 0 && (
            <div className="p-8 text-center text-stone-400 space-y-1">
              <p>No results found for "{query}"</p>
              <p className="text-[11px] text-stone-400">
                Try searching for "HACCP", "salad", "chicken", or "waste".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
