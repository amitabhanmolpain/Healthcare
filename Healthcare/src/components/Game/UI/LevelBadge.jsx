import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

const LevelBadge = ({ level }) => {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(251, 191, 36, 0.5)',
            '0 0 40px rgba(251, 191, 36, 0.8)',
            '0 0 20px rgba(251, 191, 36, 0.5)'
          ]
        }}
        transition={{
          boxShadow: { repeat: Infinity, duration: 2 }
        }}
      >
        <div className="text-center">
          <Trophy size={24} className="text-white mx-auto mb-1" />
          <span className="text-white font-bold text-lg">{level}</span>
        </div>
      </motion.div>
      
      {/* Floating Stars */}
      <motion.div
        className="absolute -top-2 -right-2"
        animate={{
          y: [-3, -8, -3],
          rotate: [0, 360],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          repeat: Infinity,
          duration: 2
        }}
      >
        <Star size={16} className="text-yellow-300 fill-yellow-300" />
      </motion.div>
      
      <motion.div
        className="absolute -bottom-1 -left-2"
        animate={{
          y: [-2, -6, -2],
          rotate: [0, -360],
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          delay: 0.5
        }}
      >
        <Star size={12} className="text-yellow-300 fill-yellow-300" />
      </motion.div>
    </motion.div>
  );
};

export default LevelBadge;
