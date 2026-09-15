import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Calendar,
  CheckSquare,
} from 'lucide-react';
import { Task, PriorityLevel } from '../types';

export const PrioritiesView: React.FC = () => {
  const {
    tasks,
    metrics,
    runAiPrioritize,
    isAiLoading,
    aiAlert,
    moveTaskStatus,
    openEditTaskModal,
    openNewTaskModal,
  } = useCanteen();

  // Quadrant 1: Urgent & Critical (HACCP, Food Safety, Immediate Pre-Rush Prep)
  const urgentCritical = tasks.filter(
    (t) => (t.priority === 'critical' || (t.priority === 'high' && t.dueTime.includes('11:'))) && t.status !== 'completed'
  );

  // Quadrant 2: High Impact, Scheduled (Future Shift Prep, Initiatives)
  const highImpactScheduled = tasks.filter(
    (t) => (t.priority === 'high' || t.projectId) && !urgentCritical.includes(t) && t.status !== 'completed'
  );

  // Quadrant 3: Quick Restock & Service Floor
  const quickRestock = tasks.filter(
    (t) => t.priority === 'medium' && !urgentCritical.includes(t) && !highImpactScheduled.includes(t) && t.status !== 'completed'
  );

  // Quadrant 4: Maintenance & Post-Shift
  const postShift = tasks.filter(
    (t) => t.priority === 'low' || (t.dueTime.includes('02:') || t.dueTime.includes('03:')) && t.status !== 'completed'
  );

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div id="priorities-matrix-view" className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-rose-100 text-rose-800">
              <Flame className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Shift Priority & Urgency Matrix
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Multi-factor prioritization weighing <strong>HACCP food safety compliance</strong>, <strong>immediate meal rush timing</strong>, and <strong>station throughput bottlenecks</strong>.
          </p>
        </div>

        <button
          id="priorities-ai-optimize-btn"
          onClick={runAiPrioritize}
          disabled={isAiLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition shrink-0"
        >
          <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Analyzing Dining Rush...' : 'Re-Order Shift with Gemini AI'}</span>
        </button>
      </div>

      {/* AI Rationale Alert Box if available */}
      {aiAlert && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Kitchen Orchestrator Recommendation:</span>
          </div>
          <p className="leading-relaxed pl-6">{aiAlert}</p>
        </div>
      )}

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quadrant 1: Urgent & Critical */}
        <div className="p-5 rounded-2xl bg-white border-2 border-rose-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                Q1
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-950">Immediate Rush & Food Safety</h3>
                <p className="text-[11px] text-rose-700">Critical HACCP temps & pre-rush cooking</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {urgentCritical.length} Critical
            </span>
          </div>

          <div className="space-y-2.5">
            {urgentCritical.length === 0 ? (
              <div className="p-4 rounded-xl bg-rose-50/50 text-center text-xs text-rose-800">
                No immediate critical bottlenecks detected!
              </div>
            ) : (
              urgentCritical.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => openEditTaskModal(t)}
                      className="text-left font-bold text-xs text-stone-900 hover:text-rose-700 line-clamp-1"
                    >
                      {t.title}
                    </button>
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded shrink-0">
                      {t.dueTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">{t.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">{t.station}</span>
                    <button
                      onClick={() => moveTaskStatus(t.id, 'completed')}
                      className="text-rose-700 hover:text-rose-900 font-bold text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sign Off Step
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quadrant 2: High Impact & Strategic Scheduled */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                Q2
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">High Impact Prep & Initiatives</h3>
                <p className="text-[11px] text-amber-800">Station readiness & planned milestones</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {highImpactScheduled.length} Scheduled
            </span>
          </div>

          <div className="space-y-2.5">
            {highImpactScheduled.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50/40 text-center text-xs text-amber-800">
                All scheduled prep items up to date.
              </div>
            ) : (
              highImpactScheduled.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => openEditTaskModal(t)}
                      className="text-left font-bold text-xs text-stone-900 hover:text-amber-700 line-clamp-1"
                    >
                      {t.title}
                    </button>
                    <span className="text-[10px] font-semibold text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded shrink-0">
                      {t.dueTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">{t.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">{t.station}</span>
                    <button
                      onClick={() => moveTaskStatus(t.id, 'completed')}
                      className="text-amber-700 hover:text-amber-900 font-bold text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quadrant 3: Quick Restock & Counter Support */}
        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                Q3
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Quick Restock & Supplies</h3>
                <p className="text-[11px] text-blue-700">Coffee hoppers, compostable cups & condiments</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {quickRestock.length} Tasks
            </span>
          </div>

          <div className="space-y-2.5">
            {quickRestock.length === 0 ? (
              <div className="p-4 rounded-xl bg-blue-50/40 text-center text-xs text-blue-800">
                All beverage & supply counters fully stocked.
              </div>
            ) : (
              quickRestock.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => openEditTaskModal(t)}
                      className="text-left font-bold text-xs text-stone-900 hover:text-blue-700 line-clamp-1"
                    >
                      {t.title}
                    </button>
                    <span className="text-[10px] text-stone-500 font-medium">{t.dueTime}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">{t.station}</span>
                    <button
                      onClick={() => moveTaskStatus(t.id, 'completed')}
                      className="text-blue-700 hover:text-blue-900 font-bold text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Restocked
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quadrant 4: Maintenance & Post-Shift */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-xs">
                Q4
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Post-Shift & Deep Sanitation</h3>
                <p className="text-[11px] text-stone-500">Oil filtering, defrosting, equipment cleanout</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {postShift.length} Tasks
            </span>
          </div>

          <div className="space-y-2.5">
            {postShift.length === 0 ? (
              <div className="p-4 rounded-xl bg-stone-50 text-center text-xs text-stone-500">
                No deferred maintenance pending.
              </div>
            ) : (
              postShift.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => openEditTaskModal(t)}
                      className="text-left font-bold text-xs text-stone-900 hover:text-stone-700 line-clamp-1"
                    >
                      {t.title}
                    </button>
                    <span className="text-[10px] text-stone-500 font-medium">{t.dueTime}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">{t.station}</span>
                    <button
                      onClick={() => moveTaskStatus(t.id, 'completed')}
                      className="text-stone-700 hover:text-stone-900 font-bold text-[11px] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
