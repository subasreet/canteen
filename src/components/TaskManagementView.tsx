import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  Kanban,
  List,
  Plus,
  Sparkles,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  CheckSquare,
  Search,
  Trash2,
  Edit2,
  ChevronRight,
  ChefHat,
  User,
} from 'lucide-react';
import { Task, TaskStatus, PriorityLevel, CanteenStation } from '../types';

export const TaskManagementView: React.FC = () => {
  const {
    tasks,
    selectedStationFilter,
    setSelectedStationFilter,
    selectedPriorityFilter,
    setSelectedPriorityFilter,
    moveTaskStatus,
    deleteTask,
    openNewTaskModal,
    openEditTaskModal,
    toggleChecklistItem,
    runAiPrioritize,
    isAiLoading,
  } = useCanteen();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedStationFilter !== 'all' && t.station !== selectedStationFilter) return false;
    if (selectedPriorityFilter !== 'all' && t.priority !== selectedPriorityFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchStation = t.station.toLowerCase().includes(q);
      const matchAssignee = t.assignee.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchStation && !matchAssignee) return false;
    }
    return true;
  });

  const columns: Array<{ id: TaskStatus; title: string; color: string; badge: string }> = [
    { id: 'todo', title: 'To Do (Shift Prep)', color: 'border-stone-300 bg-stone-100/60', badge: 'bg-stone-200 text-stone-800' },
    { id: 'in_progress', title: 'In Progress (Active Line)', color: 'border-amber-300 bg-amber-50/50', badge: 'bg-amber-100 text-amber-900' },
    { id: 'in_review', title: 'Quality & Temp Check', color: 'border-blue-300 bg-blue-50/50', badge: 'bg-blue-100 text-blue-900' },
    { id: 'completed', title: 'Completed & Signed Off', color: 'border-emerald-300 bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-900' },
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
    <div id="task-management-view" className="space-y-5">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Kitchen & Station Task Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              {filteredTasks.length} tasks
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Coordinate prep times, hygiene logs, hot-holding temps, and service line responsibilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* AI Prioritize button */}
          <button
            id="tasks-ai-prioritize-btn"
            onClick={runAiPrioritize}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Sorting...' : 'AI Auto-Prioritize'}</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            <button
              id="view-mode-kanban"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              id="view-mode-list"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'list'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Add Task Button */}
          <button
            id="new-task-main-btn"
            onClick={() => openNewTaskModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Filter tasks by name, ingredients, or SOP..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Station Filter */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600">
          <ChefHat className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedStationFilter}
            onChange={(e) => setSelectedStationFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:outline-none"
          >
            <option value="all">All Stations</option>
            {stations.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical (HACCP/Rush)</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Reset Filters */}
        {(selectedStationFilter !== 'all' || selectedPriorityFilter !== 'all' || localSearch) && (
          <button
            onClick={() => {
              setSelectedStationFilter('all');
              setSelectedPriorityFilter('all');
              setLocalSearch('');
            }}
            className="text-xs text-amber-700 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* View Content */}
      {viewMode === 'kanban' ? (
        /* Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-stone-50/80 rounded-2xl border border-stone-200 p-3 space-y-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-stone-800 tracking-tight">{col.title}</h3>
                    <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${col.badge}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openNewTaskModal({ status: col.id })}
                    title={`Add task to ${col.title}`}
                    className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-md transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5">
                  {colTasks.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-[11px] text-stone-400">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const completedCount = task.checklist.filter((c) => c.completed).length;
                      const isCritical = task.priority === 'critical';

                      return (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs hover:shadow-xs transition space-y-2.5 group"
                        >
                          {/* Top Row: Station + Priority + Due Time */}
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : task.priority === 'high'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : task.priority === 'medium'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 ml-auto">
                              <Clock className="w-3 h-3" />
                              {task.dueTime}
                            </span>
                          </div>

                          {/* Task Title & Description */}
                          <div>
                            <button
                              onClick={() => openEditTaskModal(task)}
                              className="text-left font-bold text-xs text-stone-900 hover:text-amber-700 transition leading-snug line-clamp-2"
                            >
                              {task.title}
                            </button>
                            <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Station label & AI tag */}
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                            <span className="font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                              {task.station}
                            </span>
                            {task.aiSuggested && (
                              <span className="font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600" /> AI
                              </span>
                            )}
                          </div>

                          {/* Checklist preview */}
                          {task.checklist.length > 0 && (
                            <div className="space-y-1 pt-1 border-t border-stone-100">
                              <div className="flex justify-between text-[10px] text-stone-500">
                                <span>Prep Steps:</span>
                                <span className="font-semibold">
                                  {completedCount}/{task.checklist.length}
                                </span>
                              </div>
                              <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-1 rounded-full"
                                  style={{
                                    width: `${Math.round(
                                      (completedCount / task.checklist.length) * 100
                                    )}%`,
                                  }}
                                />
                              </div>
                              {/* Quick toggle first unchecked step */}
                              {task.checklist.slice(0, 2).map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => toggleChecklistItem(task.id, item.id)}
                                  className="w-full text-left flex items-center gap-1.5 text-[11px] text-stone-600 hover:text-stone-900 group/item"
                                >
                                  <div
                                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition shrink-0 ${
                                      item.completed
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'border-stone-300 group-hover/item:border-amber-600'
                                    }`}
                                  >
                                    {item.completed && <CheckSquare className="w-2.5 h-2.5" />}
                                  </div>
                                  <span
                                    className={`truncate ${
                                      item.completed ? 'line-through text-stone-400' : ''
                                    }`}
                                  >
                                    {item.text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Footer: Assignee + Move Column Select */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-stone-200"
                              />
                              <span className="text-[11px] font-medium text-stone-700 truncate max-w-[80px]">
                                {task.assignee.name.split(' ')[0]}
                              </span>
                            </div>

                            {/* Column mover select */}
                            <select
                              value={task.status}
                              onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="text-[10px] bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 text-stone-700 font-medium focus:outline-none"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="in_review">In Review</option>
                              <option value="completed">Done</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3 w-10">Done</th>
                  <th className="p-3">Task Title & Details</th>
                  <th className="p-3">Station</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Due Timing</th>
                  <th className="p-3">Assignee</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400">
                      No matching tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const isDone = task.status === 'completed';
                    const isCritical = task.priority === 'critical';
                    return (
                      <tr key={task.id} className="hover:bg-stone-50/80 transition">
                        <td className="p-3 text-center">
                          <button
                            onClick={() => moveTaskStatus(task.id, isDone ? 'todo' : 'completed')}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-stone-300 hover:border-emerald-500'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                        <td className="p-3 max-w-sm">
                          <button
                            onClick={() => openEditTaskModal(task)}
                            className={`font-semibold text-xs text-left hover:text-amber-700 transition ${
                              isDone ? 'line-through text-stone-400' : 'text-stone-900'
                            }`}
                          >
                            {task.title}
                          </button>
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{task.description}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                            {task.station}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isCritical
                                ? 'bg-rose-100 text-rose-800'
                                : task.priority === 'high'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-amber-700">{task.dueTime}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-stone-700 font-medium">{task.assignee.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <select
                            value={task.status}
                            onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-[11px] font-medium text-stone-700"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditTaskModal(task)}
                              title="Edit Task"
                              className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Delete Task"
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
