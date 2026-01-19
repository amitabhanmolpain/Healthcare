import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { useState } from 'react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import PowerUpCard from '../PowerUpCard';
import ConfettiAnimation from '../ConfettiAnimation';
import BreathingExercise from '../Components/BreathingExercise';
import MusicModal from '../Components/MusicModal';
import GoalSetting from '../Components/GoalSetting';

const PowerUpsPage = () => {
  const { powerups, usePowerUp, progress } = useLifeQuestStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'breathing', 'music', 'goals', null

  const handleUsePowerUp = (powerUpId) => {
    const powerup = powerups.find(p => p.id === powerUpId);
    
    // Check if this power-up requires an interactive exercise
    if (powerup.name === 'Deep Breathing' || powerup.name === 'Breathing Exercise') {
      setActiveModal('breathing');
    } else if (powerup.name === 'Mindful Music' || powerup.name.toLowerCase().includes('music')) {
      setActiveModal('music');
    } else {
      // Regular power-up - instant XP
      usePowerUp(powerUpId);
      setShowConfetti(true);
    }
  };

  const handleExerciseComplete = (powerUpId) => {
    usePowerUp(powerUpId);
    setShowConfetti(true);
    setActiveModal(null);
  };

  const totalPowerUpsUsed = powerups.reduce((sum, p) => sum + p.uses, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 p-6">
      <ConfettiAnimation show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3"
          >
            <Zap className="w-12 h-12 text-yellow-400" />
            Power-Ups
          </motion.h1>
          <p className="text-gray-300 text-lg">Quick mood boosters for instant XP and energy!</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 text-center shadow-xl"
          >
            <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-4xl font-bold text-white">{totalPowerUpsUsed}</p>
            <p className="text-yellow-100 text-sm">Times Used</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-6 text-center shadow-xl"
          >
            <Zap className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-4xl font-bold text-white">{powerups.length}</p>
            <p className="text-pink-100 text-sm">Available</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-center shadow-xl"
          >
            <p className="text-4xl font-bold text-white">{progress.total_powerups_used}</p>
            <p className="text-purple-100 text-sm">Total Used</p>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-8 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">How Power-Ups Work</h3>
              <p className="text-blue-100">
                Power-ups are quick, 30-second to 2-minute actions you can do ANYTIME to boost your mood 
                and earn instant XP. Use them when you need a quick mental health boost or energy surge!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Power-Ups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {powerups.map((powerup, index) => (
            <motion.div
              key={powerup.id}
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PowerUpCard powerup={powerup} onUse={handleUsePowerUp} />
            </motion.div>
          ))}
        </div>

        {/* Interactive Modals */}
        {activeModal === 'breathing' && (
          <BreathingExercise
            onComplete={() => {
              const breathingPowerUp = powerups.find(p => p.name === 'Deep Breathing' || p.name === 'Breathing Exercise');
              if (breathingPowerUp) handleExerciseComplete(breathingPowerUp.id);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'music' && (
          <MusicModal
            onComplete={() => {
              const musicPowerUp = powerups.find(p => p.name === 'Mindful Music' || p.name.toLowerCase().includes('music'));
              if (musicPowerUp) handleExerciseComplete(musicPowerUp.id);
            }}
            onClose={() => setActiveModal(null)}
            requiredTime={300}
          />
        )}

        {activeModal === 'goals' && (
          <GoalSetting
            onComplete={() => {
              handleExerciseComplete();
              setActiveModal(null);
            }}
            onClose={() => setActiveModal(null)}
          />
        )}

        {/* Encouragement Banner */}
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-bold">
            ⚡ Use power-ups whenever you need an instant boost! ⚡
          </p>
        </motion.div>

        {/* Usage Stats */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Your Most Used Power-Ups</h3>
          <div className="space-y-3">
            {[...powerups]
              .sort((a, b) => b.uses - a.uses)
              .slice(0, 5)
              .map((powerup) => (
                <div key={powerup.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{powerup.icon}</span>
                    <span className="text-white font-semibold">{powerup.name}</span>
                  </div>
                  <span className="text-yellow-400 font-bold">{powerup.uses} uses</span>
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PowerUpsPage;
