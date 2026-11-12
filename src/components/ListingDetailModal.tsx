import React, { useState } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  AlertTriangle,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { Listing } from '../types';
import { formatExactPKR, formatPKR } from '../utils/formatters';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
  onOpenChat: (listing: Listing) => void;
  onReportListing: (listing: Listing) => void;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onPlaceBuyOrder?: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onOpenChat,
  onReportListing,
  isFavorited,
  onToggleFavorite,
  onPlaceBuyOrder,
}) => {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#021f15] border border-[#d4af37]/30 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/60 bg-[#03261a]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
              WAGE Pakistan Listing #{listing.id}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300">{listing.category.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleFavorite}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
              title="Favorite listing"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Main Grid: Media Left, Contiguous Purchase Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Image showcase & specs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#031d14] border border-[#d4af37]/20 shadow-lg">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#021810]/85 px-2.5 py-1 rounded text-xs text-[#f6e09e] border border-[#d4af37]/30 backdrop-blur-sm">
                  {listing.condition}
                </div>
              </div>

              {/* Listing Details & Metadata */}
              <div className="bg-[#03261a]/60 rounded-xl p-5 border border-emerald-900/60 space-y-4">
                <h4 className="text-sm font-semibold text-[#f6e09e] uppercase tracking-wider">
                  Listing Specifications
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-[#021c13] rounded-lg border border-emerald-950">
                    <span className="text-slate-400 block">Category</span>
                    <span className="text-slate-100 font-medium capitalize">{listing.category.replace('_', ' ')}</span>
                  </div>
                  <div className="p-2.5 bg-[#021c13] rounded-lg border border-emerald-950">
                    <span className="text-slate-400 block">Subcategory</span>
                    <span className="text-slate-100 font-medium">{listing.subcategory}</span>
                  </div>
                  <div className="p-2.5 bg-[#021c13] rounded-lg border border-emerald-950">
                    <span className="text-slate-400 block">Location</span>
                    <span className="text-slate-100 font-medium">{listing.city}, {listing.area}</span>
                  </div>
                  <div className="p-2.5 bg-[#021c13] rounded-lg border border-emerald-950">
                    <span className="text-slate-400 block">Condition</span>
                    <span className="text-slate-100 font-medium">{listing.condition}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-semibold text-[#f6e09e] uppercase tracking-wider mb-2">
                    Item Description
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Direct Payment Rules Alert */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>WAGE DIRECT PAYMENT & BUYER PROTECTION POLICY</span>
                </div>
                <p className="text-slate-300 leading-normal">
                  WAGE does not take any commission on the product sale price. Buyers pay sellers directly. Never transfer advance token money via JazzCash or EasyPaisa before inspecting the vehicle, property, or goods in person at a verified public venue.
                </p>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase / Contact Module */}
            <div className="lg:col-span-5 space-y-5">
              {/* Price & Title Card */}
              <div className="glass-emerald-card p-5 rounded-xl space-y-4">
                <div>
                  <span className="text-xs text-emerald-300 uppercase tracking-wider block mb-1">
                    Asking Price (Direct Seller Settlement)
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f6e09e] tabular-nums">
                    {formatExactPKR(listing.price)}
                  </div>
                  <span className="text-xs text-slate-400">
                    ≈ {formatPKR(listing.price)} · {listing.priceType === 'negotiable' ? 'Negotiable' : 'Fixed Price'}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-white leading-snug">
                  {listing.title}
                </h2>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-emerald-900/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    {listing.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {listing.postedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {listing.views} views
                  </span>
                </div>
              </div>

              {/* Seller Profile Card */}
              <div className="glass-emerald-card p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#065f46] to-[#022c1e] border border-[#d4af37]/40 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {listing.seller.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white truncate">{listing.seller.name}</span>
                      {listing.seller.verified && (
                        <span title="Phone & Identity Verified">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{listing.seller.city}</span>
                      <span>·</span>
                      <span>Member since {listing.seller.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Consent-Based Phone Reveal */}
                <div className="pt-2 border-t border-emerald-900/50 space-y-2">
                  <div className="text-xs text-slate-300">
                    <span className="text-emerald-400 font-medium">Privacy Protection: </span>
                    Seller phone number is shielded to prevent spam.
                  </div>

                  {!phoneRevealed ? (
                    <button
                      onClick={() => setPhoneRevealed(true)}
                      className="w-full py-2.5 px-4 bg-emerald-900/40 hover:bg-emerald-900/70 border border-[#d4af37]/40 rounded-lg text-xs font-semibold text-[#f6e09e] flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Lock className="w-4 h-4 text-[#d4af37]" />
                      <span>Click to Reveal Seller Phone</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-[#021810] border border-emerald-500/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Seller Phone:</span>
                        <a
                          href={`tel:${listing.seller.phone}`}
                          className="text-sm font-mono font-bold text-white hover:text-[#d4af37] transition-colors"
                        >
                          {listing.seller.phone}
                        </a>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`tel:${listing.seller.phone}`}
                          className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Seller
                        </a>
                        <a
                          href={`https://wa.me/${listing.seller.phone.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum, I am inquiring about your listing on WAGE Marketplace: ${encodeURIComponent(listing.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Start In-App Chat */}
                  <button
                    onClick={() => onOpenChat(listing)}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:from-[#e5c158] hover:to-[#f3e5ab] text-[#021f15] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 text-[#021f15]" />
                    <span>Start In-App Chat</span>
                  </button>

                  {/* Order / Buy with 4-Digit Ref */}
                  {onPlaceBuyOrder && (
                    <button
                      onClick={() => onPlaceBuyOrder(listing)}
                      className="w-full py-2.5 px-4 bg-[#03261a] hover:bg-emerald-900 border border-[#d4af37]/60 hover:border-[#d4af37] text-[#f6e09e] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                      <span>Order / Buy (4-Digit Ref)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Safety & Report Actions */}
              <div className="p-4 bg-[#032015] rounded-xl border border-emerald-900/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Notice suspicious activity?</span>
                <button
                  onClick={() => onReportListing(listing)}
                  className="text-rose-400 hover:text-rose-300 font-medium underline flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" /> Report Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
