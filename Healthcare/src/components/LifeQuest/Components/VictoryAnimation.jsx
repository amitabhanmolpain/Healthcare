import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const VictoryAnimation = ({ message, onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="text-center py-8"
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="text-9xl mb-4 inline-block"
      >
        🎉
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-white mb-4"
      >
        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          {message}
        </span>
      </motion.h2>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-2 text-white text-xl mb-6"
      >
        <Trophy className="w-8 h-8 text-yellow-400" />
        <span>Challenge Conquered!</span>
        <Trophy className="w-8 h-8 text-yellow-400" />
      </motion.div>
    </motion.div>
  );
};

export default VictoryAnimation;
