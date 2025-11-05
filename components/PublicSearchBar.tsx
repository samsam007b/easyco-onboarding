'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Euro, Calendar } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';

interface PublicSearchBarProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

export default function PublicSearchBar({
  variant = 'hero',
  className = ''
}: PublicSearchBarProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [moveInDate, setMoveInDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build search query
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (budget) params.set('max_price', budget);
    if (moveInDate) params.set('move_in_date', moveInDate);

    router.push(`/properties/browse?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSearch}
        className={`flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2 ${className}`}
      >
        <MapPin className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('landing.search.locationPlaceholder') || 'Ixelles, Etterbeek...'}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
        <button
          type="submit"
          className="bg-[var(--easy-purple-900)] text-white p-2 rounded-full hover:bg-[var(--easy-purple-700)] transition"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${className}`}
    >
      <div className="flex items-center">
        {/* Location */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <div>
            <label className="text-xs font-semibold text-gray-900 block mb-1">
              Où
            </label>
            <input
              type="text"
              placeholder="Ixelles, Etterbeek..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full outline-none text-sm text-gray-600 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex-1 px-6 py-4 border-r border-gray-200">
          <div>
            <label className="text-xs font-semibold text-gray-900 block mb-1">
              Budget
            </label>
            <input
              type="text"
              placeholder="€800/mois"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full outline-none text-sm text-gray-600 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Move-in Date */}
        <div className="flex-1 px-6 py-4">
          <div>
            <label className="text-xs font-semibold text-gray-900 block mb-1">
              Quand
            </label>
            <select
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full outline-none text-sm text-gray-600 bg-transparent cursor-pointer"
            >
              <option value="">Flexible</option>
              <option value="asap">Dès que possible</option>
              <option value="1month">Dans 1 mois</option>
              <option value="2months">Dans 2 mois</option>
              <option value="3months">Dans 3+ mois</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="pr-2">
          <button
            type="submit"
            className="p-4 bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span className="font-semibold hidden lg:inline">Rechercher</span>
          </button>
        </div>
      </div>
    </form>
  );
}
