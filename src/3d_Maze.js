window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player({ position }) {
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
        playerRef.current.position.add(direction);
      }
    });

     return React.createElement('mesh', { ref: playerRef, position: position },
    React.createElement('boxGeometry', { args: [1, 1, 1] }),
    React.createElement('meshStandardMaterial', { color: 'blue' })
  );
}

  function CameraFollow() {
  const { camera } = useThree();
  const playerRef = useRef();
  const mazeRef = useRef();

  useFrame(() => {
    if (playerRef.current) {
      camera.position.lerp(
        new THREE.Vector3(playerRef.current.position.x, playerRef.current.position.y + 5, playerRef.current.position.z + 10),
        0.1
      );
      camera.lookAt(playerRef.current.position);
    }
  });

  // Get the starting position from the Maze component
  const startPosition = mazeRef.current ? mazeRef.current.startPosition : [0, 1, 0];

  return React.createElement('group', { ref: playerRef },
    React.createElement(Player, { position: startPosition })
  );
}
  // Maze Component
function Maze() {
  const mazeRef = useRef();
  const maze = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ];

  // Function to find a starting position for the player
  const findStartPosition = () => {
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) { // Found an open space
          return [x, 1, -y]; // Player's position: x, y (height), z
        }
      }
    }
    return [0, 1, 0]; // Fallback position if no valid space is found
  };

  useEffect(() => {
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          const wall = React.createElement('mesh', { position: [x, 0.5, -y] },
            React.createElement('boxGeometry', { args: [1, 1, 1] }),
            React.createElement('meshStandardMaterial', { color: 'gray' })
          );
          mazeRef.current.add(wall);
        }
      });
    });
  }, [maze]);

  return React.createElement('group', { ref: mazeRef, startPosition: findStartPosition() });
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

console.log('Updated player movement with camera follow and maze script loaded');
