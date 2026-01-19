import { motion } from 'framer-motion';
import { Skull, Plus, Swords } from 'lucide-react';
import { useState } from 'react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import BadGuyCard from '../BadGuyCard';

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

  const iconOptions = ['👾', '🐉', '👻', '🧌', '👹', '😈', '💀', '🤡', '🦇', '🕷️'];
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
            className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3"
          >
            <Swords className="w-12 h-12 text-red-400" />
            Bad Guys
          </motion.h1>
          <p className="text-gray-300 text-lg">Face your challenges and defeat them one quest at a time</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-red-600 to-rose-600 rounded-xl p-6 text-center shadow-xl"
          >
            <Skull className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-4xl font-bold text-white">{activeBadGuys.length}</p>
            <p className="text-red-100 text-sm">Active</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-center shadow-xl"
          >
            <p className="text-4xl font-bold text-white">{defeatedBadGuys.length}</p>
            <p className="text-green-100 text-sm">Defeated</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-center shadow-xl"
          >
            <p className="text-4xl font-bold text-white">{badguys.length}</p>
            <p className="text-purple-100 text-sm">Total</p>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 mb-8 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚔️</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">How Bad Guys Work</h3>
              <p className="text-red-100">
                Bad guys represent your personal challenges - anxiety, procrastination, negative thinking, etc. 
                Each quest you complete deals damage to a random bad guy. Defeat them all to prove your resilience!
                Each bad guy starts with 100 health and loses health based on quest points.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Add Bad Guy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
        >
          <Plus className="w-6 h-6" />
          Add New Bad Guy
        </motion.button>

        {/* Add Bad Guy Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Define Your Challenge</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Bad Guy Name</label>
                <input
                  type="text"
                  value={newBadGuy.name}
                  onChange={(e) => setNewBadGuy({...newBadGuy, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Anxiety Monster, Procrastination Dragon..."
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={newBadGuy.description}
                  onChange={(e) => setNewBadGuy({...newBadGuy, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="What does this challenge represent?"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Choose Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(icon => (
                    <motion.button
                      key={icon}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewBadGuy({...newBadGuy, icon})}
                      className={`w-12 h-12 rounded-lg text-2xl flex items-center justify-center ${
                        newBadGuy.icon === icon ? 'bg-red-500' : 'bg-gray-700'
                      }`}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Color Theme</label>
                <div className="flex gap-2">
                  {colorOptions.map(color => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewBadGuy({...newBadGuy, color})}
                      className={`w-16 h-16 rounded-lg ${
                        color === 'blue' ? 'bg-blue-600' :
                        color === 'red' ? 'bg-red-600' :
                        color === 'purple' ? 'bg-purple-600' :
                        'bg-gray-600'
                      } ${newBadGuy.color === color ? 'ring-4 ring-white' : ''}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddBadGuy}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold"
                >
                  Add Bad Guy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-bold"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Bad Guys */}
        {activeBadGuys.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Swords className="w-6 h-6 text-red-400" />
              Active Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBadGuys.map((badguy, index) => (
                <motion.div
                  key={badguy.id}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BadGuyCard badguy={badguy} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Defeated Bad Guys */}
        {defeatedBadGuys.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Skull className="w-6 h-6 text-green-400" />
              Defeated Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defeatedBadGuys.map((badguy) => (
                <motion.div
                  key={badguy.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                >
                  <BadGuyCard badguy={badguy} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeBadGuys.length === 0 && defeatedBadGuys.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700"
          >
            <Skull className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-2xl text-gray-400 mb-2">No bad guys yet</p>
            <p className="text-gray-500">Click "Add New Bad Guy" to define your personal challenges</p>
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
