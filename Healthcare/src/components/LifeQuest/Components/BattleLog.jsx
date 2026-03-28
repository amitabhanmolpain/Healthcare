import { motion, AnimatePresence } from 'framer-motion';

const BattleLog = ({ log }) => {
  const displayLog = log.slice(-3).reverse(); // Show last 3 actions

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 mb-6">
      <h4 className="text-white font-bold mb-3 text-sm">Battle Log</h4>
      <div className="space-y-2 text-sm">
        <AnimatePresence>
          {displayLog.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`text-gray-300 ${
                action.type === 'player_attack' ? 'text-blue-300' : 'text-red-300'
              }`}
            >
              • {action.attackName}: {action.damage} DMG
              {action.badGuyHealth <= 0 ? (
                <span className="text-green-400 font-bold"> - DEFEATED!</span>
              ) : (
                <span className="text-gray-400"> → {action.badGuyHealth} HP left</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BattleLog;
