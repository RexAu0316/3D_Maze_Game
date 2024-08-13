window.initSimpleMazeGame = (React, assetsUrl) => {
  const { useRef } = React;
  const { useFrame } = window.ReactThreeFiber;
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

  function MazeGame() {
    const cameraRef = useRef();

    // Set the camera position to get an overview of the maze
    useFrame(() => {
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 5, 10); // Change Y to 5 and Z to 10 for an overview
        cameraRef.current.lookAt(0, 0, 0); // Look at the center of the maze
      }
    });

    return React.createElement(React.Fragment, null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement('perspectiveCamera', { ref: cameraRef }),
      React.createElement(Maze)
    );
  }

  return MazeGame;
};

console.log('3D Simple Maze game structure loaded');
