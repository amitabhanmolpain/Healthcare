import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const BadgeGrid = ({ badges }) => {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-indigo-600',
    epic: 'from-purple-500 to-pink-600',
    legendary: 'from-yellow-500 to-orange-600'
  };

  const rarityGlow = {
    common: 'shadow-gray-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-yellow-500/50'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`relative rounded-2xl p-6 ${
            badge.unlocked 
              ? `bg-gradient-to-br ${rarityColors[badge.rarity]} ${rarityGlow[badge.rarity]} shadow-2xl` 
              : 'bg-gray-800 opacity-50'
          } text-center`}
        >
          {!badge.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl backdrop-blur-sm">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          <motion.div
            animate={badge.unlocked ? { 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ repeat: badge.unlocked ? Infinity : 0, duration: 3 }}
            className="text-6xl mb-3"
          >
            {badge.icon}
          </motion.div>
          
          <h4 className="text-white font-bold mb-1">{badge.name}</h4>
          <p className="text-gray-300 text-xs mb-2">{badge.description}</p>
          
          {badge.unlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${rarityColors[badge.rarity]} uppercase`}
            >
              {badge.rarity}
            </motion.div>
          )}
          
          {!badge.unlocked && (
            <div className="text-gray-500 text-xs font-semibold">
              Locked
            </div>
          )}
          
          {badge.unlocked && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              style={{ width: '50%' }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default BadgeGrid;
