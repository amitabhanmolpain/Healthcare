import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Sword, Heart, Shield, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import BattleHealthBar from '../Components/BattleHealthBar';
import DamageNumber from '../Components/DamageNumber';
import ComboCounter from '../Components/ComboCounter';
import VictoryAnimation from '../Components/VictoryAnimation';
import BattleLog from '../Components/BattleLog';

const BattlePage = () => {
  const {
    badguys,
    currentBattle,
    battleStats,
    progress,
    startBattle,
    attackBadGuy,
    endBattle,
  } = useLifeQuestStore();

  const [selectedBadGuy, setSelectedBadGuy] = useState(null);
  const [showDamageNumbers, setShowDamageNumbers] = useState([]);
  const [victoryMessage, setVictoryMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [battleInProgress, setBattleInProgress] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(false);

  const activeBadGuys = badguys.filter(bg => !bg.defeated);
  const defeatedBadGuys = badguys.filter(bg => bg.defeated);
  const currentFoe = currentBattle.badGuyId 
    ? badguys.find(bg => bg.id === currentBattle.badGuyId)
    : null;

  const attackTypes = [
    { name: 'Quick Strike', damage: [15, 25], icon: '⚡', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Power Hit', damage: [25, 40], icon: '💥', color: 'from-red-400 to-red-600' },
    { name: 'Blazing Combo', damage: [35, 55], icon: '🔥', color: 'from-orange-400 to-orange-600' },
    { name: 'Mega Slash', damage: [50, 75], icon: '⚔️', color: 'from-purple-400 to-purple-600' },
  ];

  const handleStartBattle = (badGuy) => {
    startBattle(badGuy.id);
    setSelectedBadGuy(badGuy);
    setBattleInProgress(true);
    setVictoryMessage('');
    setShowDamageNumbers([]);
  };

  const handleAttack = (attackType) => {
    if (attackCooldown || !currentFoe) return;

    const damage = Math.floor(
      Math.random() * (attackType.damage[1] - attackType.damage[0]) + attackType.damage[0]
    );

    // Add combo bonus
    const comboBonus = Math.floor(battleStats.battleCombo * 0.1);
    const totalDamage = damage + comboBonus;

    attackBadGuy(totalDamage, attackType.name);

    // Show damage number
    setShowDamageNumbers(prev => [...prev, {
      id: Math.random(),
      damage: totalDamage,
      x: 0,
      y: 0,
    }]);

    setAttackCooldown(true);
    setTimeout(() => setAttackCooldown(false), 500);

    // Check if defeated
    const updatedFoe = badguys.find(bg => bg.id === currentFoe.id);
    if (updatedFoe && updatedFoe.health <= 0) {
      setBattleInProgress(false);
      setVictoryMessage(`Victory! ${attackType.name} defeated ${currentFoe.name}!`);
    }
  };

  const handleEndBattle = () => {
    endBattle();
    setBattleInProgress(false);
    setSelectedBadGuy(null);
    setShowDamageNumbers([]);
    setVictoryMessage('');
  };

  const handleSelectNewBadGuy = () => {
    setVictoryMessage('');
    setBattleInProgress(false);
    setShowDamageNumbers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-red-400 via-pink-500 to-orange-600 bg-clip-text text-transparent">
                Battle Arena
              </span>
            </h1>
            <p className="text-gray-300">Defeat your personal demons and overcome life's challenges</p>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-all"
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-red-600 to-rose-600 rounded-xl p-4 text-center shadow-xl">
            <p className="text-3xl font-bold text-white">{activeBadGuys.length}</p>
            <p className="text-red-100 text-sm">Active Enemies</p>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-center shadow-xl">
            <p className="text-3xl font-bold text-white">{defeatedBadGuys.length}</p>
            <p className="text-green-100 text-sm">Defeated</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 text-center shadow-xl">
            <p className="text-3xl font-bold text-white">{battleStats.battlesWon}</p>
            <p className="text-yellow-100 text-sm">Battles Won</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 text-center shadow-xl">
            <p className="text-3xl font-bold text-white">{progress.xp}</p>
            <p className="text-purple-100 text-sm">Total XP</p>
          </motion.div>
        </div>

        {/* Battle Arena */}
        {battleInProgress && currentFoe ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-red-500 shadow-2xl">
              {/* Enemy Display */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-9xl mb-4"
                >
                  {currentFoe.icon}
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-2">{currentFoe.name}</h2>
                <p className="text-gray-300 text-lg mb-4">{currentFoe.description}</p>
              </div>

              {/* Health Bar */}
              <BattleHealthBar
                current={currentFoe.health}
                max={currentFoe.maxHealth}
                name={currentFoe.name}
              />

              {/* Combo Counter */}
              {battleStats.battleCombo > 0 && (
                <ComboCounter combo={battleStats.battleCombo} />
              )}

              {/* Damage Numbers */}
              <div className="relative h-32 mb-8 pointer-events-none">
                <AnimatePresence>
                  {showDamageNumbers.map(dmg => (
                    <DamageNumber key={dmg.id} damage={dmg.damage} onComplete={() => {
                      setShowDamageNumbers(prev => prev.filter(d => d.id !== dmg.id));
                    }} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Battle Log */}
              <div className="mb-8">
                <BattleLog log={currentBattle.battleLog} />
              </div>

              {/* Attack Buttons */}
              {!victoryMessage && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {attackTypes.map((attack, index) => (
                    <motion.button
                      key={index}
                      whileHover={!attackCooldown ? { scale: 1.05 } : {}}
                      whileTap={!attackCooldown ? { scale: 0.95 } : {}}
                      onClick={() => handleAttack(attack)}
                      disabled={attackCooldown}
                      className={`relative overflow-hidden rounded-xl p-4 font-bold text-white shadow-lg transition-all ${
                        attackCooldown ? 'opacity-50' : 'opacity-100'
                      } bg-gradient-to-br ${attack.color}`}
                    >
                      <span className="text-3xl mb-2 block">{attack.icon}</span>
                      <span className="block text-sm font-semibold">{attack.name}</span>
                      <span className="block text-xs text-white/80">
                        Dmg: {attack.damage[0]}-{attack.damage[1]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Victory Message */}
              {victoryMessage && (
                <VictoryAnimation message={victoryMessage} onComplete={() => {}} />
              )}

              {/* Run Away Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEndBattle}
                className="mt-6 w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
              >
                {victoryMessage ? 'Next Battle' : 'Run Away'}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* No Battle - Show Bad Guys List */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Sword className="w-8 h-8 text-red-400" />
                Choose Your Enemy
              </h2>

              {activeBadGuys.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeBadGuys.map((badGuy) => (
                    <motion.div
                      key={badGuy.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => handleStartBattle(badGuy)}
                      className="cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-red-500 transition-all shadow-lg group"
                    >
                      <div className="text-7xl mb-4 text-center group-hover:scale-110 transition-transform">
                        {badGuy.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{badGuy.name}</h3>
                      <p className="text-gray-300 mb-4">{badGuy.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Health:</span>
                          <span className="text-red-400 font-bold">{badGuy.health}/{badGuy.maxHealth}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: `${(badGuy.health / badGuy.maxHealth) * 100}%` }}
                            className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                      >
                        Battle Now
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-dashed border-gray-700"
                >
                  <p className="text-2xl text-gray-300 mb-4">No enemies to fight! Add a bad guy to get started.</p>
                  <p className="text-gray-400">Go to the "Bad Guys" page and create your first challenge.</p>
                </motion.div>
              )}
            </div>

            {/* Defeated Bad Guys */}
            {defeatedBadGuys.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-green-400" />
                  Conquered Challenges ({defeatedBadGuys.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {defeatedBadGuys.map((badGuy) => (
                    <motion.div
                      key={badGuy.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-br from-green-900 to-gray-900 rounded-2xl p-6 border-2 border-green-700 shadow-lg opacity-75"
                    >
                      <div className="text-6xl mb-4 text-center opacity-60">{badGuy.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2 line-through opacity-75">{badGuy.name}</h3>
                      <p className="text-gray-400 opacity-75 mb-2">{badGuy.description}</p>
                      <div className="text-center text-green-400 font-bold">✓ Defeated</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BattlePage;
