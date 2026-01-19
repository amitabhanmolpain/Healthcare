# LifeQuest – Resilience Game

A SuperBetter-style gamified mental health recovery module built with React that turns real-life recovery actions into an engaging game experience.

## 🎮 Overview

LifeQuest transforms mental health recovery into an immersive gaming experience where:
- You are the **HERO**
- Real-life problems become **BAD GUYS**
- Positive actions are **QUESTS**
- Quick healthy habits are **POWER-UPS**
- Supporters become **ALLIES**
- Progress tracked with **XP, LEVELS, and BADGES**

## ✨ Features

### Core Game Mechanics

1. **Quest System**
   - 7 daily quests across categories (Health, Exercise, Social, Mindfulness, Productivity, Mood)
   - Each quest rewards 10-15 XP based on difficulty
   - Completing quests damages random bad guys
   - Daily streak tracking

2. **Power-Ups**
   - 8 instant mood boosters (Deep Breathing, Stretching, Dance Party, etc.)
   - Quick 30-second to 2-minute actions
   - Earn 3-5 XP instantly
   - Track usage statistics

3. **Progression System**
   - XP-based leveling (100 XP per level)
   - Visual XP bar with percentage display
   - Level milestones and achievements

4. **Streak System**
   - Daily streak counter
   - Longest streak tracking
   - Motivational messages based on streak length
   - 5-day and 10-day streak badges

5. **Bad Guys System**
   - Define personal challenges (Anxiety Monster, Procrastination Dragon, etc.)
   - Each bad guy has 100 health
   - Quests deal damage to random bad guys
   - Visual health bars and defeat animations

6. **Allies System**
   - Add supporters (friends, family, therapists, mentors)
   - Categorize by relationship type
   - Track contact information
   - Support type classification (Emotional, Practical, Social, Professional)

7. **Badges System**
   - 8 unlockable badges with different rarity levels (Common, Rare, Epic, Legendary)
   - Achievement tracking for quests, streaks, power-ups, levels, allies, and defeated bad guys
   - Animated badge displays with glow effects

## 🛠️ Tech Stack

- **React** - UI framework
- **Zustand** - State management with localStorage persistence
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── store/
│   └── lifeQuestStore.js          # Zustand store with game state
├── components/
│   └── LifeQuest/
│       ├── LifeQuestGame.jsx       # Main container with navigation
│       ├── QuestCard.jsx           # Individual quest display
│       ├── PowerUpCard.jsx         # Power-up button component
│       ├── XPBar.jsx               # Experience progress bar
│       ├── StreakCounter.jsx       # Streak display with flame icon
│       ├── BadgeGrid.jsx           # Badge collection display
│       ├── AllyCard.jsx            # Ally/supporter card
│       ├── BadGuyCard.jsx          # Challenge/bad guy display
│       ├── ConfettiAnimation.jsx   # Quest completion celebration
│       └── Pages/
│           ├── HomePage.jsx        # Hero dashboard
│           ├── QuestsPage.jsx      # Daily missions list
│           ├── PowerUpsPage.jsx    # Quick actions grid
│           ├── AlliesPage.jsx      # Support network
│           ├── ProgressPage.jsx    # XP, badges, streaks
│           └── BadGuysPage.jsx     # Personal challenges
```

## 🎯 Game Logic

### XP & Leveling
- Complete quest → +10-15 XP (based on difficulty)
- Use power-up → +3-5 XP
- 100 XP = Level Up
- Current level = floor(Total XP / 100) + 1

### Streak Calculation
- Complete 3+ quests in a day → Streak +1
- Consecutive days maintain streak
- Missing a day resets to 0
- Best streak stored separately

### Bad Guy Damage
- Each completed quest damages a random active bad guy
- Damage = Quest points (10-15)
- Bad guy defeated when health reaches 0
- Visual health bar shows progress

### Badge Unlocking
Badges unlock automatically when requirements are met:
- **First Quest** - Complete 1 quest (Common)
- **5-Day Warrior** - 5 day streak (Rare)
- **10-Day Legend** - 10 day streak (Epic)
- **Power-Up Master** - Use 20 power-ups (Rare)
- **Level 5 Hero** - Reach level 5 (Epic)
- **Social Butterfly** - Add 3 allies (Rare)
- **Bad Guy Slayer** - Defeat 1 bad guy (Epic)
- **Quest Collector** - Complete 50 quests (Legendary)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. The LifeQuest module is already integrated into the Healthcare app

2. Navigate to the Dashboard and click "LifeQuest Game" in the sidebar

### Usage

1. **Start Your Day**
   - View today's quests on the Home page
   - Complete real-life actions
   - Tap "Complete Quest" to earn XP

2. **Use Power-Ups**
   - Navigate to Power-Ups page
   - Click any power-up for instant XP boost
   - Track your most-used power-ups

3. **Track Progress**
   - View Progress page for XP, level, and badges
   - Monitor streak on Home or Progress page
   - Check badge collection

4. **Manage Challenges**
   - Add personal bad guys (anxiety, procrastination, etc.)
   - Watch health bars decrease as you complete quests
   - Celebrate defeating challenges

5. **Build Support Network**
   - Add allies on Allies page
   - Categorize by relationship
   - Track contact information

## 🎨 UI Features

- **Confetti animations** on quest completion
- **Gradient backgrounds** with animated effects
- **Responsive design** for mobile and desktop
- **Smooth page transitions** with Framer Motion
- **Interactive hover states** on all cards
- **Visual feedback** for all actions
- **Progress bars** with animated fills
- **Badge rarity** indicated by color gradients

## 💾 Data Persistence

All game data is automatically saved to localStorage:
- User progress (XP, level, streaks)
- Quest completion status
- Power-up usage counts
- Allies list
- Bad guys and their health
- Unlocked badges

Data persists across sessions and page refreshes.

## 🎯 Game Balancing

- **Easy quests**: 10 XP, simple daily actions
- **Medium quests**: 15 XP, more involved tasks
- **Power-ups**: 3-5 XP, instant actions
- **Level up**: 100 XP required per level
- **Bad guy health**: 100 HP, takes 7-10 quests to defeat

## 🔮 Future Enhancements

Potential additions:
- Daily quest reset at midnight
- Custom quest creation
- Social features (share progress)
- Achievement notifications
- Weekly challenges
- Customizable avatar
- Sound effects toggle
- Dark/light theme options
- Export progress data
- API integration for cloud sync

## 📱 Responsive Design

- **Mobile**: Single column layout, bottom navigation
- **Tablet**: Two-column grids, side navigation
- **Desktop**: Multi-column grids, persistent sidebar

## 🎮 Game Philosophy

LifeQuest is built on evidence-based principles:
- **Small wins** create momentum
- **Visual progress** motivates action
- **Gamification** reduces resistance to healthy habits
- **Social support** enhances resilience
- **Tracking** builds awareness
- **Celebration** reinforces positive behavior

## 🙏 Inspiration

Based on SuperBetter's gamification approach to mental health recovery, adapted with modern React architecture and enhanced visual design.

---

**Start your resilience journey today! Every quest completed is a step toward a stronger you.** 💪✨
