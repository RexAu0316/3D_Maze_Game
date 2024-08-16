window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  // Define a simple maze layout
  const mazeLayout = [
    [1, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
  ];

  function Maze() {
    const mazeRef = useRef();

    // Create walls based on the maze layout
    const wallSize = 1;
    const wallHeight = 3;

    return React.createElement('group', { ref: mazeRef }, 
      mazeLayout.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          if (cell === 1) {
            return React.createElement('mesh', {
              key: `${rowIndex}-${colIndex}`,
              position: [colIndex * wallSize, wallHeight / 2, rowIndex * wallSize]
            },
              React.createElement('boxGeometry', { args: [wallSize, wallHeight, wallSize] }),
              React.createElement('meshStandardMaterial', { color: 'green' })
            );
          }
          return null; // No mesh for open paths
        })
      )
    );
  }

  function Player() {
    const playerRef = useRef();
    const speed = 0.2; // Movement speed
    const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

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

        // Create movement directions based on key states
        if (keys.w || keys.ArrowUp) direction.z -= speed; // Move forward
        if (keys.s || keys.ArrowDown) direction.z += speed; // Move backward
        if (keys.a || keys.ArrowLeft) direction.x -= speed; // Move left
        if (keys.d || keys.ArrowRight) direction.x += speed; // Move right

        // Normalize direction to maintain consistent speed
        direction.normalize();
        playerRef.current.position.add(direction);
      }
    });

    return React.createElement('mesh', { ref: playerRef, position: [0, 0, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function CameraFollow() {
    const { camera } = useThree();
    const playerRef = useRef();

    useFrame(() => {
      if (playerRef.current) {
        // Smoothly update the camera position to follow the player
        camera.position.lerp(
          new THREE.Vector3(playerRef.current.position.x, playerRef.current.position.y + 5, playerRef.current.position.z + 10),
          0.1 // Smoothness factor
        );
        camera.lookAt(playerRef.current.position);
      }
    });

    return React.createElement('group', { ref: playerRef },
      React.createElement(Player)
    );
  }

  function GameScene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),  // Add the Maze component here
      React.createElement(CameraFollow)
    );
  }

  return GameScene;
};

console.log('Updated player movement with camera follow and maze script loaded');
