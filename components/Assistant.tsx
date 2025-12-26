import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Search, Loader2, ExternalLink } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const Assistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Welcome to the Strategic Operations Assistant. I am connected to live data sources. I can help with macro-level event coordination, delegation status checks, and international regulatory compliance. How can I assist the command center?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await sendMessageToGemini(messages, input);
    
    setMessages(prev => [...prev, response]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
                <h3 className="font-semibold text-white">Ops Intelligence</h3>
                <p className="text-xs text-slate-400">Gemini 2.5 • Strategic Oversight</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-700/80 text-slate-100 rounded-bl-none border border-slate-600'
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                {msg.role === 'model' && <Bot className="w-4 h-4 mt-1 opacity-70" />}
                {msg.role === 'user' && <User className="w-4 h-4 mt-1 opacity-70" />}
                <span className="text-xs font-medium opacity-70">
                    {msg.role === 'user' ? 'Command' : 'Intelligence'}
                </span>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.text}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-600/50">
                  <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                    <Search className="w-3 h-3" /> External Intelligence:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-900 text-cyan-400 px-2 py-1 rounded transition-colors border border-slate-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-slate-700/50 rounded-2xl p-4 flex items-center gap-2 text-slate-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Strategic Data...
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query operational status, international regulations, or venue metrics..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 rounded-xl transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};