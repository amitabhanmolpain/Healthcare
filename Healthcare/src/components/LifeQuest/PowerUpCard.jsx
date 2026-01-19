import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const PowerUpCard = ({ powerup, onUse }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onUse(powerup.id)}
      className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 shadow-xl cursor-pointer group"
    >
      <motion.div
        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      
      <div className="relative z-10 text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-3"
        >
          {powerup.icon}
        </motion.div>
        
        <h3 className="text-lg font-bold text-white mb-2">{powerup.name}</h3>
        <p className="text-white/90 text-sm mb-3">{powerup.description}</p>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-200" />
          <span className="text-yellow-200 font-bold text-sm">+{powerup.points} XP</span>
        </div>
        
        {powerup.uses > 0 && (
          <div className="text-xs text-white/80 font-semibold">
            Used {powerup.uses} time{powerup.uses !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-300"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default PowerUpCard;
