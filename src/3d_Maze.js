window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  // Define the maze layout
  const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];

  // Player Component
  function Player() {
    const playerRef = useRef();
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

        // Check for maze collision (simplified)
        const { x, z } = playerRef.current.position;
        const gridX = Math.floor(x);
        const gridZ = -Math.floor(z); // Invert Z for correct grid reference
        
        // Prevent moving through walls
        if (mazeLayout[gridZ] && mazeLayout[gridZ][gridX] === 1) {
          playerRef.current.position.sub(direction); // Undo movement if wall
        }
      }
    });

    return React.createElement('mesh', { ref: playerRef, position: [8.5, 0.5, -8.5] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  // Camera Follow Component
  function CameraFollow() {
    const { camera } = useThree();
    const playerRef = useRef();

    useFrame(() => {
      if (playerRef.current) {
        camera.position.lerp(
          new THREE.Vector3(playerRef.current.position.x, playerRef.current.position.y + 5, playerRef.current.position.z + 10),
          0.1 // Smoothness factor
        );
        camera.lookAt(playerRef.current.position);
      }
    });

    return React.createElement('group', { ref: playerRef },
      React.createElement(Player)
    );
  }

  // Maze Component
  function Maze() {
    const wallHeight = 1;
    const wallWidth = 1;
    const wallDepth = 1;

    const walls = mazeLayout.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === 1) {
          return React.createElement(
            'mesh',
            {
              key: `${rowIndex}-${colIndex}`,
              position: [colIndex * wallWidth, wallHeight / 2, -rowIndex * wallDepth],
            },
            React.createElement('boxGeometry', { args: [wallWidth, wallHeight, wallDepth] }),
            React.createElement('meshStandardMaterial', { color: 'gray' })
          );
        }
        return null;
      })
    );

    return React.createElement('group', null, ...walls);
  }

  // Game Scene Component
  function GameScene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(CameraFollow),
      React.createElement(Maze) // Add the Maze component here
    );
  }

  return GameScene;
};

console.log('Updated player movement with camera follow and maze script loaded');
