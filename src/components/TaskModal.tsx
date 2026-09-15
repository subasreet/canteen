import React, { useState, useEffect } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { X, Plus, Trash2, CheckCircle2, Clock, ChefHat, Sparkles } from 'lucide-react';
import { Task, PriorityLevel, CanteenStation, TaskStatus, StaffMember } from '../types';

export const TaskModal: React.FC = () => {
  const {
    isNewTaskModalOpen,
    closeTaskModal,
    editingTask,
    addTask,
    updateTask,
    staff,
    projects,
  } = useCanteen();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [station, setStation] = useState<CanteenStation>('Kitchen Prep');
  const [assigneeId, setAssigneeId] = useState<string>(staff[0]?.id || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [dueTime, setDueTime] = useState('11:30 AM');
  const [projectId, setProjectId] = useState<string>('');
  const [checklist, setChecklist] = useState<Array<{ id: string; text: string; completed: boolean }>>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const stations: CanteenStation[] = [
    'Kitchen Prep',
    'Main Cooking Line',
    'Bakery & Dessert',
    'Beverage & Coffee',
    'Counter Service',
    'Hygiene & Sanitation',
    'Inventory & Storage',
  ];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setStation(editingTask.station);
      setAssigneeId(editingTask.assignee?.id || staff[0]?.id || '');
      setEstimatedMinutes(editingTask.estimatedMinutes || 30);
      setDueTime(editingTask.dueTime || '11:30 AM');
      setProjectId(editingTask.projectId || '');
      setChecklist(editingTask.checklist || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setStation('Kitchen Prep');
      setAssigneeId(staff[0]?.id || '');
      setEstimatedMinutes(30);
      setDueTime('11:30 AM');
      setProjectId('');
      setChecklist([
        { id: `c-${Date.now()}-1`, text: 'Sanitize station and prep area', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Verify ingredient portioning & HACCP temps', completed: false },
      ]);
    }
  }, [editingTask, isNewTaskModalOpen]);

  if (!isNewTaskModalOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: `chk-${Date.now()}`, text: newChecklistText.trim(), completed: false },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedStaff = staff.find((s) => s.id === assigneeId) || staff[0];

    if (editingTask && editingTask.id) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        station,
        assignee: assignedStaff,
        estimatedMinutes: Number(estimatedMinutes),
        dueTime,
        projectId: projectId || undefined,
        checklist,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || 'Canteen operational task.',
        status,
        priority,
        station,
        assignee: assignedStaff,
        estimatedMinutes: Number(estimatedMinutes),
        dueTime,
        dueDate: 'Today',
        checklist,
        projectId: projectId || undefined,
        tags: ['Canteen Ops'],
      });
    }

    closeTaskModal();
  };

  return (
    <div
      id="task-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900">
              {editingTask && editingTask.id ? 'Edit Canteen Task' : 'Create Operational Task'}
            </h2>
          </div>
          <button
            onClick={closeTaskModal}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Prep Salad Bar & Whisk Citrus Vinaigrette"
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Description & SOP Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail required temperatures, portioning weights, allergen labels..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Station & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Station / Kitchen Area</label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value as CanteenStation)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {stations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="critical">Critical (HACCP/Immediate Rush)</option>
                <option value="high">High (Station Bottleneck)</option>
                <option value="medium">Medium (Standard Prep)</option>
                <option value="low">Low (Post-Shift / Secondary)</option>
              </select>
            </div>
          </div>

          {/* Status & Timing */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Due Timing</label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="e.g. 11:15 AM"
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Est. Minutes</label>
              <input
                type="number"
                min={5}
                max={240}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Assignee & Linked Project */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Assign Staff Member</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Link to Initiative (Optional)</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">None (Independent Task)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub-Checklist */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700">
              Kitchen Preparation Checklist Steps
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                >
                  <span className="truncate flex-1">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-stone-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add step (e.g. Check internal temperature reaches 74°C)..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl"
              >
                + Add Step
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition"
            >
              {editingTask && editingTask.id ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
