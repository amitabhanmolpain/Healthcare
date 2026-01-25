import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useEmotionQuestStore from '../../../store/emotionQuestStore';
import { CharacterAvatar, DialogueBox, ChoiceButtons, FeedbackModal } from '../Components';
import storiesData from '../data/stories.json';
import toast from 'react-hot-toast';
import soundManager from '../soundManager';

const StoryPage = ({ onNavigate }) => {
  const {
    currentChapter,
    currentScene: sceneIndex,
    addXP,
    recordChoice,
    nextScene,
    completeChapter,
    exitGame,
  } = useEmotionQuestStore();

  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isChoiceDisabled, setIsChoiceDisabled] = useState(false);
  const [perfectScore, setPerfectScore] = useState(true);

  // Find current chapter data
  const chapterData = storiesData.chapters.find((c) => c.id === currentChapter);
  
  useEffect(() => {
    // Reset perfect score when chapter starts
    if (sceneIndex === 0) {
      setPerfectScore(true);
    }
  }, [currentChapter]);

  useEffect(() => {
    soundManager.playBackgroundMusic('gameplay');
    return () => soundManager.stopBackgroundMusic();
  }, []);

  useEffect(() => {
    // Play scene transition sound
    if (sceneIndex > 0) {
      soundManager.playSceneTransition();
    }
  }, [sceneIndex]);

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl mb-4">No chapter selected</p>
          <button
            onClick={() => onNavigate('chapters')}
            className="px-6 py-3 bg-purple-500 rounded-xl hover:bg-purple-600 transition"
          >
            Choose a Chapter
          </button>
        </div>
      </div>
    );
  }

  const currentSceneData = chapterData.scenes[sceneIndex];
  const isLastScene = sceneIndex === chapterData.scenes.length - 1;

  const handleChoiceSelect = async (choice) => {
    if (isChoiceDisabled) return;

    setSelectedChoice(choice);
    setIsChoiceDisabled(true);
    setShowFeedback(true);
    // Play sound based on correctness
    if (choice.correct) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }
    // Record the choice
    recordChoice(choice.correct);
    // Track if perfect score
    if (!choice.correct) {
      setPerfectScore(false);
    }
    // Add XP and await backend update
    await addXP(choice.xp);
    soundManager.playXPGain();
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    setIsChoiceDisabled(false);

    if (isLastScene) {
      // Chapter complete!
      completeChapter(chapterData.id, chapterData.skill);
      soundManager.playChapterComplete();
      
      // Check for perfect score badge
      if (perfectScore) {
        soundManager.playBadgeUnlock();
        toast.success('🏆 Perfect Score! All correct choices!');
      }
      
      // Show completion message
      setTimeout(() => {
        toast.success(`✨ Chapter ${chapterData.id} Complete! Skill learned: ${chapterData.skill}`);
        onNavigate('chapters');
      }, 100);
    } else {
      // Move to next scene
      nextScene();
    }
  };

  const handleExit = () => {
    exitGame();
    onNavigate('chapters');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">
      {/* Exit Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleExit}
        className="absolute top-6 right-6 z-10 w-12 h-12 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-white transition border border-red-500/50"
      >
        <X size={24} />
      </motion.button>

      {/* Chapter Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6 px-6 pb-4"
      >
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm">Chapter {chapterData.id}</p>
              <h2 className="text-white font-bold text-2xl">{chapterData.title}</h2>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">Scene {sceneIndex + 1}/{chapterData.scenes.length}</p>
              <p className="text-purple-300 text-sm">🎯 {chapterData.skill}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {currentSceneData && (
              <motion.div
                key={`scene-${sceneIndex}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Character Avatar */}
                <div className="flex justify-center">
                  <CharacterAvatar
                    character={currentSceneData.character}
                    characterName={currentSceneData.characterName}
                    emotion={currentSceneData.emotion}
                  />
                </div>

                {/* Dialogue Box */}
                <DialogueBox
                  text={currentSceneData.text}
                  character={currentSceneData.character}
                  onComplete={() => {}}
                />

                {/* Choice Buttons */}
                <div className="pt-4">
                  <h3 className="text-white font-semibold text-xl mb-4 text-center">
                    How do you respond?
                  </h3>
                  <ChoiceButtons
                    choices={currentSceneData.choices}
                    onChoice={handleChoiceSelect}
                    disabled={isChoiceDisabled}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        choice={selectedChoice}
        onContinue={handleContinue}
        show={showFeedback}
      />
    </div>
  );
};

export default StoryPage;
