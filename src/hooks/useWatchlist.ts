import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'cosmicwatch_watchlist';

export interface WatchlistItem {
  asteroidId: string;
  addedAt: string;
  notes?: string;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse watchlist:', e);
        setWatchlist([]);
      }
    }
  }, []);

  // Persist watchlist to localStorage
  const saveWatchlist = useCallback((items: WatchlistItem[]) => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
    setWatchlist(items);
  }, []);

  const addToWatchlist = useCallback((asteroidId: string, notes?: string) => {
    const existing = watchlist.find(item => item.asteroidId === asteroidId);
    if (existing) return false;

    const newItem: WatchlistItem = {
      asteroidId,
      addedAt: new Date().toISOString(),
      notes,
    };
    saveWatchlist([...watchlist, newItem]);
    return true;
  }, [watchlist, saveWatchlist]);

  const removeFromWatchlist = useCallback((asteroidId: string) => {
    saveWatchlist(watchlist.filter(item => item.asteroidId !== asteroidId));
  }, [watchlist, saveWatchlist]);

  const isWatched = useCallback((asteroidId: string) => {
    return watchlist.some(item => item.asteroidId === asteroidId);
  }, [watchlist]);

  const updateNotes = useCallback((asteroidId: string, notes: string) => {
    saveWatchlist(
      watchlist.map(item =>
        item.asteroidId === asteroidId ? { ...item, notes } : item
      )
    );
  }, [watchlist, saveWatchlist]);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    updateNotes,
  };
};
