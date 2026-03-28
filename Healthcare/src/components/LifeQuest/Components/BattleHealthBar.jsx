import { motion } from 'framer-motion';

const BattleHealthBar = ({ current, max, name }) => {
  const percentage = (current / max) * 100;
  const getColor = () => {
    if (percentage > 50) return 'from-green-500 to-emerald-500';
    if (percentage > 25) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-bold text-lg">{name}</h3>
        <span className="text-red-400 font-bold">{current} / {max} HP</span>
      </div>
      <div className="relative h-10 bg-gray-700/50 rounded-full overflow-hidden border-2 border-gray-600 shadow-inner">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full relative`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-25"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold drop-shadow-lg text-sm">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BattleHealthBar;
