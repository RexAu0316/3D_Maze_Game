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

    const startPosition = findStartPosition(); // Get the start position here
    return React.createElement('group', { ref: mazeRef }, 
      React.createElement('group', { position: [0, 0, 0] }, startPosition)
    );
  }

  function CameraFollow({ playerPosition }) {
    const { camera } = useThree();
    useFrame(() => {
      if (playerPosition) {
        camera.position.lerp(
          new THREE.Vector3(playerPosition[0], playerPosition[1] + 5, playerPosition[2] + 10),
          0.1
        );
        camera.lookAt(playerPosition);
      }
    });
  }

  function GameScene() {
    const startPosition = Maze().props.children.props.position;
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze), // Add the Maze component here
      React.createElement(CameraFollow, { playerPosition: startPosition }),
      React.createElement(Player, { position: startPosition }) // Pass the starting position to Player
    );
  }

  return GameScene;
};

console.log('Updated player movement with camera follow and maze script loaded');
