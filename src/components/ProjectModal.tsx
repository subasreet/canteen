import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { X, FolderKanban, Plus, Trash2 } from 'lucide-react';
import { ProjectCategory, ProjectStatus } from '../types';

export const ProjectModal: React.FC = () => {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, addProject, staff } = useCanteen();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Sustainability');
  const [targetDate, setTargetDate] = useState('Nov 30, 2026');
  const [leader, setLeader] = useState(staff[0]?.name || 'Chef Marco Rossi');
  const [budgetAllocated, setBudgetAllocated] = useState<number>(10000);
  const [milestoneInput, setMilestoneInput] = useState('');
  const [milestones, setMilestones] = useState<Array<{ id: string; title: string; completed: boolean; dueDate: string }>>([
    { id: 'm-init-1', title: 'Phase 1 feasibility audit and vendor review', completed: false, dueDate: 'Oct 15' },
    { id: 'm-init-2', title: 'Staff training on standard operating procedure', completed: false, dueDate: 'Nov 01' },
  ]);

  if (!isNewProjectModalOpen) return null;

  const handleAddMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, title: milestoneInput.trim(), completed: false, dueDate: 'TBD' },
    ]);
    setMilestoneInput('');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProject({
      title: title.trim(),
      description: description.trim() || 'Canteen operational development project.',
      category,
      progress: 0,
      targetDate,
      status: 'on_track',
      leader,
      budgetAllocated: Number(budgetAllocated) || 5000,
      budgetSpent: 0,
      milestones,
      tags: [category, 'Strategic'],
    });

    setIsNewProjectModalOpen(false);
  };

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900">New Canteen Initiative</h2>
          </div>
          <button
            onClick={() => setIsNewProjectModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Initiative Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Organic Composting & Vegetable Trimming Recycling"
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Scope & Objectives</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail expected impact on waste, queue times, hygiene, or customer satisfaction..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Sustainability">Sustainability</option>
                <option value="Menu Innovation">Menu Innovation</option>
                <option value="Tech & Automation">Tech & Automation</option>
                <option value="Safety & Hygiene">Safety & Hygiene</option>
                <option value="Supply Chain">Supply Chain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Initiative Leader</label>
              <select
                value={leader}
                onChange={(e) => setLeader(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Target Launch Date</label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="e.g. Nov 30, 2026"
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Allocated Budget ($)</label>
              <input
                type="number"
                min={500}
                value={budgetAllocated}
                onChange={(e) => setBudgetAllocated(Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700">Initial Project Milestones</label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                >
                  <span className="truncate flex-1">{m.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
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
                placeholder="Add milestone requirement..."
                value={milestoneInput}
                onChange={(e) => setMilestoneInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl"
              >
                + Add Milestone
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs"
            >
              Launch Initiative
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
