import React from 'react';
import { motion } from 'framer-motion';
import profilePhoto from '../../assets/unnamed.jpg';

const orbitDots = [
  { top: '10%', left: '50%' },
  { top: '28%', left: '88%' },
  { top: '72%', left: '84%' },
  { top: '90%', left: '50%' },
  { top: '72%', left: '16%' },
  { top: '28%', left: '12%' },
];

export const ThreeOrb: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        width: '100%',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 'min(100%, 520px)',
          height: '100%',
          maxHeight: '500px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: '86%',
            height: '86%',
            borderRadius: '50%',
            border: '2px solid rgba(179, 136, 255, 0.65)',
            boxShadow: '0 0 28px rgba(123, 44, 255, 0.35)',
          }}
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: '95%',
            height: '95%',
            borderRadius: '50%',
            border: '1px dashed rgba(123, 44, 255, 0.55)',
          }}
        >
          {orbitDots.map((dot, index) => (
            <span
              key={`${dot.top}-${dot.left}-${index}`}
              style={{
                position: 'absolute',
                top: dot.top,
                left: dot.left,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#B388FF',
                boxShadow: '0 0 12px rgba(179, 136, 255, 0.9)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </motion.div>

        <motion.img
          src={profilePhoto}
          alt="Foto profissional"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            width: '70%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
            zIndex: 2,
          }}
        />
      </div>
    </motion.div>
  );
};
