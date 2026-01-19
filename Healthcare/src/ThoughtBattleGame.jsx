import { useEffect } from 'react';
import GameStart from './components/Game/GameStart';
import BattleArena from './components/Game/BattleArena';
import useGameStore from './store/gameStore';

function ThoughtBattleGame({ onExit }) {
  const { isPlaying, startGame, exitGame } = useGameStore();

  const handleExit = () => {
    exitGame();
    if (onExit) {
      onExit();
    }
  };

  if (!isPlaying) {
    return <GameStart onStart={startGame} onExit={onExit} />;
  }

  return <BattleArena onExit={handleExit} />;
}

export default ThoughtBattleGame;
