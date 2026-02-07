import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const DocumentationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 relative">
      {/* Back to home */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 font-mono text-sm uppercase tracking-wider mb-10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </motion.button>

      <div className="max-w-5xl mx-auto">
        {/* PAGE TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-orbitron font-bold mb-8 text-center text-white"
        >
          Cosmic Watch Documentation
        </motion.h1>

        {/* INTRODUCTION */}
        <section className="mb-10">
          <h2 className="text-2xl font-orbitron font-semibold mb-3 text-cyan-400">
            What is Cosmic Watch?
          </h2>
          <p className="text-gray-300 font-sans leading-relaxed">
            Cosmic Watch is a Near-Earth Object monitoring platform that transforms complex
            asteroid data into understandable risk insights. The system allows users to explore
            asteroid activity, understand potential risks, and track objects of interest.
          </p>
        </section>

        {/* DATA SOURCE */}
        <section className="mb-10">
          <h2 className="text-2xl font-orbitron font-semibold mb-3 text-cyan-400">
            Data Source
          </h2>
          <p className="text-gray-300 font-sans leading-relaxed">
            Asteroid data is retrieved from NASA's Near Earth Object Web Service (NeoWs). The
            platform processes scientific datasets and presents simplified information for
            easier interpretation.
          </p>
        </section>

        {/* RISK ANALYSIS */}
        <section className="mb-10">
          <h2 className="text-2xl font-orbitron font-semibold mb-3 text-cyan-400">
            Risk Analysis
          </h2>
          <p className="text-gray-300 font-sans leading-relaxed mb-3">
            The risk score is an analytical interpretation designed to help users understand
            asteroid characteristics. The following factors contribute to risk evaluation:
          </p>
          <ul className="list-disc list-inside text-gray-300 font-sans space-y-1">
            <li>Estimated asteroid diameter</li>
            <li>Relative velocity</li>
            <li>Miss distance from Earth</li>
            <li>NASA hazardous classification</li>
          </ul>
        </section>

        {/* DASHBOARD GUIDE */}
        <section className="mb-10">
          <h2 className="text-2xl font-orbitron font-semibold mb-3 text-cyan-400">
            How to Use the Dashboard
          </h2>
          <ul className="list-disc list-inside text-gray-300 font-sans space-y-1">
            <li>Browse the list of near-earth objects.</li>
            <li>View risk levels and asteroid details.</li>
            <li>Filter or search for specific asteroids.</li>
            <li>Select objects for tracking.</li>
          </ul>
        </section>

        {/* USER FEATURES */}
        <section className="mb-10">
          <h2 className="text-2xl font-orbitron font-semibold mb-3 text-cyan-400">
            User Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 font-sans space-y-1">
            <li>Create an account and log in securely.</li>
            <li>Maintain a personal asteroid watchlist.</li>
            <li>Receive alerts for close-approach events.</li>
          </ul>
        </section>

        {/* TECHNICAL OVERVIEW */}
        <section className="mb-10">
          <h2 className="text-2xl font-orbitron font-semibold mb-3 text-cyan-400">
            Technical Overview
          </h2>
          <p className="text-gray-300 font-sans leading-relaxed">
            NASA API → Backend Processing → Risk Analysis Engine → Frontend Visualization. The
            backend fetches data, calculates risk scores, and delivers simplified information
            to the dashboard interface.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DocumentationPage;
