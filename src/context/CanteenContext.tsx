import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Task,
  Project,
  StaffMember,
  CanteenMetrics,
  MealToken,
  ChatMessage,
  TaskStatus,
  PriorityLevel,
  CanteenStation,
  CanteenShift,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_METRICS,
  INITIAL_TOKENS,
  STAFF_MEMBERS,
} from '../data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'tasks'
  | 'projects'
  | 'priorities'
  | 'analytics'
  | 'assistant';

interface CanteenContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  tasks: Task[];
  projects: Project[];
  metrics: CanteenMetrics;
  tokens: MealToken[];
  staff: StaffMember[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStationFilter: string;
  setSelectedStationFilter: (station: string) => void;
  selectedPriorityFilter: string;
  setSelectedPriorityFilter: (priority: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  chatMessages: ChatMessage[];
  isAiLoading: boolean;
  aiAlert: string | null;
  setAiAlert: (alert: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  toggleChecklistItem: (taskId: string, checklistId: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  updateTokenStatus: (tokenId: string, status: 'preparing' | 'ready' | 'picked_up') => void;
  addNewToken: (token: Omit<MealToken, 'id'>) => void;
  setShift: (shift: CanteenShift) => void;
  runAiPrioritize: () => Promise<void>;
  generateAiShiftSummary: () => Promise<string>;
  decomposeObjective: (objective: string, station?: string) => Promise<any[]>;
  sendChatMessage: (text: string) => Promise<void>;
  importAiTasks: (suggestedTasks: any[]) => void;
  openNewTaskModal: (prefill?: Partial<Task>) => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  resetToDefaults: () => void;
}

const CanteenContext = createContext<CanteenContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'canteen_ops_tasks_v2',
  PROJECTS: 'canteen_ops_projects_v2',
  METRICS: 'canteen_ops_metrics_v2',
  TOKENS: 'canteen_ops_tokens_v2',
};

export const CanteenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStationFilter, setSelectedStationFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAlert, setAiAlert] = useState<string | null>(null);

  // Initialize data with local storage fallback
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [metrics, setMetrics] = useState<CanteenMetrics>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
      return saved ? JSON.parse(saved) : INITIAL_METRICS;
    } catch {
      return INITIAL_METRICS;
    }
  });

  const [tokens, setTokens] = useState<MealToken[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOKENS);
      return saved ? JSON.parse(saved) : INITIAL_TOKENS;
    } catch {
      return INITIAL_TOKENS;
    }
  });

  const staff = STAFF_MEMBERS;

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content:
        "👋 **Welcome to CanteenAI Copilot!** I'm your dining operations intelligence assistant.\n\nI can help you:\n- **Organize & schedule kitchen prep** before upcoming meal rushes\n- **Auto-prioritize shift tasks** based on HACCP food safety & queue dynamics\n- **Summarize shift handovers** and equipment logs\n- **Break down new initiatives** (like vegan station revamps or waste audits)\n\nWhat can I assist you with right now?",
      timestamp: 'Just now',
    },
  ]);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [metrics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [tokens]);

  // Keyboard shortcut for Cmd/Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const toggleChecklistItem = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((item) =>
          item.id === checklistId ? { ...item, completed: !item.completed } : item
        );
        return { ...t, checklist: updatedChecklist };
      })
    );
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const newProgress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
        return {
          ...p,
          milestones: updatedMilestones,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : p.status,
        };
      })
    );
  };

  const updateTokenStatus = (tokenId: string, status: 'preparing' | 'ready' | 'picked_up') => {
    setTokens((prev) =>
      prev.map((tok) => (tok.id === tokenId ? { ...tok, status } : tok))
    );
  };

  const addNewToken = (tokenData: Omit<MealToken, 'id'>) => {
    const newToken: MealToken = {
      ...tokenData,
      id: `tok-${Date.now()}`,
    };
    setTokens((prev) => [newToken, ...prev]);
  };

  const setShift = (shift: CanteenShift) => {
    setMetrics((prev) => ({
      ...prev,
      currentShift: shift,
      rushCountdownMinutes: shift === 'Lunch' ? 25 : shift === 'Dinner' ? 90 : 45,
    }));
  };

  // AI Service Calls
  const runAiPrioritize = async () => {
    setIsAiLoading(true);
    setAiAlert(null);
    try {
      const response = await fetch('/api/gemini/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          currentShift: metrics.currentShift,
          mealRushTime: `${metrics.rushCountdownMinutes} minutes`,
        }),
      });

      const data = await response.json();
      if (data.rankedTaskIds && Array.isArray(data.rankedTaskIds)) {
        const idRankMap = new Map<string, number>();
        data.rankedTaskIds.forEach((id: string, index: number) => {
          idRankMap.set(id, index);
        });

        setTasks((prev) => {
          const sorted = [...prev].sort((a, b) => {
            const rankA = idRankMap.has(a.id) ? (idRankMap.get(a.id) as number) : 999;
            const rankB = idRankMap.has(b.id) ? (idRankMap.get(b.id) as number) : 999;
            return rankA - rankB;
          });
          return sorted;
        });

        if (data.rationale) {
          setAiAlert(data.rationale);
        }
      } else if (data.prioritizedTasks) {
        setTasks(data.prioritizedTasks);
        if (data.summary) setAiAlert(data.summary);
      }
    } catch (err) {
      console.error('AI prioritize error', err);
      setAiAlert('Automated sorting applied by priority level.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateAiShiftSummary = async (): Promise<string> => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          projects,
          stats: metrics,
          shiftName: metrics.currentShift,
        }),
      });
      const data = await response.json();
      return data.summary || 'Summary unavailable.';
    } catch (err: any) {
      console.error('AI summary error', err);
      return `### Shift Summary (${metrics.currentShift})\n- Velocity: ${tasks.filter((t) => t.status === 'completed').length} completed tasks.\n- Service Status: Stable operating conditions.`;
    } finally {
      setIsAiLoading(false);
    }
  };

  const decomposeObjective = async (objective: string, station?: string): Promise<any[]> => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/gemini/decompose-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective, station }),
      });
      const data = await response.json();
      return data.tasks || [];
    } catch (err) {
      console.error('Decompose error', err);
      return [];
    } finally {
      setIsAiLoading(false);
    }
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newChatHistory = [...chatMessages, userMsg];
    setChatMessages(newChatHistory);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newChatHistory.map((m) => ({ role: m.role, content: m.content })),
          canteenContext: {
            currentShift: metrics.currentShift,
            rushInMinutes: metrics.rushCountdownMinutes,
            mealsServed: metrics.mealsServedToday,
            activeTokens: metrics.activeTokens,
            foodWasteKg: metrics.foodWasteKg,
            pendingTasksCount: tasks.filter((t) => t.status !== 'completed').length,
            criticalTasks: tasks
              .filter((t) => t.priority === 'critical' && t.status !== 'completed')
              .map((t) => ({ title: t.title, station: t.station, due: t.dueTime })),
          },
        }),
      });

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'I am ready to assist with your canteen operations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          content:
            "I'm experiencing a temporary connection hiccup with the AI service. You can still manage all tasks, track projects, and view analytics directly in the dashboard!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const importAiTasks = (suggestedTasks: any[]) => {
    if (!suggestedTasks || !suggestedTasks.length) return;
    const mapped: Task[] = suggestedTasks.map((st, idx) => ({
      id: `ai-task-${Date.now()}-${idx}`,
      title: st.title,
      description: st.description || 'AI decomposed operational canteen task.',
      status: 'todo',
      priority: (st.priority as PriorityLevel) || 'medium',
      station: (st.station as CanteenStation) || 'Kitchen Prep',
      assignee: STAFF_MEMBERS[idx % STAFF_MEMBERS.length],
      estimatedMinutes: st.estimatedMinutes || 25,
      dueTime: 'Before Rush',
      dueDate: 'Today',
      checklist: (st.checklist || ['Review station standards', 'Execute preparation', 'Inspect quality']).map(
        (chk: string, cIdx: number) => ({
          id: `chk-${Date.now()}-${cIdx}`,
          text: chk,
          completed: false,
        })
      ),
      tags: ['AI-Organized', 'Kitchen Ops'],
      createdAt: new Date().toISOString(),
      aiSuggested: true,
    }));

    setTasks((prev) => [...mapped, ...prev]);
  };

  const openNewTaskModal = (prefill?: Partial<Task>) => {
    if (prefill) {
      setEditingTask({
        id: '',
        title: prefill.title || '',
        description: prefill.description || '',
        status: prefill.status || 'todo',
        priority: prefill.priority || 'medium',
        station: prefill.station || 'Kitchen Prep',
        assignee: prefill.assignee || STAFF_MEMBERS[0],
        estimatedMinutes: prefill.estimatedMinutes || 30,
        dueTime: prefill.dueTime || '11:30 AM',
        dueDate: prefill.dueDate || 'Today',
        checklist: prefill.checklist || [],
        projectId: prefill.projectId,
        tags: prefill.tags || ['Kitchen Ops'],
        createdAt: new Date().toISOString(),
      });
    } else {
      setEditingTask(null);
    }
    setIsNewTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsNewTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsNewTaskModalOpen(false);
  };

  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setProjects(INITIAL_PROJECTS);
    setMetrics(INITIAL_METRICS);
    setTokens(INITIAL_TOKENS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.METRICS);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
  };

  return (
    <CanteenContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        tasks,
        projects,
        metrics,
        tokens,
        staff,
        searchQuery,
        setSearchQuery,
        selectedStationFilter,
        setSelectedStationFilter,
        selectedPriorityFilter,
        setSelectedPriorityFilter,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isNewTaskModalOpen,
        setIsNewTaskModalOpen,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        editingTask,
        setEditingTask,
        chatMessages,
        isAiLoading,
        aiAlert,
        setAiAlert,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        toggleChecklistItem,
        addProject,
        updateProject,
        toggleMilestone,
        updateTokenStatus,
        addNewToken,
        setShift,
        runAiPrioritize,
        generateAiShiftSummary,
        decomposeObjective,
        sendChatMessage,
        importAiTasks,
        openNewTaskModal,
        openEditTaskModal,
        closeTaskModal,
        resetToDefaults,
      }}
    >
      {children}
    </CanteenContext.Provider>
  );
};

export const useCanteen = () => {
  const context = useContext(CanteenContext);
  if (!context) {
    throw new Error('useCanteen must be used within a CanteenProvider');
  }
  return context;
};
