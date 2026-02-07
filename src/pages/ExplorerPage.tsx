import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import SystemStatusBar from '@/components/SystemStatusBar';
import { SolarSystem } from '@/components/3d/SolarSystem';
import { Asteroid } from '@/types/asteroid';
import { mockAsteroids } from '@/data/mockAsteroids';
import { ArrowLeft, AlertTriangle, Shield, Info, ExternalLink, Calendar, Gauge, Target, Crosshair } from 'lucide-react';

const ExplorerPage = () => {
  const navigate = useNavigate();
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);

  const stats = {
    totalAsteroids: mockAsteroids.length,
    hazardous: mockAsteroids.filter(a => a.isHazardous).length,
    highRisk: mockAsteroids.filter(a => a.riskScore === 'high').length,
  };

  const getOrbitClassification = (asteroid: Asteroid) => {
    const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
    if (asteroid.isHazardous && avgDiameter > 500) return 'Apollo-class PHA';
    if (asteroid.isHazardous) return 'Near-Earth PHA';
    if (avgDiameter > 300) return 'Main Belt Crosser';
    return 'Near-Earth Object';
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <SystemStatusBar />
      
      {/* 3D Canvas Container */}
      <div className="fixed inset-0 pt-28">
        <SolarSystem
          selectedAsteroid={selectedAsteroid}
          onSelectAsteroid={setSelectedAsteroid}
        />
      </div>

      {/* UI Overlays */}
      <div className="relative z-10 pt-32 px-4 pointer-events-none">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/dashboard')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm text-white font-mono text-xs uppercase tracking-wider hover:border-cyan-500/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>

        {/* Info Panel - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="pointer-events-auto absolute top-40 left-4 w-72"
        >
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors">
            <div className="bg-black/40 border-b border-white/10 px-4 py-2">
              <h2 className="font-orbitron text-cyan-400 text-sm font-bold tracking-widest flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                ORBITAL SIMULATION
              </h2>
            </div>
            <div className="p-4">
              <ul className="space-y-2 text-sm font-sans text-white">
                <li className="flex items-center gap-2">
                  <span>🪐</span> 6 Planets
                </li>
                <li className="flex items-center gap-2">
                  <span>☄️</span> {stats.totalAsteroids} Tracked Asteroids
                </li>
                <li className="flex items-center gap-2">
                  <span>⚠️</span> {stats.hazardous} Potentially Hazardous
                </li>
                <li className="flex items-center gap-2">
                  <span>🎯</span> {stats.highRisk} High Risk
                </li>
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-xs uppercase rounded-sm hover:bg-cyan-500/30 transition-colors"
              >
                ☀️ CENTER ON SUN
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Selected Asteroid Details Panel - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="pointer-events-auto fixed top-40 right-4 w-80"
        >
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors">
            <div className="bg-black/40 border-b border-white/10 px-4 py-2">
              <h3 className="font-orbitron text-sm font-bold text-white tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                OBJECT DETAILS
              </h3>
            </div>
            
            {selectedAsteroid ? (
              <div className="p-4">
                {/* Header with name and status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-orbitron text-cyan-400 text-sm font-bold">
                      {selectedAsteroid.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono">
                      ID: {selectedAsteroid.nasaId}
                    </p>
                  </div>
                  {selectedAsteroid.isHazardous ? (
                    <div className="p-1.5 bg-red-500/20 rounded">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-green-500/20 rounded">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                  )}
                </div>

                {/* Orbit Classification */}
                <div className="bg-black/40 rounded-sm p-3 mb-4 border border-white/10">
                  <span className="text-[10px] text-gray-400 font-mono uppercase">ORBIT CLASSIFICATION</span>
                  <p className="text-sm font-orbitron text-white mt-1">
                    {getOrbitClassification(selectedAsteroid)}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/40 rounded-sm p-2 border border-white/10">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] text-gray-400 font-mono uppercase">APPROACH</span>
                    </div>
                    <p className="text-xs font-orbitron text-white">
                      {new Date(selectedAsteroid.closeApproachDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-black/40 rounded-sm p-2 border border-white/10">
                    <div className="flex items-center gap-1 mb-1">
                      <Gauge className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] text-gray-400 font-mono uppercase">VELOCITY</span>
                    </div>
                    <p className="text-xs font-orbitron text-white">
                      {selectedAsteroid.velocityKmps.toFixed(1)} km/s
                    </p>
                  </div>
                  <div className="bg-black/40 rounded-sm p-2 border border-white/10">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] text-gray-400 font-mono uppercase">DISTANCE</span>
                    </div>
                    <p className="text-xs font-orbitron text-white">
                      {(selectedAsteroid.missDistanceKm / 1000000).toFixed(2)}M km
                    </p>
                  </div>
                  <div className="bg-black/40 rounded-sm p-2 border border-white/10">
                    <span className="text-[10px] text-gray-400 font-mono uppercase">DIAMETER</span>
                    <p className="text-xs font-orbitron text-white mt-1">
                      ~{Math.round((selectedAsteroid.diameterMin + selectedAsteroid.diameterMax) / 2)}m
                    </p>
                  </div>
                </div>

                {/* Risk Level */}
                <div className={`rounded-sm p-3 mb-4 border ${
                  selectedAsteroid.riskScore === 'high' ? 'bg-red-500/20 border-red-500/30' :
                  selectedAsteroid.riskScore === 'medium' ? 'bg-amber-500/20 border-amber-500/30' :
                  'bg-green-500/20 border-green-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono uppercase">RISK LEVEL</span>
                    <span className={`font-orbitron text-sm font-bold ${
                      selectedAsteroid.riskScore === 'high' ? 'text-red-400' :
                      selectedAsteroid.riskScore === 'medium' ? 'text-amber-400' :
                      'text-green-400'
                    }`}>
                      {selectedAsteroid.riskScore.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => navigate(`/asteroid/${selectedAsteroid.id}`)}
                  className="w-full py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-xs uppercase rounded-sm hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  FULL INSPECTION
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAsteroid(null)}
                  className="w-full mt-2 py-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                >
                  Clear selection
                </button>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                  <Crosshair className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 font-mono">
                  Click on an asteroid in the 3D view to inspect its details
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pointer-events-auto fixed bottom-4 left-4"
        >
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 hover:border-cyan-500/50 transition-colors">
            <h3 className="font-orbitron text-xs text-gray-400 font-bold tracking-widest mb-2">RISK LEGEND</h3>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-green-400">Low Risk</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-amber-400">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-red-400">High Risk</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pointer-events-auto fixed bottom-4 right-4"
        >
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-gray-400">
              Scroll to zoom • Drag to rotate • Click asteroids for details
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExplorerPage;
