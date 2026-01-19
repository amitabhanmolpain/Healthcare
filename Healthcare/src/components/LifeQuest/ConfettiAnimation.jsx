import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ConfettiAnimation = ({ show, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        rotation: Math.random() * 360,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 6)],
        size: Math.random() * 10 + 5,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            y: -50, 
            x: particle.x,
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            y: window.innerHeight + 50, 
            rotate: particle.rotation + 360,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random(), 
            delay: particle.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="text-center">
          <div className="text-8xl mb-4">🎉</div>
          <p className="text-4xl font-bold text-white drop-shadow-lg">Quest Complete!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfettiAnimation;
