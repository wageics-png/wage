import React from 'react';
import {
  FileText,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Edit,
  CreditCard,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { Listing, PaymentTransaction, UserAccount } from '../types';
import { formatExactPKR, formatPKR } from '../utils/formatters';

interface MyAdsViewProps {
  currentUser: UserAccount;
  myListings: Listing[];
  myTransactions: PaymentTransaction[];
  onOpenPostAd: () => void;
  onViewListing: (listing: Listing) => void;
  onEditAd: (listing: Listing) => void;
  onMarkSold: (listingId: string) => void;
  onOpenPaymentGuide: () => void;
}

export const MyAdsView: React.FC<MyAdsViewProps> = ({
  currentUser,
  myListings,
  myTransactions,
  onOpenPostAd,
  onViewListing,
  onEditAd,
  onMarkSold,
  onOpenPaymentGuide,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Quota & Profile Summary */}
      <div className="glass-emerald-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#065f46] to-[#022c1e] border-2 border-[#d4af37]/40 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-luxury">{currentUser.name}</h2>
              {currentUser.isVerifiedSeller && (
                <span title="Verified Pakistani Seller">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              {currentUser.phone} · {currentUser.city} · Member since {currentUser.joinedDate}
            </p>
          </div>
        </div>

        {/* Quota & Quick Action Strip */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 bg-[#021810] border border-emerald-900 rounded-xl text-xs">
            <span className="text-slate-400 block text-[11px]">Free Monthly Allowance</span>
            <span className="text-base font-bold text-[#f6e09e]">
              {currentUser.freeAdsRemainingThisMonth} of 1 remaining
            </span>
          </div>

          <div className="p-3 bg-[#021810] border border-emerald-900 rounded-xl text-xs">
            <span className="text-slate-400 block text-[11px]">Direct Product Sales</span>
            <span className="text-base font-bold text-emerald-400">0% WAGE Cut</span>
          </div>

          <button
            onClick={onOpenPaymentGuide}
            className="px-3.5 py-3 bg-[#03261a] hover:bg-emerald-900/60 border border-[#d4af37]/40 text-[#f6e09e] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#d4af37]" />
            <span>How to Pay Guide</span>
          </button>

          <button
            onClick={onOpenPostAd}
            className="px-4 py-3 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Ad</span>
          </button>
        </div>
      </div>

      {/* Grid: My Ads Left (7 cols), Receipts Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: My Listings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-luxury">
              My Advertisements ({myListings.length})
            </h3>
            <span className="text-xs text-slate-400">1st ad free · Extra ads Rs. 200 each</span>
          </div>

          {myListings.length === 0 ? (
            <div className="p-8 text-center bg-[#03261a]/60 border border-emerald-900 rounded-xl space-y-3">
              <Sparkles className="w-8 h-8 text-[#d4af37] mx-auto opacity-70" />
              <p className="text-sm text-slate-300">You haven't posted any advertisements yet.</p>
              <button
                onClick={onOpenPostAd}
                className="px-4 py-2 bg-[#d4af37] text-[#021f15] font-semibold text-xs rounded-lg shadow"
              >
                Post Your 1st Free Ad
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="p-4 bg-[#03261a] border border-emerald-900/80 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={listing.imageUrl}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover border border-emerald-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-white truncate block">
                          {listing.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="text-[#f6e09e] font-mono font-bold">
                            {formatExactPKR(listing.price)}
                          </span>
                          <span>·</span>
                          <span>{listing.city}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-slate-500" /> {listing.views}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                          listing.status === 'live'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                            : listing.status === 'pending_verification'
                            ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                            : listing.status === 'pending_payment'
                            ? 'bg-orange-950 text-orange-300 border border-orange-600/40'
                            : listing.status === 'rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {listing.status === 'live'
                          ? 'LIVE'
                          : listing.status === 'pending_verification'
                          ? 'CHECKING PAYMENT'
                          : listing.status === 'pending_payment'
                          ? 'PAYMENT PENDING'
                          : listing.status === 'rejected'
                          ? 'PAYMENT NOT VERIFIED'
                          : 'SOLD'}
                      </span>
                    </div>
                  </div>

                  {/* Payment Reference Banner if not live */}
                  {listing.status !== 'live' && (
                    <div className="p-2.5 rounded-lg bg-[#021810] border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div>
                        {listing.status === 'pending_verification' && (
                          <span className="text-amber-200">
                            Payment Ref: <strong className="font-mono text-white">{listing.paymentRef}</strong> ({listing.paymentMethod}). WAGE Admin is checking received payment.
                          </span>
                        )}
                        {listing.status === 'pending_payment' && (
                          <span className="text-orange-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Fee required: Rs. 200. Ad will go live once payment reference is submitted and checked.
                          </span>
                        )}
                        {listing.status === 'rejected' && (
                          <span className="text-rose-300">
                            Reference not verified in bank portal. Click 'Edit Ad / Pay Ref' to submit correct TID.
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onEditAd(listing)}
                        className="px-3 py-1 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-bold rounded text-[11px] self-start sm:self-center transition-colors whitespace-nowrap"
                      >
                        {listing.status === 'pending_payment' ? 'Pay Now & Submit Ref' : 'Update Ref / Edit'}
                      </button>
                    </div>
                  )}

                  {/* Action Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-950 text-xs">
                    <div className="text-slate-400">
                      {listing.adFeePaid === 0 ? 'Monthly Free Ad' : 'Paid Ad (Rs. 200 fee)'}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditAd(listing)}
                        className="px-2.5 py-1.5 bg-[#021810] hover:bg-emerald-900/60 text-slate-200 hover:text-white rounded border border-emerald-900 flex items-center gap-1 text-[11px]"
                      >
                        <Edit className="w-3 h-3 text-[#d4af37]" />
                        <span>Edit Ad & Ref</span>
                      </button>

                      {listing.status === 'live' && (
                        <>
                          <button
                            onClick={() => onViewListing(listing)}
                            className="px-2.5 py-1.5 bg-[#021810] hover:bg-emerald-900 text-slate-300 hover:text-white rounded border border-emerald-900 text-[11px] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => onMarkSold(listing.id)}
                            className="px-2.5 py-1.5 bg-[#021810] hover:bg-emerald-900 text-slate-300 hover:text-white rounded border border-emerald-900 text-[11px]"
                          >
                            Mark Sold
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Payment Receipts & Invoices */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-luxury">
              Official Platform Fee Receipts
            </h3>
            <span className="text-xs text-slate-400">Rs. 200 Ad Fee Record</span>
          </div>

          <div className="p-4 bg-[#021810] border border-[#d4af37]/30 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>WAGE Invoices and Advertising Ledger</span>
            </div>

            {myTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No fee transactions yet. Your 1st ad is within your free monthly allowance (Rs. 0).
              </p>
            ) : (
              <div className="space-y-3">
                {myTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#03261a] border border-emerald-900 rounded-lg text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white">{tx.transactionId}</span>
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

                    <div className="flex justify-between text-slate-300">
                      <span className="truncate max-w-[200px]">{tx.adTitle}</span>
                      <span className="font-mono font-bold text-[#f6e09e]">Rs. {tx.amount}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-emerald-950 text-[11px] text-slate-400">
                      <span>Method: {tx.paymentMethod}</span>
                      <span>{tx.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">Need official tax statement?</span>
              <button
                onClick={() => window.print()}
                className="text-[#f6e09e] hover:underline flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Fee Statement</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
