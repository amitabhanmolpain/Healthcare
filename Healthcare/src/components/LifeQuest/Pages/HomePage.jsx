import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, Users, Swords, Target } from 'lucide-react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import XPBar from '../XPBar';
import ConfettiAnimation from '../ConfettiAnimation';
import { useState } from 'react';

const HomePage = () => {
  const { progress, badguys, badges, allies, battleStats } = useLifeQuestStore();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const activeBadGuys = badguys.filter(bg => !bg.defeated);
  const defeatedBadGuys = badguys.filter(bg => bg.defeated);
  const unlockedBadges = badges.filter(b => b.unlocked);

  const stats = [
    { label: 'Battles Won', value: battleStats.battlesWon, icon: Sparkles, color: 'from-green-500 to-emerald-500' },
    { label: 'Current Level', value: progress.level, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { label: 'Badges Earned', value: unlockedBadges.length, icon: Award, color: 'from-yellow-500 to-orange-500' },
    { label: 'Active Enemies', value: activeBadGuys.length, icon: Swords, color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-6">
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
            <span className="bg-gradient-to-r from-red-400 via-orange-500 to-pink-600 bg-clip-text text-transparent">
              Battle Arena
            </span>
          </motion.h1>
          <p className="text-xl text-gray-300">Defeat Your Personal Demons  & Overcome Life's Challenges</p>
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

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-3xl p-8 text-center shadow-2xl border-2 border-orange-400"
        >
          <Target className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Fight?</h2>
          <p className="text-red-100 text-lg mb-6">
            You have {activeBadGuys.length} challenge{activeBadGuys.length !== 1 ? 's' : ''} waiting. 
            {defeatedBadGuys.length > 0 && ` You've already conquered ${defeatedBadGuys.length}!`}
          </p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block"
          >
            <div className="text-6xl">⚔️</div>
          </motion.div>
        </motion.div>

        {/* Top Enemies */}
        {activeBadGuys.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Swords className="w-6 h-6 text-red-400" />
              Your Active Enemies
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBadGuys.slice(0, 2).map((badguy, index) => (
                <motion.div
                  key={badguy.id}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-red-500/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{badguy.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">{badguy.name}</h4>
                      <p className="text-gray-300 text-sm mb-3">{badguy.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Health: {Math.ceil(badguy.health)} / {badguy.maxHealth}</span>
                        <span className="text-red-400 font-bold">{Math.round((badguy.health / badguy.maxHealth) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: '100%' }}
                          animate={{ width: `${(badguy.health / badguy.maxHealth) * 100}%` }}
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Battle Stats */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Battle Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Battles</p>
              <p className="text-3xl font-bold text-blue-400">{battleStats.totalBattles}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Victories</p>
              <p className="text-3xl font-bold text-green-400">{battleStats.battlesWon}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Damage</p>
              <p className="text-3xl font-bold text-orange-400">{battleStats.battlesDamageDealt}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Enemies Defeated</p>
              <p className="text-3xl font-bold text-purple-400">{defeatedBadGuys.length}</p>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-center"
        >
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 font-bold">
            {battleStats.battlesWon === 0 && "Start your first battle and show your demons who's boss! 💪"}
            {battleStats.battlesWon > 0 && battleStats.battlesWon < 5 && "You're building momentum! Keep fighting! 🔥"}
            {battleStats.battlesWon >= 5 && battleStats.battlesWon < 20 && "You're becoming a true warrior! 🗡️"}
            {battleStats.battlesWon >= 20 && "You are a LEGEND! Your resilience is unstoppable! 👑"}
          </p>
        </motion.div>

        {/* No Enemies Message */}
        {activeBadGuys.length === 0 && defeatedBadGuys.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-gradient-to-br from-green-900/50 to-gray-900 rounded-2xl p-8 text-center border-2 border-dashed border-green-700"
          >
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-2xl text-white font-bold mb-2">All Clear!</p>
            <p className="text-gray-300">No enemies yet. Go to "Enemies" tab to create your first challenge!</p>
          </motion.div>
        )}

        {/* Support Network */}
        {allies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-br from-blue-900/30 to-gray-900 rounded-2xl p-6 border border-blue-700"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              Your Support Network: {allies.length}
            </h3>
            <p className="text-gray-300">You have {allies.length} ally{allies.length !== 1 ? 'ies' : ''} supporting your journey!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;
