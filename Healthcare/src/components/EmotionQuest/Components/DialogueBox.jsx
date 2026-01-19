import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import soundManager from '../soundManager';

const DialogueBox = ({ text, character, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (isSkipped) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    let currentIndex = 0;
    setDisplayedText('');
    setIsComplete(false);

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        // Play typing sound every 3rd character for subtle effect
        if (currentIndex % 3 === 0) {
          soundManager.playTyping();
        }
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(typingInterval);
      }
    }, 30); // Typing speed

    return () => clearInterval(typingInterval);
  }, [text, isSkipped]);

  const handleSkip = () => {
    soundManager.playClick();
    setIsSkipped(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      {/* Speech Bubble */}
      <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30 shadow-2xl relative">
        {/* Bubble Pointer */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rotate-45 border-l border-t border-purple-500/30"></div>
        
        {/* Text */}
        <p className="text-white text-xl leading-relaxed font-medium min-h-[80px]">
          {displayedText}
          {!isComplete && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-5 bg-white ml-1"
            />
          )}
        </p>

        {/* Skip Button */}
        {!isComplete && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleSkip}
            className="absolute bottom-4 right-4 text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            <span>Skip</span>
            <span className="text-xs">→→</span>
          </motion.button>
        )}

        {/* Continue Indicator */}
        <AnimatePresence>
          {isComplete && onComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-8 right-4 flex items-center gap-2 text-purple-400"
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-sm"
              >
                Continue ↓
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

DialogueBox.propTypes = {
  text: PropTypes.string.isRequired,
  character: PropTypes.string,
  onComplete: PropTypes.func,
};

export default DialogueBox;
