import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';

const BreathingExercise = ({ onComplete, onClose }) => {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1;
        
        // Move to next phase
        if (phase === 'inhale') {
          setPhase('hold');
          return 4;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 4;
        } else {
          // Complete cycle
          const newCycle = cycle + 1;
          setCycle(newCycle);
          
          if (newCycle >= 3) {
            // Completed 3 cycles
            setIsActive(false);
            setTimeout(() => onComplete(), 500);
            return 0;
          }
          
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, count, cycle, onComplete]);

  const phaseColors = {
    inhale: 'from-blue-500 to-cyan-500',
    hold: 'from-yellow-500 to-orange-500',
    exhale: 'from-purple-500 to-pink-500',
  };

  const phaseText = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/20"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-white font-bold text-3xl text-center mb-6">
          🧘 Breathing Exercise
        </h2>

        <p className="text-gray-300 text-center mb-8">
          Complete 3 breathing cycles to finish this power-up
        </p>

        {/* Breathing Circle */}
        <div className="flex items-center justify-center mb-8">
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
            }}
            transition={{ duration: 1 }}
            className={`w-48 h-48 rounded-full bg-gradient-to-br ${phaseColors[phase]} flex items-center justify-center shadow-2xl`}
          >
            <div className="text-center">
              <p className="text-white text-2xl font-bold mb-2">{phaseText[phase]}</p>
              <p className="text-white text-6xl font-bold">{count}</p>
            </div>
          </motion.div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < cycle ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm">
            Cycle {cycle + 1} of 3
          </p>
        </div>

        {/* Control Button */}
        <button
          onClick={() => setIsActive(!isActive)}
          className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
            isActive
              ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50 hover:bg-red-500/30'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
          }`}
        >
          {isActive ? (
            <>
              <Pause size={24} />
              Pause
            </>
          ) : (
            <>
              <Play size={24} />
              {cycle > 0 ? 'Resume' : 'Start'}
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BreathingExercise;
