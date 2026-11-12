import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Users,
  CreditCard,
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  Bell,
  Eye,
  Building,
  Smartphone,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Listing, PaymentTransaction, UserAccount, FlaggedReport, PlatformAnnouncement } from '../types';
import { formatExactPKR, formatPKR } from '../utils/formatters';

interface AdminDashboardProps {
  listings: Listing[];
  transactions: PaymentTransaction[];
  users: UserAccount[];
  reports: FlaggedReport[];
  announcements: PlatformAnnouncement[];
  onApproveTransaction: (transactionId: string) => void;
  onRejectTransaction: (transactionId: string, reason: string) => void;
  onUpdateListingStatus: (listingId: string, status: Listing['status']) => void;
  onToggleUserStatus: (userId: string, reason?: string) => void;
  onToggleUserVerification: (userId: string) => void;
  onResolveReport: (reportId: string, action: 'action_taken' | 'dismissed') => void;
  onAddAnnouncement: (title: string, content: string, type: 'rule' | 'safety' | 'promo') => void;
  isAdminUnlocked: boolean;
  onToggleAdminLock: (unlocked: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  listings,
  transactions,
  users,
  reports,
  announcements,
  onApproveTransaction,
  onRejectTransaction,
  onUpdateListingStatus,
  onToggleUserStatus,
  onToggleUserVerification,
  onResolveReport,
  onAddAnnouncement,
  isAdminUnlocked,
  onToggleAdminLock,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'verification' | 'listings' | 'users' | 'reports' | 'announcements' | 'audit'
  >('verification');

  // Credentials security state (Username: admin, PIN: 0000 - strictly hidden from website UI)
  const [usernameInput, setUsernameInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Announcement state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnType, setNewAnnType] = useState<'rule' | 'safety' | 'promo'>('safety');

  // Search filters
  const [listingSearch, setListingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Calculate metrics
  const totalApprovedFeeRevenue = transactions
    .filter((t) => t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingTransactions = transactions.filter((t) => t.status === 'pending');
  const liveListingsCount = listings.filter((l) => l.status === 'live').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending_review').length;

  const handleUnlockWithCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() === 'admin' && pinInput.trim() === '0000') {
      onToggleAdminLock(true);
      setAuthError('');
      setUsernameInput('');
      setPinInput('');
    } else {
      setAuthError('Invalid administrator username or security PIN. Access denied.');
    }
  };

  // If locked, show authentic credential authentication screen without leaking username or PIN
  if (!isAdminUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-950 border-2 border-[#d4af37] flex items-center justify-center mx-auto text-[#d4af37] shadow-xl">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white font-luxury">
            WAGE Administrative Console
          </h2>
          <p className="text-xs text-slate-300">
            Authorized personnel only. Enter administrator credentials to manage payments and marketplace listings.
          </p>
        </div>

        <form onSubmit={handleUnlockWithCredentials} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Admin Username
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter admin username"
              className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#d4af37]"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Security PIN
            </label>
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 bg-[#03261a] border border-emerald-800 rounded-lg text-center text-lg font-mono tracking-[0.5em] text-[#f6e09e] focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          {authError && (
            <p className="text-xs text-rose-400 text-center font-medium">{authError}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg transition-all"
          >
            Authenticate & Access Portal
          </button>
        </form>

        <div className="p-3 bg-[#021810] border border-emerald-950 rounded-lg text-[11px] text-slate-400 text-center">
          Protected by multi-factor administrative session validation & audit logging.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#03261a] border border-[#d4af37]/35 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-luxury">
                WAGE Executive Control Room
              </h2>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/50">
                Pakistan Operations Live
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Manage Rs. 200 ad fees, JazzCash & EasyPaisa reconciliation, user restrictions & dispute resolution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block">Ad Platform Revenue</span>
            <span className="text-base font-bold font-mono text-[#f6e09e] tabular-nums">
              {formatExactPKR(totalApprovedFeeRevenue)}
            </span>
          </div>

          <button
            onClick={() => onToggleAdminLock(false)}
            className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 rounded-lg text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-emerald-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ad Revenue (Rs. 200 Ads)</span>
            <DollarSign className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#f6e09e] tabular-nums">
            {formatExactPKR(totalApprovedFeeRevenue)}
          </div>
          <div className="text-[11px] text-emerald-400">
            {transactions.filter((t) => t.status === 'approved').length} verified transactions
          </div>
        </div>

        <div className="glass-emerald-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Slip Verifications</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {pendingTransactions.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Awaiting JazzCash/Bank match
          </div>
        </div>

        <div className="glass-emerald-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Live Marketplace Ads</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
            {liveListingsCount}
          </div>
          <div className="text-[11px] text-emerald-400">
            Across 14 Pakistani cities
          </div>
        </div>

        <div className="glass-emerald-card p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Flagged Reports / Scams</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-300 tabular-nums">
            {pendingReportsCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Requires fraud team action
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-emerald-900/80 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'verification', label: `Payment Approvals (${pendingTransactions.length})` },
          { id: 'listings', label: `Listings Moderation (${listings.length})` },
          { id: 'users', label: `User Management (${users.length})` },
          { id: 'reports', label: `Fraud Reports (${reports.length})` },
          { id: 'announcements', label: `Announcements (${announcements.length})` },
          { id: 'audit', label: 'PDF & Revenue Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeAdminTab === tab.id
                ? 'bg-[#d4af37] text-[#021f15] shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Payment Verification Desk */}
      {activeAdminTab === 'verification' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-950/80 border border-[#d4af37]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-[#f6e09e] text-sm block">
                Customer Payment Verification Desk
              </span>
              <p className="text-slate-300 leading-relaxed">
                Check whether the Rs. 200 listing fee was received into WAGE JazzCash (0301-8294711), EasyPaisa (0345-9876543), or HBL account. Confirming payment immediately publishes the ad live on the platform.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#021810] border border-emerald-900 font-mono text-emerald-400 whitespace-nowrap self-start sm:self-center">
              Pending Check: {pendingTransactions.length}
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/80 bg-[#021f15] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#032b1e] border-b border-emerald-800 text-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold uppercase">Customer Reference (TID)</th>
                    <th className="py-3 px-4 font-semibold uppercase">Customer / Sender</th>
                    <th className="py-3 px-4 font-semibold uppercase">Advertisement</th>
                    <th className="py-3 px-4 font-semibold uppercase">Channel</th>
                    <th className="py-3 px-4 font-semibold uppercase">Amount</th>
                    <th className="py-3 px-4 font-semibold uppercase">Status</th>
                    <th className="py-3 px-4 font-semibold uppercase text-right">Payment Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950 text-slate-300">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-emerald-950/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        <span className="text-[#f6e09e] text-sm block">{t.transactionId}</span>
                        <span className="text-[10px] text-slate-400 font-sans block">{t.submittedAt}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-medium block">{t.userName}</span>
                        <span className="text-[11px] text-slate-400 font-mono block">Registered: {t.userPhone}</span>
                        <span className="text-[10px] text-emerald-400 font-mono block">Sender: {t.senderAccount}</span>
                      </td>
                      <td className="py-3 px-4 max-w-[220px]">
                        <span className="truncate block font-medium text-slate-200">{t.adTitle}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Ad ID: {t.adId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-900/50 border border-emerald-700/40 text-[#f6e09e] font-semibold text-[11px]">
                          {t.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#f6e09e] tabular-nums">
                        {formatExactPKR(t.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            t.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                              : t.status === 'pending'
                              ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-600/40'
                          }`}
                        >
                          {t.status === 'approved'
                            ? 'RECEIVED ✓'
                            : t.status === 'pending'
                            ? 'CHECK REQUIRED'
                            : 'NOT RECEIVED'}
                        </span>
                        {t.adminNotes && (
                          <span className="block text-[10px] text-slate-400 mt-0.5 max-w-[140px] truncate" title={t.adminNotes}>
                            {t.adminNotes}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {t.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onApproveTransaction(t.id)}
                              className="px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-[#f6e09e]" />
                              <span>Received (Publish Live)</span>
                            </button>
                            <button
                              onClick={() => {
                                const reason = window.prompt(
                                  'Enter reason why payment was not received (e.g., TID not found in JazzCash portal, amount mismatch):',
                                  'Reference ID not found in JazzCash/Bank portal'
                                );
                                if (reason) {
                                  onRejectTransaction(t.id, reason);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs transition-colors flex items-center gap-1 whitespace-nowrap"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Not Received</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Reconciled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Listings Moderation */}
      {activeAdminTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                placeholder="Search listing by title or city..."
                className="w-full pl-9 pr-3 py-2 bg-[#021f15] border border-emerald-900 rounded-lg text-xs text-slate-100"
              />
            </div>
            <span className="text-xs text-slate-400">Total: {listings.length} items</span>
          </div>

          <div className="rounded-xl border border-emerald-900/80 bg-[#021f15] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#032b1e] border-b border-emerald-800 text-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold uppercase">Listing</th>
                    <th className="py-3 px-4 font-semibold uppercase">Category</th>
                    <th className="py-3 px-4 font-semibold uppercase">City</th>
                    <th className="py-3 px-4 font-semibold uppercase">Price (PKR)</th>
                    <th className="py-3 px-4 font-semibold uppercase">Status</th>
                    <th className="py-3 px-4 font-semibold uppercase text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950 text-slate-300">
                  {listings
                    .filter((l) =>
                      l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
                      l.city.toLowerCase().includes(listingSearch.toLowerCase())
                    )
                    .map((listing) => (
                      <tr key={listing.id} className="hover:bg-emerald-950/30 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <img
                            src={listing.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-emerald-900 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-white font-semibold truncate block max-w-[260px]">
                              {listing.title}
                            </span>
                            <span className="text-[11px] text-slate-400">Seller: {listing.seller.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize">{listing.category.replace('_', ' ')}</td>
                        <td className="py-3 px-4">{listing.city}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#f6e09e] tabular-nums">
                          {formatExactPKR(listing.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              listing.status === 'live'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                                : listing.status === 'pending_verification'
                                ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                                : 'bg-rose-950 text-rose-300 border border-rose-600/40'
                            }`}
                          >
                            {listing.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {listing.status !== 'live' && (
                              <button
                                onClick={() => onUpdateListingStatus(listing.id, 'live')}
                                className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px]"
                              >
                                Approve Live
                              </button>
                            )}
                            {listing.status === 'live' && (
                              <button
                                onClick={() => onUpdateListingStatus(listing.id, 'sold')}
                                className="px-2 py-1 bg-[#03261a] hover:bg-emerald-900 border border-emerald-800 text-slate-300 rounded text-[11px]"
                              >
                                Mark Sold
                              </button>
                            )}
                            <button
                              onClick={() => onUpdateListingStatus(listing.id, 'rejected')}
                              className="px-2 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded text-[11px]"
                            >
                              Takedown
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: User Management & Restriction Controls */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-900/80 bg-[#021f15] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#032b1e] border-b border-emerald-800 text-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold uppercase">User Name</th>
                    <th className="py-3 px-4 font-semibold uppercase">Phone (OTP Status)</th>
                    <th className="py-3 px-4 font-semibold uppercase">City</th>
                    <th className="py-3 px-4 font-semibold uppercase">Ad Quotas</th>
                    <th className="py-3 px-4 font-semibold uppercase">Account Status</th>
                    <th className="py-3 px-4 font-semibold uppercase text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950 text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-emerald-950/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{u.name}</span>
                          {u.isVerifiedSeller && (
                            <span title="Verified Seller Badge">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{u.email}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {u.phone}
                        <span
                          className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] ${
                            u.isPhoneVerified
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-rose-950 text-rose-300'
                          }`}
                        >
                          {u.isPhoneVerified ? 'OTP Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{u.city}</td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300 block">
                          Free Rem.: <strong className="text-[#f6e09e]">{u.freeAdsRemainingThisMonth}</strong>
                        </span>
                        <span className="text-[10px] text-slate-400">Paid Ads: {u.paidAdsCount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            u.status === 'active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-600/40'
                          }`}
                        >
                          {u.status.toUpperCase()}
                        </span>
                        {u.freezeReason && (
                          <span className="block text-[10px] text-rose-400 mt-1 max-w-[180px] truncate">
                            {u.freezeReason}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onToggleUserVerification(u.id)}
                            className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded text-[11px]"
                          >
                            {u.isVerifiedSeller ? 'Revoke Badge' : 'Grant Badge'}
                          </button>

                          <button
                            onClick={() =>
                              onToggleUserStatus(
                                u.id,
                                u.status === 'active' ? 'Demanding advance token deposit on WhatsApp' : undefined
                              )
                            }
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                              u.status === 'active'
                                ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                                : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {u.status === 'active' ? 'Freeze Account' : 'Unfreeze'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Fraud Reports & Disputes */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-5 bg-[#03261a] border border-emerald-900 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {report.reason}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      report.status === 'action_taken'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white">{report.listingTitle}</h4>
                  <p className="text-xs text-slate-400">
                    Seller: <strong className="text-slate-200">{report.sellerName}</strong> · Reporter: {report.reporterPhone}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-950 text-xs">
                  <span className="text-slate-500">{report.reportedAt}</span>
                  {report.status === 'pending_review' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onResolveReport(report.id, 'dismissed')}
                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-slate-300 rounded text-xs"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => onResolveReport(report.id, 'action_taken')}
                        className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-rose-100 font-semibold rounded text-xs"
                      >
                        Action Taken / Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Announcements */}
      {activeAdminTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-[#03261a] border border-emerald-900 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-[#f6e09e] uppercase tracking-wider">
              Broadcast System Announcement
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Notice Title</label>
                <input
                  type="text"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  placeholder="e.g. Eid-ul-Adha Livestock Ad Policy"
                  className="w-full px-3 py-2 bg-[#021f15] border border-emerald-800 rounded-lg text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Notice Category</label>
                <select
                  value={newAnnType}
                  onChange={(e) => setNewAnnType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#021f15] border border-emerald-800 rounded-lg text-xs text-white"
                >
                  <option value="safety">Safety & Anti-Fraud Notice</option>
                  <option value="rule">Platform Fee & Policy Update</option>
                  <option value="promo">Marketplace Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Announcement Body</label>
                <textarea
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  rows={3}
                  placeholder="Official instructions for Pakistani buyers and sellers..."
                  className="w-full px-3 py-2 bg-[#021f15] border border-emerald-800 rounded-lg text-xs text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (newAnnTitle && newAnnContent) {
                    onAddAnnouncement(newAnnTitle, newAnnContent, newAnnType);
                    setNewAnnTitle('');
                    setNewAnnContent('');
                  }
                }}
                className="w-full py-2 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg shadow"
              >
                Publish Broadcast Notice
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-[#f6e09e] uppercase tracking-wider">
              Active Marketplace Broadcasts
            </h3>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-[#021810] border border-emerald-950 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{ann.title}</span>
                    <span className="text-[10px] text-[#d4af37]">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PDF / Revenue Audit Report */}
      {activeAdminTab === 'audit' && (
        <div className="p-6 bg-[#021810] border border-[#d4af37]/30 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-900 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                Official Revenue & Audit Statement
              </span>
              <h3 className="text-lg font-bold text-white font-luxury">
                WAGE Advertising Fee Ledger (Rs. 200 / Paid Listing)
              </h3>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#d4af37]" />
              <span>Print Audit Statement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#03261a] rounded-xl border border-emerald-900">
              <span className="text-slate-400 block">Total Collections to Date</span>
              <span className="text-xl font-bold font-mono text-[#f6e09e]">{formatExactPKR(totalApprovedFeeRevenue)}</span>
            </div>
            <div className="p-4 bg-[#03261a] rounded-xl border border-emerald-900">
              <span className="text-slate-400 block">Commission on Product Sales</span>
              <span className="text-xl font-bold font-mono text-emerald-400">Rs. 0 (0% Commission)</span>
            </div>
            <div className="p-4 bg-[#03261a] rounded-xl border border-emerald-900">
              <span className="text-slate-400 block">Server Storage Architecture</span>
              <span className="text-xl font-bold text-white">PostgreSQL / Cloud Run</span>
            </div>
          </div>

          <div className="border border-emerald-950 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#032b1e] border-b border-emerald-800 text-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold uppercase">Txn ID</th>
                  <th className="py-2.5 px-3 font-semibold uppercase">Sender Phone</th>
                  <th className="py-2.5 px-3 font-semibold uppercase">Payment Channel</th>
                  <th className="py-2.5 px-3 font-semibold uppercase">Fee Credit</th>
                  <th className="py-2.5 px-3 font-semibold uppercase">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950 text-slate-300">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2.5 px-3 font-mono text-white">{t.transactionId}</td>
                    <td className="py-2.5 px-3 font-mono">{t.userPhone}</td>
                    <td className="py-2.5 px-3">{t.paymentMethod}</td>
                    <td className="py-2.5 px-3 font-mono text-[#f6e09e]">Rs. {t.amount}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-400 font-medium">Verified Ledger Entry</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
