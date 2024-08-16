window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player({ wallBoxes }) {
    const playerRef = useRef();
    const speed = 0.2; // Movement speed
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

        // Check for collisions with walls
        const newPosition = playerRef.current.position.clone().add(direction);
        const playerBox = new THREE.Box3().setFromCenterAndSize(
          newPosition,
          new THREE.Vector3(1, 1, 1) // Assuming the player size is 1x1x1
        );

        let collision = false;
        for (const wallBox of wallBoxes) {
          if (playerBox.intersectsBox(wallBox)) {
            collision = true;
            break;
          }
        }

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

  function MazeWall({ position, scale }) {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshStandardMaterial({ color: 'gray' }),
      className: 'maze-wall'
    });
  }

  function Coin({ position }) {
    return React.createElement('mesh', {
      position: position,
      geometry: new THREE.CircleGeometry(0.5, 32),
      material: new THREE.MeshStandardMaterial({ color: 'gold', side: THREE.DoubleSide }),
      rotation: [Math.PI / 2, 0, 0] // Rotate the coin to lie flat on the ground
    });
  }

  function Camera() {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.set(0, 20, 20); // Adjusted for maze size
      camera.lookAt(0, 0, 0);
    }, [camera]);
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
      React.createElement(Player, { wallBoxes }), // Pass wallBoxes as props
      React.createElement(Coin, { position: [-8.5, 0.5, 10.5] }) // Add the coin at the specified position
    );
  }

  function GameScene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Camera),
      React.createElement(Maze) // Include the maze in the game scene
    );
  }

  return GameScene;
};

console.log('Updated game with maze and player collision detection loaded');
