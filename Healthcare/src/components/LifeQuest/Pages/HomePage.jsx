import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Users } from 'lucide-react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import XPBar from '../XPBar';
import StreakCounter from '../StreakCounter';
import QuestCard from '../QuestCard';
import ConfettiAnimation from '../ConfettiAnimation';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const { progress, quests, badges, allies, completeQuest } = useLifeQuestStore();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const todayQuests = quests.filter(q => q.status === 'available').slice(0, 3);
  const completedToday = quests.filter(q => q.status === 'completed').length;
  const unlockedBadges = badges.filter(b => b.unlocked);

  const handleCompleteQuest = (questId) => {
    completeQuest(questId);
    setShowConfetti(true);
  };

  const stats = [
    { label: 'Quests Completed', value: progress.total_quests_completed, icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
    { label: 'Current Level', value: progress.level, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Badges Earned', value: unlockedBadges.length, icon: Award, color: 'from-yellow-500 to-orange-500' },
    { label: 'Allies', value: allies.length, icon: Users, color: 'from-green-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <ConfettiAnimation show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              LifeQuest
            </span>
          </motion.h1>
          <p className="text-xl text-gray-300">Your Resilience Journey Starts Here</p>
        </div>

        {/* XP Bar */}
        <div className="mb-8">
          <XPBar xp={progress.xp} level={progress.level} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-xl`}
            >
              <stat.icon className="w-8 h-8 text-white mb-2" />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/80 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Streak Counter */}
        <div className="mb-8">
          <StreakCounter 
            currentStreak={progress.current_streak} 
            longestStreak={progress.longest_streak} 
          />
        </div>

        {/* Today's Featured Quests */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            Today's Featured Quests
          </h2>
          
          {todayQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayQuests.map((quest) => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest} 
                  onComplete={handleCompleteQuest}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-center shadow-xl"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">All Quests Completed!</h3>
              <p className="text-green-100">Amazing work today, hero! Come back tomorrow for new challenges.</p>
            </motion.div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Today's Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Completed Today</p>
              <p className="text-3xl font-bold text-green-400">{completedToday} / {quests.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total XP</p>
              <p className="text-3xl font-bold text-yellow-400">{progress.xp}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Streak</p>
              <p className="text-3xl font-bold text-orange-400">{progress.current_streak} 🔥</p>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold">
            {progress.level < 5 && "Every quest completed is a step toward a stronger you! 💪"}
            {progress.level >= 5 && progress.level < 10 && "You're becoming unstoppable! Keep pushing! 🚀"}
            {progress.level >= 10 && "You're a true legend! Your resilience inspires! 👑"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
