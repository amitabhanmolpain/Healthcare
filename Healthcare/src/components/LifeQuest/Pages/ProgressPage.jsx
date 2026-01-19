import { motion } from 'framer-motion';
import { TrendingUp, Award, Flame, Star } from 'lucide-react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import XPBar from '../XPBar';
import StreakCounter from '../StreakCounter';
import BadgeGrid from '../BadgeGrid';

const ProgressPage = () => {
  const { progress, badges, quests } = useLifeQuestStore();

  const stats = [
    { label: 'Total XP', value: progress.xp, icon: Star, color: 'from-yellow-500 to-orange-500' },
    { label: 'Current Level', value: progress.level, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Total Quests', value: progress.total_quests_completed, icon: Award, color: 'from-blue-500 to-cyan-500' },
    { label: 'Longest Streak', value: progress.longest_streak, icon: Flame, color: 'from-red-500 to-orange-500' },
  ];

  const unlockedBadges = badges.filter(b => b.unlocked);
  const totalBadges = badges.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
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
            <TrendingUp className="w-12 h-12 text-purple-400" />
            Progress Tracker
          </motion.h1>
          <p className="text-gray-300 text-lg">Track your journey to resilience</p>
        </div>

        {/* XP Progress */}
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
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-xl text-center`}
            >
              <stat.icon className="w-10 h-10 text-white mx-auto mb-3" />
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
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

        {/* Badges Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-400" />
              Badges Collection
            </h2>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{unlockedBadges.length} / {totalBadges}</p>
              <p className="text-gray-400 text-sm">Badges Unlocked</p>
            </div>
          </div>
          
          <BadgeGrid badges={badges} />
        </div>

        {/* Level Progress Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Level Milestones</h3>
          
          <div className="space-y-4">
            {[1, 5, 10, 15, 20].map((level) => (
              <div key={level} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  progress.level >= level 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-700 text-gray-500'
                }`}>
                  {level}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold">Level {level}</span>
                    {progress.level >= level && (
                      <span className="text-green-400 text-sm font-bold">✓ Completed</span>
                    )}
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: progress.level >= level ? '100%' : '0%' }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                </div>
                
                <div className="text-gray-400 text-sm">
                  {level * 100} XP
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">Quest Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-blue-100">Total Completed</span>
                <span className="text-white font-bold">{progress.total_quests_completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Completed Today</span>
                <span className="text-white font-bold">{quests.filter(q => q.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Available Today</span>
                <span className="text-white font-bold">{quests.filter(q => q.status === 'available').length}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">Power-Up Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-100">Total Used</span>
                <span className="text-white font-bold">{progress.total_powerups_used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">XP from Power-Ups</span>
                <span className="text-white font-bold">{progress.total_powerups_used * 3}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Favorite Power-Up</span>
                <span className="text-white font-bold">⚡</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Motivational Message */}
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">
            {progress.level < 5 && "Every step forward is progress! Keep going! 🚀"}
            {progress.level >= 5 && progress.level < 10 && "You're building incredible momentum! 💪"}
            {progress.level >= 10 && progress.level < 15 && "Your dedication is truly inspiring! 🌟"}
            {progress.level >= 15 && "You're a resilience champion! 👑"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProgressPage;
