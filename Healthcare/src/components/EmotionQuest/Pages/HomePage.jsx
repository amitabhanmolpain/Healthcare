import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Award, Brain, Trophy, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import useEmotionQuestStore from '../../../store/emotionQuestStore';
import { XPBar } from '../Components';
import storiesData from '../data/stories.json';
import soundManager from '../soundManager';

const HomePage = ({ onNavigate }) => {
  const { level, completedChapters, badges, totalChoices, correctChoices } = useEmotionQuestStore();
  
  const totalChapters = storiesData.chapters.length;
  const completionRate = totalChoices > 0 ? Math.round((correctChoices / totalChoices) * 100) : 0;
  const unlockedBadges = badges.filter(b => b.unlocked).length;

  useEffect(() => {
    soundManager.playBackgroundMusic('menu');
    return () => soundManager.stopBackgroundMusic();
  }, []);

  const stats = [
    { icon: Trophy, label: 'Level', value: level, color: 'from-yellow-500 to-orange-500' },
    { icon: Brain, label: 'Chapters Done', value: `${completedChapters.length}/${totalChapters}`, color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'Badges', value: `${unlockedBadges}/${badges.length}`, color: 'from-blue-500 to-cyan-500' },
    { icon: Trophy, label: 'Accuracy', value: `${completionRate}%`, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mx-auto"
          >
            🎭
          </motion.div>
          
          <h1 className="font-bold text-6xl text-white">
            Emotion Quest
          </h1>
          
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Master emotional intelligence through interactive story adventures. 
            Make choices, learn skills, and grow stronger mentally.
          </p>
        </motion.div>

        {/* XP Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <XPBar showLevel={true} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-center border border-white/20 shadow-xl`}
              >
                <Icon size={32} className="text-white mx-auto mb-2" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => soundManager.playHover()}
            onClick={() => {
              soundManager.playClick();
              onNavigate('chapters');
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-left border-2 border-white/20 shadow-2xl hover:shadow-purple-500/50 transition"
          >
            <Play size={40} className="text-white mb-3" />
            <h3 className="text-white font-bold text-2xl mb-2">Start Playing</h3>
            <p className="text-purple-100">Choose a chapter and begin your journey</p>
            <ArrowRight size={24} className="text-white mt-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => soundManager.playHover()}
            onClick={() => {
              soundManager.playClick();
              onNavigate('progress');
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-left border-2 border-white/20 shadow-2xl hover:shadow-blue-500/50 transition"
          >
            <Trophy size={40} className="text-white mb-3" />
            <h3 className="text-white font-bold text-2xl mb-2">Your Progress</h3>
            <p className="text-blue-100">View achievements and skills learned</p>
            <ArrowRight size={24} className="text-white mt-4" />
          </motion.button>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2">How It Works</h3>
              <ul className="text-green-100 space-y-2">
                <li>• Each chapter teaches a key emotional intelligence skill</li>
                <li>• Make choices in realistic scenarios</li>
                <li>• Learn from feedback on every decision</li>
                <li>• Earn XP, level up, and unlock badges</li>
                <li>• Build real-world mental health skills through play</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
