import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_QUESTS = [
  { id: 1, title: 'Drink a Glass of Water', description: 'Hydration is key to mental clarity', difficulty: 'easy', points: 10, status: 'available', category: 'health', date: new Date().toISOString().split('T')[0] },
  { id: 2, title: 'Take a 5-Minute Walk', description: 'Movement boosts mood and energy', difficulty: 'easy', points: 10, status: 'available', category: 'exercise', date: new Date().toISOString().split('T')[0] },
  { id: 3, title: 'Message a Friend', description: 'Social connection strengthens resilience', difficulty: 'medium', points: 15, status: 'available', category: 'social', date: new Date().toISOString().split('T')[0] },
  { id: 4, title: 'Write 3 Good Things', description: 'Gratitude practice rewires your brain', difficulty: 'easy', points: 10, status: 'available', category: 'mindfulness', date: new Date().toISOString().split('T')[0] },
  { id: 5, title: 'Deep Breathing (2 min)', description: 'Calm your nervous system instantly', difficulty: 'easy', points: 10, status: 'available', category: 'mindfulness', date: new Date().toISOString().split('T')[0] },
  { id: 6, title: 'Organize Your Desk', description: 'External order creates internal calm', difficulty: 'medium', points: 15, status: 'available', category: 'productivity', date: new Date().toISOString().split('T')[0] },
  { id: 7, title: 'Listen to Uplifting Music', description: 'Music therapy for the soul', difficulty: 'easy', points: 10, status: 'available', category: 'mood', date: new Date().toISOString().split('T')[0] },
];

const POWER_UPS = [
  { id: 1, name: 'Deep Breathing', description: '3 deep breaths, exhale slowly', points: 3, icon: '🫁', uses: 0 },
  { id: 2, name: 'Stretch Break', description: '30-second full body stretch', points: 3, icon: '🤸', uses: 0 },
  { id: 3, name: 'Mindful Music', description: 'Listen to soothing music for 5 minutes', points: 5, icon: '🎵', uses: 0 },
  { id: 4, name: 'Dance Party', description: '1 song, dance like nobody\'s watching', points: 5, icon: '💃', uses: 0 },
  { id: 5, name: 'Gratitude Moment', description: 'Name 1 thing you\'re grateful for', points: 3, icon: '🙏', uses: 0 },
  { id: 6, name: 'Power Pose', description: 'Stand like a superhero for 1 minute', points: 3, icon: '💪', uses: 0 },
  { id: 7, name: 'Affirmation', description: 'Say "I am capable and strong"', points: 3, icon: '✨', uses: 0 },
  { id: 8, name: 'Nature Gaze', description: 'Look at something green for 30 sec', points: 3, icon: '🌿', uses: 0 },
];

const INITIAL_BAD_GUYS = [
  { id: 1, name: 'Anxiety Monster', description: 'Feeds on worry and fear', health: 100, defeated: false, color: 'blue', icon: '👾' },
  { id: 2, name: 'Procrastination Dragon', description: 'Keeps you from your goals', health: 100, defeated: false, color: 'red', icon: '🐉' },
  { id: 3, name: 'Negative Thinking Ghost', description: 'Whispers doubts in your ear', health: 100, defeated: false, color: 'purple', icon: '👻' },
  { id: 4, name: 'Isolation Troll', description: 'Wants you to stay alone', health: 100, defeated: false, color: 'gray', icon: '🧌' },
];

const BADGES = [
  { id: 1, name: 'First Quest', description: 'Complete your first quest', requirement: 'quests', threshold: 1, unlocked: false, icon: '🌟', rarity: 'common' },
  { id: 2, name: '5-Day Warrior', description: '5 day streak achieved', requirement: 'streak', threshold: 5, unlocked: false, icon: '🔥', rarity: 'rare' },
  { id: 3, name: '10-Day Legend', description: '10 day streak achieved', requirement: 'streak', threshold: 10, unlocked: false, icon: '👑', rarity: 'epic' },
  { id: 4, name: 'Power-Up Master', description: 'Use 20 power-ups', requirement: 'powerups', threshold: 20, unlocked: false, icon: '⚡', rarity: 'rare' },
  { id: 5, name: 'Level 5 Hero', description: 'Reach level 5', requirement: 'level', threshold: 5, unlocked: false, icon: '🏆', rarity: 'epic' },
  { id: 6, name: 'Social Butterfly', description: 'Add 3 allies', requirement: 'allies', threshold: 3, unlocked: false, icon: '🦋', rarity: 'rare' },
  { id: 7, name: 'Bad Guy Slayer', description: 'Defeat your first bad guy', requirement: 'badguys', threshold: 1, unlocked: false, icon: '⚔️', rarity: 'epic' },
  { id: 8, name: 'Quest Collector', description: 'Complete 50 quests', requirement: 'quests', threshold: 50, unlocked: false, icon: '📜', rarity: 'legendary' },
];

