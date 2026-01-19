import { motion } from 'framer-motion';
import { Shield, Sword } from 'lucide-react';

const ChoiceButton = ({ option, index, onClick, disabled }) => {
  const letters = ['A', 'B', 'C', 'D'];
  
  const handleClick = () => {
    if (!disabled) {
      import('../../EmotionQuest/soundManager').then(module => {
        module.default.playClick();
      });
      onClick(option);
    }
  };

  const handleHover = () => {
    if (!disabled) {
      import('../../EmotionQuest/soundManager').then(module => {
        module.default.playHover();
      });
    }
  };
  
  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={handleHover}
      disabled={disabled}
      className="w-full text-left p-5 rounded-2xl bg-gradient-to-br from-purple-600/40 to-blue-600/40 border-2 border-purple-500/50 hover:border-green-400 hover:from-purple-500/50 hover:to-blue-500/50 text-white transition-all group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: disabled ? 1 : 1.02, y: -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      <div className="flex items-start gap-4 relative z-10">
        {/* Letter Badge */}
        <motion.div
          className="w-12 h-12 rounded-full bg-purple-700/70 flex items-center justify-center flex-shrink-0 border-2 border-purple-400/50 group-hover:bg-green-500/70 group-hover:border-green-300 transition-all"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-bold text-xl">{letters[index]}</span>
        </motion.div>
        
        {/* Option Text */}
        <div className="flex-1">
          <p className="text-lg leading-relaxed font-medium">
            {option.text}
          </p>
        </div>
        
        {/* Weapon Icon */}
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ scale: 0, rotate: -45 }}
          whileHover={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Sword size={24} className="text-green-400" />
        </motion.div>
      </div>
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '100%', opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </motion.button>
  );
};

export default ChoiceButton;
