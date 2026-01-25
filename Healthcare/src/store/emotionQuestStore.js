import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { statsAPI } from '../services/statsApi';

const useEmotionQuestStore = create(
  persist(
    (set, get) => ({
      // User Progress
      xp: 0,
      level: 1,
      totalXP: 0,
      
      // Current Game State
      currentChapter: null,
      currentScene: 0,
      isPlaying: false,
      
      // Completed Content
      completedChapters: [],
      completedScenes: [],
      
      // Achievements
      badges: [
        { id: 'first_step', name: 'First Step', description: 'Complete your first chapter', unlocked: false, icon: '🎯' },
        { id: 'quick_learner', name: 'Quick Learner', description: 'Get 5 correct choices in a row', unlocked: false, icon: '⚡' },
        { id: 'emotional_master', name: 'Emotional Master', description: 'Complete all chapters', unlocked: false, icon: '👑' },
        { id: 'persistent', name: 'Persistent', description: 'Play 7 days in a row', unlocked: false, icon: '🔥' },
        { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', unlocked: false, icon: '⭐' },
        { id: 'level_10', name: 'Expert', description: 'Reach level 10', unlocked: false, icon: '💎' },
        { id: 'perfect_score', name: 'Perfect Score', description: 'Complete a chapter without mistakes', unlocked: false, icon: '🏆' },
        { id: 'wise_choice', name: 'Wise Choice', description: 'Make 50 correct choices', unlocked: false, icon: '🧠' },
      ],
      
      // Stats
      totalChoices: 0,
      correctChoices: 0,
      consecutiveCorrect: 0,
      lastPlayDate: null,
      playStreak: 0,
      longestStreak: 0,
      
      // Skills Learned
      skillsLearned: [],
      
      // Actions
      addXP: async (amount) => {
        const state = get();
        const newTotalXP = state.totalXP + amount;
        const newXP = state.xp + amount;
        const xpNeededForLevel = state.level * 100;

        // Update backend stats for leaderboard
        try {
          await statsAPI.updateStats({ game: 'emotionquest', win: true, xp: amount });
        } catch (e) {
          // Optionally handle error
        }

        if (newXP >= xpNeededForLevel) {
          // Level up!
          const newLevel = state.level + 1;
          set({ 
            xp: newXP - xpNeededForLevel, 
            level: newLevel,
            totalXP: newTotalXP
          });
          // Import sound manager dynamically to avoid circular deps
          import('../components/EmotionQuest/soundManager').then(module => {
            module.default.playLevelUp();
          });
          // Check level badges
          get().checkBadges();
        } else {
          set({ xp: newXP, totalXP: newTotalXP });
        }
      },
      
      recordChoice: (isCorrect) => {
        const state = get();
        const newConsecutive = isCorrect ? state.consecutiveCorrect + 1 : 0;
        
        set({
          totalChoices: state.totalChoices + 1,
          correctChoices: isCorrect ? state.correctChoices + 1 : state.correctChoices,
          consecutiveCorrect: newConsecutive,
        });
        
        // Check badges after recording choice
        get().checkBadges();
      },
      
      startChapter: (chapterId) => {
        set({
          currentChapter: chapterId,
          currentScene: 0,
          isPlaying: true,
        });
      },
      
      nextScene: () => {
        const state = get();
        set({ currentScene: state.currentScene + 1 });
      },
      
      completeChapter: (chapterId, skill) => {
        const state = get();
        
        if (!state.completedChapters.includes(chapterId)) {
          set({
            completedChapters: [...state.completedChapters, chapterId],
            skillsLearned: [...state.skillsLearned, skill],
            isPlaying: false,
            currentChapter: null,
            currentScene: 0,
          });
          
          // Update play streak
          get().updatePlayStreak();
          
          // Check badges
          get().checkBadges();
        }
      },
      
      updatePlayStreak: () => {
        const today = new Date().toDateString();
        const state = get();
        
        if (state.lastPlayDate === today) {
          return; // Already played today
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        let newStreak = 1;
        if (state.lastPlayDate === yesterdayStr) {
          newStreak = state.playStreak + 1;
        }
        
        set({
          lastPlayDate: today,
          playStreak: newStreak,
          longestStreak: Math.max(newStreak, state.longestStreak),
        });
        
        get().checkBadges();
      },
      
      unlockBadge: (badgeId) => {
        set((state) => ({
          badges: state.badges.map((badge) =>
            badge.id === badgeId ? { ...badge, unlocked: true } : badge
          ),
        }));
        
        // Play badge unlock sound
        import('../components/EmotionQuest/soundManager').then(module => {
          module.default.playBadgeUnlock();
        });
      },
      
      checkBadges: () => {
        const state = get();
        
        // First Step
        if (state.completedChapters.length >= 1 && !state.badges.find(b => b.id === 'first_step')?.unlocked) {
          get().unlockBadge('first_step');
        }
        
        // Quick Learner
        if (state.consecutiveCorrect >= 5 && !state.badges.find(b => b.id === 'quick_learner')?.unlocked) {
          get().unlockBadge('quick_learner');
        }
        
        // Emotional Master
        if (state.completedChapters.length >= 6 && !state.badges.find(b => b.id === 'emotional_master')?.unlocked) {
          get().unlockBadge('emotional_master');
        }
        
        // Persistent
        if (state.playStreak >= 7 && !state.badges.find(b => b.id === 'persistent')?.unlocked) {
          get().unlockBadge('persistent');
        }
        
        // Level badges
        if (state.level >= 5 && !state.badges.find(b => b.id === 'level_5')?.unlocked) {
          get().unlockBadge('level_5');
        }
        
        if (state.level >= 10 && !state.badges.find(b => b.id === 'level_10')?.unlocked) {
          get().unlockBadge('level_10');
        }
        
        // Wise Choice
        if (state.correctChoices >= 50 && !state.badges.find(b => b.id === 'wise_choice')?.unlocked) {
          get().unlockBadge('wise_choice');
        }
      },
      
      exitGame: () => {
        set({
          isPlaying: false,
          currentChapter: null,
          currentScene: 0,
        });
      },
      
      resetProgress: () => {
        set({
          xp: 0,
          level: 1,
          totalXP: 0,
          currentChapter: null,
          currentScene: 0,
          isPlaying: false,
          completedChapters: [],
          completedScenes: [],
          badges: get().badges.map(b => ({ ...b, unlocked: false })),
          totalChoices: 0,
          correctChoices: 0,
          consecutiveCorrect: 0,
          lastPlayDate: null,
          playStreak: 0,
          longestStreak: 0,
          skillsLearned: [],
        });
      },
    }),
    {
      name: 'emotion-quest-storage',
    }
  )
);

export default useEmotionQuestStore;
