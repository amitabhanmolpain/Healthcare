import { motion } from 'framer-motion';
import { Skull, Plus, Swords, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useLifeQuestStore from '../../../store/lifeQuestStore';

const BadGuysPage = () => {
  const { badguys, addBadGuy } = useLifeQuestStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBadGuy, setNewBadGuy] = useState({
    name: '',
    description: '',
    color: 'blue',
    icon: '👾'
  });

  const handleAddBadGuy = () => {
    if (newBadGuy.name.trim() && newBadGuy.description.trim()) {
      addBadGuy(newBadGuy);
      setNewBadGuy({ name: '', description: '', color: 'blue', icon: '👾' });
      setShowAddForm(false);
    }
  };

  const activeBadGuys = badguys.filter(bg => !bg.defeated);
  const defeatedBadGuys = badguys.filter(bg => bg.defeated);

  const iconOptions = ['👾', '🐉', '👻', '🧌', '👹', '😈', '💀', '🤡', '🦇', '🕷️', '🔥', '⚡', '🌪️', '⛈️', '🦑', '🕸️', '👾', '💀'];

  const colorOptions = ['blue', 'red', 'purple', 'gray'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-2 flex items-center gap-3"
          >
            <Skull className="w-12 h-12 text-red-400" />
            <span className="bg-gradient-to-r from-red-400 via-orange-500 to-pink-600 bg-clip-text text-transparent">
              Define Your Enemies
            </span>
          </motion.h1>
          <p className="text-gray-300 text-lg">Add the challenges and obstacles you want to defeat</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-red-600 to-rose-600 rounded-xl p-6 text-center shadow-xl"
          >
            <Swords className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-4xl font-bold text-white">{activeBadGuys.length}</p>
            <p className="text-red-100 text-sm">Active Enemies</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-center shadow-xl"
          >
            <p className="text-4xl font-bold text-white">{defeatedBadGuys.length}</p>
            <p className="text-green-100 text-sm">Conquered</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-center shadow-xl"
          >
            <p className="text-4xl font-bold text-white">{badguys.length}</p>
            <p className="text-purple-100 text-sm">Total Enemies</p>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 mb-8 shadow-xl border-2 border-orange-500"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">⚔️</div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">What are Bad Guys?</h3>
              <p className="text-red-100 text-lg mb-2">
                Bad guys represent personal challenges you want to overcome. Examples:
              </p>
              <ul className="text-red-100 space-y-1 text-sm">
                <li>• <strong>Addictions</strong> - Habits you want to break free from</li>
                <li>• <strong>Disrespect</strong> - People or situations that undermine you</li>
                <li>• <strong>Anxiety</strong> - Racing thoughts and fear</li>
                <li>• <strong>Your Boss</strong> - Challenging authority figures</li>
                <li>• <strong>Procrastination</strong> - Avoidance and laziness</li>
                <li>• <strong>Low Self-Esteem</strong> - Negative self-talk</li>
              </ul>
              <p className="text-red-100 mt-3 font-semibold">Go to Battle Arena to fight these enemies with different attacks!</p>
            </div>
          </div>
        </motion.div>

        {/* Add Bad Guy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto text-lg"
        >
          <Plus className="w-6 h-6" />
          Add New Enemy
        </motion.button>

        {/* Add Bad Guy Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Create Your Enemy
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Enemy Name</label>
                <input
                  type="text"
                  value={newBadGuy.name}
                  onChange={(e) => setNewBadGuy({...newBadGuy, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                  placeholder="e.g., My Addiction, Disrespect, My Boss, Procrastination..."
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Description / Why is this an enemy?</label>
                <textarea
                  value={newBadGuy.description}
                  onChange={(e) => setNewBadGuy({...newBadGuy, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Explain why this is a challenge you want to overcome..."
                  rows="4"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-3">Choose Enemy Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(icon => (
                    <motion.button
                      key={icon}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewBadGuy({...newBadGuy, icon})}
                      type="button"
                      className={`w-14 h-14 rounded-lg text-3xl flex items-center justify-center transition-all ${
                        newBadGuy.icon === icon 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 ring-4 ring-white' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddBadGuy}
                  type="button"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
                >
                  Create Enemy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  type="button"
                  className="px-8 py-4 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Bad Guys */}
        {activeBadGuys.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Swords className="w-8 h-8 text-red-400" />
              Your Enemies ({activeBadGuys.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBadGuys.map((badguy, index) => (
                <motion.div
                  key={badguy.id}
                  initial={{ scale: 0, rotate: 180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-red-500 transition-all shadow-lg"
                >
                  <div className="text-6xl mb-4 text-center">{badguy.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">{badguy.name}</h3>
                  <p className="text-gray-300 mb-4 text-center text-sm">{badguy.description}</p>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Health:</span>
                        <span className="text-red-400 font-bold">{Math.ceil(badguy.health)} / {badguy.maxHealth}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
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

        {/* Defeated Bad Guys */}
        {defeatedBadGuys.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Skull className="w-8 h-8 text-green-400" />
              Conquered Enemies ({defeatedBadGuys.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defeatedBadGuys.map((badguy) => (
                <motion.div
                  key={badguy.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-green-900/30 to-gray-900 rounded-2xl p-6 border-2 border-green-700 shadow-lg opacity-70"
                >
                  <div className="text-5xl mb-4 text-center line-through opacity-60">{badguy.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center line-through opacity-75">{badguy.name}</h3>
                  <p className="text-gray-400 opacity-75 mb-4 text-center text-sm">{badguy.description}</p>
                  <div className="text-center">
                    <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full font-bold">
                      ✓ Conquered
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeBadGuys.length === 0 && defeatedBadGuys.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-gray-700"
          >
            <div className="text-7xl mb-6">🎯</div>
            <p className="text-3xl text-white font-bold mb-3">No Enemies Created Yet</p>
            <p className="text-gray-400 text-lg mb-6">Click "Add New Enemy" to start defining the challenges you want to defeat!</p>
            <p className="text-gray-500 text-sm">Examples: Your Boss, Addiction, Anxiety, Procrastination, Disrespect, Self-Doubt...</p>
          </motion.div>
        )}

        {/* Motivational Message */}
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 font-bold">
            ⚔️ Every quest weakens your bad guys! Keep fighting! ⚔️
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BadGuysPage;
