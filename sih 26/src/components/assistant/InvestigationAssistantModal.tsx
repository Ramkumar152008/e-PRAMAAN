import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  BookOpen, 
  FileText, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApiClient } from '../../services/apiClient';

interface InvestigationAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: any[];
  usedTools?: string[];
  suggestedActions?: string[];
}

export const InvestigationAssistantModal: React.FC<InvestigationAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const { selectedTender, selectedBidder, setActiveView } = useApp();
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-01',
      sender: 'assistant',
      text: `Greetings, Officer. I am your **Compliance Investigation Assistant**. I provide grounded explanations, retrieve clauses from GFR 2017 / CPCL manuals, evaluate temporal deadlines, and draft clarification notices for **${selectedBidder?.name || 'Selected Bidder'}** under Tender **${selectedTender?.gemBidNo || 'C03H240087'}**.\n\n*Notice: AI operates strictly in a Decision-Support capacity. Procurement Officers retain sole statutory decision authority.*`,
      timestamp: 'Just now',
      usedTools: ['search_knowledge_base', 'retrieve_tender_clause'],
      suggestedActions: [
        'Why was this bidder flagged?',
        'Check temporal validity on bid date',
        'What tender clause applies?',
        'Draft clarification notice'
      ]
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const tenderId = selectedTender?.id || selectedTender?.gemBidNo || 'C03H240087';
      const bidderId = selectedBidder?.id || 'BID-ATC-001';

      const response = await ApiClient.queryAssistant(textToSend, tenderId, bidderId);

      if (response.data) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: response.data.answer,
          timestamp: response.data.timestamp || 'Just now',
          citations: response.data.citations || [],
          usedTools: response.data.usedTools || [],
          suggestedActions: response.data.suggestedActions || []
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        // Fallback local deterministic answer
        const fallbackMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: `**Investigation Analysis for ${selectedBidder?.name || 'Bidder'}**:\n\nBased on CPCL Tender Specifications and GFR 2017 (Rule 144/153), compliance verification requires checking active statutory filings against the bid submission date (${selectedTender?.bidEndDate || '10-Aug-2026'}).\n\n*Officer Action Recommended*: Verify MCA21 Form AOC-4 and OEM MAF backing certificate.`,
          timestamp: 'Just now',
          usedTools: ['search_knowledge_base'],
          suggestedActions: ['Draft Clarification Notice', 'View Truth Graph']
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to reach backend assistant API. Local offline procurement guidelines remain active for Officer review.',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('Clarification')) {
      onClose();
      setActiveView('clarification-center');
    } else if (action.includes('Truth Graph') || action.includes('Evidence Graph')) {
      onClose();
      setActiveView('truth-graph');
    } else if (action.includes('Matrix')) {
      onClose();
      setActiveView('compliance-matrix');
    } else if (action.includes('Passport')) {
      onClose();
      setActiveView('evidence-passport');
    } else {
      handleSend(action);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 text-xs font-sans">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col h-[85vh] max-h-[720px] border border-slate-300 overflow-hidden">
        
        {/* Institutional Header */}
        <div className="bg-[#0B2347] text-white p-3.5 px-4 flex items-center justify-between border-b border-[#081B38]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600/50 rounded-sm text-blue-200 border border-blue-400/40">
              <Scale className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Compliance Investigation Assistant</h3>
                <span className="px-1.5 py-0.2 rounded-xs text-[9.5px] font-bold bg-blue-900 text-blue-200 border border-blue-700">
                  Decision Support
                </span>
              </div>
              <p className="text-[10.5px] text-slate-300">
                Tender: <span className="font-mono text-amber-300">{selectedTender?.gemBidNo}</span> • Bidder: <span className="font-medium">{selectedBidder?.name}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statutory Governance Disclaimer Bar */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-900">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
            <span>AI provides evidence retrieval & explanations. Final procurement decisions are made by the Officer.</span>
          </span>
          <span className="text-[10px] font-mono text-amber-800 uppercase tracking-wider hidden sm:inline">
            Rule 144 / GFR 2017
          </span>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
          {messages.map((msg) => {
            const isAsst = msg.sender === 'assistant';
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isAsst ? 'items-start' : 'items-end justify-end'}`}>
                {isAsst && (
                  <div className="w-7 h-7 rounded-full bg-[#0B2347] text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-md p-3 shadow-2xs border ${
                  isAsst 
                    ? 'bg-white border-slate-200 text-slate-900' 
                    : 'bg-[#163354] border-blue-900 text-white'
                }`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-bold text-[11px]">
                      {isAsst ? 'e-BID Investigation AI' : 'Procurement Officer (PO-1042)'}
                    </span>
                    <span className={`text-[10px] ${isAsst ? 'text-slate-400' : 'text-blue-200'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="text-[11.5px] leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Tools Used Badge */}
                  {Boolean(msg.usedTools && msg.usedTools.length > 0) && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1 text-[10px] text-slate-500">
                      <span className="font-medium text-slate-600">Permitted Tools:</span>
                      {msg.usedTools?.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 bg-slate-100 border border-slate-200 rounded font-mono text-[9px] text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Grounded Statutory Citations */}
                  {Boolean(msg.citations && msg.citations.length > 0) && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                      <p className="font-bold text-[10.5px] text-[#0B2347] flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-blue-700" />
                        <span>Retrieved Statutory Citations & Sources:</span>
                      </p>
                      <div className="space-y-1">
                        {msg.citations?.map((c: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[10.5px]">
                            <div className="flex items-center justify-between font-bold text-slate-800">
                              <span>{c.document} — {c.section}</span>
                              <span className="text-slate-500 font-normal">Page {c.page}</span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-0.5">{c.snippet || c.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Quick Actions */}
                  {Boolean(msg.suggestedActions && msg.suggestedActions.length > 0) && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Follow-up:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedActions?.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded text-[10.5px] font-medium transition cursor-pointer flex items-center gap-1"
                          >
                            <span>{action}</span>
                            <ChevronRight className="w-3 h-3 text-blue-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}


                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
              <Bot className="w-4 h-4 animate-spin text-blue-600" />
              <span>Searching GFR 2017, CPCL clauses, and evaluating evidence...</span>
            </div>
          )}
        </div>

        {/* Prompt Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about compliance rules, temporal status, discrepancy root causes, or drafting clarification..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-3.5 py-2 bg-[#0B2347] hover:bg-[#163354] disabled:opacity-50 text-white rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
            <span>Powered by e-BID PRAMAAN Domain RAG & Controlled Investigation Pipeline</span>
            <span>Hallucination Guard: Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
