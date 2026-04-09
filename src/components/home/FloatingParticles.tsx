'use client'

import { motion } from 'framer-motion';

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-amber/30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -80 - Math.random() * 120, 0],
          x: [0, (Math.random() - 0.5) * 60, 0],
          opacity: [0, 0.8, 0],
          scale: [0, 1 + Math.random(), 0],
        }}
        transition={{
          duration: 4 + Math.random() * 6,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export default FloatingParticles;
