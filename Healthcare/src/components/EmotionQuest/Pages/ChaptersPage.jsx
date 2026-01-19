import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book } from 'lucide-react';
import useEmotionQuestStore from '../../../store/emotionQuestStore';
import { ChapterCard } from '../Components';
import storiesData from '../data/stories.json';
import soundManager from '../soundManager';

const ChaptersPage = ({ onNavigate }) => {
  const { completedChapters, startChapter } = useEmotionQuestStore();

  useEffect(() => {
    soundManager.playBackgroundMusic('menu');
    return () => soundManager.stopBackgroundMusic();
  }, []);

  const handleStartChapter = (chapterId) => {
    soundManager.playChapterStart();
    startChapter(chapterId);
    setTimeout(() => onNavigate('story'), 300);
  };

  const isChapterLocked = (chapterId) => {
    // First chapter is always unlocked
    if (chapterId === 1) return false;
    // Other chapters unlock when previous one is completed
    return !completedChapters.includes(chapterId - 1);
  };

  const isChapterCompleted = (chapterId) => {
    return completedChapters.includes(chapterId);
  };

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
            <Book size={48} className="text-purple-400" />
            <h1 className="font-bold text-5xl text-white">Choose Your Chapter</h1>
          </div>
          
          <p className="text-xl text-purple-200">
            Each chapter teaches a different emotional intelligence skill
          </p>

          <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 max-w-2xl mx-auto">
            <p className="text-white text-sm">
              ✨ Complete chapters in order to unlock new ones • 
              💪 Replay chapters anytime to practice skills
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Overall Progress</span>
            <span className="text-purple-300">
              {completedChapters.length} / {storiesData.chapters.length} Chapters
            </span>
          </div>
          <div className="w-full h-4 bg-purple-900/30 rounded-full overflow-hidden border border-purple-500/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedChapters.length / storiesData.chapters.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </motion.div>

        {/* Chapters Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {storiesData.chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <ChapterCard
                chapter={chapter}
                isLocked={isChapterLocked(chapter.id)}
                isCompleted={isChapterCompleted(chapter.id)}
                onStart={() => handleStartChapter(chapter.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ChaptersPage;
