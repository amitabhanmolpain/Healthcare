import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Lock, CheckCircle, Play } from 'lucide-react';
import soundManager from '../soundManager';

const ChapterCard = ({ chapter, isLocked, isCompleted, onStart }) => {
  const difficultyColors = {
    Beginner: 'from-green-500 to-emerald-500',
    Intermediate: 'from-yellow-500 to-orange-500',
    Advanced: 'from-red-500 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isLocked ? { scale: 1.03, y: -5 } : {}}
      className={`relative rounded-2xl p-6 border-2 ${
        isLocked
          ? 'bg-gray-800/50 border-gray-700/50 opacity-60'
          : `bg-gradient-to-br ${chapter.color} border-white/20 shadow-xl`
      }`}
    >
      {/* Completed Badge */}
      {isCompleted && !isLocked && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-green-500 border-4 border-white flex items-center justify-center shadow-lg"
        >
          <CheckCircle size={24} className="text-white" />
        </motion.div>
      )}

      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute top-4 right-4">
          <Lock size={24} className="text-gray-500" />
        </div>
      )}

      {/* Chapter Icon & Number */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{chapter.icon}</div>
        <div>
          <p className="text-white/60 text-sm font-semibold">Chapter {chapter.id}</p>
          <h3 className="text-white font-bold text-2xl">{chapter.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/80 mb-4 leading-relaxed">{chapter.description}</p>

      {/* Skill Tag */}
      <div className="flex items-center gap-2 mb-4">
        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <p className="text-white text-sm font-semibold">🎯 {chapter.skill}</p>
        </div>
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[chapter.difficulty]} text-white text-xs font-bold`}>
          {chapter.difficulty}
        </div>
      </div>

      {/* Scene Count */}
      <p className="text-white/60 text-sm mb-4">
        📖 {chapter.scenes.length} Scenes
      </p>

      {/* Start Button */}
      {!isLocked && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => soundManager.playHover()}
          onClick={() => {
            soundManager.playClick();
            onStart();
          }}
          className="w-full py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 border border-white/30"
        >
          <Play size={20} />
          {isCompleted ? 'Play Again' : 'Start Chapter'}
        </motion.button>
      )}

      {isLocked && (
        <div className="text-center text-gray-400 text-sm py-3">
          Complete previous chapters to unlock
        </div>
      )}
    </motion.div>
  );
};

ChapterCard.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    skill: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    scenes: PropTypes.array.isRequired,
  }).isRequired,
  isLocked: PropTypes.bool,
  isCompleted: PropTypes.bool,
  onStart: PropTypes.func.isRequired,
};

export default ChapterCard;
