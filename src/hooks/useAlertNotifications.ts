import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { mockAsteroids } from '@/data/mockAsteroids';
import { AlertSettings } from '@/hooks/useAlertSettings';

interface UseAlertNotificationsProps {
  settings: AlertSettings;
  watchedAsteroidIds?: string[];
}

export const useAlertNotifications = ({ settings, watchedAsteroidIds = [] }: UseAlertNotificationsProps) => {
  const hasShownAlerts = useRef(false);

  useEffect(() => {
    if (!settings.enabled || hasShownAlerts.current) return;
    hasShownAlerts.current = true;

    // Filter asteroids based on settings
    const alertAsteroids = mockAsteroids.filter(asteroid => {
      // Check risk level settings
      if (asteroid.riskScore === 'high' && !settings.showHighRisk) return false;
      if (asteroid.riskScore === 'medium' && !settings.showMediumRisk) return false;
      if (asteroid.riskScore === 'low' && !settings.showLowRisk) return false;

      // Check minimum diameter
      const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
      if (avgDiameter < settings.minDiameter) return false;

      // Check watchlist only setting
      if (settings.notifyWatchlistOnly && !watchedAsteroidIds.includes(asteroid.id)) return false;

      // Check days ahead
      const now = new Date();
      const approachDate = new Date(asteroid.closeApproachDate);
      const daysUntil = Math.ceil((approachDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > settings.daysAhead || daysUntil < 0) return false;

      return true;
    });

    // Show alerts with delays
    alertAsteroids.forEach((asteroid, index) => {
      const now = new Date();
      const approachDate = new Date(asteroid.closeApproachDate);
      const daysUntil = Math.ceil((approachDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      setTimeout(() => {
        const timeText = daysUntil > 0 ? `Approaching in ${daysUntil} days` : 'Imminent approach';
        
        toast({
          title: '⚠️ Close Approach Alert',
          description: `${asteroid.name} — Distance: ${(asteroid.missDistanceKm / 1000000).toFixed(2)}M km — ${timeText}`,
          variant: asteroid.riskScore === 'high' ? 'destructive' : 'default',
          duration: 8000,
        });
      }, 1500 + index * 2000);
    });
  }, [settings, watchedAsteroidIds]);

  // Reset function to allow re-triggering alerts
  const resetAlerts = () => {
    hasShownAlerts.current = false;
  };

  return { resetAlerts };
};
