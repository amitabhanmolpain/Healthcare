import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import useEmotionQuestStore from '../../../store/emotionQuestStore';

const XPBar = ({ showLevel = true }) => {
  const { xp, level } = useEmotionQuestStore();
  
  const xpNeeded = level * 100;
  const percentage = (xp / xpNeeded) * 100;

  return (
    <div className="w-full">
      {showLevel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30"
            >
              {level}
            </motion.div>
            <span className="text-white font-semibold">Level {level}</span>
          </div>
          <span className="text-gray-400 text-sm">
            {xp} / {xpNeeded} XP
          </span>
        </div>
      )}
      
      <div className="w-full h-4 bg-purple-900/30 rounded-full overflow-hidden border border-purple-500/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 relative overflow-hidden"
        >
          <motion.div
            animate={{
              x: ['0%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>
      </div>
      
      {showLevel && (
        <p className="text-center text-gray-400 text-xs mt-1">
          {xpNeeded - xp} XP to level {level + 1}
        </p>
      )}
    </div>
  );
};

XPBar.propTypes = {
  showLevel: PropTypes.bool,
};

export default XPBar;
