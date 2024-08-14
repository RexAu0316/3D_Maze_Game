// App.js
import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Player = () => {
  const playerRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          playerRef.current.position.z -= 0.1; // Move forward
          break;
        case 'ArrowDown':
          playerRef.current.position.z += 0.1; // Move backward
          break;
        case 'ArrowLeft':
          playerRef.current.position.x -= 0.1; // Move left
          break;
        case 'ArrowRight':
          playerRef.current.position.x += 0.1; // Move right
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <mesh ref={playerRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
      <OrbitControls />
      <Player />
    </Canvas>
  );
};

export default App;
