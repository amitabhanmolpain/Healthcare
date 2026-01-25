import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import useLifeQuestStore from '../../../store/lifeQuestStore';
import QuestCard from '../QuestCard';
import ConfettiAnimation from '../ConfettiAnimation';
import GoalSetting from '../Components/GoalSetting';
import ThoughtsWriting from '../Components/ThoughtsWriting';
import MusicModal from '../Components/MusicModal';
import BreathingExercise from '../Components/BreathingExercise';

const QuestsPage = () => {
  const { quests, completeQuest } = useLifeQuestStore();
  const [filter, setFilter] = useState('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'goals', 'thoughts', 'music', 'breathing', null
  const [pendingQuestId, setPendingQuestId] = useState(null);
  const [currentQuestTitle, setCurrentQuestTitle] = useState('');

  const handleCompleteQuest = async (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    setCurrentQuestTitle(quest.title);
    // Check quest type and show appropriate modal
    const title = quest.title.toLowerCase();
    if (title.includes('write') || title.includes('thought') || title.includes('journal')) {
      setPendingQuestId(questId);
      setActiveModal('thoughts');
    } else if (title.includes('music') || title.includes('listen')) {
      setPendingQuestId(questId);
      setActiveModal('music');
    } else if (title.includes('breathing') || title.includes('breathe')) {
      setPendingQuestId(questId);
      setActiveModal('breathing');
    } else if (title.includes('goal')) {
      setPendingQuestId(questId);
      setActiveModal('goals');
    } else {
      // Simple quest - instant completion
      await completeQuest(questId);
      setShowConfetti(true);
    }
  };

  const handleModalComplete = async () => {
    if (pendingQuestId) {
      await completeQuest(pendingQuestId);
      setShowConfetti(true);
      setPendingQuestId(null);
    }
    setActiveModal(null);
    setCurrentQuestTitle('');
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setPendingQuestId(null);
    setCurrentQuestTitle('');
  };

  const filteredQuests = filter === 'all' 
    ? quests 
    : filter === 'completed'
    ? quests.filter(q => q.status === 'completed')
    : quests.filter(q => q.status === 'available');

  const completedCount = quests.filter(q => q.status === 'completed').length;
  const availableCount = quests.filter(q => q.status === 'available').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
      <ConfettiAnimation show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Daily Quests</h1>
          <p className="text-gray-300">Complete missions to level up and defeat bad guys</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-white">{quests.length}</p>
            <p className="text-indigo-200 text-sm">Total Quests</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-white">{completedCount}</p>
            <p className="text-green-200 text-sm">Completed</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-white">{availableCount}</p>
            <p className="text-yellow-200 text-sm">Available</p>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Filter className="w-6 h-6 text-gray-400" />
          {['all', 'available', 'completed'].map((filterOption) => (
            <motion.button
              key={filterOption}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                filter === filterOption
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Quests Grid */}
        {filteredQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuestCard quest={quest} onComplete={handleCompleteQuest} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700"
          >
            <p className="text-2xl text-gray-400">No quests found for this filter</p>
          </motion.div>
        )}

        {/* Interactive Modals */}
        {activeModal === 'thoughts' && (
          <ThoughtsWriting
            onComplete={handleModalComplete}
            onClose={handleModalClose}
            questTitle={currentQuestTitle}
          />
        )}

        {activeModal === 'music' && (
          <MusicModal
            onComplete={handleModalComplete}
            onClose={handleModalClose}
            requiredTime={60}
          />
        )}

        {activeModal === 'breathing' && (
          <BreathingExercise
            onComplete={handleModalComplete}
            onClose={handleModalClose}
          />
        )}

        {activeModal === 'goals' && (
          <GoalSetting
            onComplete={handleModalComplete}
            onClose={handleModalClose}
          />
        )}

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Daily Progress</h3>
            <span className="text-white font-bold">{completedCount} / {quests.length}</span>
          </div>
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / quests.length) * 100}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuestsPage;
