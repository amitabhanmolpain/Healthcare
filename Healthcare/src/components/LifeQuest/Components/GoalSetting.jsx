import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, CheckCircle, Target } from 'lucide-react';

const GoalSetting = ({ onComplete, onClose }) => {
  const [goals, setGoals] = useState(['', '', '']);
  const [submitted, setSubmitted] = useState(false);

  const handleGoalChange = (index, value) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleSubmit = () => {
    // Check if all goals are filled
    if (goals.every(goal => goal.trim().length > 0)) {
      setSubmitted(true);
      // Save goals to localStorage
      const savedGoals = JSON.parse(localStorage.getItem('lifequest-goals') || '[]');
      const newGoalEntry = {
        date: new Date().toISOString(),
        goals: goals,
      };
      localStorage.setItem('lifequest-goals', JSON.stringify([...savedGoals, newGoalEntry]));
      
      setTimeout(() => onComplete(), 1000);
    }
  };

  const allGoalsFilled = goals.every(goal => goal.trim().length > 0);

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
        className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full border border-white/20"
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
              <Target size={32} className="text-purple-400" />
              <h2 className="text-white font-bold text-3xl">Set Your Goals</h2>
            </div>

            <p className="text-gray-300 mb-8">
              Write down three goals you want to achieve. Being specific helps you stay motivated!
            </p>

            <div className="space-y-4 mb-8">
              {goals.map((goal, index) => (
                <div key={index}>
                  <label className="text-white font-semibold mb-2 block">
                    Goal {index + 1}
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    placeholder="e.g., Exercise 3 times this week"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border-2 border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition"
                    maxLength={100}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!allGoalsFilled}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                allGoalsFilled
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Goals
            </button>

            {!allGoalsFilled && (
              <p className="text-center text-gray-400 text-sm mt-4">
                Fill in all three goals to continue
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
            <h3 className="text-white font-bold text-2xl mb-4">Goals Set! 🎯</h3>
            <p className="text-gray-300">
              Great work! Your goals have been saved. Now go make them happen!
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GoalSetting;
