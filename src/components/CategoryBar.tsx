import React from 'react';
import {
  Car,
  Home,
  Key,
  Smartphone,
  Laptop,
  Briefcase,
  Armchair,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  Watch,
  Tv,
  Tractor,
  PawPrint,
  BookOpen,
  Trophy,
  Hammer,
  TrendingUp,
  GraduationCap,
  Wrench,
  Package,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CategoryId } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Car,
  Home,
  Key,
  Smartphone,
  Laptop,
  Briefcase,
  Armchair,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  Watch,
  Tv,
  Tractor,
  PawPrint,
  BookOpen,
  Trophy,
  Hammer,
  TrendingUp,
  GraduationCap,
  Wrench,
  Package,
};

interface CategoryBarProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full bg-[#032418]/60 border-y border-[#d4af37]/15 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#d4af37] text-[#021f15] font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
            }`}
          >
            All Categories ({CATEGORIES.reduce((acc, c) => acc + c.count, 0)})
          </button>

          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Package;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#d4af37] text-[#021f15] font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-900/40 border border-transparent hover:border-emerald-700/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#021f15]' : 'text-[#d4af37]'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] tabular-nums ${isSelected ? 'text-[#021f15]/75' : 'text-emerald-400/60'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
