import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Camera component
function Camera({ playerRef }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    // Initialize OrbitControls
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true; // Smooth movement
    controls.dampingFactor = 0.25;
    controls.enableZoom = true; // Allow zooming
    controls.enablePan = false; // Disable panning
    controls.minDistance = 2; // Minimum zoom distance
    controls.maxDistance = 10; // Maximum zoom distance

    controlsRef.current = controls; // Store controls reference
    return () => {
      controls.dispose(); // Clean up on unmount
    };
  }, [camera, gl]);

  useFrame(() => {
    if (playerRef.current) {
      // Update the controls target to follow the player
      controlsRef.current.target.copy(playerRef.current.position);
      controlsRef.current.update();
    }
  });

  return null;
}

// Player component
function Player({ playerRef }) {
  const speed = 0.1; // Movement speed
  const keys = { w: false, a: false, s: false, d: false };

  const handleKeyDown = (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = true;
    }
  };

  const handleKeyUp = (event) => {
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = false;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (playerRef.current) {
      const direction = new THREE.Vector3();

      if (keys.w) direction.z -= speed;
      if (keys.s) direction.z += speed;
      if (keys.a) direction.x -= speed;
      if (keys.d) direction.x += speed;

      // Normalize direction to maintain consistent speed
      direction.normalize();
      playerRef.current.position.add(direction);
    }
  });

  return (
    <mesh ref={playerRef} position={[0, 0, 0]}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

// Function to create the maze
function createMaze() {
  // Maze layout - 1 represents a wall, 0 represents open space
  const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const walls = [];
  const wallHeight = 1; // Height of the wall
  const wallThickness = 1;

  mazeLayout.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) {
        // Create a wall mesh at y = wallHeight / 2 to place it on the ground
        const wall = (
          <mesh
            position={[colIndex, wallHeight / 2, -rowIndex]}
            key={`wall-${rowIndex}-${colIndex}`}
          >
            <boxGeometry args={[wallThickness, wallHeight, wallThickness]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        );
        walls.push(wall);
      }
    });
  });

  return walls;
}

// Main Game Component
function MazeRunnerGame() {
  const playerRef = useRef();

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Camera playerRef={playerRef} />
      <Player playerRef={playerRef} />
      {createMaze()}
    </Canvas>
  );
}

export default MazeRunnerGame;
