import { motion } from 'framer-motion';
import { Brain, Heart, Shield, Sparkles } from 'lucide-react';
import styles from '../style';

const MentalHealthGames = () => {
  const conditions = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Depression",
      description: "Combat negative thoughts and build positive mental patterns through interactive cognitive exercises.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "PTSD",
      description: "Process trauma safely with guided scenarios and develop healthy coping mechanisms.",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Anxiety",
      description: "Learn to identify triggers and practice mindfulness techniques in a supportive environment.",
      gradient: "from-green-600 to-teal-600"
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Hopelessness",
      description: "Rebuild confidence and discover your inner strength through empowering gameplay.",
      gradient: "from-orange-600 to-yellow-600"
    }
  ];

  return (
    <section className={`${styles.paddingY} ${styles.paddingX} relative`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-poppins font-semibold text-[48px] text-white leading-tight mb-4">
            Healing Through
            <span className="text-gradient"> Gaming</span>
          </h2>
          <p className={`${styles.paragraph} text-dimWhite max-w-3xl mx-auto text-lg`}>
            We help cure mental health conditions using scientifically-designed therapeutic games. 
            Our interactive approach combines cognitive behavioral therapy with engaging gameplay 
            to make recovery enjoyable and effective.
          </p>
        </motion.div>

        {/* Conditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conditions.map((condition, index) => (
            <motion.div
              key={condition.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="h-full bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
                {/* Icon with Gradient Background */}
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${condition.gradient} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {condition.icon}
                </div>

                {/* Title */}
                <h3 className="font-poppins font-semibold text-2xl text-white mb-4">
                  {condition.title}
                </h3>

                {/* Description */}
                <p className="text-dimWhite text-sm leading-relaxed">
                  {condition.description}
                </p>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${condition.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <p className="text-white text-lg mb-4 font-medium">
              🎮 Start Your Healing Journey Today
            </p>
            <p className="text-dimWhite text-sm max-w-2xl">
              Our games are designed by mental health professionals and backed by cognitive 
              behavioral therapy principles. Join thousands who have found hope through our platform.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[40%] h-[40%] purple__gradient opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] blue__gradient opacity-30 pointer-events-none" />
    </section>
  );
};

export default MentalHealthGames;
