import { motion } from 'framer-motion';

const AnxietyGhost = ({ isHit, isDefeated }) => {
  return (
    <motion.div
      className="relative w-48 h-48"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDefeated ? 0 : isHit ? 0.9 : 1,
        opacity: isDefeated ? 0 : isHit ? 0.8 : [0.85, 1, 0.85],
        y: isHit ? -10 : [0, -25, 0],
        rotate: isHit ? [0, 5, -5, 5, 0] : 0
      }}
      transition={{
        y: { repeat: isHit ? 0 : Infinity, duration: 3, ease: "easeInOut" },
        opacity: { repeat: isHit ? 0 : Infinity, duration: 2 },
        rotate: { duration: 0.5 },
        scale: { duration: isDefeated ? 0.5 : 0.3 }
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="ghostGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main ghost body */}
        <ellipse cx="100" cy="90" rx="45" ry="50" fill="url(#ghostGradient)" filter="url(#ghostGlow)" opacity="0.9" />
        
        {/* Ghost tail with waves */}
        <path 
          d="M 55 130 Q 60 140 65 130 Q 75 145 85 130 Q 95 145 100 130 Q 105 145 115 130 Q 125 145 135 130 Q 140 140 145 130 L 145 90 L 55 90 Z" 
          fill="url(#ghostGradient)" 
          filter="url(#ghostGlow)"
          opacity="0.9"
        />
        
        {/* Eyes */}
        <ellipse cx="85" cy="80" rx="10" ry="15" fill="#1e3a8a" />
        <ellipse cx="115" cy="80" rx="10" ry="15" fill="#1e3a8a" />
        
        {/* Eye highlights */}
        <circle cx="87" cy="77" r="4" fill={isHit ? "#fbbf24" : "#dbeafe"} />
        <circle cx="117" cy="77" r="4" fill={isHit ? "#fbbf24" : "#dbeafe"} />
        
        {/* Mouth - worried O shape */}
        <ellipse cx="100" cy="100" rx="8" ry="10" fill="#1e3a8a" />
      </svg>
      
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
        animate={{
          scale: isHit ? [1, 1.5, 1] : [1, 1.3, 1],
          opacity: isHit ? [0.5, 0.8, 0.5] : [0.3, 0.6, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 20}%`
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + i * 0.3,
            delay: i * 0.2
          }}
        />
      ))}
      
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-blue-900/80 backdrop-blur-md px-4 py-1 rounded-full border border-blue-500/50">
          <span className="text-white font-bold text-sm">Anxiety Ghost</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnxietyGhost;