const useLifeQuestStore = create(
  persist(
    (set, get) => ({
      // User Progress
      progress: {
        xp: 0,
        level: 1,
        current_streak: 0,
        longest_streak: 0,
        total_quests_completed: 0,
        total_powerups_used: 0,
        last_quest_date: null,
      },

      // Quests
      quests: INITIAL_QUESTS,

      // Power-ups
      powerups: POWER_UPS,

      // Allies
      allies: [],

      // Bad Guys
      badguys: INITIAL_BAD_GUYS,

      // Badges
      badges: BADGES,

      // Actions
      completeQuest: (questId) => {
        const state = get();
        const quest = state.quests.find(q => q.id === questId);
        
        if (!quest || quest.status === 'completed') return;

        const today = new Date().toISOString().split('T')[0];
        const newXP = state.progress.xp + quest.points;
        const newLevel = Math.floor(newXP / 100) + 1;
        
        // Update streak
        let newStreak = state.progress.current_streak;
        const lastQuestDate = state.progress.last_quest_date;
        
        if (lastQuestDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastQuestDate === yesterdayStr) {
            newStreak += 1;
          } else if (lastQuestDate && lastQuestDate !== today) {
            newStreak = 1;
          } else {
            newStreak = 1;
          }
        }

        const newLongestStreak = Math.max(state.progress.longest_streak, newStreak);

        // Damage random bad guy
        const activeBadGuys = state.badguys.filter(bg => !bg.defeated);
        let updatedBadGuys = [...state.badguys];
        
        if (activeBadGuys.length > 0) {
          const randomBadGuy = activeBadGuys[Math.floor(Math.random() * activeBadGuys.length)];
          const badGuyIndex = updatedBadGuys.findIndex(bg => bg.id === randomBadGuy.id);
          updatedBadGuys[badGuyIndex] = {
            ...randomBadGuy,
            health: Math.max(0, randomBadGuy.health - quest.points),
            defeated: randomBadGuy.health - quest.points <= 0
          };
        }

        set({
          quests: state.quests.map(q => 
            q.id === questId ? { ...q, status: 'completed' } : q
          ),
          progress: {
            ...state.progress,
            xp: newXP,
            level: newLevel,
            current_streak: newStreak,
            longest_streak: newLongestStreak,
            total_quests_completed: state.progress.total_quests_completed + 1,
            last_quest_date: today,
          },
          badguys: updatedBadGuys,
        });

        // Check and unlock badges
        get().checkBadges();
      },

      usePowerUp: (powerUpId) => {
        const state = get();
        const powerup = state.powerups.find(p => p.id === powerUpId);
        
        if (!powerup) return;

        const newXP = state.progress.xp + powerup.points;
        const newLevel = Math.floor(newXP / 100) + 1;

        set({
          powerups: state.powerups.map(p =>
            p.id === powerUpId ? { ...p, uses: p.uses + 1 } : p
          ),
          progress: {
            ...state.progress,
            xp: newXP,
            level: newLevel,
            total_powerups_used: state.progress.total_powerups_used + 1,
          }
        });

        get().checkBadges();
      },

      addAlly: (ally) => {
        set(state => ({
          allies: [...state.allies, { ...ally, id: Date.now() }]
        }));
        get().checkBadges();
      },

      removeAlly: (allyId) => {
        set(state => ({
          allies: state.allies.filter(a => a.id !== allyId)
        }));
      },

      addBadGuy: (badguy) => {
        set(state => ({
          badguys: [...state.badguys, { 
            ...badguy, 
            id: Date.now(), 
            health: 100, 
            defeated: false 
          }]
        }));
      },

      resetDailyQuests: () => {
        set({
          quests: INITIAL_QUESTS.map(q => ({
            ...q,
            status: 'available',
            date: new Date().toISOString().split('T')[0]
          }))
        });
      },

      checkBadges: () => {
        const state = get();
        let updatedBadges = [...state.badges];
        let hasChanges = false;

        updatedBadges = updatedBadges.map(badge => {
          if (badge.unlocked) return badge;

          let shouldUnlock = false;

          switch(badge.requirement) {
            case 'quests':
              shouldUnlock = state.progress.total_quests_completed >= badge.threshold;
              break;
            case 'streak':
              shouldUnlock = state.progress.current_streak >= badge.threshold;
              break;
            case 'powerups':
              shouldUnlock = state.progress.total_powerups_used >= badge.threshold;
              break;
            case 'level':
              shouldUnlock = state.progress.level >= badge.threshold;
              break;
            case 'allies':
              shouldUnlock = state.allies.length >= badge.threshold;
              break;
            case 'badguys':
              shouldUnlock = state.badguys.filter(bg => bg.defeated).length >= badge.threshold;
              break;
            default:
              break;
          }

          if (shouldUnlock) {
            hasChanges = true;
            return { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
          }

          return badge;
        });

        if (hasChanges) {
          set({ badges: updatedBadges });
        }
      },

      resetProgress: () => {
        set({
          progress: {
            xp: 0,
            level: 1,
            current_streak: 0,
            longest_streak: 0,
            total_quests_completed: 0,
            total_powerups_used: 0,
            last_quest_date: null,
          },
          quests: INITIAL_QUESTS,
          powerups: POWER_UPS,
          allies: [],
          badguys: INITIAL_BAD_GUYS,
          badges: BADGES,
        });
      },
    }),
    {
      name: 'lifequest-storage',
    }
  )
);

export default useLifeQuestStore;
