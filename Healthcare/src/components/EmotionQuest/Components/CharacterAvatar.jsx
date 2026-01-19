import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CharacterAvatar = ({ character, emotion, characterName }) => {
  // Character avatar styles based on character type
  const avatarStyles = {
    boss: {
      bg: 'from-gray-700 to-gray-900',
      emoji: '👔',
      border: 'border-gray-500'
    },
    self: {
      bg: 'from-purple-600 to-indigo-600',
      emoji: '🧠',
      border: 'border-purple-400'
    },
    friend: {
      bg: 'from-green-600 to-teal-600',
      emoji: '👋',
      border: 'border-green-400'
    },
    colleague: {
      bg: 'from-blue-600 to-cyan-600',
      emoji: '💼',
      border: 'border-blue-400'
    },
    audience: {
      bg: 'from-yellow-600 to-orange-600',
      emoji: '👥',
      border: 'border-yellow-400'
    },
    mirror: {
      bg: 'from-pink-600 to-rose-600',
      emoji: '🪞',
      border: 'border-pink-400'
    },
    failure: {
      bg: 'from-red-600 to-pink-600',
      emoji: '📉',
      border: 'border-red-400'
    },
    partner: {
      bg: 'from-rose-600 to-pink-600',
      emoji: '💕',
      border: 'border-rose-400'
    },
    roommate: {
      bg: 'from-amber-600 to-yellow-600',
      emoji: '🏠',
      border: 'border-amber-400'
    },
    opportunity: {
      bg: 'from-emerald-600 to-green-600',
      emoji: '🚀',
      border: 'border-emerald-400'
    },
    social: {
      bg: 'from-violet-600 to-purple-600',
      emoji: '🎭',
      border: 'border-violet-400'
    },
    mistake: {
      bg: 'from-orange-600 to-red-600',
      emoji: '⚠️',
      border: 'border-orange-400'
    },
    overwhelmed: {
      bg: 'from-slate-700 to-gray-800',
      emoji: '😰',
      border: 'border-slate-400'
    },
    boundary: {
      bg: 'from-teal-600 to-cyan-600',
      emoji: '🛡️',
      border: 'border-teal-400'
    },
    self_care: {
      bg: 'from-indigo-600 to-purple-600',
      emoji: '🧘',
      border: 'border-indigo-400'
    },
  };

  const style = avatarStyles[character] || avatarStyles.self;

  // Emotion-based animations
  const emotionAnimations = {
    serious: { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity } },
    anxious: { y: [0, -5, 0], transition: { duration: 1.5, repeat: Infinity } },
    friendly: { rotate: [0, 5, -5, 0], transition: { duration: 2, repeat: Infinity } },
    concerned: { scale: [1, 1.05, 1], transition: { duration: 1.8, repeat: Infinity } },
    upset: { x: [-2, 2, -2], transition: { duration: 0.5, repeat: Infinity } },
    tired: { opacity: [1, 0.8, 1], transition: { duration: 2, repeat: Infinity } },
    'self-critical': { scale: [1, 0.98, 1], transition: { duration: 2, repeat: Infinity } },
    disappointed: { y: [0, 3, 0], transition: { duration: 2, repeat: Infinity } },
    forgetful: { rotate: [0, -3, 3, 0], transition: { duration: 2, repeat: Infinity } },
    messy: { rotate: [0, 2, -2, 0], transition: { duration: 1.5, repeat: Infinity } },
    uncertain: { x: [-3, 3, -3], transition: { duration: 2, repeat: Infinity } },
    nervous: { scale: [1, 1.03, 1], y: [0, -3, 0], transition: { duration: 1, repeat: Infinity } },
    embarrassed: { scale: [1, 0.95, 1], transition: { duration: 1.5, repeat: Infinity } },
    stressed: { rotate: [-2, 2, -2], y: [0, -2, 0], transition: { duration: 0.8, repeat: Infinity } },
    requesting: { scale: [1, 1.02, 1], transition: { duration: 1.5, repeat: Infinity } },
    neutral: {},
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={`w-24 h-24 rounded-full bg-gradient-to-br ${style.bg} border-4 ${style.border} flex items-center justify-center text-4xl shadow-xl`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, ...emotionAnimations[emotion] }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        {style.emoji}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-white font-semibold text-lg">{characterName}</p>
        <p className="text-gray-400 text-sm capitalize">{emotion}</p>
      </motion.div>
    </div>
  );
};

CharacterAvatar.propTypes = {
  character: PropTypes.string.isRequired,
  emotion: PropTypes.string.isRequired,
  characterName: PropTypes.string.isRequired,
};

export default CharacterAvatar;
