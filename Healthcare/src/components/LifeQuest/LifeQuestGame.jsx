import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ListTodo, Zap, Users, TrendingUp, Skull, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import HomePage from './Pages/HomePage';
import QuestsPage from './Pages/QuestsPage';
import PowerUpsPage from './Pages/PowerUpsPage';
import AlliesPage from './Pages/AlliesPage';
import ProgressPage from './Pages/ProgressPage';
import BadGuysPage from './Pages/BadGuysPage';
import LifeQuestMusicPlayer from './Components/LifeQuestMusicPlayer';

const LifeQuestGame = ({ onExit }) => {
  const [activePage, setActivePage] = useState('home');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  useEffect(() => {
    // Auto-start music when game loads
    setShowMusicPlayer(true);
  }, []);

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
  };

  const pages = {
    home: { component: HomePage, title: 'Home', icon: Home },
    quests: { component: QuestsPage, title: 'Quests', icon: ListTodo },
    powerups: { component: PowerUpsPage, title: 'Power-Ups', icon: Zap },
    allies: { component: AlliesPage, title: 'Allies', icon: Users },
    progress: { component: ProgressPage, title: 'Progress', icon: TrendingUp },
    badguys: { component: BadGuysPage, title: 'Bad Guys', icon: Skull },
  };

  const CurrentPage = pages[activePage].component;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-gray-800/95 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            {onExit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExit}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">Back</span>
              </motion.button>
            )}

            {/* Navigation Links */}
            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-center">
              {Object.entries(pages).map(([key, { title, icon: Icon }]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActivePage(key)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-bold transition-all ${
                    activePage === key
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{title}</span>
                </motion.button>
              ))}
            </div>

            <div className="w-24 hidden md:block" />
          </div>
        </div>
      </motion.nav>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentPage />
        </motion.div>
      </AnimatePresence>

      {/* Music Player */}
      <AnimatePresence>
        {showMusicPlayer && <LifeQuestMusicPlayer onClose={() => setShowMusicPlayer(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default LifeQuestGame;
