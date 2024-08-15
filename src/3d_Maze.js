import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';

// Wall Component
const Wall = ({ position }) => {
  const wallRef = useRef();
  return (
    <mesh ref={wallRef} position={position}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="brown" />
    </mesh>
  );
};

// Collectible Component
const Collectible = ({ position, onCollect }) => {
  const collectibleRef = useRef();
  return (
    <mesh ref={collectibleRef} position={position} onClick={onCollect}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="gold" />
    </mesh>
  );
};

// Player Component
const Player = () => {
  const playerRef = useRef();
  const { camera } = useThree();
  const [position, setPosition] = useState([0, 1, 0]);

  useFrame(() => {
    if (playerRef.current) {
      camera.position.copy(playerRef.current.position.clone().add(new THREE.Vector3(0, 2, -5)));
      camera.lookAt(playerRef.current.position);
    }
  });

  const handleKeyDown = (event) => {
    const speed = 0.1;
    const newPosition = [...position];

    switch (event.key) {
      case 'ArrowUp':
        newPosition[2] -= speed;
        break;
      case 'ArrowDown':
        newPosition[2] += speed;
        break;
      case 'ArrowLeft':
        newPosition[0] -= speed;
        break;
      case 'ArrowRight':
        newPosition[0] += speed;
        break;
      default:
        break;
    }

    setPosition(newPosition);
    playerRef.current.position.set(...newPosition);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [position]);

  return (
    <mesh ref={playerRef} position={position}>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

// Mouse Controlled Camera Component
const MouseControlledCamera = () => {
  const { camera } = useThree();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const sensitivity = 0.1;

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      setIsMouseDown(true);
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    }
  };

  const handleMouseUp = () => setIsMouseDown(false);

  const handleMouseMove = (event) => {
    if (isMouseDown) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      camera.rotation.y -= deltaX * sensitivity;
      camera.rotation.x -= deltaY * sensitivity;

      // Constrain camera rotation
      camera.rotation.x = Math.max(Math.min(camera.rotation.x, Math.PI / 2), -Math.PI / 2);

      setMouseX(event.clientX);
      setMouseY(event.clientY);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMouseDown]);

  return null;
};

// Maze Component
const Maze = () => {
  const walls = [
    [-3, 1, 0], [3, 1, 0],
    [0, 1, -3], [0, 1, 3],
    [-2, 1, -2], [2, 1, 2],
    [-1, 1, -1], [1, 1, 1],
  ];

  const [collectibles, setCollectibles] = useState([
    [0, 1, -1], [1, 1, 2],
    [2, 1, 0], [-1, 1, 1]
  ]);

  const collectItem = (position) => {
    setCollectibles(current => current.filter(item => item[0] !== position[0] || item[2] !== position[2]));
  };

  return (
    <>
      {walls.map((pos, index) => <Wall key={index} position={pos} />)}
      {collectibles.map((pos, index) => (
        <Collectible key={index} position={pos} onCollect={() => collectItem(pos)} />
      ))}
      <Player />
    </>
  );
};

// Camera Component
const Camera = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
};

// Main Game Component
const MazeGame = () => {
  return (
    <>
      <Camera />
      <MouseControlledCamera />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Maze />
    </>
  );
};

// Render the MazeGame component inside a Canvas
export default function App() {
  return (
    <Canvas>
      <MazeGame />
    </Canvas>
  );
}
