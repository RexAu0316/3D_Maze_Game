window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  let wallPositions = [];
  let wallBoxes = [];

  function Player() {
    const playerRef = useRef();
    const speed = 0.2; // Movement speed
    const keys = { w: false, a: false, s: false, d: false };

    const handleKeyDown = (event) => {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
    console.log(`${event.key} pressed`);
  }
};

const handleKeyUp = (event) => {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
    console.log(`${event.key} released`);
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
    console.log('Player position:', playerRef.current.position);
    
        if (keys.w) direction.z -= speed;
        if (keys.s) direction.z += speed;
        if (keys.a) direction.x -= speed;
        if (keys.d) direction.x += speed;

        // Normalize direction to maintain consistent speed
        direction.normalize();

        const newPosition = playerRef.current.position.clone().add(direction);
        const playerBox = new THREE.Box3().setFromCenterAndSize(
          newPosition,
          new THREE.Vector3(1, 1, 1) // Player box size
        );

        // Check for collisions with walls
        let collision = false;
        for (const box of wallBoxes) {
          if (playerBox.intersectsBox(box)) {
            collision = true;
            break;
          }
        }

        // Update position only if there's no collision
        if (!collision) {
          playerRef.current.position.add(direction);
        }
      }
    });

    return React.createElement('mesh', { ref: playerRef, position: [0, 0, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

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
    const wallHeight = 1; // Height of the walls
    const mazeLayout = [
      // ... (your original maze layout)
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      // ... (remaining maze layout)
    ];

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

    return React.createElement(
      React.Fragment,
      null,
      wallPositions.map((wall, index) => (
        React.createElement('mesh', { key: index, position: wall.position, scale: wall.scale },
          React.createElement('boxGeometry', { args: [1, wallHeight, 1] }),
          React.createElement('meshStandardMaterial', { color: 'gray' })
        )
      ))
    );
  }

  function GameScene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze), // Add the Maze component here
      React.createElement(CameraFollow)
    );
  }

  return GameScene;
};

console.log('Game script loaded with player movement, camera follow, and maze rendering');
