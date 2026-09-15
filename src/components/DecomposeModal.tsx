import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { X, Sparkles, Plus, CheckCircle2, Clock, ChefHat, CheckSquare } from 'lucide-react';
import { Project, CanteenStation, PriorityLevel } from '../types';

interface DecomposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProject?: Project | null;
}

export const DecomposeModal: React.FC<DecomposeModalProps> = ({
  isOpen,
  onClose,
  targetProject,
}) => {
  const { decomposeObjective, importAiTasks } = useCanteen();

  const [objective, setObjective] = useState('');
  const [selectedStation, setSelectedStation] = useState<CanteenStation>('Kitchen Prep');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);

  React.useEffect(() => {
    if (targetProject) {
      setObjective(`Plan and execute tasks for initiative: ${targetProject.title}. Goal: ${targetProject.description}`);
    } else {
      setObjective('');
    }
    setGeneratedTasks([]);
  }, [targetProject, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;
    setIsGenerating(true);
    const tasks = await decomposeObjective(objective.trim(), selectedStation);
    setGeneratedTasks(tasks);
    setIsGenerating(false);
  };

  const handleImportAll = () => {
    if (!generatedTasks.length) return;
    importAiTasks(generatedTasks);
    onClose();
  };

  const sampleObjectives = [
    'Prepare catering for 150-guest Executive Board Luncheon',
    'Execute Sunday deep sanitation of walk-in chillers & fryers',
    'Launch allergen-safe salad bar with gluten-free labeling',
    'Deploy waste separation and plate weighing scales at dish return',
  ];

  return (
    <div
      id="decompose-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                AI Kitchen Task Organizer
              </h2>
              <p className="text-[11px] text-stone-500">
                Turn any canteen initiative or catering goal into actionable prep tasks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Canteen Goal or High-Level Objective
              </label>
              <textarea
                rows={2}
                required
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Prepare for 150-person VIP lunch banquet with vegan and gluten-free dietary requirements..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
              />
            </div>

            {/* Quick sample chips */}
            <div className="flex flex-wrap gap-1.5">
              {sampleObjectives.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setObjective(s)}
                  className="text-[10px] text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-md transition text-left"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs">
                <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-stone-500">Primary Station:</span>
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value as CanteenStation)}
                  className="px-2 py-1 text-xs rounded-lg border border-stone-200 bg-white font-medium"
                >
                  <option value="Kitchen Prep">Kitchen Prep</option>
                  <option value="Main Cooking Line">Main Cooking Line</option>
                  <option value="Bakery & Dessert">Bakery & Dessert</option>
                  <option value="Counter Service">Counter Service</option>
                  <option value="Hygiene & Sanitation">Hygiene & Sanitation</option>
                  <option value="Inventory & Storage">Inventory & Storage</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !objective.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating Tasks...' : 'Break Down with AI'}</span>
              </button>
            </div>
          </form>

          {/* Generated Tasks Preview */}
          {generatedTasks.length > 0 && (
            <div className="pt-3 border-t border-stone-200 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Generated {generatedTasks.length} Kitchen Tasks
                </span>
                <span className="text-[11px] text-stone-500 font-medium">Ready to import</span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {generatedTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{t.title}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded bg-amber-100 text-amber-900">
                        {t.priority || 'medium'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">{t.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                      <span>{t.station}</span>
                      <span>~{t.estimatedMinutes || 25} mins</span>
                    </div>
                    {t.checklist && t.checklist.length > 0 && (
                      <div className="text-[10px] text-stone-500 pl-2 border-l border-stone-300 space-y-0.5 mt-1">
                        {t.checklist.map((step: string, sIdx: number) => (
                          <div key={sIdx}>• {step}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportAll}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Import All {generatedTasks.length} Tasks to Board</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
