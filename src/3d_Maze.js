window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player({ playerRef, walls }) {
    const speed = 0.00005; // Movement speed
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

const checkCollision = (nextPosition) => {
  const playerBox = new THREE.Box3().setFromCenterAndSize(
    nextPosition,
    new THREE.Vector3(0.5, 1, 0.5)
  );

  for (let wall of walls) {
    if (wall) { // Check if wall is defined
      const wallBox = new THREE.Box3().setFromCenterAndSize(
        wall,
        new THREE.Vector3(1, 1, 1)
      );
      if (playerBox.intersectsBox(wallBox)) {
        return true;
      }
    }
  }
  return false;
};

    useFrame(() => {
      if (playerRef.current) {
        const direction = new THREE.Vector3();
        if (keys.w) direction.z -= speed;
        if (keys.s) direction.z += speed;
        if (keys.a) direction.x -= speed;
        if (keys.d) direction.x += speed;

        // Normalize direction to maintain consistent speed
        direction.normalize();

        // Calculate the next position
        const nextPosition = playerRef.current.position.clone().add(direction);

        // Check for collision before updating the position
        if (!checkCollision(nextPosition)) {
          playerRef.current.position.copy(nextPosition);
        }
      }
    });

    return React.createElement('mesh', { ref: playerRef, position: [1, 0.5, 1] },
      React.createElement('boxGeometry', { args: [0.5, 1, 0.5] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function CameraFollow({ playerRef }) {
    const { camera } = useThree();
    const offset = new THREE.Vector3(0, 30, 10);
    const targetPosition = new THREE.Vector3();

    useFrame(() => {
      if (playerRef.current) {
        targetPosition.copy(playerRef.current.position).add(offset);
        camera.position.lerp(targetPosition, 0.1);
        camera.lookAt(playerRef.current.position);
      }
    });

    return null;
  }

  function createMaze() {
    // Maze layout - 1 represents a wall, 0 represents open space
    const mazeLayout = [
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

    const walls = [];
    const wallHeight = 1;
    const wallThickness = 1;

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          const wallPosition = new THREE.Vector3(colIndex, wallHeight / 2, -rowIndex);
          walls.push(wallPosition); // Store wall positions
          const wall = React.createElement('mesh', {
            position: wallPosition.toArray(),
            key: `wall-${rowIndex}-${colIndex}`
          },
            React.createElement('boxGeometry', { args: [wallThickness, wallHeight, wallThickness] }),
            React.createElement('meshStandardMaterial', { color: 'gray' })
          );
        }
      });
    });

    return walls;
  }

  function GameScene() {
    const playerRef = useRef(); 
    const walls = createMaze(); // Generate maze walls

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player, { playerRef, walls }), // Pass walls to Player
      React.createElement(CameraFollow, { playerRef }),
      ...walls.map((position, index) => (
        React.createElement('mesh', { position: position.toArray(), key: `wall-${index}` },
          React.createElement('boxGeometry', { args: [1, 1, 1] }),
          React.createElement('meshStandardMaterial', { color: 'gray' })
        )
      ))
    );
  }

  return GameScene;
};

console.log('Collision detection script loaded');
