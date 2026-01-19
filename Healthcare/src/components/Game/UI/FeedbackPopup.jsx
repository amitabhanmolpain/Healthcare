import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, Sparkles } from 'lucide-react';

const FeedbackPopup = ({ result, onNext }) => {
  if (!result) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`max-w-2xl w-full rounded-3xl p-8 border-4 ${
            result.isCorrect
              ? 'bg-gradient-to-br from-green-600 to-emerald-700 border-green-400'
              : 'bg-gradient-to-br from-red-600 to-rose-700 border-red-400'
          }`}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Icon and Title */}
          <motion.div
            className="text-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: result.isCorrect ? [0, 360] : [0, -10, 10, -10, 0]
              }}
              transition={{ duration: 0.6 }}
            >
              {result.isCorrect ? (
                <CheckCircle size={80} className="text-white" strokeWidth={3} />
              ) : (
                <XCircle size={80} className="text-white" strokeWidth={3} />
              )}
            </motion.div>
            
            <motion.h2
              className="text-5xl font-bold text-white mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {result.isCorrect ? 'VICTORY! 🎉' : 'Not Quite... 💪'}
            </motion.h2>
            
            <motion.p
              className="text-xl text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {result.isCorrect
                ? 'You defeated the Negative Thought Monster!'
                : 'The monster is still standing, but you\'re learning!'}
            </motion.p>
          </motion.div>

          {/* XP Gained */}
          {result.isCorrect && (
            <motion.div
              className="bg-white/20 rounded-2xl p-6 mb-6 text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles size={28} className="text-yellow-300" />
                <span className="text-3xl font-bold text-white">+20 XP</span>
                <Sparkles size={28} className="text-yellow-300" />
              </div>
              {result.streak && result.streak > 1 && (
                <motion.p
                  className="text-yellow-300 font-semibold text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.7 }}
                >
                  🔥 {result.streak} Win Streak!
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Feedback Section */}
          <motion.div
            className="bg-white/10 rounded-2xl p-6 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb size={24} className="text-yellow-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {result.isCorrect ? 'Why This Works:' : 'The Better Response:'}
                </h3>
                {!result.isCorrect && (
                  <p className="text-white/90 text-lg mb-3 italic border-l-4 border-white/50 pl-4">
                    "{result.correctAnswer}"
                  </p>
                )}
                <p className="text-white/90 leading-relaxed text-lg">
                  {result.feedback}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next Button */}
          <motion.button
            onClick={onNext}
            className="w-full py-5 bg-white text-gray-900 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {result.isCorrect ? 'Next Battle →' : 'Try Again 💪'}
          </motion.button>

          {/* Confetti Effect for Correct Answer */}
          {result.isCorrect && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: '50%'
                  }}
                  initial={{ y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    y: [0, -200, -400],
                    x: [(Math.random() - 0.5) * 200],
                    opacity: [1, 1, 0],
                    scale: [0, 1, 0],
                    rotate: Math.random() * 720
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.03,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackPopup;
