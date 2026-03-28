import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const ComboCounter = ({ combo }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="mb-6 text-center"
    >
      <div className="inline-block">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-full shadow-lg"
        >
          <Flame className="w-6 h-6 text-white" />
          <span className="text-2xl font-bold text-white">{combo}x Combo!</span>
          <Flame className="w-6 h-6 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ComboCounter;
