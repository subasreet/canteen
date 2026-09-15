import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  FolderKanban,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { Project, ProjectCategory } from '../types';

interface ProjectsViewProps {
  onDecomposeProject: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onDecomposeProject }) => {
  const {
    projects,
    toggleMilestone,
    tasks,
    setIsNewProjectModalOpen,
  } = useCanteen();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: ProjectCategory[] = [
    'Sustainability',
    'Menu Innovation',
    'Tech & Automation',
    'Safety & Hygiene',
    'Supply Chain',
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div id="projects-view" className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Canteen Projects & Operational Initiatives</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              {projects.length} Initiatives
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Drive dining hall sustainability, queue automation, HACCP recertifications, and seasonal culinary revamps.
          </p>
        </div>

        <button
          id="create-project-btn"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Initiative</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
            selectedCategory === 'all'
              ? 'bg-amber-600 text-white shadow-2xs font-semibold'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          All Categories ({projects.length})
        </button>
        {categories.map((cat) => {
          const count = projects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => {
          const completedMilestones = proj.milestones.filter((m) => m.completed).length;
          const linkedTasks = tasks.filter((t) => t.projectId === proj.id);

          return (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:shadow-xs transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Category & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    {proj.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      proj.status === 'on_track'
                        ? 'bg-emerald-100 text-emerald-800'
                        : proj.status === 'at_risk'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {proj.status === 'on_track' && <CheckCircle2 className="w-3 h-3" />}
                    {proj.status === 'at_risk' && <AlertTriangle className="w-3 h-3" />}
                    <span>{proj.status.replace('_', ' ').toUpperCase()}</span>
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="text-base font-bold text-stone-900 leading-snug">{proj.title}</h2>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{proj.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Initiative Completion</span>
                    <span className="font-bold text-stone-900">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        proj.progress >= 70
                          ? 'bg-emerald-600'
                          : proj.progress >= 40
                          ? 'bg-amber-600'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Financials & Leader info */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs">
                  <div>
                    <div className="text-[10px] text-stone-400 font-semibold uppercase">Project Lead</div>
                    <div className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3 text-stone-400" />
                      <span>{proj.leader}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-semibold uppercase">Target Launch</div>
                    <div className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{proj.targetDate}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-semibold uppercase">Budget Utilized</div>
                    <div className="font-semibold text-stone-800 mt-0.5">
                      ${proj.budgetSpent.toLocaleString()} / ${proj.budgetAllocated.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-semibold uppercase">Active Linked Tasks</div>
                    <div className="font-semibold text-amber-700 mt-0.5">
                      {linkedTasks.length} Kitchen Tasks
                    </div>
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                    <span>Key Milestones</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      {completedMilestones} of {proj.milestones.length} achieved
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {proj.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => toggleMilestone(proj.id, m.id)}
                        className="w-full text-left flex items-start gap-2 p-2 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 transition group text-xs"
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition shrink-0 ${
                            m.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-stone-300 group-hover:border-amber-600'
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`leading-tight ${
                              m.completed ? 'line-through text-stone-400' : 'text-stone-700 font-medium'
                            }`}
                          >
                            {m.title}
                          </p>
                          <span className="text-[10px] text-stone-400">Due: {m.dueDate}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: AI Action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <button
                  id={`decompose-btn-${proj.id}`}
                  onClick={() => onDecomposeProject(proj)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold shadow-2xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Break Down into Kitchen Tasks with AI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
