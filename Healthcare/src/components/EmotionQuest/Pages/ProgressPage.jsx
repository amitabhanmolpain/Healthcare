import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Brain, Target, TrendingUp, CheckCircle, Lock } from 'lucide-react';
import useEmotionQuestStore from '../../../store/emotionQuestStore';
import { XPBar } from '../Components';
import soundManager from '../soundManager';

const ProgressPage = () => {
  const {
    level,
    totalXP,
    completedChapters,
    badges,
    totalChoices,
    correctChoices,
    playStreak,
    longestStreak,
    skillsLearned,
  } = useEmotionQuestStore();

  useEffect(() => {
    soundManager.playBackgroundMusic('victory');
    return () => soundManager.stopBackgroundMusic();
  }, []);

  const accuracyRate = totalChoices > 0 ? Math.round((correctChoices / totalChoices) * 100) : 0;
  
  const stats = [
    { icon: Trophy, label: 'Total XP Earned', value: totalXP, color: 'from-yellow-500 to-orange-500' },
    { icon: Brain, label: 'Chapters Completed', value: completedChapters.length, color: 'from-purple-500 to-pink-500' },
    { icon: Target, label: 'Total Choices', value: totalChoices, color: 'from-blue-500 to-cyan-500' },
    { icon: CheckCircle, label: 'Correct Choices', value: correctChoices, color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: `${accuracyRate}%`, color: 'from-indigo-500 to-purple-500' },
    { icon: Trophy, label: 'Current Streak', value: `${playStreak} days`, color: 'from-red-500 to-pink-500' },
    { icon: Award, label: 'Longest Streak', value: `${longestStreak} days`, color: 'from-teal-500 to-cyan-500' },
    { icon: Brain, label: 'Skills Learned', value: skillsLearned.length, color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Trophy size={48} className="text-yellow-400" />
            <h1 className="font-bold text-5xl text-white">Your Progress</h1>
          </div>
          
          <p className="text-xl text-purple-200">
            Track your emotional intelligence journey
          </p>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <XPBar showLevel={true} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-center border border-white/20 shadow-xl`}
              >
                <Icon size={32} className="text-white mx-auto mb-2" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award size={32} className="text-yellow-400" />
            <h2 className="text-white font-bold text-3xl">Achievement Badges</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, rotate: -10, scale: 0 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05, type: 'spring' }}
                className={`rounded-2xl p-6 text-center border-2 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-400/50'
                    : 'bg-gray-800/50 border-gray-700/50'
                }`}
              >
                <div className="relative">
                  <div className="text-5xl mb-3">{badge.icon}</div>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock size={32} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <h3 className={`font-bold mb-1 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <p className={`text-sm ${badge.unlocked ? 'text-white/80' : 'text-gray-600'}`}>
                  {badge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Learned */}
        {skillsLearned.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain size={32} className="text-purple-400" />
              <h2 className="text-white font-bold text-3xl">Skills Mastered</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillsLearned.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30"
                >
                  <CheckCircle size={24} className="text-green-400" />
                  <span className="text-white font-semibold">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 text-center"
        >
          <p className="text-white text-lg">
            {completedChapters.length === 0 && "🌱 Start your journey today! Every expert was once a beginner."}
            {completedChapters.length > 0 && completedChapters.length < 3 && "🚀 Great start! Keep building your emotional intelligence."}
            {completedChapters.length >= 3 && completedChapters.length < 6 && "💪 You're making excellent progress! Keep going!"}
            {completedChapters.length === 6 && "🎉 Amazing! You've completed all chapters! You're an emotional intelligence master!"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressPage;
