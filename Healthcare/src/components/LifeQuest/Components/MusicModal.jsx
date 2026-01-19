import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, CheckCircle, Music, ExternalLink, Play } from 'lucide-react';

const musicOptions = [
  {
    id: 1,
    title: 'Peaceful Piano',
    url: 'https://www.youtube.com/watch?v=3jWRrafhO7M',
    duration: '3 hours',
    description: 'Relaxing piano music for focus and calm'
  },
  {
    id: 2,
    title: 'Nature Sounds',
    url: 'https://www.youtube.com/watch?v=lE6RYpe9IT0',
    duration: '2 hours',
    description: 'Soothing rain and forest sounds'
  },
  {
    id: 3,
    title: 'Meditation Music',
    url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    duration: '3 hours',
    description: 'Deep meditation and healing music'
  },
  {
    id: 4,
    title: 'Lo-Fi Beats',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    duration: 'Live 24/7',
    description: 'Chill lo-fi hip hop beats to relax'
  },
  {
    id: 5,
    title: 'Ocean Waves',
    url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I',
    duration: '10 hours',
    description: 'Calming ocean waves for deep relaxation'
  },
  {
    id: 6,
    title: 'Zen Garden',
    url: 'https://www.youtube.com/watch?v=CySNhHHCHLo',
    duration: '3 hours',
    description: 'Traditional Japanese music for meditation'
  }
];

const MusicModal = ({ onComplete, onClose, requiredTime = 60 }) => {
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [timer, setTimer] = useState(requiredTime); // Default 60 seconds (1 minute) for quests
  const [isListening, setIsListening] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const initialTime = requiredTime;

  useEffect(() => {
    let interval;
    if (isListening && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsListening(false);
            setShowCompletion(true);
            setTimeout(() => onComplete(), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, timer, onComplete]);

  const handleSelectMusic = (music) => {
    setSelectedMusic(music);
    window.open(music.url, '_blank');
  };

  const handleStartListening = () => {
    if (selectedMusic) {
      setIsListening(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-md rounded-3xl p-8 max-w-3xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {!showCompletion ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Music size={32} className="text-indigo-400" />
              <h2 className="text-white font-bold text-3xl">Soothing Music</h2>
            </div>

            <p className="text-gray-300 mb-8">
              Choose music to listen to for at least {Math.floor(initialTime / 60)} {Math.floor(initialTime / 60) === 1 ? 'minute' : 'minutes'}. Take this time to relax and unwind.
            </p>

            {/* Music Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {musicOptions.map((music) => (
                <motion.div
                  key={music.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectMusic(music)}
                  className={`p-4 rounded-xl cursor-pointer transition border-2 ${
                    selectedMusic?.id === music.id
                      ? 'bg-indigo-500/30 border-indigo-400'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold">{music.title}</h3>
                    <ExternalLink size={16} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{music.description}</p>
                  <div className="flex items-center gap-2">
                    <Play size={12} className="text-indigo-400" />
                    <span className="text-indigo-400 text-xs font-semibold">{music.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Timer and Controls */}
            {selectedMusic && (
              <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                <div className="text-center mb-4">
                  <p className="text-gray-300 mb-2">Listening to: <span className="text-white font-semibold">{selectedMusic.title}</span></p>
                  {isListening ? (
                    <div className="text-5xl font-bold text-white mb-2">
                      {formatTime(timer)}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-400 mb-2">
                      {formatTime(initialTime)}
                    </div>
                  )}
                  <p className="text-gray-400 text-sm">
                    {isListening ? 'Time remaining' : `Start the timer when you begin listening (${Math.floor(initialTime / 60)}:${String(initialTime % 60).padStart(2, '0')} required)`}
                  </p>
                </div>

                {!isListening && (
                  <button
                    onClick={handleStartListening}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Start {Math.floor(initialTime / 60)}-Minute Timer
                  </button>
                )}

                {isListening && (
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-16 h-16 rounded-full bg-indigo-500/30 flex items-center justify-center mx-auto"
                    >
                      <Music size={32} className="text-indigo-400" />
                    </motion.div>
                    <p className="text-gray-300 mt-4">
                      Relax and enjoy the music... 🎵
                    </p>
                  </div>
                )}
              </div>
            )}

            {!selectedMusic && (
              <p className="text-center text-gray-400">
                Select a music option above to get started
              </p>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-24 h-24 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={48} className="text-green-400" />
            </motion.div>
            <h3 className="text-white font-bold text-2xl mb-4">Well Done! 🎵</h3>
            <p className="text-gray-300">
              You've completed your music listening session. Feel refreshed?
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MusicModal;
