import { motion } from 'framer-motion';

const DoomsdayDragon = ({ isHit, isDefeated }) => {
  return (
    <motion.div
      className="relative w-48 h-48"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDefeated ? 0 : isHit ? 0.9 : 1,
        opacity: isDefeated ? 0 : 1,
        y: isHit ? -10 : [0, -20, 0],
        rotate: isHit ? [0, -10, 10, -10, 0] : 0
      }}
      transition={{
        y: { repeat: isHit ? 0 : Infinity, duration: 2, ease: "easeInOut" },
        rotate: { duration: 0.5 },
        scale: { duration: isDefeated ? 0.5 : 0.3 },
        opacity: { duration: isDefeated ? 0.5 : 0.3 }
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="dragonGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Body */}
        <ellipse cx="100" cy="120" rx="40" ry="50" fill="url(#dragonGradient)" filter="url(#dragonGlow)" />
        
        {/* Head */}
        <circle cx="100" cy="70" r="35" fill="url(#dragonGradient)" filter="url(#dragonGlow)" />
        
        {/* Horns */}
        <path d="M 80 50 L 70 30 L 85 45" fill="#7c3aed" />
        <path d="M 120 50 L 130 30 L 115 45" fill="#7c3aed" />
        
        {/* Eyes */}
        <circle cx="90" cy="65" r="5" fill={isHit ? "#fbbf24" : "#fef3c7"} />
        <circle cx="110" cy="65" r="5" fill={isHit ? "#fbbf24" : "#fef3c7"} />
        
        {/* Mouth */}
        <path d="M 85 80 Q 100 85 115 80" stroke="#dc2626" strokeWidth="3" fill="none" />
        
        {/* Wings */}
        <path d="M 60 100 L 30 80 L 40 120 Z" fill="#a855f7" opacity="0.7" />
        <path d="M 140 100 L 170 80 L 160 120 Z" fill="#a855f7" opacity="0.7" />
        
        {/* Tail */}
        <path d="M 100 160 Q 120 180 110 190" stroke="#9333ea" strokeWidth="8" fill="none" strokeLinecap="round" />
      </svg>
      
      <motion.div
        className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"
        animate={{
          scale: isHit ? [1, 1.5, 1] : [1, 1.2, 1],
          opacity: isHit ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-purple-900/80 backdrop-blur-md px-4 py-1 rounded-full border border-purple-500/50">
          <span className="text-white font-bold text-sm">Doomsday Dragon</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoomsdayDragon;
