import { motion } from 'framer-motion';

const XPBar = ({ xp, level }) => {
  const xpInCurrentLevel = xp % 100;
  const xpNeededForNextLevel = 100;
  const percentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
          >
            <span className="text-xl font-bold text-white">{level}</span>
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Level {level}</h3>
            <p className="text-sm text-gray-300">{xpInCurrentLevel} / {xpNeededForNextLevel} XP</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-400">{xp} XP</p>
          <p className="text-xs text-gray-400">Total Experience</p>
        </div>
      </div>
      
      <div className="relative h-8 bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-2">
        {100 - xpInCurrentLevel} XP to Level {level + 1}
      </p>
    </div>
  );
};

export default XPBar;
