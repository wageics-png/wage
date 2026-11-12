import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Bell,
  Heart,
  MessageSquare,
  AlertTriangle,
  Send,
  X,
  Phone,
  HelpCircle,
} from 'lucide-react';

import {
  CategoryId,
  ItemCondition,
  Listing,
  PaymentTransaction,
  UserAccount,
  ChatConversation,
  FlaggedReport,
  PlatformAnnouncement,
  DirectBuyOrder,
  InboxMessage,
} from './types';
import {
  CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  INITIAL_CONVERSATIONS,
  INITIAL_REPORTS,
  INITIAL_ANNOUNCEMENTS,
  PAKISTAN_CITIES,
  INITIAL_ORDERS,
  INITIAL_INBOX_MESSAGES,
} from './data/mockData';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryBar } from './components/CategoryBar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { ChatModal } from './components/ChatModal';
import { GlossaryModal } from './components/GlossaryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MyAdsView } from './components/MyAdsView';
import { EditAdModal } from './components/EditAdModal';
import { PaymentGuideModal } from './components/PaymentGuideModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { formatPKR, formatExactPKR } from './utils/formatters';

export default function App() {
  // Navigation & Workspace State
  const [activeTab, setActiveTab] = useState<'marketplace' | 'categories' | 'rules' | 'admin' | 'dashboard'>('marketplace');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Core Data States
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [reports, setReports] = useState<FlaggedReport[]>(INITIAL_REPORTS);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [orders, setOrders] = useState<DirectBuyOrder[]>(INITIAL_ORDERS);
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>(INITIAL_INBOX_MESSAGES);

  // Active current user session (starts with Tariq Mehmood, can logout/switch/register)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_USERS[0]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under500k' | 'under5m' | 'above5m'>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | ItemCondition>('all');
  const [favorites, setFavorites] = useState<string[]>(['w-101']);

  // Modal States
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [reportingListing, setReportingListing] = useState<Listing | null>(null);
  const [reportReason, setReportReason] = useState<FlaggedReport['reason']>('Suspected Fraud / Advance Demand');
  const [reportSuccessNotice, setReportSuccessNotice] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isPaymentGuideOpen, setIsPaymentGuideOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'retrieve' | null>(null);
  const [latestOrderConfirmed, setLatestOrderConfirmed] = useState<DirectBuyOrder | null>(null);

  // Filtered Listings
  const filteredListings = listings.filter((listing) => {
    // Only show live listings on customer marketplace
    if (listing.status !== 'live') return false;

    // Category filter
    if (selectedCategory !== 'all' && listing.category !== selectedCategory) return false;

    // City filter
    if (selectedCity !== 'All Cities' && listing.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = listing.title.toLowerCase().includes(q);
      const matchDesc = listing.description.toLowerCase().includes(q);
      const matchSub = listing.subcategory.toLowerCase().includes(q);
      const matchArea = listing.area.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub && !matchArea) return false;
    }

    // Price Filter
    if (priceFilter === 'under500k' && listing.price > 500000) return false;
    if (priceFilter === 'under5m' && (listing.price < 500000 || listing.price > 5000000)) return false;
    if (priceFilter === 'above5m' && listing.price <= 5000000) return false;

    // Condition filter
    if (conditionFilter !== 'all' && listing.condition !== conditionFilter) return false;

    return true;
  });

  // Toggle Favorite
  const handleToggleFavorite = (listingId: string) => {
    setFavorites((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  };

  // Open Chat with Seller
  const handleStartChat = (listing: Listing) => {
    // Find existing or create new chat
    const existing = conversations.find((c) => c.listingId === listing.id);
    if (existing) {
      setActiveChat(existing);
    } else {
      const newChat: ChatConversation = {
        id: `chat-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: listing.imageUrl,
        otherPartyName: listing.seller.name,
        otherPartyPhone: listing.seller.phone,
        otherPartyVerified: listing.seller.verified,
        lastMessage: 'Started conversation',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'buyer',
            text: `Assalam-o-Alaikum, is this ${listing.title} still available in ${listing.city}?`,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations((prev) => [newChat, ...prev]);
      setActiveChat(newChat);
    }
    setSelectedListing(null);
  };

  // Send Chat message
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'buyer' as const,
      text,
      timestamp: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = {
            ...c,
            lastMessage: text,
            lastTimestamp: 'Just now',
            messages: [...c.messages, newMsg],
          };
          if (activeChat && activeChat.id === conversationId) {
            setActiveChat(updated);
          }
          return updated;
        }
        return c;
      })
    );

    // Simulated quick seller reply after 1.5 seconds
    setTimeout(() => {
      const sellerReply = {
        id: `reply-${Date.now()}`,
        sender: 'seller' as const,
        text: 'Wa Alaikum Assalam! Yes brother, it is available. You can inspect it physically at our commercial address.',
        timestamp: 'Just now',
      };
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            const updated = {
              ...c,
              lastMessage: sellerReply.text,
              lastTimestamp: 'Just now',
              messages: [...c.messages, sellerReply],
            };
            if (activeChat && activeChat.id === conversationId) {
              setActiveChat(updated);
            }
            return updated;
          }
          return c;
        })
      );
    }, 1200);
  };

  // Submit Ad (Free or Paid)
  const handleSubmitAd = (
    newAdData: Partial<Listing>,
    paymentData?: Partial<PaymentTransaction>
  ) => {
    const id = `w-${Date.now()}`;
    const newListing: Listing = {
      id,
      title: newAdData.title || 'Untitled Listing',
      category: newAdData.category || 'other',
      subcategory: newAdData.subcategory || 'General',
      price: newAdData.price || 0,
      priceType: newAdData.priceType || 'fixed',
      city: newAdData.city || 'Islamabad',
      area: newAdData.area || 'Main Commercial',
      condition: newAdData.condition || 'Brand New',
      description: newAdData.description || '',
      imageUrl: newAdData.imageUrl || '/src/assets/images/wage_hero_showcase_1794469920765.jpg',
      seller: newAdData.seller || {
        id: currentUser?.id || 'usr-guest',
        name: currentUser?.name || 'Guest Trader',
        phone: currentUser?.phone || '+92 300 0000000',
        verified: true,
        city: currentUser?.city || 'Lahore',
        memberSince: 'Today',
        rating: 5.0,
        totalAds: 1,
        hidePhoneUntilConsent: true,
      },
      status: paymentData ? 'pending_verification' : 'live',
      postedAt: 'Just now',
      views: 1,
      likes: 0,
      adFeePaid: paymentData ? 200 : 0,
      paymentMethod: paymentData ? paymentData.paymentMethod : 'Free Allowance',
      paymentRef: paymentData ? paymentData.transactionId : 'FREE-MONTHLY-ALLOWANCE',
    };

    setListings((prev) => [newListing, ...prev]);

    if (paymentData) {
      const newTx: PaymentTransaction = {
        id: `TXN-${Date.now()}`,
        adId: id,
        adTitle: newListing.title,
        userId: currentUser?.id || 'usr-guest',
        userName: currentUser?.name || 'Guest Trader',
        userPhone: currentUser?.phone || '+92 300 0000000',
        amount: 200,
        paymentMethod: paymentData.paymentMethod || 'JazzCash',
        transactionId: paymentData.transactionId || `JC-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        senderAccount: paymentData.senderAccount || currentUser?.phone || '0300 0000000',
        submittedAt: 'Just now',
        status: 'pending',
        adminNotes: 'Submitted via customer portal. Awaiting admin slip reconciliation.',
      };
      setTransactions((prev) => [newTx, ...prev]);
    } else if (currentUser) {
      // Decrement free monthly ad count
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              freeAdsRemainingThisMonth: Math.max(0, prev.freeAdsRemainingThisMonth - 1),
            }
          : null
      );
    }
  };

  // Phone OTP Verification
  const handleVerifyPhone = (phone: string) => {
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            phone,
            isPhoneVerified: true,
          }
        : null
    );
  };

  // User Auth Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    setAuthModalMode(null);
  };

  const handleRegisterAccount = (newUser: UserAccount, welcomeMessage: InboxMessage) => {
    setUsers((prev) => [newUser, ...prev]);
    setInboxMessages((prev) => [welcomeMessage, ...prev]);
    setCurrentUser(newUser);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (activeTab === 'dashboard') {
      setActiveTab('marketplace');
    }
  };

  // Send Direct Inbox Message
  const handleSendInboxMessage = (recipientAccount: string, subject: string, body: string) => {
    if (!currentUser) return;

    const cleanAcc = recipientAccount.trim().replace(/[\s-]/g, '');
    const matchedRecipient = users.find(
      (u) =>
        u.accountNumber === cleanAcc ||
        u.phone.replace(/[\s-]/g, '').includes(cleanAcc) ||
        cleanAcc.includes(u.phone.replace(/[\s-]/g, ''))
    );

    const newMsg: InboxMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAccount: currentUser.accountNumber,
      recipientId: matchedRecipient ? matchedRecipient.id : 'usr-recipient',
      recipientName: matchedRecipient ? matchedRecipient.name : `Account #${recipientAccount}`,
      recipientAccount: recipientAccount,
      subject,
      body,
      timestamp: 'Just now',
      isRead: false,
      type: 'direct_message',
    };

    setInboxMessages((prev) => [newMsg, ...prev]);
  };

  // Create Direct Buy Order with Simple 4-Digit Reference
  const handlePlaceBuyOrder = (listing: Listing) => {
    if (!currentUser) {
      setAuthModalMode('login');
      return;
    }

    const simpleRef = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: DirectBuyOrder = {
      id: `ord-${Date.now()}`,
      orderRef: simpleRef,
      listingId: listing.id,
      listingTitle: listing.title,
      listingPrice: listing.price,
      listingImage: listing.imageUrl,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerAddress: `${currentUser.address}, ${currentUser.city}`,
      sellerId: listing.seller.id,
      sellerName: listing.seller.name,
      sellerPhone: listing.seller.phone,
      status: 'placed',
      createdAt: 'Just now',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send order confirmation dispatch to buyer inbox
    const buyerDispatch: InboxMessage = {
      id: `msg-ord-${Date.now()}`,
      senderId: 'sys-orders',
      senderName: 'WAGE Direct Settlement Desk',
      senderAccount: 'WAGE-ORDERS',
      recipientId: currentUser.id,
      recipientName: currentUser.name,
      recipientAccount: currentUser.accountNumber,
      subject: `Order Created · Ref #${simpleRef} · ${listing.title}`,
      body: `Assalam-o-Alaikum ${currentUser.name},

Your direct purchase order for "${listing.title}" has been recorded on WAGE Marketplace Pakistan.

• 4-Digit Order Reference: Ref #${simpleRef}
• Item Price: Rs. ${listing.price.toLocaleString('en-PK')}
• Seller Name: ${listing.seller.name}
• Seller Phone: ${listing.seller.phone}

Next Step:
Contact the seller directly and quote Ref #${simpleRef}. Meet at a safe, verified venue to physically inspect the item before paying cash or bank transfer.

WAGE Policy: 0% sales commission. Buyer pays seller directly.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'order_notice',
      orderRef: simpleRef,
    };

    setInboxMessages((prev) => [buyerDispatch, ...prev]);
    setLatestOrderConfirmed(newOrder);
  };

  const handleUpdateOrderStatus = (orderId: string, status: DirectBuyOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Handle Save Edited Ad & Payment Reference
  const handleSaveEditedAd = (
    updatedListing: Listing,
    paymentUpdate?: Partial<PaymentTransaction>
  ) => {
    setListings((prev) =>
      prev.map((l) => (l.id === updatedListing.id ? updatedListing : l))
    );

    if (paymentUpdate) {
      const existingTx = transactions.find((t) => t.adId === updatedListing.id);
      if (existingTx) {
        setTransactions((prev) =>
          prev.map((t) =>
            t.adId === updatedListing.id
              ? {
                  ...t,
                  transactionId: paymentUpdate.transactionId || t.transactionId,
                  paymentMethod: paymentUpdate.paymentMethod || t.paymentMethod,
                  senderAccount: paymentUpdate.senderAccount || t.senderAccount,
                  status: 'pending',
                  submittedAt: 'Just now',
                  adminNotes: 'Updated payment reference submitted by customer. Awaiting admin check.',
                }
              : t
          )
        );
      } else {
        const newTx: PaymentTransaction = {
          id: `TXN-${Date.now()}`,
          adId: updatedListing.id,
          adTitle: updatedListing.title,
          userId: currentUser?.id || 'usr-guest',
          userName: currentUser?.name || 'Guest Trader',
          userPhone: currentUser?.phone || '0300 0000000',
          amount: 200,
          paymentMethod: paymentUpdate.paymentMethod || 'JazzCash',
          transactionId: paymentUpdate.transactionId || `TID-${Date.now()}`,
          senderAccount: paymentUpdate.senderAccount || currentUser?.phone || '0300 0000000',
          submittedAt: 'Just now',
          status: 'pending',
          adminNotes: 'Payment reference submitted by customer. Awaiting admin check.',
        };
        setTransactions((prev) => [newTx, ...prev]);
      }
    }
  };

  // Admin Actions
  const handleApproveTransaction = (txnId: string) => {
    const tx = transactions.find((t) => t.id === txnId);
    if (!tx) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: 'approved', adminNotes: 'Verified received in corporate account.' } : t))
    );

    // Make associated listing live on WAGE Pakistan immediately
    setListings((prev) =>
      prev.map((l) => (l.id === tx.adId ? { ...l, status: 'live', adFeePaid: 200 } : l))
    );
  };

  const handleRejectTransaction = (txnId: string, reason: string) => {
    const tx = transactions.find((t) => t.id === txnId);
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: 'rejected', adminNotes: reason } : t))
    );
    if (tx) {
      setListings((prev) =>
        prev.map((l) => (l.id === tx.adId ? { ...l, status: 'rejected' } : l))
      );
    }
  };

  const handleUpdateListingStatus = (listingId: string, status: Listing['status']) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status } : l))
    );
  };

  const handleToggleUserStatus = (userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'frozen' : 'active';
          return {
            ...u,
            status: nextStatus,
            freezeReason: nextStatus === 'frozen' ? reason || 'Demanding advance payment' : undefined,
          };
        }
        return u;
      })
    );
  };

  const handleToggleUserVerification = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerifiedSeller: !u.isVerifiedSeller } : u))
    );
  };

  const handleResolveReport = (reportId: string, action: 'action_taken' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  const handleAddAnnouncement = (
    title: string,
    content: string,
    type: 'rule' | 'safety' | 'promo'
  ) => {
    const newAnn: PlatformAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      type,
      date: 'Today',
      active: true,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  // Submit Fraud Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingListing) return;

    const newRep: FlaggedReport = {
      id: `rep-${Date.now()}`,
      listingId: reportingListing.id,
      listingTitle: reportingListing.title,
      sellerName: reportingListing.seller.name,
      reporterPhone: currentUser?.phone || 'Guest User',
      reason: reportReason,
      reportedAt: 'Just now',
      status: 'pending_review',
    };
    setReports((prev) => [newRep, ...prev]);
    setReportSuccessNotice(true);
    setTimeout(() => {
      setReportSuccessNotice(false);
      setReportingListing(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#021810] text-slate-100 selection:bg-[#d4af37]/30 selection:text-white">
      {/* Platform Announcement Marquee/Banner */}
      {announcements.length > 0 && announcements[0].active && (
        <div className="bg-[#03261a] border-b border-[#d4af37]/20 px-4 py-2 text-xs flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2 max-w-5xl mx-auto overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#f6e09e] font-bold text-[10px] uppercase shrink-0 border border-[#d4af37]/40">
              WAGE Bulletin
            </span>
            <span className="truncate">
              <strong>{announcements[0].title}:</strong> {announcements[0].content}
            </span>
          </div>
          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="text-[11px] text-[#f6e09e] hover:underline whitespace-nowrap shrink-0 ml-3"
          >
            Policy Guide &rarr;
          </button>
        </div>
      )}

      {/* Header conforming to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'rules') {
            setIsGlossaryOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenPostAd={() => setIsPostAdOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
        currentUser={currentUser}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: Customer Marketplace */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Hero Banner with Search */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
              onOpenPostAd={() => setIsPostAdOpen(true)}
              onOpenPaymentGuide={() => setIsPaymentGuideOpen(true)}
            />

            {/* Horizontal Category Nav */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Filter Bar & Controls */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#03261a]/60 border border-emerald-900/60 text-xs">
                {/* Left: Active Filters & Results count */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-medium">
                    Showing <strong className="text-white font-mono">{filteredListings.length}</strong> active listings
                  </span>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 hover:text-white border border-emerald-800 flex items-center gap-1"
                    >
                      <span>Category: {selectedCategory.replace('_', ' ')}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {selectedCity !== 'All Cities' && (
                    <button
                      onClick={() => setSelectedCity('All Cities')}
                      className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 hover:text-white border border-emerald-800 flex items-center gap-1"
                    >
                      <span>City: {selectedCity}</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Right: Quick Price & Condition Segmented Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 p-1 bg-[#021810] rounded-lg border border-emerald-950">
                    <span className="text-slate-500 px-2">Price:</span>
                    <button
                      onClick={() => setPriceFilter('all')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        priceFilter === 'all'
                          ? 'bg-[#d4af37] text-[#021f15] font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Any
                    </button>
                    <button
                      onClick={() => setPriceFilter('under500k')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        priceFilter === 'under500k'
                          ? 'bg-[#d4af37] text-[#021f15] font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      &lt; 5 Lakh
                    </button>
                    <button
                      onClick={() => setPriceFilter('under5m')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        priceFilter === 'under5m'
                          ? 'bg-[#d4af37] text-[#021f15] font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      5 - 50 Lakh
                    </button>
                    <button
                      onClick={() => setPriceFilter('above5m')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        priceFilter === 'above5m'
                          ? 'bg-[#d4af37] text-[#021f15] font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      &gt; 50 Lakh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              {filteredListings.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#03261a]/40 border border-emerald-900/60 space-y-4">
                  <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto opacity-70" />
                  <h3 className="text-lg font-bold text-white font-luxury">No Listings Match Current Filters</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Try broadening your city selection or resetting your search keywords.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedCity('All Cities');
                      setSearchQuery('');
                      setPriceFilter('all');
                    }}
                    className="px-4 py-2 bg-[#d4af37] text-[#021f15] font-semibold text-xs rounded-lg shadow"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onClick={() => setSelectedListing(listing)}
                      isFavorited={favorites.includes(listing.id)}
                      onToggleFavorite={() => handleToggleFavorite(listing.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: Complete Categories Explorer */}
        {activeTab === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                Pakistani Commerce Taxonomy
              </span>
              <h2 className="text-2xl font-bold text-white font-luxury">
                All Marketplace Categories & Sectors
              </h2>
              <p className="text-xs text-slate-300">
                Browse verified listings by domain. Each seller pays advertising maintenance only (1 free/month, Rs. 200 extra), zero product sales commission.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveTab('marketplace');
                  }}
                  className="glass-emerald-card glass-emerald-card-hover p-5 rounded-xl cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-medium font-serif">{cat.urduName}</span>
                    <span className="text-xs font-mono font-bold text-[#f6e09e] tabular-nums">
                      {cat.count} Ads
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-luxury">{cat.name}</h3>

                  <div className="text-xs text-emerald-300 group-hover:text-emerald-200 flex items-center justify-between pt-2 border-t border-emerald-900/50">
                    <span>Explore Section</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Registered User Dashboard (Profile, Inbox, 4-Digit Buy Orders, Payments, My Ads) */}
        {activeTab === 'dashboard' && (
          currentUser ? (
            <UserDashboard
              currentUser={currentUser}
              myListings={listings.filter((l) => l.seller.id === currentUser.id)}
              myTransactions={transactions.filter((t) => t.userId === currentUser.id)}
              myOrders={orders.filter((o) => o.buyerId === currentUser.id || o.sellerId === currentUser.id)}
              myInboxMessages={inboxMessages.filter((m) => m.recipientId === currentUser.id || m.senderId === currentUser.id)}
              onOpenPostAd={() => setIsPostAdOpen(true)}
              onViewListing={(l) => setSelectedListing(l)}
              onEditAd={(l) => setEditingListing(l)}
              onMarkSold={(id) => handleUpdateListingStatus(id, 'sold')}
              onOpenPaymentGuide={() => setIsPaymentGuideOpen(true)}
              onSendMessage={handleSendInboxMessage}
              onOpenRetrievePin={() => setAuthModalMode('retrieve')}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 text-center bg-[#021f15] border border-[#d4af37]/40 rounded-2xl shadow-xl space-y-4">
              <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto" />
              <h3 className="text-lg font-bold text-white font-luxury">Access User Dashboard</h3>
              <p className="text-xs text-slate-300">
                Please sign in with your 8-digit Account Number and 4-digit PIN, or register a free account.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setAuthModalMode('login')}
                  className="px-4 py-2 bg-[#d4af37] text-[#021f15] font-bold text-xs rounded-lg shadow"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModalMode('register')}
                  className="px-4 py-2 bg-[#03261a] border border-[#d4af37]/40 text-[#f6e09e] font-bold text-xs rounded-lg"
                >
                  Register Account
                </button>
              </div>
            </div>
          )
        )}

        {/* VIEW 4: Admin Dashboard Control Suite */}
        {activeTab === 'admin' && (
          <AdminDashboard
            listings={listings}
            transactions={transactions}
            users={users}
            reports={reports}
            announcements={announcements}
            onApproveTransaction={handleApproveTransaction}
            onRejectTransaction={handleRejectTransaction}
            onUpdateListingStatus={handleUpdateListingStatus}
            onToggleUserStatus={handleToggleUserStatus}
            onToggleUserVerification={handleToggleUserVerification}
            onResolveReport={handleResolveReport}
            onAddAnnouncement={handleAddAnnouncement}
            isAdminUnlocked={isAdminUnlocked}
            onToggleAdminLock={setIsAdminUnlocked}
          />
        )}
      </main>

      {/* Footer conforming to domain rules */}
      <footer className="mt-auto bg-[#01140e] border-t border-[#d4af37]/20 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#065f46] border border-[#d4af37]/40 flex items-center justify-center text-[#f6e09e] font-serif font-bold text-xs">
                W
              </div>
              <span className="text-sm font-bold text-white font-luxury">WAGE MARKETPLACE · PAKISTAN</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <button onClick={() => setIsGlossaryOpen(true)} className="hover:text-white">
                Platform Rules & Fee Matrix
              </button>
              <button onClick={() => setIsPaymentGuideOpen(true)} className="hover:text-white">
                How to Pay WAGE Guide
              </button>
              <button onClick={() => setIsGlossaryOpen(true)} className="hover:text-white">
                Device Safety & Cloud Architecture
              </button>
              <button onClick={() => setActiveTab('admin')} className="text-emerald-400 hover:text-emerald-300">
                Admin Control Room
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-emerald-950">
            <p>© 2026 WAGE Marketplace Pakistan. All rights reserved. Operating in Karachi, Lahore, Islamabad, and across Pakistan.</p>
            <p>1 Free Ad / Month · Additional Ads Rs. 200 · Direct Buyer-to-Seller Settlement</p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Listing Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onOpenChat={handleStartChat}
          onReportListing={(l) => setReportingListing(l)}
          isFavorited={favorites.includes(selectedListing.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedListing.id)}
          onPlaceBuyOrder={handlePlaceBuyOrder}
        />
      )}

      {/* 2. Post Ad Modal */}
      {isPostAdOpen && (
        <PostAdModal
          currentUser={currentUser || INITIAL_USERS[0]}
          onClose={() => setIsPostAdOpen(false)}
          onSubmitAd={handleSubmitAd}
          onVerifyPhone={handleVerifyPhone}
          onOpenPaymentGuide={() => setIsPaymentGuideOpen(true)}
        />
      )}

      {/* 2.5 Edit Ad & Payment Reference Modal */}
      {editingListing && (
        <EditAdModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSaveAd={handleSaveEditedAd}
          onOpenPaymentGuide={() => setIsPaymentGuideOpen(true)}
        />
      )}

      {/* 2.6 How to Pay Payment Guide Modal */}
      {isPaymentGuideOpen && (
        <PaymentGuideModal
          onClose={() => setIsPaymentGuideOpen(false)}
        />
      )}

      {/* 3. In-App Buyer/Seller Chat Modal */}
      {activeChat && (
        <ChatModal
          conversation={activeChat}
          onClose={() => setActiveChat(null)}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* 4. Glossary & System Rules Modal */}
      {isGlossaryOpen && (
        <GlossaryModal
          onClose={() => setIsGlossaryOpen(false)}
          onOpenPostAd={() => {
            setIsGlossaryOpen(false);
            setIsPostAdOpen(true);
          }}
        />
      )}

      {/* 5. Report Listing Modal */}
      {reportingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#021f15] border border-rose-600/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-luxury">Report Listing</h3>
              </div>
              <button onClick={() => setReportingListing(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccessNotice ? (
              <div className="p-4 bg-emerald-950 border border-emerald-600 rounded-xl text-center text-xs text-emerald-200">
                Thank you. Your report has been dispatched to the WAGE Trust & Safety desk for review.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <p className="text-slate-300">
                  Reporting: <strong className="text-white">{reportingListing.title}</strong>
                </p>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reason for Flagging</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#03261a] border border-emerald-800 rounded-lg text-white"
                  >
                    <option value="Suspected Fraud / Advance Demand">
                      Demanding advance cash on WhatsApp without inspection
                    </option>
                    <option value="Counterfeit Product">Counterfeit or Fake product/documents</option>
                    <option value="Misleading Price">Misleading or unrealistic price</option>
                    <option value="Harassment / Spam">Spam or abusive seller conduct</option>
                  </select>
                </div>

                <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg text-[11px] text-rose-200">
                  WAGE does not tolerate fraudulent advance payment demands. Verified reports result in permanent account bans.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingListing(null)}
                    className="px-4 py-2 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white font-semibold rounded-lg shadow"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. Authentication Modal (Login, Register 8-Digit Acc + 4-Digit PIN, Retrieve PIN by Phone) */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onLoginSuccess={handleLoginSuccess}
          registeredUsers={users}
          onRegisterAccount={handleRegisterAccount}
        />
      )}

      {/* 7. 4-Digit Reference Order Confirmation Modal */}
      {latestOrderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#021f15] border border-[#d4af37]/50 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white font-luxury text-sm">Direct Buy Order Placed</span>
              </div>
              <button
                onClick={() => setLatestOrderConfirmed(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#03281c] border border-[#d4af37]/40 rounded-xl space-y-2 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Your Simple 4-Digit Order Reference
              </span>
              <div className="text-3xl font-mono font-bold text-[#f6e09e] tracking-[0.2em]">
                REF #{latestOrderConfirmed.orderRef}
              </div>
              <p className="text-[11px] text-emerald-300">
                Dispatched to your User Dashboard Inbox & Order Registry
              </p>
            </div>

            <div className="space-y-1.5 p-3 bg-[#021810] rounded-xl border border-emerald-950">
              <div className="flex justify-between">
                <span className="text-slate-400">Listing:</span>
                <span className="text-white font-semibold truncate max-w-[200px]">
                  {latestOrderConfirmed.listingTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Agreed Price:</span>
                <span className="text-[#f6e09e] font-mono font-bold">
                  {formatExactPKR(latestOrderConfirmed.listingPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seller Name:</span>
                <span className="text-white">{latestOrderConfirmed.sellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seller Phone:</span>
                <a
                  href={`tel:${latestOrderConfirmed.sellerPhone}`}
                  className="text-emerald-400 hover:underline font-mono"
                >
                  {latestOrderConfirmed.sellerPhone}
                </a>
              </div>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-900 rounded-lg text-[11px] text-amber-200">
              WAGE Direct Policy: 0% sales commission. Buyer pays seller directly. Quote Ref #{latestOrderConfirmed.orderRef} upon physical inspection.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setLatestOrderConfirmed(null);
                  setActiveTab('dashboard');
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] text-[#021f15] font-bold uppercase tracking-wider rounded-lg shadow text-center"
              >
                Go to Dashboard & Inbox
              </button>
              <button
                onClick={() => setLatestOrderConfirmed(null)}
                className="px-4 py-2.5 bg-[#03261a] hover:bg-emerald-900 border border-emerald-800 text-slate-300 rounded-lg"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
