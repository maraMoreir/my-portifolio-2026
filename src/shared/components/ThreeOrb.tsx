import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';

const AnimatedOrb: React.FC = () => {
  return (
    <Sphere args={[1, 64, 64]}>
      <meshStandardMaterial
        color="#7B2CFF"
        emissive="#B388FF"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
        wireframe={false}
      />
    </Sphere>
  );
};

const Particles: React.FC = () => {
  const particleCount = 50;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#B388FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export const ThreeOrb: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ width: '100%', height: '500px' }}
    >
      <Suspense fallback={<div>Loading 3D...</div>}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4DA3FF" />
          
          <AnimatedOrb />
          <Particles />
          
          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.5}
            enablePan={false}
          />
        </Canvas>
      </Suspense>
    </motion.div>
  );
};
