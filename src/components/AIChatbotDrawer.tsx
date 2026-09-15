import React, { useState, useRef, useEffect } from 'react';
import { useCanteen } from '../context/CanteenContext';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Plus,
  RefreshCw,
  User,
  CheckCircle2,
  Clock,
  Flame,
  FileText,
  Trash2,
} from 'lucide-react';

interface AIChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isFullPageView?: boolean;
}

export const AIChatbotDrawer: React.FC<AIChatbotDrawerProps> = ({
  isOpen,
  onClose,
  isFullPageView = false,
}) => {
  const {
    chatMessages,
    sendChatMessage,
    isAiLoading,
    importAiTasks,
    metrics,
    tasks,
    projects,
  } = useCanteen();

  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiLoading]);

  const quickPrompts = [
    {
      label: '⚡ Prioritize Shift Tasks',
      prompt: `Analyze our active tasks for the ${metrics.currentShift} shift and prioritize them based on HACCP food safety and the upcoming meal rush.`,
    },
    {
      label: '📋 Summarize Shift Progress',
      prompt: `Generate an executive shift progress report summarizing completed kitchen prep, active meal tokens, and pending handover items.`,
    },
    {
      label: '🍱 Plan 120-Person VIP Catering',
      prompt: `We have a VIP lunch banquet for 120 guests tomorrow. Break down this objective into actionable station tasks with checklists and estimated times.`,
    },
    {
      label: '🌱 Reduce Buffet Food Waste',
      prompt: `What are 3 practical operational adjustments our kitchen team can make right now to cut buffet plate waste and vegetable prep loss?`,
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isAiLoading) return;
    setInputPrompt('');
    await sendChatMessage(text);
  };

  if (!isOpen && !isFullPageView) return null;

  const content = (
    <div className={`flex flex-col h-full bg-white ${isFullPageView ? 'rounded-2xl border border-stone-200 shadow-2xs' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900">CanteenAI Copilot</h2>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full border border-amber-200">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Kitchen operations, shift prioritization & task organizer
            </p>
          </div>
        </div>

        {!isFullPageView && (
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-3 bg-stone-50/50 border-b border-stone-100 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" /> Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isAiLoading}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 text-stone-700 whitespace-nowrap transition shadow-2xs shrink-0"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-stone-100 text-stone-900 rounded-tl-xs border border-stone-200/80 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* If AI provided suggested tasks, render a 1-click import button */}
                {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-stone-200 space-y-2">
                    <span className="font-bold text-[11px] text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Suggested Kitchen Tasks:
                    </span>
                    <div className="space-y-1">
                      {msg.suggestedTasks.map((st, i) => (
                        <div key={i} className="p-2 rounded bg-white text-stone-800 border border-stone-200 text-[11px]">
                          <strong>{st.title}</strong> — {st.station} ({st.estimatedMinutes}m)
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => importAiTasks(msg.suggestedTasks!)}
                      className="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Import All to Task Board
                    </button>
                  </div>
                )}

                <div className="text-[10px] text-stone-400 text-right">{msg.timestamp}</div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAiLoading && (
          <div className="flex gap-3 items-center text-xs text-stone-500 italic p-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600/80 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <span>CanteenAI is analyzing kitchen workload and formulating guidance...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-stone-200 bg-stone-50/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            id="ai-assistant-input"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask CanteenAI to organize tasks, balance stations, summarize..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
            disabled={isAiLoading}
          />
          <button
            type="submit"
            id="ai-assistant-send-btn"
            disabled={!inputPrompt.trim() || isAiLoading}
            className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white shadow-xs transition shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 mt-1.5 text-center">
          Powered by server-side Gemini 3.8 Flash • Contextualized to real-time canteen status
        </p>
      </div>
    </div>
  );

  if (isFullPageView) {
    return content;
  }

  return (
    <div
      id="ai-chat-drawer-container"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg h-full shadow-2xl animate-in slide-in-from-right duration-300">
        {content}
      </div>
    </div>
  );
};
