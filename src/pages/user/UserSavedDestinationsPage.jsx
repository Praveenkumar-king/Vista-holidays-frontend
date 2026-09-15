import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Compass,
  Star,
  MapPin,
  Sparkles,
  Trash2,
  Calendar,
  CloudSun,
  ArrowRight,
  ExternalLink,
  Search,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTravelAssistant } from '../../hooks/useTravelAssistant';
import { userService } from '../../services/userService';
import { DESTINATIONS } from '../../data/destinations';

export const UserSavedDestinationsPage = () => {
  const { currentUser, updateUser } = useAuth();
  const toast = useToast();
  const { openAssistant } = useTravelAssistant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [removingId, setRemovingId] = useState(null);

  const savedIds = currentUser?.savedDestinations || [];

  // Match saved IDs with DESTINATIONS dataset
  const savedList = DESTINATIONS.filter((d) =>
    savedIds.some((sid) => String(sid).toLowerCase() === String(d.id).toLowerCase())
  );

  // If user has saved IDs that aren't in DESTINATIONS or list is empty, also include any matches by title or fallback
  const allSaved = savedList.length > 0 ? savedList : [];

  // Filter by category and search query
  const categories = ['All', ...new Set(DESTINATIONS.map((d) => d.category || 'General'))];

  const filtered = allSaved.filter((dest) => {
    const matchesCategory =
      selectedCategory === 'All' || dest.category === selectedCategory;
    const matchesSearch =
      (dest.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemoveSaved = async (destId, destName) => {
    try {
      setRemovingId(destId);
      const res = await userService.toggleSavedDestination(destId);
      if (res.success) {
        const updated = savedIds.filter((id) => id !== destId);
        updateUser({
          ...currentUser,
          savedDestinations: updated
        });
        toast.success(`Removed ${destName} from saved destinations.`);
      }
    } catch (err) {
      toast.error('Failed to update wishlist.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-rose-600 uppercase mb-1">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Wishlist Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Saved Destinations ({allSaved.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of places you dream of visiting and jumpstart your holiday planning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm shadow-brand-500/20 transition-all hover:scale-102"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Places</span>
          </Link>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      {allSaved.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your saved destinations..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Destination Grid or Empty State */}
      {allSaved.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              Your wishlist is currently empty
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Save your favorite destinations while browsing so you can easily compare itineraries, weather, and book packages later.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Destinations Directory</span>
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-xs text-slate-500 font-medium">
            No saved destinations matched "{searchQuery}" in category "{selectedCategory}".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-3 text-xs font-bold text-brand-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Image Preview & Badges */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={
                    dest.image ||
                    `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80`
                  }
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveSaved(dest.id, dest.name)}
                  disabled={removingId === dest.id}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 shadow-md backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer"
                  title="Remove from saved"
                  aria-label={`Remove ${dest.name} from saved destinations`}
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {dest.category || 'Destination'}
                  </span>
                </div>

                {/* Country & Rating */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold flex items-center gap-1 drop-shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    {dest.country}
                  </span>
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs text-xs font-bold text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{dest.rating || '4.8'}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {dest.shortDescription || dest.overview}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <span>
                      Duration: <strong>{dest.duration || '3-5 Days'}</strong>
                    </span>
                    <span className="text-brand-600 font-bold">
                      {dest.estimatedBudget || '₹12,000 avg'}
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    to={`/destinations/${dest.id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      openAssistant(
                        `Tell me the best time to visit ${dest.name} in ${dest.country}, top activities, and travel tips.`
                      )
                    }
                    className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 border border-slate-200/60 transition-colors"
                    title="Plan with AI Assistant"
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSavedDestinationsPage;
