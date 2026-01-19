import { motion } from 'framer-motion';

const HopelessnessTroll = ({ isHit, isDefeated }) => {
  return (
    <motion.div
      className="relative w-48 h-48"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDefeated ? 0 : isHit ? 0.9 : 1,
        opacity: isDefeated ? 0 : 1,
        y: isHit ? -10 : 0,
        rotate: isHit ? [0, -8, 8, -8, 0] : [0, -2, 2, -2, 0]
      }}
      transition={{
        rotate: isHit 
          ? { duration: 0.5 } 
          : { repeat: Infinity, duration: 4, ease: "easeInOut" },
        scale: { duration: isDefeated ? 0.5 : 0.3 },
        opacity: { duration: isDefeated ? 0.5 : 0.3 }
      }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="trollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <filter id="trollGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Body */}
        <ellipse cx="100" cy="130" rx="50" ry="45" fill="url(#trollGradient)" filter="url(#trollGlow)" />
        
        {/* Head */}
        <ellipse cx="100" cy="75" rx="40" ry="45" fill="url(#trollGradient)" filter="url(#trollGlow)" />
        
        {/* Ears */}
        <ellipse cx="65" cy="70" rx="12" ry="18" fill="#52525b" />
        <ellipse cx="135" cy="70" rx="12" ry="18" fill="#52525b" />
        
        {/* Hair spikes */}
        <path d="M 70 45 L 65 25 L 75 40" fill="#3f3f46" />
        <path d="M 90 40 L 90 20 L 95 38" fill="#3f3f46" />
        <path d="M 110 40 L 110 20 L 105 38" fill="#3f3f46" />
        <path d="M 130 45 L 135 25 L 125 40" fill="#3f3f46" />
        
        {/* Eyes - droopy and sad */}
        <ellipse cx="85" cy="70" rx="8" ry="10" fill="#1f2937" />
        <ellipse cx="115" cy="70" rx="8" ry="10" fill="#1f2937" />
        
        {/* Eye bags */}
        <ellipse cx="85" cy="78" rx="10" ry="4" fill="#52525b" opacity="0.5" />
        <ellipse cx="115" cy="78" rx="10" ry="4" fill="#52525b" opacity="0.5" />
        
        {/* Pupils */}
        <circle cx="85" cy="72" r="3" fill={isHit ? "#fbbf24" : "#4b5563"} />
        <circle cx="115" cy="72" r="3" fill={isHit ? "#fbbf24" : "#4b5563"} />
        
        {/* Frown */}
        <path d="M 80 90 Q 100 85 120 90" stroke="#1f2937" strokeWidth="3" fill="none" />
        
        {/* Arms */}
        <ellipse cx="60" cy="120" rx="15" ry="40" fill="#52525b" />
        <ellipse cx="140" cy="120" rx="15" ry="40" fill="#52525b" />
      </svg>
      
      <motion.div
        className="absolute inset-0 rounded-full bg-gray-700/20 blur-xl"
        animate={{
          scale: isHit ? [1, 1.5, 1] : [1, 1.2, 1],
          opacity: isHit ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3]
        }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
      
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-4 bg-gray-500/20 rounded-full blur-sm"
          style={{
            left: `${10 + i * 25}%`,
            top: `${40 + (i % 2) * 30}%`
          }}
          animate={{
            x: [-5, 5, -5],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + i * 0.5,
            delay: i * 0.3
          }}
        />
      ))}
      
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-gray-900/80 backdrop-blur-md px-4 py-1 rounded-full border border-gray-500/50">
          <span className="text-white font-bold text-sm">Hopelessness Troll</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HopelessnessTroll;
