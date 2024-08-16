window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

 function Player({ wallBoxes }) {
    const playerRef = useRef();
    const speed = 0.05; // Decreased speed for easier control
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
            if (keys.current['w'] || keys.current['ArrowUp']) direction.z -= speed;
            if (keys.current['s'] || keys.current['ArrowDown']) direction.z += speed;
            if (keys.current['a'] || keys.current['ArrowLeft']) direction.x -= speed;
            if (keys.current['d'] || keys.current['ArrowRight']) direction.x += speed;

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
        ref: playerRef,
        position: [1, 0.5, -1], // Centered position
        geometry: new THREE.BoxGeometry(0.5, 1, 0.5),
        material: new THREE.MeshStandardMaterial({ color: 'blue' })
    });
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
