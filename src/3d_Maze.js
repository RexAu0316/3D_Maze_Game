window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

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

    // Set player's initial position at y = 0.5 to match wall height
    return React.createElement('mesh', { ref: playerRef, position: [0, 0.5, 0] },
      React.createElement('boxGeometry', { args: [0.5, 1, 0.5] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function CameraFollow({ playerRef }) {
    const { camera } = useThree();
    const offset = new THREE.Vector3(0, 5, 10); // Offset from the player
    const targetPosition = new THREE.Vector3();

    useFrame(() => {
      if (playerRef.current) {
        // Set the target position based on the player's position and the offset
        targetPosition.copy(playerRef.current.position).add(offset);
        
        // Smoothly interpolate the camera position towards the target position
        camera.position.lerp(targetPosition, 0.1); // Smoothness factor
        camera.lookAt(playerRef.current.position);
      }
    });

    return null; // Nothing to render
  }

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
    
    const wallHeight = 1;
    const wallThickness = 1;

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          // Create a wall mesh positioned at y = wallHeight / 2
          const wall = React.createElement('mesh', {
            position: [colIndex, wallHeight / 2, -rowIndex],
            key: `wall-${rowIndex}-${colIndex}`
          },
            React.createElement('boxGeometry', { args: [wallThickness, wallHeight, wallThickness] }),
            React.createElement('meshStandardMaterial', { color: 'gray' })
          );
          walls.push(wall);
        }
      });
    });

    return walls;
  }

  function GameScene() {
    const playerRef = useRef(); // Create a ref for the player
    const mazeWalls = createMaze(); // Generate maze walls

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player, { playerRef }), // Pass the playerRef to Player
      React.createElement(CameraFollow, { playerRef }), // Pass the playerRef to CameraFollow
      ...mazeWalls // Spread the maze walls into the scene
    );
  }

  return GameScene;
};

console.log('Updated player movement with camera follow script loaded');
