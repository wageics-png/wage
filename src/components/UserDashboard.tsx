import React, { useState } from 'react';
import {
  User,
  Inbox,
  ShoppingBag,
  CreditCard,
  PlusCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Send,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Edit,
  HelpCircle,
  AlertTriangle,
  Mail,
  KeyRound,
  MapPin,
  Phone,
  MessageSquare,
  X,
} from 'lucide-react';

import { Listing, PaymentTransaction, UserAccount, DirectBuyOrder, InboxMessage } from '../types';
import { formatExactPKR, formatPKR } from '../utils/formatters';

interface UserDashboardProps {
  currentUser: UserAccount;
  myListings: Listing[];
  myTransactions: PaymentTransaction[];
  myOrders: DirectBuyOrder[];
  myInboxMessages: InboxMessage[];
  onOpenPostAd: () => void;
  onViewListing: (listing: Listing) => void;
  onEditAd: (listing: Listing) => void;
  onMarkSold: (listingId: string) => void;
  onOpenPaymentGuide: () => void;
  onSendMessage: (recipientAccount: string, subject: string, body: string) => void;
  onOpenRetrievePin: () => void;
  onUpdateOrderStatus?: (orderId: string, status: DirectBuyOrder['status']) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  myListings,
  myTransactions,
  myOrders,
  myInboxMessages,
  onOpenPostAd,
  onViewListing,
  onEditAd,
  onMarkSold,
  onOpenPaymentGuide,
  onSendMessage,
  onOpenRetrievePin,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'orders' | 'payments' | 'ads'>('inbox');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'received' | 'sent' | 'system'>('all');
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(
    myInboxMessages.length > 0 ? myInboxMessages[0] : null
  );

