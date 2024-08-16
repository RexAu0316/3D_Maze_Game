window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player() {
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

    return React.createElement('mesh', { ref: playerRef, position: [0, 1, 0] }, // Raise the player to be above ground
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

  // Maze Component
  function Maze() {
    const mazeRef = useRef();

    // Simple grid-based maze generation (for demonstration)
    const maze = [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1],
    ];

    useEffect(() => {
      maze.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1) {
            const wall = React.createElement('mesh', { position: [x, 0.5, -y] }, // Set the wall height to 1
              React.createElement('boxGeometry', { args: [1, 1, 1] }), // Height set to 1
              React.createElement('meshStandardMaterial', { color: 'gray' })
            );
            mazeRef.current.add(wall);
          }
        });
      });
    }, [maze]);

    return React.createElement('group', { ref: mazeRef });
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
