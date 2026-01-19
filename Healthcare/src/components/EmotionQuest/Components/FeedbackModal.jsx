import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, Lightbulb, Award, Zap } from 'lucide-react';
import soundManager from '../soundManager';

const FeedbackModal = ({ choice, onContinue, show }) => {
  if (!show || !choice) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onContinue}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className={`max-w-lg w-full rounded-3xl p-8 border-2 shadow-2xl ${
            choice.correct
              ? 'bg-gradient-to-br from-green-900/95 to-emerald-900/95 border-green-500/50'
              : 'bg-gradient-to-br from-orange-900/95 to-red-900/95 border-orange-500/50'
          }`}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center mb-6"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              choice.correct ? 'bg-green-500/30' : 'bg-orange-500/30'
            }`}>
              {choice.correct ? (
                <CheckCircle size={48} className="text-green-400" />
              ) : (
                <XCircle size={48} className="text-orange-400" />
              )}
            </div>
          </motion.div>

          {/* Result */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white font-bold text-3xl text-center mb-4"
          >
            {choice.correct ? '✨ Great Choice!' : '🤔 Let\'s Learn'}
          </motion.h2>

          {/* Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-6 mb-6 ${
              choice.correct ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              <Lightbulb size={24} className={choice.correct ? 'text-green-400' : 'text-orange-400'} />
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {choice.correct ? 'Why this works:' : 'Why this doesn\'t work:'}
                </h3>
                <p className="text-gray-200 leading-relaxed">{choice.feedback}</p>
              </div>
            </div>

            {/* Skill Learned */}
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <Award size={20} className="text-yellow-400" />
              <div>
                <p className="text-gray-300 text-sm">Skill Learned:</p>
                <p className="text-white font-semibold">{choice.skill}</p>
              </div>
            </div>
          </motion.div>

          {/* XP Gained */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex items-center justify-center gap-3 bg-purple-500/30 rounded-xl p-4 mb-6"
          >
            <Zap size={24} className="text-yellow-400" />
            <span className="text-white font-bold text-xl">+{choice.xp} XP</span>
          </motion.div>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => {
              soundManager.playClick();
              onContinue();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white font-bold text-lg hover:shadow-lg transition"
          >
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

FeedbackModal.propTypes = {
  choice: PropTypes.shape({
    correct: PropTypes.bool.isRequired,
    feedback: PropTypes.string.isRequired,
    skill: PropTypes.string.isRequired,
    xp: PropTypes.number.isRequired,
  }),
  onContinue: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default FeedbackModal;
