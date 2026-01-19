import { motion } from 'framer-motion';
import { UserPlus, MessageCircle, Trash2 } from 'lucide-react';

const AllyCard = ({ ally, onRemove, onMessage }) => {
  const relationIcons = {
    friend: '👥',
    family: '👨‍👩‍👧‍👦',
    therapist: '🩺',
    mentor: '🎓',
    partner: '💑',
    other: '🤝'
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl"
          >
            {relationIcons[ally.relation] || '🤝'}
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{ally.name}</h3>
            <p className="text-teal-100 text-sm capitalize mb-2">{ally.relation}</p>
            {ally.contact && (
              <p className="text-teal-200 text-xs">{ally.contact}</p>
            )}
            {ally.supportType && (
              <div className="mt-2 flex flex-wrap gap-1">
                {ally.supportType.map((type, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          {onMessage && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMessage(ally)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </motion.button>
          )}
          
          {onRemove && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(ally.id)}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AllyCard;
