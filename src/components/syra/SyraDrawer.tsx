import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Clock,
  Shield,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/db';

export interface SyraAction {
  type: string;
  label: string;
  payload?: any;
  page?: string;
  caseNumber?: string;
  filters?: any;
  reportType?: string;
  institutionId?: string;
  requiresConfirmation?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'syra';
  text: string;
  action?: SyraAction | null;
  status?: 'pending_confirmation' | 'executed' | 'cancelled';
  timestamp: string;
}

interface SyraDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string, state?: any) => void;
  onOpenCase?: (caseNumber: string) => void;
  onOpenInstitution?: (instId: string) => void;
}

export const SyraDrawer: React.FC<SyraDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCase,
  onOpenInstitution,
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'syra',
      text: `Hello ${currentUser?.name || 'Officer'}. I am SYRA, your AICTE Unified Complaint Intelligence Assistant.\n\nI can help you navigate records, cross-reference complaints across bureaus, detect duplicate filings, and draft regulatory actions with full audit verification.`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickChips = [
    'Register complaint for ABC Institute',
    'Open case SYN-1042',
    'Find pending fee complaints in Maharashtra',
    'Check whether this complaint is already reported',
    'Prepare monthly PGRC report',
    'Prepare escalation for overdue case',
    'Open the institution directory',
    'What should I do next?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini/syra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          userRole: currentUser?.role,
          currentContext: {
            officerName: currentUser?.name,
            bureau: currentUser?.bureauCode,
          },
        }),
      });

      const data = await response.json();
      const syraMsg: ChatMessage = {
        id: `msg-${Date.now()}-s`,
        sender: 'syra',
        text: data.text || 'I have processed your inquiry.',
        action: data.action,
        status: data.action?.requiresConfirmation !== false && data.action ? 'pending_confirmation' : undefined,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, syraMsg]);
    } catch (err) {
      console.error('SYRA query error:', err);
      // Client-side fallback handling for resilience
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-s`,
          sender: 'syra',
          text: `I analyzed: "${prompt}". Ready to assist with complaint docket navigation, cross-bureau overlap analysis, and coordination room updates.`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExecuteAction = (msgId: string, action: SyraAction) => {
    // Audit the human confirmation of AI suggestion
    db.addAuditEvent({
      eventType: 'AI Suggested Action',
      actorName: currentUser?.name || 'Officer',
      actorRole: currentUser?.role || 'Bureau Officer',
      details: `User executed SYRA action: ${action.label} (${action.type})`,
      isAiSuggested: true,
    });

    if (action.type === 'navigate') {
      onNavigate(action.payload?.page || action.page || '/dashboard');
      onClose();
    } else if (action.type === 'open_case') {
      if (onOpenCase) {
        onOpenCase(action.payload?.caseNumber || action.caseNumber || 'SYN-1042');
      } else {
        onNavigate(`/complaints?search=${action.payload?.caseNumber || action.caseNumber}`);
      }
      onClose();
    } else if (action.type === 'filter_cases') {
      onNavigate(`/complaints`, { filters: action.payload?.filters || action.filters });
      onClose();
    } else if (action.type === 'prepare_complaint') {
      onNavigate('/register-complaint', { prefill: action.payload });
      onClose();
    } else if (action.type === 'view_overlap') {
      onNavigate('/overlap-alerts');
      onClose();
    } else if (action.type === 'open_report') {
      onNavigate('/reports', { reportType: action.payload?.reportType || action.reportType });
      onClose();
    } else if (action.type === 'draft_escalation') {
      onNavigate(`/complaints?search=${action.payload?.caseNumber || 'SYN-1042'}&escalate=true`);
      onClose();
    } else if (action.type === 'open_institution_summary') {
      if (onOpenInstitution) {
        onOpenInstitution(action.payload?.institutionId || '1-43289012');
      } else {
        onNavigate('/institutions');
      }
      onClose();
    }

    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: 'executed' } : m))
    );
  };

  const handleCancelAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: 'cancelled' } : m))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-[#E3E3E6] shadow-2xl z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-[#1F1F24] text-white p-4 flex items-center justify-between border-b border-[#2D2D35]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[2px] bg-[#C9AE7C] text-[#1F1F24] flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[#C9AE7C] tracking-wide">
                SYRA Assistant
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#2D2D35] text-gray-300 rounded">
                v2.6
              </span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Not Just Answers. Actions.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2D2D35] rounded-[2px] transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Decision-Support Disclaimer Banner */}
      <div className="bg-[#FAF6EE] border-b border-[#C9AE7C]/30 px-3.5 py-2 text-[11px] text-[#8C6D2E] flex items-center gap-2">
        <Shield size={14} className="shrink-0 text-[#C9AE7C]" />
        <span>SYRA assists with workflow & overlap detection. Consequential actions require officer confirmation.</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9F9FA]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-[3px] text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#1F1F24] text-white'
                  : 'bg-white border border-[#E3E3E6] text-[#1F1F24] shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
              }`}
            >
              {msg.text}
            </div>

            {/* Action Preview Card if tool returned action */}
            {msg.action && (
              <div className="mt-2 w-full max-w-[92%] bg-white border-2 border-[#C9AE7C] rounded-[3px] p-3 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#8C6D2E] font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} /> Proposed Action Preview
                  </span>
                  <span className="text-[10px] font-mono bg-[#FAF6EE] px-1 py-0.2 rounded border border-[#C9AE7C]/40">
                    {msg.action.type}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#1F1F24]">{msg.action.label}</div>

                {msg.action.payload && (
                  <div className="bg-[#FAF9F7] border border-[#E3E3E6] p-2 rounded text-[11px] font-mono text-[#3A3A40] space-y-0.5">
                    {Object.entries(msg.action.payload).map(([key, val]) => (
                      <div key={key} className="truncate">
                        <span className="text-gray-500">{key}:</span> {String(val)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Execution state buttons */}
                {msg.status === 'executed' ? (
                  <div className="text-xs text-[#4F8A6B] flex items-center gap-1.5 font-semibold pt-1">
                    <CheckCircle2 size={13} />
                    <span>Action Confirmed & Executed</span>
                  </div>
                ) : msg.status === 'cancelled' ? (
                  <div className="text-xs text-gray-500 italic pt-1">Action Cancelled by User</div>
                ) : (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3E3E6]">
                    <button
                      type="button"
                      onClick={() => handleCancelAction(msg.id)}
                      className="px-2.5 py-1 text-xs border border-[#E3E3E6] text-[#3A3A40] hover:bg-gray-100 rounded-[2px] transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExecuteAction(msg.id, msg.action!)}
                      className="px-3 py-1 text-xs uppercase tracking-wider font-semibold bg-[#1F1F24] text-[#C9AE7C] hover:bg-black rounded-[2px] transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>Confirm & Execute</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <span className="text-[9px] text-[#3A3A40]/50 mt-1 font-mono">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-[#E3E3E6] p-2.5 rounded-[3px] w-28">
            <Sparkles size={13} className="text-[#C9AE7C] animate-spin" />
            <span>Analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Chips */}
      <div className="px-3.5 py-2 bg-white border-t border-[#E3E3E6] overflow-x-auto whitespace-nowrap space-x-1.5 flex scrollbar-none">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(chip)}
            className="inline-block px-2.5 py-1 text-[11px] bg-[#F2F2F3] hover:bg-[#EBEBEF] text-[#3A3A40] hover:text-[#1F1F24] border border-[#E3E3E6] rounded-[2px] shrink-0 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-[#E3E3E6] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask SYRA to find cases, detect overlaps, pre-fill forms..."
          className="flex-1 bg-[#F2F2F3] border border-[#E3E3E6] rounded-[2px] px-3 py-2 text-xs text-[#1F1F24] focus:outline-none focus:border-[#C9AE7C] focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-[#1F1F24] disabled:opacity-40 text-[#C9AE7C] hover:bg-black p-2 rounded-[2px] transition-colors"
          title="Send Command"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
