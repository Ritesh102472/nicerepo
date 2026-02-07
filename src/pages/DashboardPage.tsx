import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlanetarySafetyIndex from '@/components/dashboard/PlanetarySafetyIndex';
import RiskExplanationModal from '@/components/dashboard/RiskExplanationModal';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { AsteroidListItem } from '@/components/dashboard/AsteroidListItem';
import { AsteroidDetailsPanel } from '@/components/dashboard/AsteroidDetailsPanel';
import { ImpactModal } from '@/components/dashboard/ImpactModal';
import { AlertSettingsModal } from '@/components/dashboard/AlertSettingsModal';
import { WatchlistPanel } from '@/components/dashboard/WatchlistPanel';
import { CommunityChat } from '@/components/dashboard/CommunityChat';
import { getAsteroidsByMonth, calculateImpactScenario, mockAsteroids } from '@/data/mockAsteroids';
import { Asteroid, ImpactScenario } from '@/types/asteroid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAlertSettings } from '@/hooks/useAlertSettings';
import { useAlertNotifications } from '@/hooks/useAlertNotifications';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/services/auth';
import { Globe, LayoutDashboard, LogOut, HelpCircle, Bell, Star, MessageCircle } from 'lucide-react';
import DashboardBackground from '@/components/3d/DashboardBackground';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const asteroidGroups = useMemo(() => getAsteroidsByMonth(), []);
  
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    asteroidGroups.length > 0 ? `${asteroidGroups[0].month} ${asteroidGroups[0].year}` : null
  );
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [impactScenario, setImpactScenario] = useState<ImpactScenario | null>(null);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showAlertSettingsModal, setShowAlertSettingsModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);

  // Hooks for watchlist and alerts
  const { watchlist, addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();
  const { settings: alertSettings, updateSettings: updateAlertSettings, resetSettings: resetAlertSettings } = useAlertSettings();

  // Enable alert notifications
  useAlertNotifications({ 
    settings: alertSettings, 
    watchedAsteroidIds: watchlist.map(w => w.asteroidId) 
  });

  const currentAsteroids = useMemo(() => {
    if (!selectedMonth) return [];
    const group = asteroidGroups.find(g => `${g.month} ${g.year}` === selectedMonth);
    return group?.asteroids || [];
  }, [selectedMonth, asteroidGroups]);

  const handleViewImpact = () => {
    if (selectedAsteroid) {
      const scenario = calculateImpactScenario(selectedAsteroid);
      setImpactScenario(scenario);
      setShowImpactModal(true);
    }
  };

  const handleAsteroidClick = (asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
  };

  const handleInspectAsteroid = () => {
    if (selectedAsteroid) {
      navigate(`/asteroid/${selectedAsteroid.id}`);
    }
  };

  const handleToggleWatch = () => {
    if (!selectedAsteroid) return;
    
    if (isWatched(selectedAsteroid.id)) {
      removeFromWatchlist(selectedAsteroid.id);
      toast({
        title: 'Removed from Watchlist',
        description: `${selectedAsteroid.name} has been removed from your watchlist.`,
      });
    } else {
      addToWatchlist(selectedAsteroid.id);
      toast({
        title: 'Added to Watchlist',
        description: `${selectedAsteroid.name} is now being tracked.`,
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen text-white relative bg-transparent">
      {/* Dashboard-only background: starfield + orbit rings + radar sweep */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <DashboardBackground />
      </div>

      {/* Grid overlay (match landing) */}
      <div
        className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
        aria-hidden
      />

      {/* Dashboard Content */}
      <div className="relative z-10 pt-8 pb-8 px-4 md:px-8">
        {/* Header - landing style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <LayoutDashboard className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-orbitron font-bold tracking-widest text-white">
              NEO MONITORING DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChatPanel(!showChatPanel)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-sm text-xs font-mono uppercase tracking-wider transition-colors ${
                showChatPanel
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  : 'bg-black/35 border-white/10 text-gray-400 hover:text-white hover:border-cyan-500/50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">Chat</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAlertSettingsModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-black/35 border border-white/10 rounded-sm text-gray-400 text-xs font-mono uppercase tracking-wider hover:text-white hover:border-cyan-500/50 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline">Alerts</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRiskModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-black/35 border border-white/10 rounded-sm text-gray-400 text-xs font-mono uppercase tracking-wider hover:text-white hover:border-cyan-500/50 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden md:inline">Risk Info</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explorer')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-sm text-cyan-400 text-xs font-mono uppercase tracking-wider hover:bg-cyan-500/30 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">3D Explorer</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-sm text-red-400 text-xs font-mono uppercase tracking-wider hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Planetary Safety Index Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <PlanetarySafetyIndex />
        </motion.div>

        {/* Main Grid */}
        <div className={`grid gap-6 ${showChatPanel ? 'lg:grid-cols-12' : 'lg:grid-cols-12'}`}>
          {/* Left Panel - Month Selector & Watchlist */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={showChatPanel ? 'lg:col-span-2' : 'lg:col-span-3'}
          >
            <div className="panel-glass rounded-xl p-4">
              <p className="text-sm text-gray-400 font-mono uppercase tracking-wider mb-4">
                Asteroids by closest approach date
              </p>
              <MonthSelector
                groups={asteroidGroups}
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
              />

              {/* Watchlist Section */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-orbitron text-sm font-bold tracking-widest text-white">
                    MY WATCHLIST
                  </h3>
                  <span className="ml-auto text-xs text-gray-400 font-mono">
                    {watchlist.length}
                  </span>
                </div>
                <WatchlistPanel
                  watchlist={watchlist}
                  asteroids={mockAsteroids}
                  onSelectAsteroid={handleAsteroidClick}
                  onRemoveFromWatchlist={removeFromWatchlist}
                  selectedAsteroidId={selectedAsteroid?.id}
                />
              </div>

              {/* ISS Live Feed Section */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="font-orbitron text-sm font-bold tracking-widest text-white mb-2">
                  Live from the ISS
                </h3>
                <p className="text-xs text-gray-400 font-mono mb-3">
                  Live video from the International Space Station
                </p>
                <div className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/10">
                  <iframe
                    src="https://www.youtube.com/embed/P9C25Un7xaM?autoplay=0&mute=1"
                    title="ISS Live"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Middle Panel - Asteroid List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={showChatPanel ? 'lg:col-span-4' : 'lg:col-span-5'}
          >
            <div className="panel-glass rounded-xl p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                  Click an asteroid card for inspection
                </p>
                <span className="text-cyan-400 text-xl">▼</span>
              </div>
              
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {currentAsteroids.map((asteroid) => (
                    <AsteroidListItem
                      key={asteroid.id}
                      asteroid={asteroid}
                      isSelected={selectedAsteroid?.id === asteroid.id}
                      onClick={() => handleAsteroidClick(asteroid)}
                      isWatched={isWatched(asteroid.id)}
                      onToggleWatch={() => {
                        if (isWatched(asteroid.id)) {
                          removeFromWatchlist(asteroid.id);
                          toast({ title: 'Removed from Watchlist', description: `${asteroid.name} removed.` });
                        } else {
                          addToWatchlist(asteroid.id);
                          toast({ title: 'Added to Watchlist', description: `${asteroid.name} is now watched.` });
                        }
                      }}
                    />
                  ))}
                  {currentAsteroids.length === 0 && (
                    <p className="text-center text-gray-400 py-8 font-mono">
                      Select a month to view asteroids
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>

          {/* Right Panel - Asteroid Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={showChatPanel ? 'lg:col-span-3' : 'lg:col-span-4'}
          >
            <div className="panel-glass rounded-xl p-4 h-full">
              <AsteroidDetailsPanel
                asteroid={selectedAsteroid}
                onViewImpact={handleViewImpact}
                onInspect={handleInspectAsteroid}
                isWatched={selectedAsteroid ? isWatched(selectedAsteroid.id) : false}
                onToggleWatch={selectedAsteroid ? handleToggleWatch : undefined}
              />
            </div>
          </motion.div>

          {/* Chat Panel (conditionally shown) */}
          {showChatPanel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3"
            >
              <CommunityChat 
                asteroidContext={selectedAsteroid?.name}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Impact Modal */}
      <ImpactModal
        scenario={impactScenario}
        isOpen={showImpactModal}
        onClose={() => setShowImpactModal(false)}
      />

      {/* Risk Explanation Modal */}
      <RiskExplanationModal
        isOpen={showRiskModal}
        onClose={() => setShowRiskModal(false)}
      />

      {/* Alert Settings Modal */}
      <AlertSettingsModal
        isOpen={showAlertSettingsModal}
        onClose={() => setShowAlertSettingsModal(false)}
        settings={alertSettings}
        onUpdateSettings={updateAlertSettings}
        onResetSettings={resetAlertSettings}
      />
    </div>
  );
};

export default DashboardPage;
