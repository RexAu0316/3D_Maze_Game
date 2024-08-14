import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// MazeWall Component
function MazeWall({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

// Coin Component
function Coin({ position }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
      <meshStandardMaterial color="gold" />
    </mesh>
  );
}

// Player Component
const Player = React.forwardRef(({ wallBoxes }, ref) => {
  const speed = 0.1;
  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.key] = true;
    };

    const handleKeyUp = (event) => {
      keys.current[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const checkCollision = (nextPosition) => {
    const playerBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(...nextPosition),
      new THREE.Vector3(0.5, 1, 0.5)
    );

    return wallBoxes.some(wallBox => playerBox.intersectsBox(wallBox));
  };

  useFrame(() => {
    if (ref.current) {
      const direction = new THREE.Vector3();
      if (keys.current['ArrowUp']) direction.z -= speed;
      if (keys.current['ArrowDown']) direction.z += speed;
      if (keys.current['ArrowLeft']) direction.x -= speed;
      if (keys.current['ArrowRight']) direction.x += speed;

      const nextPosition = [
        ref.current.position.x + direction.x,
        ref.current.position.y,
        ref.current.position.z + direction.z,
      ];

      if (!checkCollision(nextPosition)) {
        ref.current.position.set(nextPosition[0], nextPosition[1], nextPosition[2]);
      }
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.5, 0]}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
});

// ThirdPersonCamera Component
function ThirdPersonCamera({ playerRef }) {
  const { camera } = useThree();
  const offset = new THREE.Vector3(0, 5, -10); // Camera position offset

  useFrame(() => {
    if (playerRef.current) {
      camera.position.copy(playerRef.current.position).add(offset);
      camera.lookAt(playerRef.current.position);
    }
  });

  return null; // No visible output
}

// Maze Component
function Maze() {
  const mazeLayout = [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ];

  const walls = [];
  const wallBoxes = [];

  mazeLayout.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) {
        const position = [colIndex, 0.5, -rowIndex];
        walls.push(<MazeWall key={`${rowIndex}-${colIndex}`} position={position} />);
        wallBoxes.push(new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...position),
          new THREE.Vector3(1, 1, 1) // Size of the wall
        ));
      }
    });
  });

  return <group>{walls}</group>;
}

// Main Game Component
function MazeRunnerGame() {
  const playerRef = useRef();
  const wallBoxes = []; // This will hold the wall boxes for collision detection

  return (
    <>
      <ThirdPersonCamera playerRef={playerRef} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Maze wallBoxes={wallBoxes} />
      <Player wallBoxes={wallBoxes} ref={playerRef} />
    </>
  );
}

// Main Application
function App() {
  return (
    <Canvas>
      <MazeRunnerGame />
    </Canvas>
  );
}

export default App;
