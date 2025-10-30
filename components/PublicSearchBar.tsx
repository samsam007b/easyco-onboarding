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
      className={`bg-white rounded-2xl shadow-2xl p-2 ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Location */}
        <div className="flex items-center gap-3 px-4 py-3 md:border-r border-gray-200">
          <MapPin className="w-5 h-5 text-[var(--easy-purple-900)] flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t('landing.search.location') || 'Quartier'}
            </label>
            <input
              type="text"
              placeholder={t('landing.search.locationPlaceholder') || 'Ixelles, Etterbeek...'}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-3 px-4 py-3 md:border-r border-gray-200">
          <Euro className="w-5 h-5 text-[var(--easy-purple-900)] flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t('landing.search.budget') || 'Budget max'}
            </label>
            <input
              type="number"
              placeholder="€800/mois"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Move-in Date */}
        <div className="flex items-center gap-3 px-4 py-3 md:border-r border-gray-200">
          <Calendar className="w-5 h-5 text-[var(--easy-purple-900)] flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {t('landing.search.date') || 'Date d\'emménagement'}
            </label>
            <select
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full outline-none text-sm text-gray-900 bg-transparent cursor-pointer"
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
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-[var(--easy-purple-900)] text-white font-semibold rounded-xl hover:bg-[var(--easy-purple-700)] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>{t('landing.search.button') || 'Rechercher'}</span>
          </button>
        </div>
      </div>

      {/* Quick filters (below search bar) */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4 pb-2 border-t border-gray-100 mt-2">
        <span className="text-xs text-gray-500">Recherches populaires :</span>
        <button
          type="button"
          onClick={() => {
            setLocation('Ixelles');
            setBudget('700');
          }}
          className="px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          Ixelles €700
        </button>
        <button
          type="button"
          onClick={() => {
            setLocation('Etterbeek');
            setBudget('600');
          }}
          className="px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          Etterbeek €600
        </button>
        <button
          type="button"
          onClick={() => {
            setLocation('ULB');
            setMoveInDate('asap');
          }}
          className="px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          Près ULB
        </button>
        <button
          type="button"
          onClick={() => {
            setBudget('500');
            setMoveInDate('asap');
          }}
          className="px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          Budget étudiant
        </button>
      </div>
    </form>
  );
}
