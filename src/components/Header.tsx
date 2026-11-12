import React from 'react';
import { PlusCircle, Shield, Sparkles, User, LogOut, KeyRound, LayoutDashboard } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  activeTab: 'marketplace' | 'categories' | 'rules' | 'admin' | 'dashboard';
  onSelectTab: (tab: 'marketplace' | 'categories' | 'rules' | 'admin' | 'dashboard') => void;
  onOpenPostAd: () => void;
  isAdminUnlocked: boolean;
  currentUser: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenPostAd,
  isAdminUnlocked,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#021810]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-lg shadow-black/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark with Official 3D Gold Logo */}
        <button
          onClick={() => onSelectTab('marketplace')}
          className="text-left group flex items-center gap-3 focus:outline-none shrink-0"
        >
          <img
            src="/assets/aistudio/image_b0ecc101.png"
            alt="WAGE PAKISTAN"
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)] group-hover:scale-[1.02] transition-transform duration-300"
          />
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'marketplace'
                ? 'text-[#f6e09e] border-b-2 border-[#d4af37]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Marketplace
          </button>

          <button
            onClick={() => onSelectTab('categories')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'categories'
                ? 'text-[#f6e09e] border-b-2 border-[#d4af37]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Categories
          </button>

          {currentUser ? (
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-[#f6e09e] border-b-2 border-[#d4af37]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>User Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('register')}
              className="whitespace-nowrap shrink-0 transition-colors py-1 text-slate-300 hover:text-[#f6e09e]"
            >
              Register Account
            </button>
          )}

          <button
            onClick={() => onSelectTab('rules')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'text-[#f6e09e] border-b-2 border-[#d4af37]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
            Rules & Glossary
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'text-[#f6e09e] border-b-2 border-[#d4af37]'
                : 'text-emerald-300/80 hover:text-emerald-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Admin Portal {isAdminUnlocked ? '(Active)' : ''}
          </button>
        </nav>

        {/* Zone 3: Actions (Auth / Dashboard / Post Ad) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTab('dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#03281c] hover:bg-emerald-900/60 border border-[#d4af37]/40 rounded-lg text-xs text-slate-200 transition-colors"
                title="Go to User Dashboard"
              >
                <div className="w-5 h-5 rounded-full bg-[#065f46] text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left font-mono">
                  <span className="font-bold text-white block text-[11px] truncate max-w-[100px]">{currentUser.name}</span>
                  <span className="text-[10px] text-[#f6e09e]">Acc #{currentUser.accountNumber}</span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-900/60 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-emerald-950/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#f6e09e] bg-[#03261a] hover:bg-emerald-900 border border-[#d4af37]/40 rounded-lg transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Register</span>
              </button>
            </div>
          )}

          <button
            onClick={onOpenPostAd}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#021f15] bg-gradient-to-r from-[#fef3c7] via-[#d4af37] to-[#e5c158] hover:from-white hover:to-[#d4af37] rounded-lg shadow-md hover:shadow-lg shadow-[#d4af37]/20 transition-all duration-200 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#021f15]" />
            <span>Post Ad</span>
          </button>
        </div>
      </div>
    </header>
  );
};
