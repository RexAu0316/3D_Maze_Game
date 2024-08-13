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

    // Function to check for collisions
    const checkCollision = (newPosition) => {
      for (const wall of walls) {
        const wallPosition = wall.position;
        const wallScale = wall.scale;

        const wallHalfSize = new THREE.Vector3(
          wallScale[0] / 2,
          wallScale[1] / 2,
          wallScale[2] / 2
        );

        const wallBox = new THREE.Box3(
          new THREE.Vector3(
            wallPosition[0] - wallHalfSize.x,
            wallPosition[1] - wallHalfSize.y,
            wallPosition[2] - wallHalfSize.z
          ),
          new THREE.Vector3(
            wallPosition[0] + wallHalfSize.x,
            wallPosition[1] + wallHalfSize.y,
            wallPosition[2] + wallHalfSize.z
          )
        );

        const playerBox = new THREE.Box3(
          new THREE.Vector3(
            newPosition[0] - 0.25, // Player half width
            newPosition[1] - 0.5,  // Player half height
            newPosition[2] - 0.25   // Player half depth
          ),
          new THREE.Vector3(
            newPosition[0] + 0.25,
            newPosition[1] + 0.5,
            newPosition[2] + 0.25
          )
        );

        if (wallBox.intersectsBox(playerBox)) {
          return true; // Collision detected
        }
      }
      return false; // No collision
    };

    useFrame(() => {
      if (playerRef.current) {
        const direction = new THREE.Vector3();
        if (keys.current['ArrowUp']) direction.z -= speed;
        if (keys.current['ArrowDown']) direction.z += speed;
        if (keys.current['ArrowLeft']) direction.x -= speed;
        if (keys.current['ArrowRight']) direction.x += speed;

        // Calculate new position
        const newPosition = playerRef.current.position.clone().add(direction);

        // Check for collisions before updating the position
        if (!checkCollision(newPosition.toArray())) {
          playerRef.current.position.add(direction);
        }
      }
    });

    return React.createElement('mesh', {
      ref: playerRef,
      position: [8.0, 0.5, -8.5], // Centered position
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

  function Maze() {
    const wallHeight = 1; // Height of the walls
    const mazeLayout = [
      // ... (same layout as before)
    ];

    const wallPositions = [];
    const walls = []; // Store wall data for collision detection

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) { // Wall
          const wallPosition = [
            colIndex - mazeLayout[0].length / 2 + 0.5, // Center the maze
            wallHeight / 2,
            rowIndex - mazeLayout.length / 2 + 0.5,
          ];
          wallPositions.push({
            position: wallPosition,
            scale: [1, wallHeight, 1]
          });
          walls.push({ position: wallPosition, scale: [1, wallHeight, 1] }); // Store wall for collision
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
      ),
      React.createElement(Player, { walls }) // Pass walls to Player
    );
  }

  function MazeRunnerGame() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze)
    );
  }

  return MazeRunnerGame;
};

console.log('3D Maze Runner game script loaded with collision detection');
