import { motion } from 'framer-motion';
import { Users, Plus, Heart } from 'lucide-react';
import { useState } from 'react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import AllyCard from '../AllyCard';

const AlliesPage = () => {
  const { allies, addAlly, removeAlly } = useLifeQuestStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlly, setNewAlly] = useState({
    name: '',
    relation: 'friend',
    contact: '',
    supportType: []
  });

  const handleAddAlly = () => {
    if (newAlly.name.trim()) {
      addAlly(newAlly);
      setNewAlly({ name: '', relation: 'friend', contact: '', supportType: [] });
      setShowAddForm(false);
    }
  };

  const supportTypes = ['Emotional', 'Practical', 'Social', 'Professional'];

  const toggleSupportType = (type) => {
    setNewAlly(prev => ({
      ...prev,
      supportType: prev.supportType.includes(type)
        ? prev.supportType.filter(t => t !== type)
        : [...prev.supportType, type]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 p-6">
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
            <Users className="w-12 h-12 text-teal-400" />
            My Allies
          </motion.h1>
          <p className="text-gray-300 text-lg">Your support network - people who have your back</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-6 text-center shadow-xl"
          >
            <Users className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-4xl font-bold text-white">{allies.length}</p>
            <p className="text-teal-100 text-sm">Total Allies</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-6 text-center shadow-xl"
          >
            <Heart className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-4xl font-bold text-white">{allies.filter(a => a.relation === 'family').length}</p>
            <p className="text-pink-100 text-sm">Family</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-center shadow-xl"
          >
            <p className="text-4xl font-bold text-white">{allies.filter(a => a.relation === 'friend').length}</p>
            <p className="text-purple-100 text-sm">Friends</p>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤝</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Why Allies Matter</h3>
              <p className="text-blue-100">
                Research shows that social support is one of the strongest predictors of resilience. 
                Your allies are your safety net - people you can reach out to when you need support, 
                encouragement, or just someone to listen.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Add Ally Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
        >
          <Plus className="w-6 h-6" />
          Add New Ally
        </motion.button>

        {/* Add Ally Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold text-white mb-4">Add a New Ally</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={newAlly.name}
                  onChange={(e) => setNewAlly({...newAlly, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter name..."
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Relationship</label>
                <select
                  value={newAlly.relation}
                  onChange={(e) => setNewAlly({...newAlly, relation: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="friend">Friend</option>
                  <option value="family">Family</option>
                  <option value="therapist">Therapist</option>
                  <option value="mentor">Mentor</option>
                  <option value="partner">Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Contact (Optional)</label>
                <input
                  type="text"
                  value={newAlly.contact}
                  onChange={(e) => setNewAlly({...newAlly, contact: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Phone, email, or social media..."
                />
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2">Support Type</label>
                <div className="flex flex-wrap gap-2">
                  {supportTypes.map(type => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSupportType(type)}
                      className={`px-4 py-2 rounded-full font-semibold transition-all ${
                        newAlly.supportType.includes(type)
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {type}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddAlly}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-bold"
                >
                  Add Ally
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

        {/* Allies Grid */}
        {allies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allies.map((ally, index) => (
              <motion.div
                key={ally.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <AllyCard ally={ally} onRemove={removeAlly} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700"
          >
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-2xl text-gray-400 mb-2">No allies added yet</p>
            <p className="text-gray-500">Click "Add New Ally" to build your support network</p>
          </motion.div>
        )}

        {/* Motivational Message */}
        <motion.div
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 font-bold">
            🤝 You don't have to face challenges alone! 🤝
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AlliesPage;
