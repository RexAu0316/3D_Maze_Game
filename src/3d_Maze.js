window.initGame = (React, assetsUrl) => {
  const { useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const MazeWall = ({ position, scale }) => {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshStandardMaterial({ color: 'gray' })
    });
  };

  function Player({ walls }) {
  const playerRef = useRef();
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

  useFrame(() => {
    if (playerRef.current) {
      const direction = new THREE.Vector3();
      if (keys.current['ArrowUp']) direction.z -= speed;
      if (keys.current['ArrowDown']) direction.z += speed;
      if (keys.current['ArrowLeft']) direction.x -= speed;
      if (keys.current['ArrowRight']) direction.x += speed;

      // Calculate new position
      const newPosition = playerRef.current.position.clone().add(direction);
      const playerBox = new THREE.Box3().setFromObject(playerRef.current);

      // Check collision with walls
      let collision = false;
      walls.forEach(wall => {
        const wallBox = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...wall.position),
          new THREE.Vector3(...wall.scale)
        );

        if (playerBox.intersectsBox(wallBox)) {
          collision = true; // Collision detected
        }
      });

      // Update position only if no collision
      if (!collision) {
        playerRef.current.position.copy(newPosition);
      }
    }
  });

  return React.createElement('mesh', {
    ref: playerRef,
    position: [8.5, 0.5, -8.5], // Centered position
    geometry: new THREE.BoxGeometry(0.5, 1, 0.5),
    material: new THREE.MeshStandardMaterial({ color: 'blue' })
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

  function Maze({ walls }) {
    const wallHeight = 1; // Height of the walls
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

   const wallPositions = [];

  mazeLayout.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) { // Wall
        const wallPosition = [
          colIndex - mazeLayout[0].length / 2 + 0.5,
          wallHeight / 2,
          rowIndex - mazeLayout.length / 2 + 0.5,
        ];
        const wallScale = [1, wallHeight, 1];
        wallPositions.push({ position: wallPosition, scale: wallScale });
        walls.push({ position: wallPosition, scale: wallScale }); // Store wall for Player collision
      }
    });
  });

  return React.createElement(
    React.Fragment,
    null,
    wallPositions.map((wall, index) =>
      React.createElement(MazeWall, {
        key: index,
        position: wall.position,
        scale: wall.scale
      })
    )
  );
}

  function MazeRunnerGame() {
  const wallData = []; // Store wall data for collision detection

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Camera),
    React.createElement('ambientLight', { intensity: 0.5 }),
    React.createElement('pointLight', { position: [10, 10, 10] }),
    React.createElement(Maze, { walls: wallData }), // Pass walls data to Maze
    React.createElement(Player, { walls: wallData }) // Pass walls data to Player
  );
}

  return MazeRunnerGame;
};

console.log('3D Maze Runner game script loaded');
