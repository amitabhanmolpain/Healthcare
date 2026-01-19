import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, CheckCircle, PenTool } from 'lucide-react';

const ThoughtsWriting = ({ onComplete, onClose, questTitle }) => {
  const [thoughts, setThoughts] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Check if user has written something meaningful
    if (thoughts.trim().length >= 10) {
      setSubmitted(true);
      // Save thoughts to localStorage
      const savedThoughts = JSON.parse(localStorage.getItem('lifequest-thoughts') || '[]');
      const newThought = {
        date: new Date().toISOString(),
        content: thoughts,
        questTitle: questTitle || 'Thoughts'
      };
      localStorage.setItem('lifequest-thoughts', JSON.stringify([...savedThoughts, newThought]));
      
      setTimeout(() => onComplete(), 1000);
    }
  };

  const isValid = thoughts.trim().length >= 10;
  const charCount = thoughts.trim().length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full border border-white/20"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <PenTool size={32} className="text-blue-400" />
              <h2 className="text-white font-bold text-3xl">Write Your Thoughts</h2>
            </div>

            <p className="text-gray-300 mb-8">
              Take a moment to write down what's on your mind. Expressing your thoughts helps process emotions and gain clarity.
            </p>

            <div className="mb-6">
              <label className="text-white font-semibold mb-2 block">
                Your Thoughts
              </label>
              <textarea
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder="Write about how you're feeling, what's bothering you, or what you're grateful for..."
                className="w-full h-48 px-4 py-3 rounded-xl bg-white/10 border-2 border-blue-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${isValid ? 'text-green-400' : 'text-gray-400'}`}>
                  {charCount >= 10 ? '✓ Ready to submit' : `Write at least ${10 - charCount} more characters`}
                </span>
                <span className="text-gray-400 text-sm">
                  {charCount}/1000
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                isValid
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Thoughts
            </button>

            {!isValid && (
              <p className="text-center text-gray-400 text-sm mt-4">
                Write at least 10 characters to continue
              </p>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-24 h-24 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={48} className="text-green-400" />
            </motion.div>
            <h3 className="text-white font-bold text-2xl mb-4">Well Done! 📝</h3>
            <p className="text-gray-300">
              You've expressed your thoughts. That's an important step in mental wellness!
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ThoughtsWriting;
