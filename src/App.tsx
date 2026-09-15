import React, { useState, useEffect } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TaskManagementView } from './components/TaskManagementView';
import { ProjectsView } from './components/ProjectsView';
import { PrioritiesView } from './components/PrioritiesView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIChatbotDrawer } from './components/AIChatbotDrawer';
import { TaskModal } from './components/TaskModal';
import { ProjectModal } from './components/ProjectModal';
import { ShiftSummaryModal } from './components/ShiftSummaryModal';
import { DecomposeModal } from './components/DecomposeModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Project } from './types';

const MainApp: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    isAiChatOpen,
    setIsAiChatOpen,
    isShiftSummaryOpen,
    setIsShiftSummaryOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
  } = useCanteen();

  const [decomposeTargetProject, setDecomposeTargetProject] = useState<Project | null>(null);
  const [isDecomposeModalOpen, setIsDecomposeModalOpen] = useState(false);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  const handleDecomposeProject = (project: Project) => {
    setDecomposeTargetProject(project);
    setIsDecomposeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex antialiased font-sans">
      {/* Structural Desktop / Mobile Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Header with Metrics, Search & Assistant trigger */}
        <Header />

        {/* Content View Container */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto pb-16">
          {currentTab === 'dashboard' && (
            <DashboardView
              onOpenDecompose={() => {
                setDecomposeTargetProject(null);
                setIsDecomposeModalOpen(true);
              }}
            />
          )}

          {currentTab === 'tasks' && <TaskManagementView />}

          {currentTab === 'projects' && (
            <ProjectsView onDecomposeProject={handleDecomposeProject} />
          )}

          {currentTab === 'priorities' && <PrioritiesView />}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'assistant' && (
            <div className="h-[calc(100vh-140px)]">
              <AIChatbotDrawer
                isOpen={true}
                onClose={() => setCurrentTab('dashboard')}
                isFullPageView={true}
              />
            </div>
          )}
        </main>
      </div>

      {/* Slide-over AI Chatbot Drawer (when opened from Header or shortcuts) */}
      {currentTab !== 'assistant' && (
        <AIChatbotDrawer
          isOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
        />
      )}

      {/* Modals */}
      <TaskModal />
      <ProjectModal />
      <ShiftSummaryModal
        isOpen={isShiftSummaryOpen}
        onClose={() => setIsShiftSummaryOpen(false)}
      />
      <DecomposeModal
        isOpen={isDecomposeModalOpen}
        onClose={() => {
          setIsDecomposeModalOpen(false);
          setDecomposeTargetProject(null);
        }}
        targetProject={decomposeTargetProject}
      />
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <CanteenProvider>
      <MainApp />
    </CanteenProvider>
  );
}
