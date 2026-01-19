import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

const QuestCard = ({ quest, onComplete }) => {
  const isCompleted = quest.status === 'completed';
  
  const difficultyColors = {
    easy: 'from-green-500 to-emerald-500',
    medium: 'from-yellow-500 to-orange-500',
    hard: 'from-red-500 to-pink-500'
  };

  const categoryIcons = {
    health: '💧',
    exercise: '🏃',
    social: '💬',
    mindfulness: '🧘',
    productivity: '📝',
    mood: '🎵'
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!isCompleted ? { scale: 1.02, y: -5 } : {}}
      className={`relative overflow-hidden rounded-2xl p-6 ${
        isCompleted 
          ? 'bg-gradient-to-br from-gray-700 to-gray-800 opacity-75' 
          : 'bg-gradient-to-br from-indigo-600 to-purple-600'
      } shadow-xl`}
    >
      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4"
        >
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        <div className="text-5xl">{categoryIcons[quest.category]}</div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${difficultyColors[quest.difficulty]}`}>
              {quest.difficulty.toUpperCase()}
            </span>
            <span className="flex items-center gap-1 text-yellow-300 font-bold">
              <span className="text-lg">⭐</span>
              +{quest.points} XP
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{quest.title}</h3>
          <p className="text-gray-200 text-sm mb-4">{quest.description}</p>
          
          {!isCompleted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(quest.id)}
              className="px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Complete Quest
            </motion.button>
          )}
          
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-400 font-bold">
              <Check className="w-5 h-5" />
              Quest Completed!
            </div>
          )}
        </div>
      </div>
      
      {!isCompleted && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          style={{ width: '50%' }}
        />
      )}
    </motion.div>
  );
};

export default QuestCard;
