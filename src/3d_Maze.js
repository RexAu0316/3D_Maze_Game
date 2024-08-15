const { useEffect, useRef } = React;
const { Canvas, useFrame, useThree } = ReactThreeFiber;
const THREE = window.THREE;

// Camera component
function Camera({ playerRef }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    const controls = new THREE.OrbitControls(camera, gl.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.25;
    controls.enableZoom = true; 
    controls.enablePan = false; 
    controls.minDistance = 2; 
    controls.maxDistance = 10; 

    controlsRef.current = controls; 
    return () => {
      controls.dispose(); 
    };
  }, [camera, gl]);

  useFrame(() => {
    if (playerRef.current) {
      controlsRef.current.target.copy(playerRef.current.position);
      controlsRef.current.update();
    }
  });

  return null;
}

// Player component
function Player({ playerRef }) {
  const speed = 0.1; 
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

      direction.normalize();
      playerRef.current.position.add(direction);
    }
  });

  return React.createElement(
    'mesh',
    { ref: playerRef, position: [0, 0, 0] },
    React.createElement('boxGeometry', { args: [0.5, 1, 0.5] }),
    React.createElement('meshStandardMaterial', { color: 'blue' })
  );
}

// Function to create the maze
function createMaze() {
  const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const walls = [];
  const wallHeight = 1; 
  const wallThickness = 1;

  mazeLayout.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) {
        const wall = React.createElement(
          'mesh',
          { position: [colIndex, wallHeight / 2, -rowIndex], key: `wall-${rowIndex}-${colIndex}` },
          React.createElement('boxGeometry', { args: [wallThickness, wallHeight, wallThickness] }),
          React.createElement('meshStandardMaterial', { color: 'gray' })
        );
        walls.push(wall);
      }
    });
  });

  return walls;
}

// Main Game Component
function MazeRunnerGame() {
  const playerRef = useRef();

  return React.createElement(
    Canvas,
    null,
    React.createElement('ambientLight', null),
    React.createElement('pointLight', { position: [10, 10, 10] }),
    React.createElement(Camera, { playerRef: playerRef }),
    React.createElement(Player, { playerRef: playerRef }),
    createMaze()
  );
}

// Render the game
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(MazeRunnerGame));
