import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const XPBar = ({ xp, level }) => {
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const currentLevelXP = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const percentage = (currentLevelXP / xpNeeded) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-purple-300">
          XP: {currentLevelXP} / {xpNeeded}
        </span>
        <span className="text-xs text-gray-400">
          {xpNeeded - currentLevelXP} to next level
        </span>
      </div>
      <div className="w-full h-6 bg-gray-800/50 rounded-full overflow-hidden border-2 border-purple-500/30">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-white/30"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default XPBar;
