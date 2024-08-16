function Player() {
    const playerRef = useRef();
    const speed = 0.2; // Movement speed
    const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

    const handleKeyDown = (event) => {
      if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
        console.log(`Key pressed: ${event.key}`); // Log key press
      }
    };

    const handleKeyUp = (event) => {
      if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
        console.log(`Key released: ${event.key}`); // Log key release
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

        // Only normalize if there is movement
        if (direction.length() > 0) {
          direction.normalize(); // Normalize direction to maintain consistent speed
          playerRef.current.position.add(direction);
        }
      }
    });

    return React.createElement('mesh', { ref: playerRef, position: [0, 0, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function CameraFollow({ playerRef }) {
    const { camera } = useThree();

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

    return null; // No need to render anything in CameraFollow
  }

  function GameScene() {
    const playerRef = useRef(); // Create a reference for the player

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),  // Add the Maze component here
      React.createElement(CameraFollow, { playerRef }), // Pass the playerRef to CameraFollow
      React.createElement(Player, { ref: playerRef }) // Pass the ref to Player
    );
  }
