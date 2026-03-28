import { motion } from 'framer-motion';

const DamageNumber = ({ damage, onComplete }) => {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{ y: -100, opacity: 0, scale: 1.2 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="absolute left-1/2 top-1/2 text-3xl md:text-5xl font-bold pointer-events-none"
      style={{ translateX: '-50%' }}
    >
      <span className="text-red-500 drop-shadow-lg font-black">{damage}</span>
    </motion.div>
  );
};

export default DamageNumber;
