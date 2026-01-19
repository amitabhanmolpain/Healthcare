import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StreakCounter = ({ currentStreak, longestStreak }) => {
  return (
    <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative"
          >
            <Flame className="w-16 h-16 text-yellow-300" />
            {currentStreak >= 5 && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold"
              >
                🔥
              </motion.div>
            )}
          </motion.div>
          
          <div>
            <h3 className="text-4xl font-bold text-white">{currentStreak} Days</h3>
            <p className="text-orange-200 text-sm">Current Streak</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-300">🏆 {longestStreak}</p>
          <p className="text-orange-200 text-xs">Best Streak</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-orange-400/30">
        <p className="text-white/80 text-sm">
          {currentStreak === 0 && "Complete 3 quests today to start your streak! 🚀"}
          {currentStreak > 0 && currentStreak < 5 && "Keep going! You're building momentum! 💪"}
          {currentStreak >= 5 && currentStreak < 10 && "Amazing! You're on fire! 🔥"}
          {currentStreak >= 10 && "Legendary streak! You're unstoppable! 👑"}
        </p>
      </div>
    </div>
  );
};

export default StreakCounter;