  // Pin visibility toggle
  const [showPin, setShowPin] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compose Message state
  const [isComposing, setIsComposing] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeSuccess, setComposeSuccess] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeRecipient.trim() || !composeSubject.trim() || !composeBody.trim()) return;

    onSendMessage(composeRecipient.trim(), composeSubject.trim(), composeBody.trim());
    setComposeSuccess(true);
    setTimeout(() => {
      setComposeSuccess(false);
      setIsComposing(false);
      setComposeRecipient('');
      setComposeSubject('');
      setComposeBody('');
    }, 1500);
  };

  const filteredMessages = myInboxMessages.filter((msg) => {
    if (inboxFilter === 'system') return msg.type === 'system_credentials';
    if (inboxFilter === 'received') return msg.recipientId === currentUser.id;
    if (inboxFilter === 'sent') return msg.senderId === currentUser.id;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header & Account Details Card */}
      <div className="glass-emerald-card p-6 rounded-2xl relative overflow-hidden border border-[#d4af37]/35 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* User Identity */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#022c1e] border-2 border-[#d4af37]/50 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
              {currentUser.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-luxury">{currentUser.name}</h2>
                {currentUser.isVerifiedSeller && (
                  <span title="Verified Pakistani Trader">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                  {currentUser.phone}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  {currentUser.address}, {currentUser.city}
                </span>
              </p>
            </div>
          </div>

          {/* Account Credentials Strip (8-Digit Acc & 4-Digit PIN) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 8-Digit Account Badge */}
            <div className="p-3 bg-[#021810] border border-emerald-900 rounded-xl text-xs space-y-0.5">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">
                8-Digit Account No.
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-white tracking-wider">
                  {currentUser.accountNumber}
                </span>
                <button
                  onClick={() => copyToClipboard(currentUser.accountNumber, 'acc')}
                  className="p-1 hover:text-[#d4af37] text-slate-400 transition-colors"
                  title="Copy 8-digit account number"
                >
                  {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* 4-Digit PIN Viewer with Eye Toggle */}
            <div className="p-3 bg-[#021810] border border-emerald-900 rounded-xl text-xs space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">
                  4-Digit Security PIN
                </span>
                <button
                  onClick={onOpenRetrievePin}
                  className="text-[10px] text-[#f6e09e] hover:underline"
                >
                  Retrieve
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-[#f6e09e] tracking-[0.25em]">
                  {showPin ? currentUser.pin : '••••'}
                </span>
                <button
                  onClick={() => setShowPin(!showPin)}
                  className="p-1 hover:text-white text-slate-400 transition-colors"
                  title={showPin ? 'Hide PIN' : 'Reveal PIN'}
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => copyToClipboard(currentUser.pin, 'pin')}
                  className="p-1 hover:text-[#d4af37] text-slate-400 transition-colors"
                  title="Copy PIN"
                >
                  {copiedKey === 'pin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quota Indicator */}
            <div className="p-3 bg-[#021810] border border-emerald-900 rounded-xl text-xs space-y-0.5">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Free Ad Quota</span>
              <span className="text-base font-bold text-[#f6e09e]">
                {currentUser.freeAdsRemainingThisMonth} of 1 remaining
              </span>
            </div>

            <button
              onClick={onOpenPostAd}
              className="px-4 py-3 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Ad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-emerald-900/80 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'inbox'
              ? 'bg-[#d4af37] text-[#021f15] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Inbox & Messaging ({myInboxMessages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#d4af37] text-[#021f15] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Buy Orders · 4-Digit Ref ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-[#d4af37] text-[#021f15] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Ad Payments to WAGE ({myTransactions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'ads'
              ? 'bg-[#d4af37] text-[#021f15] shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>My Advertisements ({myListings.length})</span>
        </button>
      </div>

      {/* TAB 1: INBOX & MESSAGING */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#021810] border border-emerald-950 rounded-lg text-xs">
              {(['all', 'received', 'sent', 'system'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setInboxFilter(f)}
                  className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                    inboxFilter === f
                      ? 'bg-[#d4af37] text-[#021f15] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'system' ? 'Credentials & Security' : f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsComposing(!isComposing)}
              className="px-3.5 py-2 bg-[#03261a] hover:bg-emerald-900 border border-[#d4af37]/40 text-[#f6e09e] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isComposing ? 'Close Compose' : 'Compose Message'}</span>
            </button>
          </div>

          {/* Compose Drawer/Box */}
          {isComposing && (
            <form onSubmit={handleSendCompose} className="p-5 bg-[#03281c] border border-[#d4af37]/40 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
                <span className="font-bold text-white font-luxury text-sm">Compose Text Message</span>
                <button type="button" onClick={() => setIsComposing(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {composeSuccess && (
                <div className="p-3 bg-emerald-950 border border-emerald-600 rounded-lg text-emerald-200">
                  Message sent successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Recipient 8-Digit Account No. or Phone *
                  </label>
                  <input
                    type="text"
                    value={composeRecipient}
                    onChange={(e) => setComposeRecipient(e.target.value)}
                    placeholder="e.g. 71049281 or 0300 8521940"
                    className="w-full px-3 py-2 bg-[#021810] border border-emerald-800 rounded-lg text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject *</label>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="e.g. Inquiring regarding vehicle / property"
                    className="w-full px-3 py-2 bg-[#021810] border border-emerald-800 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Body *</label>
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={3}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 bg-[#021810] border border-emerald-800 rounded-lg text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d4af37] text-[#021f15] font-bold rounded-lg shadow"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}

          {/* Inbox Master/Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Message List Left (5 cols) */}
            <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center bg-[#021810] border border-emerald-950 rounded-xl text-xs text-slate-400">
                  No messages in this folder.
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1.5 ${
                      selectedMessage?.id === msg.id
                        ? 'bg-[#032c20] border-[#d4af37] shadow-md'
                        : 'bg-[#021810] border-emerald-950 hover:border-emerald-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate max-w-[180px]">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div className="text-[#f6e09e] font-medium truncate">{msg.subject}</div>

                    <p className="text-[11px] text-slate-400 line-clamp-1">{msg.body}</p>

                    <div className="flex items-center gap-2 pt-1 text-[10px]">
                      {msg.type === 'system_credentials' && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Account Credentials
                        </span>
                      )}
                      {msg.orderRef && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          Order Ref: {msg.orderRef}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Detail Right (7 cols) */}
            <div className="lg:col-span-7 bg-[#021810] border border-emerald-900/80 rounded-xl p-5 text-xs flex flex-col justify-between">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="border-b border-emerald-950 pb-3 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                      {selectedMessage.type === 'system_credentials' ? 'Official Security Dispatch' : 'Text Message'}
                    </span>
                    <h3 className="text-base font-bold text-white font-luxury">{selectedMessage.subject}</h3>
                    <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                      <span>From: <strong className="text-slate-200">{selectedMessage.senderName}</strong> ({selectedMessage.senderAccount || 'WAGE'})</span>
                      <span>{selectedMessage.timestamp}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#03261a]/60 border border-emerald-950 rounded-xl text-slate-200 leading-relaxed whitespace-pre-line text-xs font-sans">
                    {selectedMessage.body}
                  </div>

                  {selectedMessage.type === 'system_credentials' && (
                    <div className="p-3 bg-emerald-950/80 border border-[#d4af37]/40 rounded-lg flex items-center justify-between text-xs text-[#f6e09e]">
                      <span>Keep your credentials safe. You can retrieve PIN anytime via phone.</span>
                      <button
                        onClick={onOpenRetrievePin}
                        className="px-2.5 py-1 bg-[#d4af37] text-[#021f15] font-bold rounded text-[11px]"
                      >
                        PIN Recovery
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  Select a message to view its details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUY ORDERS (4-DIGIT REF SYSTEM) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-950/60 border border-[#d4af37]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#f6e09e] text-sm block">
                Simple 4-Digit Reference Buy Orders System
              </span>
              <p className="text-slate-300 leading-relaxed">
                When you initiate an inquiry or buy order on WAGE, a unique 4-digit reference number is created for direct settlement between buyer and seller.
              </p>
            </div>
          </div>

          {myOrders.length === 0 ? (
            <div className="p-8 text-center bg-[#021810] border border-emerald-950 rounded-xl space-y-2 text-xs">
              <ShoppingBag className="w-8 h-8 text-[#d4af37] mx-auto opacity-70" />
              <p className="text-slate-300">You have no active buy orders.</p>
              <p className="text-slate-400">Browse the marketplace and click "Order / Buy with 4-Digit Ref" on any listing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-[#03261a] border border-emerald-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={ord.listingImage}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border border-emerald-900 shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f6e09e] font-mono font-bold text-xs">
                          REF #{ord.orderRef}
                        </span>
                        <span className="text-white font-semibold truncate max-w-[200px] block">
                          {ord.listingTitle}
                        </span>
                      </div>
                      <div className="text-[#f6e09e] font-mono font-bold text-sm">
                        {formatExactPKR(ord.listingPrice)}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Seller: <strong className="text-white">{ord.sellerName}</strong> ({ord.sellerPhone}) · {ord.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                        ord.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                          : ord.status === 'seller_contacted'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {ord.status.toUpperCase().replace('_', ' ')}
                    </span>

                    <a
                      href={`tel:${ord.sellerPhone}`}
                      className="px-3 py-1.5 bg-[#021810] hover:bg-emerald-900 text-white rounded-lg border border-emerald-800 text-[11px] flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Call Seller</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AD PAYMENTS TO WAGE */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#03281c] border border-emerald-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#f6e09e] text-sm block">
                WAGE Advertising Fee Ledger & Payment Center
              </span>
              <p className="text-slate-300 leading-relaxed">
                Platform fee for additional advertisements is flat Rs. 200 per listing. Buyers pay sellers directly (0% commission on item sales).
              </p>
            </div>
            <button
              onClick={onOpenPaymentGuide}
              className="px-3.5 py-2 bg-emerald-950 border border-[#d4af37]/40 text-[#f6e09e] rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              <HelpCircle className="w-4 h-4 text-[#d4af37]" />
              <span>How to Pay Guide</span>
            </button>
          </div>

          {myTransactions.length === 0 ? (
            <div className="p-8 text-center bg-[#021810] border border-emerald-950 rounded-xl text-xs text-slate-400">
              No fee transactions yet. Your 1st ad is free.
            </div>
          ) : (
            <div className="space-y-3">
              {myTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 bg-[#021810] border border-emerald-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{tx.transactionId}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-[#f6e09e] text-[10px]">
                        {tx.paymentMethod}
                      </span>
                    </div>
                    <div className="text-slate-300">{tx.adTitle}</div>
                    <div className="text-slate-400 text-[11px]">{tx.submittedAt}</div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
                    <span className="text-base font-bold font-mono text-[#f6e09e]">Rs. {tx.amount}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        tx.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300'
                          : tx.status === 'pending'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {tx.status === 'approved' ? 'CONFIRMED RECEIVED' : tx.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MY ADVERTISEMENTS */}
      {activeTab === 'ads' && (
        <div className="space-y-3">
          {myListings.length === 0 ? (
            <div className="p-8 text-center bg-[#021810] border border-emerald-950 rounded-xl text-xs text-slate-400 space-y-2">
              <p>You haven't posted any advertisements yet.</p>
              <button
                onClick={onOpenPostAd}
                className="px-4 py-2 bg-[#d4af37] text-[#021f15] font-bold rounded-lg"
              >
                Post 1st Free Ad
              </button>
            </div>
          ) : (
            myListings.map((listing) => (
              <div
                key={listing.id}
                className="p-4 bg-[#03261a] border border-emerald-900 rounded-xl flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={listing.imageUrl}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover border border-emerald-900 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-sm font-semibold text-white truncate block">{listing.title}</span>
                    <div className="text-[#f6e09e] font-mono font-bold">{formatExactPKR(listing.price)}</div>
                    <div className="text-slate-400 text-[11px]">{listing.city} · {listing.views} views</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditAd(listing)}
                    className="px-3 py-1.5 bg-[#021810] hover:bg-emerald-900 text-[#f6e09e] border border-emerald-800 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Ad & Ref</span>
                  </button>
                  <button
                    onClick={() => onViewListing(listing)}
                    className="p-2 bg-[#021810] hover:bg-emerald-900 text-slate-300 rounded-lg border border-emerald-900"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
