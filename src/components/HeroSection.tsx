import React from 'react';
import { Search, MapPin, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';
import { PAKISTAN_CITIES } from '../data/mockData';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onOpenGlossary: () => void;
  onOpenPostAd: () => void;
  onOpenPaymentGuide?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  onOpenGlossary,
  onOpenPostAd,
  onOpenPaymentGuide,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#021810] via-[#03261a] to-[#021a12] border-b border-[#d4af37]/20 pt-8 pb-12">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#d4af37] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-[#d4af37]/30 text-xs text-[#f6e09e]">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span className="font-medium tracking-wide">ISLAMIC REPUBLIC OF PAKISTAN · LUXURY MARKETPLACE 2.0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-luxury">
              Buy, Sell & Rent <br />
              <span className="gold-gradient-text">Directly Across Pakistan</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              From luxury motors in Islamabad to seaside Clifton penthouses, certified smartphones in Karachi, and agricultural machinery in Multan. Direct settlement between buyer and seller with zero platform commission.
            </p>

            {/* Interactive Search Bar & City Selector */}
            <div className="bg-[#04281c]/90 p-2.5 rounded-xl border border-[#d4af37]/40 shadow-xl backdrop-blur-md">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-4 relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#d4af37]" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#021f15] border border-emerald-800/60 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#d4af37] transition-colors"
                  >
                    {PAKISTAN_CITIES.map((city) => (
                      <option key={city} value={city} className="bg-[#021f15] text-slate-100">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-emerald-400/80" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search motors, mobiles, plots, furniture..."
                    className="w-full pl-9 pr-4 py-2 bg-[#021f15] border border-emerald-800/60 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    onClick={onOpenPostAd}
                    className="w-full py-2 px-3 bg-[#d4af37] hover:bg-[#e5c158] text-[#021f15] font-semibold text-xs sm:text-sm rounded-lg transition-all shadow-md text-center whitespace-nowrap"
                  >
                    Sell Now
                  </button>
                </div>
              </div>
            </div>

            {/* System Guarantees & Policy Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>1 Free Ad / Month (Rs. 0)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <DollarSign className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>0% Commission on Sales</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Server-Side Device Safety</span>
              </div>
            </div>
          </div>

          {/* Right Column: High Fidelity Curated Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl glass-emerald-card group">
              <img
                src="/src/assets/images/wage_hero_showcase_1794469920765.jpg"
                alt="WAGE Pakistani Luxury Marketplace Showcase"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021810] via-[#021810]/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#f6e09e]">
                  <span className="font-semibold uppercase tracking-wider">Premium Pakistan C2C & B2C</span>
                  <div className="flex items-center gap-3">
                    {onOpenPaymentGuide && (
                      <button
                        onClick={onOpenPaymentGuide}
                        className="text-xs text-[#f6e09e] underline hover:text-white transition-colors"
                      >
                        How to Pay Rs. 200
                      </button>
                    )}
                    <button
                      onClick={onOpenGlossary}
                      className="text-xs text-white underline hover:text-[#d4af37] transition-colors"
                    >
                      Rules &rarr;
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white font-luxury">
                  Direct Buyer & Seller Trust Network
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  No hidden database extraction. Verified phone OTPs, transparent Rs. 200 extra ad publishing fee via JazzCash / EasyPaisa with direct admin validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
