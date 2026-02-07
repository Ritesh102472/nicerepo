import { motion } from 'framer-motion';
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { Asteroid } from '@/types/asteroid';
import { WatchlistItem } from '@/hooks/useWatchlist';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface WatchlistPanelProps {
  watchlist: WatchlistItem[];
  asteroids: Asteroid[];
  onSelectAsteroid: (asteroid: Asteroid) => void;
  onRemoveFromWatchlist: (asteroidId: string) => void;
  selectedAsteroidId?: string;
}

export const WatchlistPanel = ({
  watchlist,
  asteroids,
  onSelectAsteroid,
  onRemoveFromWatchlist,
  selectedAsteroidId,
}: WatchlistPanelProps) => {
  const watchedAsteroids = watchlist
    .map(item => ({
      ...item,
      asteroid: asteroids.find(a => a.id === item.asteroidId),
    }))
    .filter(item => item.asteroid);

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-8">
        <Eye className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-rajdhani">
          No asteroids in your watchlist
        </p>
        <p className="text-xs text-muted-foreground/70 font-rajdhani mt-1">
          Click the star icon on any asteroid to add it
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2">
        {watchedAsteroids.map(({ asteroid, addedAt }) => {
          if (!asteroid) return null;
          
          return (
            <motion.div
              key={asteroid.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                selectedAsteroidId === asteroid.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary/30 hover:border-primary/50'
              }`}
              onClick={() => onSelectAsteroid(asteroid)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Star className="w-4 h-4 text-warning flex-shrink-0" fill="currentColor" />
                <div className="min-w-0">
                  <p className="font-rajdhani text-sm text-foreground truncate">
                    {asteroid.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-rajdhani">
                    Added {new Date(addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded font-rajdhani ${
                  asteroid.riskScore === 'high' ? 'bg-destructive/20 text-destructive' :
                  asteroid.riskScore === 'medium' ? 'bg-warning/20 text-warning' :
                  'bg-safe/20 text-safe'
                }`}>
                  {asteroid.riskScore.toUpperCase()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWatchlist(asteroid.id);
                  }}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
