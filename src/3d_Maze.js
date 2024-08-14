window.initGame = (React, assetsUrl) => {
  const { useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const MazeWall = ({ position, scale }) => {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshStandardMaterial({ color: 'gray' }),
      className: 'maze-wall' // Adding class for identification
    });
  };

    const Coin = ({ position }) => {
    return React.createElement('mesh', {
      position: position,
      geometry: new THREE.CircleGeometry(0.5, 32), // Circular geometry for the coin
      material: new THREE.MeshStandardMaterial({ color: 'gold', side: THREE.DoubleSide }), // Gold color for the coin
      rotation: [0, 0, 0] // Rotate the coin to lie flat on the ground
    });
  };

  function Player({ wallBoxes, playerRef }) {
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
    if (playerRef.current) {
      const direction = new THREE.Vector3();
      if (keys.current['ArrowUp']) direction.z -= speed;
      if (keys.current['ArrowDown']) direction.z += speed;
      if (keys.current['ArrowLeft']) direction.x -= speed;
      if (keys.current['ArrowRight']) direction.x += speed;

      // Calculate the new position based on direction
      const nextPosition = [
        playerRef.current.position.x + direction.x,
        playerRef.current.position.y,
        playerRef.current.position.z + direction.z,
      ];

      // Check for collisions before updating the player's position
      if (!checkCollision(nextPosition)) {
        playerRef.current.position.set(nextPosition[0], nextPosition[1], nextPosition[2]);
      }
    }
  });

  return React.createElement('mesh', {
    ref: playerRef, // Use the passed playerRef
    position: [8.5, 0.5, -8.5],
    geometry: new THREE.BoxGeometry(0.5, 1, 0.5),
    material: new THREE.MeshStandardMaterial({ color: 'blue' })
  });
}

  function Camera({ playerRef }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (playerRef.current) {
      // Set the camera position relative to the player
      camera.position.set(
        playerRef.current.position.x,
        playerRef.current.position.y + 5, // Adjust the camera height above the player
        playerRef.current.position.z + 5  // Offset the camera behind the player
      );
      camera.lookAt(playerRef.current.position); // Make the camera look at the player
    }
  });

  return null;
}

  function Maze() {
    const wallHeight = 1; // Height of the walls
    const mazeLayout = [
      // ... (your original maze layout)
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const wallPositions = [];
    const wallBoxes = []; // Array to hold the bounding boxes

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) { // Wall
          const position = [
            colIndex - mazeLayout[0].length / 2 + 0.5, // Center the maze
            wallHeight / 2,
            rowIndex - mazeLayout.length / 2 + 0.5,
          ];
          wallPositions.push({
            position: position,
            scale: [1, wallHeight, 1]
          });

          // Create bounding box for collision detection
          const wallBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(...position),
            new THREE.Vector3(1, wallHeight, 1)
          );
          wallBoxes.push(wallBox);
        }
      });
    });
    
    const playerRef = useRef();
    // Pass the wallBoxes to the Player component
    return React.createElement(
    React.Fragment,
      null,
      wallPositions.map((wall, index) =>
        React.createElement(MazeWall, {
          key: index,
          position: wall.position,
          scale: wall.scale
        })
      ),
      React.createElement(Player, { wallBoxes, playerRef }), // Pass playerRef to Player
      React.createElement(Coin, { position: [-8.5, 0.5, 10.5] })
    );
  }


  function MazeRunnerGame() {
  const playerRef = useRef(); // Create a playerRef for the Camera

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Camera, { playerRef }), // Pass playerRef to Camera
    React.createElement('ambientLight', { intensity: 0.5 }),
    React.createElement('pointLight', { position: [10, 10, 10] }),
    React.createElement(Maze, { playerRef }) // Pass playerRef to Maze
  );
}

  return MazeRunnerGame;
};

console.log('3D Maze Runner game script loaded');
