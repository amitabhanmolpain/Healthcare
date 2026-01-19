import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import soundManager from '../soundManager';

const ChoiceButtons = ({ choices, onChoice, disabled }) => {
  const handleChoice = (choice) => {
    if (disabled) return;
    soundManager.playClick();
    onChoice(choice);
  };

  return (
    <div className="space-y-4">
      {choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleChoice(choice)}
          onMouseEnter={() => !disabled && soundManager.playHover()}
          disabled={disabled}
          whileHover={!disabled ? { scale: 1.02, x: 10 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          className={`w-full p-5 rounded-2xl bg-gradient-to-r from-purple-700/40 to-indigo-700/40 backdrop-blur-sm border-2 border-purple-500/30 text-left text-white transition-all hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center font-bold text-purple-300 border border-purple-400/50">
              {String.fromCharCode(65 + index)}
            </div>
            <p className="flex-1 text-lg leading-relaxed">{choice.text}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

ChoiceButtons.propTypes = {
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      correct: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onChoice: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ChoiceButtons;
