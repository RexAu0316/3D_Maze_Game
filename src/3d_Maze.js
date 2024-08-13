window.initMazeRunner = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const Wall = ({ position, scale }) => {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: React.createElement('boxGeometry', {}),
      material: React.createElement('meshStandardMaterial', { color: 'gray' }),
    });
  };

  function Maze() {
    return React.createElement(React.Fragment, null,
      React.createElement(Wall, { position: [0, 0, 0], scale: [1, 1, 10] }), // Center wall
      React.createElement(Wall, { position: [-5, 0, -2], scale: [10, 1, 0.5] }), // Horizontal wall
      React.createElement(Wall, { position: [-3, 0, 2], scale: [3, 1, 0.5] }), // Vertical wall
      React.createElement(Wall, { position: [-1, 0, 0], scale: [1, 1, 3] }), // Short wall
      React.createElement(Wall, { position: [3, 0, -2], scale: [3, 1, 0.5] }), // Right wall
      React.createElement(Wall, { position: [-3, 0, -4], scale: [0.5, 1, 4] }), // Left vertical wall
      React.createElement(Wall, { position: [-1, 0, -6], scale: [3, 1, 0.5] }), // Bottom wall
      React.createElement(Wall, { position: [5, 0, -4], scale: [0.5, 1, 4] }), // Right vertical wall
      React.createElement(Wall, { position: [2, 0, -6], scale: [3, 1, 0.5] }), // Another bottom wall
      React.createElement(Wall, { position: [1, 0, -1], scale: [0.5, 1, 2] }), // Middle wall
      React.createElement(Wall, { position: [0, 0, -3], scale: [3, 1, 0.5] })  // Horizontal wall
    );
  }

  function Player() {
    const playerRef = useRef();
    const { camera } = useThree();

    useFrame(() => {
      if (playerRef.current) {
        // Update player position based on camera position
        playerRef.current.position.copy(camera.position);
      }
    });

    return React.createElement('mesh', {
      ref: playerRef,
      position: [0, 1, 5],
      geometry: React.createElement('sphereGeometry', { args: [0.5, 32, 32] }),
      material: React.createElement('meshStandardMaterial', { color: 'blue' }),
    });
  }

  function Camera() {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(0, 5, 10); // Adjust camera position
      camera.lookAt(0, 0, 0); // Look at the center of the maze
    }, [camera]);

    return null;
  }

  function MazeRunner() {
    return React.createElement(React.Fragment, null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player)
    );
  }

  return MazeRunner;
};

console.log('3D Maze Runner game script loaded');
