import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';

const BadGuyCard = ({ badguy }) => {
  const healthPercentage = (badguy.health / 100) * 100;
  
  const colorClasses = {
    blue: { bg: 'from-blue-600 to-indigo-600', bar: 'from-blue-500 to-blue-700' },
    red: { bg: 'from-red-600 to-rose-600', bar: 'from-red-500 to-red-700' },
    purple: { bg: 'from-purple-600 to-violet-600', bar: 'from-purple-500 to-purple-700' },
    gray: { bg: 'from-gray-600 to-slate-600', bar: 'from-gray-500 to-gray-700' },
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: 180 }}
      animate={{ 
        scale: badguy.defeated ? 0 : 1, 
        rotate: 0,
        opacity: badguy.defeated ? 0 : 1
      }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${colorClasses[badguy.color].bg} shadow-xl ${
        badguy.defeated ? 'grayscale' : ''
      }`}
    >
      {badguy.defeated && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10"
        >
          <div className="text-center">
            <Skull className="w-16 h-16 text-white mx-auto mb-2" />
            <p className="text-white font-bold text-2xl">DEFEATED!</p>
          </div>
        </motion.div>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{ 
            rotate: badguy.defeated ? 0 : [0, -10, 10, 0],
            scale: badguy.defeated ? 0.8 : [1, 1.1, 1]
          }}
          transition={{ repeat: badguy.defeated ? 0 : Infinity, duration: 2 }}
          className="text-6xl"
        >
          {badguy.icon}
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-1">{badguy.name}</h3>
          <p className="text-gray-200 text-sm">{badguy.description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white font-semibold">Health</span>
          <span className="text-white font-bold">{badguy.health} / 100</span>
        </div>
        
        <div className="relative h-6 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${healthPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full bg-gradient-to-r ${colorClasses[badguy.color].bar} relative`}
          >
            {healthPercentage > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
            )}
          </motion.div>
        </div>
        
        {!badguy.defeated && healthPercentage > 0 && (
          <p className="text-xs text-white/80 text-center">
            {healthPercentage > 70 && "Strong and menacing..."}
            {healthPercentage > 40 && healthPercentage <= 70 && "Weakening under your attacks!"}
            {healthPercentage > 20 && healthPercentage <= 40 && "Almost defeated!"}
            {healthPercentage <= 20 && "One more quest to victory!"}
          </p>
        )}
      </div>
      
      {!badguy.defeated && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
        />
      )}
    </motion.div>
  );
};

export default BadGuyCard;
