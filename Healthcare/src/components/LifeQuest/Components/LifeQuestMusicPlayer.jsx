import { motion } from 'framer-motion';
import { X, Music, Minimize2 } from 'lucide-react';
import { useState } from 'react';

const LifeQuestMusicPlayer = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(true);

  if (isMinimized) {
    // Minimized floating button
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[100] p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl border-2 border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <Music size={28} className="text-white" />
        </motion.div>
        {/* Hidden audio player */}
        <div className="sr-only">
          <iframe
            width="0"
            height="0"
            src="https://www.youtube.com/embed/3pNpHZ1yv3I?autoplay=1&loop=1&playlist=3pNpHZ1yv3I"
            title="LifeQuest Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md"
      >
        {/* Control Buttons */}
        <div className="absolute -top-12 right-0 flex gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition backdrop-blur-sm flex items-center gap-2"
          >
            <Minimize2 size={20} />
            <span className="font-semibold">Minimize</span>
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition backdrop-blur-sm flex items-center gap-2"
          >
            <X size={24} />
            <span className="font-semibold">Close</span>
          </button>
        </div>

        {/* Audio Player Card */}
        <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-4 border-purple-500/50">
          <div className="text-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Music size={48} className="text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">🎵 LifeQuest Music</h3>
            <p className="text-purple-200">Stay motivated on your journey!</p>
          </div>

          {/* Hidden YouTube iframe for audio only */}
          <div className="sr-only">
            <iframe
              width="0"
              height="0"
              src="https://www.youtube.com/embed/3pNpHZ1yv3I?autoplay=1&loop=1&playlist=3pNpHZ1yv3I"
              title="LifeQuest Music"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white/90 text-center text-sm">
              🎧 Audio is playing in the background. You can minimize this and continue your quest!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LifeQuestMusicPlayer;
