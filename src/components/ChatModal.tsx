import React, { useState } from 'react';
import { X, Send, ShieldCheck, MapPin, CheckCheck } from 'lucide-react';
import { ChatConversation, Listing } from '../types';
import { formatPKR } from '../utils/formatters';

interface ChatModalProps {
  conversation: ChatConversation;
  listing?: Listing;
  onClose: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
}

const QUICK_PROMPTS = [
  'Is this still available?',
  'What is your final price in PKR?',
  'Is the biometric transfer available on spot?',
  'Can we meet at a safe bank branch for inspection?',
];

export const ChatModal: React.FC<ChatModalProps> = ({
  conversation,
  onClose,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    onSendMessage(conversation.id, text.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl h-[600px] flex flex-col bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-900/60 bg-[#03261a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#065f46] to-[#022c1e] border border-[#d4af37]/40 flex items-center justify-center text-white font-bold text-sm">
              {conversation.otherPartyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{conversation.otherPartyName}</span>
                {conversation.otherPartyVerified && (
                  <span title="Verified Phone">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-emerald-400">Verified Pakistani Seller</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing Context Bar */}
        <div className="px-5 py-2.5 bg-[#021810] border-b border-emerald-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={conversation.listingImage}
              alt={conversation.listingTitle}
              className="w-9 h-9 rounded object-cover border border-emerald-900"
            />
            <div className="min-w-0">
              <span className="text-white font-medium truncate block max-w-[240px]">
                {conversation.listingTitle}
              </span>
              <span className="text-[#f6e09e] font-mono font-bold">
                {formatPKR(conversation.listingPrice)}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-300/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
            Direct Trade
          </span>
        </div>

        {/* Safety Banner */}
        <div className="px-5 py-2 bg-amber-950/20 border-b border-amber-900/30 text-[11px] text-amber-200/90 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
          <span>Safety Notice: Meet in safe public venues. Never send advance deposits.</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#01140e]">
          {conversation.messages.map((msg) => {
            const isMe = msg.sender === 'buyer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-br-none border border-emerald-600/40'
                      : 'bg-[#03281c] text-slate-200 rounded-bl-none border border-[#d4af37]/25'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#021810] border-t border-emerald-950 overflow-x-auto no-scrollbar flex items-center gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] text-slate-300 hover:text-white bg-[#03261a] hover:bg-emerald-900/60 border border-emerald-800/60 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#03261a] border-t border-emerald-900/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message in English or Urdu..."
              className="flex-1 px-3.5 py-2 bg-[#021c13] border border-emerald-800 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#d4af37] disabled:opacity-40 hover:bg-[#e5c158] text-[#021f15] rounded-lg transition-colors shadow-md"
            >
              <Send className="w-4 h-4 text-[#021f15]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
