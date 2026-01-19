# 🎮 Thought Battle Arena

A **fun, visual, gamified React application** designed to help users fight depression and negative thoughts through **Cognitive Behavioral Therapy (CBT)** in an engaging, game-like experience.

![Thought Battle Arena](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-FF0080?style=for-the-badge&logo=framer)
![Zustand](https://img.shields.io/badge/Zustand-Latest-000000?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 🌟 Features

### 🎯 Core Gameplay
- **4 Animated Enemy Types**: Doomsday Dragon, Self-Doubt Slime, Anxiety Ghost, Hopelessness Troll
- **8 Battle Scenarios**: Real-life situations with negative thoughts to defeat
- **CBT-Based Responses**: Learn evidence-based mental health techniques while playing
- **Real-Time Animations**: Enemies float, react when hit, and explode on defeat

### 🏆 Progression System
- **XP System**: Earn +20 XP for correct answers, +5 XP for attempts
- **Level Progression**: Every 100 XP = Level Up with animated celebrations
- **Win Streaks**: Track consecutive victories with visual indicators
- **Badge System**: Unlock achievements like "Mind Warrior" and "Battle Master"

### 🎨 Visual Design
- **Cartoon Fantasy Theme**: Friendly, calming art style (not scary!)
- **Soft Color Palette**: Purple, pink, blue gradients for mental-health-friendly vibes
- **Framer Motion Animations**: Smooth entrance, exit, hover, and battle effects
- **Confetti Effects**: Victory celebrations with animated particles
- **Floating Elements**: Dynamic background with animated stars and sparkles

### 🔊 Sound Effects
- **Battle Sounds**: Hit, victory, and defeat audio feedback
- **Victory Fanfare**: Multi-tone celebration music
- **Mute Toggle**: Control sound on/off with a single click
- **Web Audio API**: Pure JavaScript audio (no external files needed)

### 💾 State Management
- **Zustand Store**: Global state for XP, levels, streaks, badges
- **Persistent Stats**: Track total battles, victories, and highest streak
- **Scenario Rotation**: 8 scenarios loop infinitely for continued practice

---

## 🚀 Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd Healthcare

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:5173`

---

## 🎮 How to Play

### Step-by-Step Gameplay

1. **Click "Start Battle"** 
   - Enter the game arena from the welcome screen

2. **Face the Monster** 
   - A negative thought appears as an animated enemy
   - Read the situation and the monster's negative thought attack

3. **Choose Your Response Weapon** 
   - Select from 4 response options (A, B, C, D)
   - One is the healthy CBT-based response

4. **Battle Results**
   - ✅ **Correct**: Enemy explodes, +20 XP, confetti animation
   - ❌ **Wrong**: +5 XP, learn why and see the better response

5. **Track Progress**
   - Watch your XP bar fill up
   - Level up every 100 XP
   - Build win streaks for badges

6. **Keep Battling**
   - Click "Next Battle" to continue
   - Fight all 8 scenarios on repeat
   - Earn badges at milestones

---

## 🧠 Mental Health Concepts (CBT)

The game teaches these **Cognitive Behavioral Therapy** techniques:

| Cognitive Distortion | What It Means | Healthy Response |
|---------------------|---------------|------------------|
| **All-or-Nothing Thinking** | "One failure = I'm a complete failure" | One event doesn't define my entire worth |
| **Catastrophizing** | "This mistake will ruin everything" | This is one small setback, not a disaster |
| **Mind Reading** | "Everyone thinks I'm incompetent" | I can't know what others think without asking |
| **Overgeneralization** | "Nobody likes me" (after one rejection) | One person's opinion ≠ everyone's opinion |
| **Personalization** | "My friend is upset, it must be my fault" | Their mood may have nothing to do with me |
| **Fortune Telling** | "I'll always feel this way" | Feelings change, this is temporary |
| **Labeling** | "I'm broken/useless/a failure" | I'm a person experiencing challenges |
| **Comparison** | "Everyone is succeeding except me" | Social media shows highlights, not reality |

---

## 🏗️ Project Structure

```
Healthcare/
├── src/
│   ├── store/
│   │   └── gameStore.js              # Zustand state management
│   ├── components/
│   │   └── Game/
│   │       ├── BattleArena.jsx       # Main game screen
│   │       ├── GameStart.jsx         # Welcome screen
│   │       ├── Enemies/
│   │       │   ├── DoomsdayDragon.jsx
│   │       │   ├── SelfDoubtSlime.jsx
│   │       │   ├── AnxietyGhost.jsx
│   │       │   └── HopelessnessTroll.jsx
│   │       └── UI/
│   │           ├── XPBar.jsx         # Animated XP progress bar
│   │           ├── LevelBadge.jsx    # Rotating level display
│   │           ├── ChoiceButton.jsx  # Answer option buttons
│   │           └── FeedbackPopup.jsx # Victory/defeat modal
│   ├── ThoughtBattleGame.jsx         # Main game component
│   └── main.jsx                      # Entry point
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library |
| **Vite** | Build tool & dev server |
| **Framer Motion** | Animations & transitions |
| **Zustand** | State management |
| **Tailwind CSS** | Styling & responsive design |
| **Lucide React** | Icon library |
| **Web Audio API** | Sound effects |

---

## 🎯 Game Mechanics

### XP & Leveling
```javascript
Correct Answer: +20 XP
Wrong Answer: +5 XP (still learning!)
Level Formula: Level = floor(XP / 100) + 1
```

### Badge Unlocks
| Badge | Requirement |
|-------|------------|
| **Mind Warrior** | 5 win streak |
| **Thought Champion** | 10 win streak |
| **10 Victories** | Win 10 battles |
| **Battle Master** | Win 25 battles |
| **Level 5 Warrior** | Reach level 5 |

### Enemies
Each enemy represents a specific mental health challenge:

1. **Doomsday Dragon** 🐲 - Catastrophizing
2. **Self-Doubt Slime** 💧 - Low self-esteem
3. **Anxiety Ghost** 👻 - Excessive worry
4. **Hopelessness Troll** 🧌 - Depression & helplessness

---

## 🎨 Design Philosophy

### Why This Matters
- **Gamification**: Makes mental health learning engaging and fun
- **CBT Integration**: Evidence-based therapy techniques in game format
- **Positive Reinforcement**: XP and badges reward learning
- **Visual Appeal**: Cartoon enemies are silly, not scary (reduces anxiety)
- **Immediate Feedback**: Learn why each response is healthy or unhealthy

### Color Psychology
- **Purple/Pink**: Creativity, calmness, mental wellness
- **Blue**: Trust, stability, peace
- **Green (correct)**: Success, growth, health
- **Red (incorrect)**: Warning, learning opportunity

---

## 🔧 Customization

### Add New Scenarios
Edit `src/store/gameStore.js`:

```javascript
scenarios: [
  {
    id: 9,
    enemy: 'anxiety-ghost',
    situation: "Your situation here",
    negativeThought: "The negative thought",
    options: [
      { text: "Option A", isCorrect: false, feedback: "Why not" },
      { text: "Option B", isCorrect: true, feedback: "Why yes" },
      // ... more options
    ]
  }
]
```

### Create New Enemies
1. Create `src/components/Game/Enemies/YourEnemy.jsx`
2. Use Framer Motion for animations
3. Add to `BattleArena.jsx` switch statement

---

## 📊 Stats Tracking

The game tracks:
- **Total XP** earned
- **Current Level**
- **Win Streak** (consecutive victories)
- **Total Battles** fought
- **Total Victories** achieved
- **Badges** unlocked
- **Highest Streak** ever

---

## 🎵 Sound Design

Sound effects are generated using **Web Audio API**:
- **Hit Sound**: 800Hz beep (0.1s)
- **Victory**: 4-note fanfare (C5, E5, G5, C6)
- **Wrong**: 200Hz low tone (0.3s)

Toggle sound with the speaker icon in the top-right corner.

---

## 🌐 Browser Support

Works on all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS/Android)

---

## 🤝 Contributing

Want to add more features? Ideas:
- [ ] More enemy types
- [ ] Boss battles every 10 scenarios
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Meditation mini-games
- [ ] Progress export/import

---

## 📜 License

This project is built for mental health education and gamification.

---

## 🧠 Mental Health Resources

If you or someone you know needs immediate help:
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International**: Find resources at [findahelpline.com](https://findahelpline.com)

---

## 🎉 Acknowledgments

- **CBT Techniques**: Based on evidence-based cognitive behavioral therapy
- **Game Design**: Inspired by educational games and mental health apps
- **Art Style**: Friendly cartoon aesthetic for mental wellness

---

## 📞 Contact

Built with ❤️ for mental health awareness and CBT education.

**Remember**: This game is educational and supportive, but not a replacement for professional mental health treatment. If you're struggling, please reach out to a mental health professional.

---

### 🎮 Ready to Battle Your Thoughts? Let's Go! 💪🧠⚔️
