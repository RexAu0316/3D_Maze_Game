window.initGame = (React) => {
  const { useRef, useEffect } = React;
  const { useFrame } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player() {
    const playerRef = useRef();
    const speed = 0.1; // Movement speed
    const keys = {
      ArrowUp: false,
      ArrowLeft: false,
      ArrowDown: false,
      ArrowRight: false,
    };

    // Handle key down events
    const handleKeyDown = (event) => {
      if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
      }
    };

    // Handle key up events
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

    // Update player position based on key input
    useFrame(() => {
      if (playerRef.current) {
        const direction = new THREE.Vector3();
        if (keys.ArrowUp) direction.z -= speed;      // Move forward
        if (keys.ArrowDown) direction.z += speed;    // Move backward
        if (keys.ArrowLeft) direction.x -= speed;    // Move left
        if (keys.ArrowRight) direction.x += speed;   // Move right

        // Normalize direction to maintain consistent speed if moving diagonally
        direction.normalize();
        playerRef.current.position.add(direction);
      }
    });

    // Render the player as a 3D box
    return React.createElement('mesh', { ref: playerRef, position: [0, 0.5, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  // Updated Camera component
  function Camera({ playerRef }) {
    useFrame(() => {
      if (playerRef.current) {
        const playerPosition = playerRef.current.position;
        const cameraOffset = new THREE.Vector3(0, 2, -5); // Adjust this offset as needed
        const cameraPosition = playerPosition.clone().add(cameraOffset);
        
        window.camera.position.copy(cameraPosition); // Assuming camera is defined globally
        window.camera.lookAt(playerPosition);
      }
    });

    return null; // No visual representation needed for the camera
  }

  // Main component to return the Player and Camera
  function Game() {
    const playerRef = useRef();

    return React.createElement(React.Fragment, null,
      React.createElement(Player, { ref: playerRef }),
      React.createElement(Camera, { playerRef }) // Pass playerRef to the Camera
    );
  }

  return Game;
};

console.log('Player movement script with camera follow loaded');
