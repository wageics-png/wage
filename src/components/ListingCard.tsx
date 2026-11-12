import React from 'react';
import { MapPin, ShieldCheck, Heart, Eye } from 'lucide-react';
import { Listing } from '../types';
import { formatPKR } from '../utils/formatters';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
  isFavorited?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onClick,
  isFavorited,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={onClick}
      className="glass-emerald-card glass-emerald-card-hover rounded-xl overflow-hidden cursor-pointer flex flex-col group"
    >
      {/* Media Slot with Fallback Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#032117]">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Styled CSS fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Subtle Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(e);
          }}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
          title="Save to favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
        </button>

        {/* Direct Seller Payment Marker */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 text-[11px] text-[#f6e09e] font-medium bg-[#021810]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#d4af37]/20">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Direct Seller Settlement</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Title */}
        <div>
          <h3 className="text-sm font-semibold text-white group-hover:text-[#f6e09e] transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-300/80 mt-1.5">
            <span>{listing.subcategory}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.condition}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.postedAt}</span>
          </div>
        </div>

        {/* Location & Seller */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-emerald-900/40">
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span className="truncate max-w-[140px]">{listing.city}, {listing.area}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Eye className="w-3 h-3 text-slate-500" />
            <span className="tabular-nums">{listing.views}</span>
          </div>
        </div>

        {/* Price & Primary CTA */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="text-lg font-bold font-mono tabular-nums text-[#f6e09e]">
              {formatPKR(listing.price)}
            </span>
            {listing.priceType === 'per_month' && (
              <span className="text-[11px] text-slate-400 ml-1">/ month</span>
            )}
          </div>
          <span className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
            View Details &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
