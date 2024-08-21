window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player({ playerRef, walls }) {
  const speed = 0.005; // Movement speed
  const keys = useRef({ w: false, a: false, s: false, d: false });

  const handleKeyDown = (event) => {
    if (keys.current.hasOwnProperty(event.key)) {
      keys.current[event.key] = true;
    }
  };

  const handleKeyUp = (event) => {
    if (keys.current.hasOwnProperty(event.key)) {
      keys.current[event.key] = false;
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

  useFrame((state) => {
    if (playerRef.current) {
      const direction = new THREE.Vector3();
      const delta = state.clock.getDelta(); // Get delta time

      if (keys.current.w) direction.z -= speed * delta;
      if (keys.current.s) direction.z += speed * delta;
      if (keys.current.a) direction.x -= speed * delta;
      if (keys.current.d) direction.x += speed * delta;

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

  return React.createElement('mesh', { ref: playerRef, position: [1, 0.5, -1] },
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
    const collectibles = [];
    const wallHeight = 1;
    const wallThickness = 1;

    mazeLayout.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const wallPosition = new THREE.Vector3(colIndex, wallHeight / 2, -rowIndex);
            if (cell === 1) {
                walls.push(wallPosition);
            } else if (cell === 0 && Math.random() < 0.1) { // Randomly place collectibles
                const collectiblePosition = wallPosition.clone().add(new THREE.Vector3(0, 0.5, 0));
                collectibles.push(collectiblePosition);
            }
        });
    });

    return { walls, collectibles };
}

function GameScene() {
    const playerRef = useRef();
    const [score, setScore] = React.useState(0); // Initialize score state
    const { walls, collectibles } = createMaze(); // Generate maze walls and collectibles

    const handleCollectibleCollision = (playerBox, collectible) => {
        const collectibleBox = new THREE.Box3().setFromCenterAndSize(
            collectible,
            new THREE.Vector3(0.5, 0.5, 0.5)
        );
        return playerBox.intersectsBox(collectibleBox);
    };

    useFrame(() => {
        if (playerRef.current) {
            const playerBox = new THREE.Box3().setFromCenterAndSize(
                playerRef.current.position,
                new THREE.Vector3(0.5, 1, 0.5)
            );

            collectibles.forEach((collectible, index) => {
                if (handleCollectibleCollision(playerBox, collectible)) {
                    setScore((prevScore) => prevScore + 1); // Increment the score
                    collectibles.splice(index, 1); // Remove the collectible
                }
            });
        }
    });

    return React.createElement(
        React.Fragment,
        null,
        React.createElement('ambientLight', { intensity: 0.5 }),
        React.createElement('pointLight', { position: [10, 10, 10] }),
        React.createElement(Player, { playerRef, walls }),
        React.createElement(CameraFollow, { playerRef }),
        ...walls.map((position, index) => (
            React.createElement('mesh', { position: position.toArray(), key: `wall-${index}` },
                React.createElement('boxGeometry', { args: [1, 1, 1] }),
                React.createElement('meshStandardMaterial', { color: 'gray' })
            )
        )),
        ...collectibles.map((position, index) => (
            React.createElement('mesh', { position: position.toArray(), key: `collectible-${index}` },
                React.createElement('sphereGeometry', { args: [0.25, 16, 16] }),
                React.createElement('meshStandardMaterial', { color: 'gold' })
            )
        )),
        React.createElement('text', { position: [-8, 5, 0], scale: [1, 1, 1], fontSize: 0.5 }, `Score: ${score}`)
    );
}

  return GameScene;
};

console.log('Collision detection script loaded');
