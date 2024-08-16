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

  function Camera() {
    const playerRef = useRef();

    useFrame(() => {
      if (playerRef.current) {
        // Set the camera position behind the player
        const playerPosition = playerRef.current.position;
        const cameraOffset = new THREE.Vector3(0, 2, -5); // Adjust as necessary
        const cameraPosition = playerPosition.clone().add(cameraOffset);
        
        // Update the camera position and look at the player
        window.camera.position.copy(cameraPosition);
        window.camera.lookAt(playerPosition);
      }
    });

    return null; // No visual representation needed for the camera
  }

  // Main component to return the Player and Camera
  function Game() {
    return React.createElement(React.Fragment, null,
      React.createElement(Player),
      React.createElement(Camera)
    );
  }

  return Game;
};

console.log('Player movement script with camera follow loaded');
