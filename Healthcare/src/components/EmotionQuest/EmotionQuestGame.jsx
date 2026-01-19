import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Book, Trophy, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { HomePage, ChaptersPage, StoryPage, ProgressPage } from './Pages';
import useEmotionQuestStore from '../../store/emotionQuestStore';
import soundManager from './soundManager';

const EmotionQuestGame = ({ onExit }) => {
  const [activePage, setActivePage] = useState('home');
  const [isMuted, setIsMuted] = useState(false);
  const { isPlaying } = useEmotionQuestStore();

  const handleNavigate = (page) => {
    soundManager.playClick();
    setActivePage(page);
  };

  const handleExit = () => {
    soundManager.playClick();
    soundManager.stopBackgroundMusic();
    if (onExit) onExit();
  };

  const toggleMute = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(newMuteState);
    soundManager.playClick();
  };

  // Navigation items (hide during story gameplay)
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chapters', label: 'Chapters', icon: Book },
    { id: 'progress', label: 'Progress', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Top Navigation Bar - Hide during story */}
      {activePage !== 'story' && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="text-4xl">🎭</div>
                <div>
                  <h1 className="text-white font-bold text-2xl">Emotion Quest</h1>
                  <p className="text-purple-300 text-sm">Learn EQ Through Stories</p>
                </div>
              </motion.div>

              {/* Nav Items */}
              <div className="flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => soundManager.playHover()}
                      onClick={() => handleNavigate(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${
                        activePage === item.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/15'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}

                {/* Mute Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-white/10 text-gray-300 hover:text-white hover:bg-white/15 transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>

                {/* Exit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExit}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition border border-red-500/50"
                >
                  <ArrowLeft size={20} />
                  <span>Exit</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Page Content with Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activePage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {activePage === 'chapters' && <ChaptersPage onNavigate={handleNavigate} />}
          {activePage === 'story' && <StoryPage onNavigate={handleNavigate} />}
          {activePage === 'progress' && <ProgressPage onNavigate={handleNavigate} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EmotionQuestGame;
