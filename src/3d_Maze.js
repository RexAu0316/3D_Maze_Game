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
    });
  };

  const Coin = ({ position }) => {
    return React.createElement('mesh', {
      position: position,
      geometry: new THREE.CircleGeometry(0.5, 32),
      material: new THREE.MeshStandardMaterial({ color: 'gold', side: THREE.DoubleSide }),
      rotation: [Math.PI / 2, 0, 0], // Rotate to lie flat
    });
  };

function Player({ wallBoxes, onPositionChange }) {
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

            const nextPosition = [
                playerRef.current.position.x + direction.x,
                playerRef.current.position.y,
                playerRef.current.position.z + direction.z,
            ];

            if (!checkCollision(nextPosition)) {
                playerRef.current.position.set(nextPosition[0], nextPosition[1], nextPosition[2]);
                onPositionChange(nextPosition); // Update the player position for the camera
            }
        }
    });

    return React.createElement('mesh', {
        ref: playerRef,
        position: [8.5, 0.5, -8.5],
        geometry: new THREE.BoxGeometry(0.5, 1, 0.5),
        material: new THREE.MeshStandardMaterial({ color: 'blue' })
    });
}

  function Camera({ playerPosition }) {
    const { camera } = useThree();
    
    useEffect(() => {
        const updateCameraPosition = () => {
            camera.position.set(playerPosition[0], playerPosition[1] + 10, playerPosition[2] + 10); // Adjust height and distance
            camera.lookAt(playerPosition[0], playerPosition[1], playerPosition[2]); // Look at the player
        };
        
        // Initial position
        updateCameraPosition();

        return () => {
            // Optional: Clean-up if needed
        };
    }, [camera, playerPosition]);

    return null;
}

  function Maze({ playerRef }) {
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
    const wallBoxes = [];

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          const position = [
            colIndex - mazeLayout[0].length / 2 + 0.5,
            wallHeight / 2,
            rowIndex - mazeLayout.length / 2 + 0.5,
          ];
          wallPositions.push({
            position: position,
            scale: [1, wallHeight, 1],
          });

          const wallBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(...position),
            new THREE.Vector3(1, wallHeight, 1)
          );
          wallBoxes.push(wallBox);
        }
      });
    });
    
    const [playerPosition, setPlayerPosition] = React.useState([8.5, 0.5, -8.5]); // Initial player position

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
        React.createElement(Player, { wallBoxes, onPositionChange: setPlayerPosition }), // Pass function to update position
        React.createElement(Coin, { position: [-8.5, 0.5, 10.5] }),
        React.createElement(Camera, { playerPosition }) // Pass playerPosition to Camera
    );
}

  function MazeRunnerGame() {
    const playerRef = useRef();

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera, { playerRef }),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze, { playerRef }) // Pass playerRef to Maze
    );
  }

  return MazeRunnerGame;
};

console.log('3D Maze Runner game script loaded');
