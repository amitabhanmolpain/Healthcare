import { motion } from 'framer-motion';

const SelfDoubtSlime = ({ isHit, isDefeated }) => {
  return (
    <motion.div
      className="relative w-48 h-48"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDefeated ? 0 : isHit ? 0.9 : 1,
        opacity: isDefeated ? 0 : 1,
        y: isHit ? -10 : [0, -15, 0],
        rotate: isHit ? [0, -8, 8, -8, 0] : 0
      }}
      transition={{
        y: { repeat: isHit ? 0 : Infinity, duration: 2.5, ease: "easeInOut" },
        rotate: { duration: 0.5 },
        scale: { duration: isDefeated ? 0.5 : 0.3 },
        opacity: { duration: isDefeated ? 0.5 : 0.3 }
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="slimeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <filter id="slimeGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main body - blob shape */}
        <ellipse cx="100" cy="120" rx="60" ry="50" fill="url(#slimeGradient)" filter="url(#slimeGlow)" opacity="0.9" />
        
        {/* Upper blob */}
        <ellipse cx="100" cy="80" rx="50" ry="40" fill="url(#slimeGradient)" filter="url(#slimeGlow)" opacity="0.8" />
        
        {/* Eyes */}
        <ellipse cx="85" cy="75" rx="8" ry="12" fill="#065f46" />
        <ellipse cx="115" cy="75" rx="8" ry="12" fill="#065f46" />
        
        {/* Eye highlights */}
        <circle cx="87" cy="72" r="3" fill={isHit ? "#fbbf24" : "#d1fae5"} />
        <circle cx="117" cy="72" r="3" fill={isHit ? "#fbbf24" : "#d1fae5"} />
        
        {/* Mouth - wavy sad line */}
        <path d="M 85 95 Q 100 90 115 95" stroke="#065f46" strokeWidth="2" fill="none" />
        
        {/* Drips */}
        <ellipse cx="70" cy="145" rx="8" ry="12" fill="url(#slimeGradient)" opacity="0.7" />
        <ellipse cx="100" cy="155" rx="6" ry="10" fill="url(#slimeGradient)" opacity="0.7" />
        <ellipse cx="130" cy="145" rx="8" ry="12" fill="url(#slimeGradient)" opacity="0.7" />
      </svg>
      
      <motion.div
        className="absolute inset-0 rounded-full bg-green-500/20 blur-xl"
        animate={{
          scale: isHit ? [1, 1.5, 1] : [1, 1.3, 1],
          opacity: isHit ? [0.5, 0.8, 0.5] : [0.3, 0.6, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
      
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-green-900/80 backdrop-blur-md px-4 py-1 rounded-full border border-green-500/50">
          <span className="text-white font-bold text-sm">Self-Doubt Slime</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SelfDoubtSlime;
