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
      className: 'maze-wall' // Adding class for identification
    });
  };
function Player() {
  const playerRef = useRef();
  const speed = 0.1;
  const keys = useRef({});
  const mazeWalls = useRef([]);

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
  
  useEffect(() => {
    // Initialize maze walls after maze component is rendered
    mazeWalls.current = [...document.querySelectorAll('.maze-wall')].map(wall => {
      const box = new THREE.Box3().setFromObject(wall);
      return box;
    });
  }, []);

  const checkCollision = (nextPosition) => {
    const playerBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(...nextPosition),
      new THREE.Vector3(0.5, 1, 0.5)
    );

    return mazeWalls.current.some(wallBox => playerBox.intersectsBox(wallBox));
  };

  useFrame(() => {
    if (playerRef.current) {
      const direction = new THREE.Vector3();
      if (keys.current['ArrowUp']) direction.z -= speed;
      if (keys.current['ArrowDown']) direction.z += speed;
      if (keys.current['ArrowLeft']) direction.x -= speed;
      if (keys.current['ArrowRight']) direction.x += speed;

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
  function Maze() {
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
          wallPositions.push({
            position: [
              colIndex - mazeLayout[0].length / 2 + 0.5, // Center the maze
              wallHeight / 2,
              rowIndex - mazeLayout.length / 2 + 0.5,
            ],
            scale: [1, wallHeight, 1]
          });
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
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player)
    );
  }
  return MazeRunnerGame;
};
console.log('3D Maze Runner game script loaded');
