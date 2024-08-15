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

    return React.createElement('mesh', { ref: playerRef, position: [0, 0, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function CameraControls() {
    const { camera } = useThree();
    const speed = 0.1; // Speed of camera movement
    const rotationSpeed = 0.002; // Speed of camera rotation
    const keys = { w: false, a: false, s: false, d: false };
    const mouseMovement = useRef({ x: 0, y: 0 });

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

    const handleMouseMove = (event) => {
      mouseMovement.current.x = event.movementX;
      mouseMovement.current.y = event.movementY;
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);

    useFrame(() => {
      // Rotate camera based on mouse movement
      camera.rotation.y -= mouseMovement.current.x * rotationSpeed;
      camera.rotation.x -= mouseMovement.current.y * rotationSpeed;
      mouseMovement.current.x = 0; // Reset after processing
      mouseMovement.current.y = 0; // Reset after processing

      // Move camera based on key presses (optional)
      if (keys.w) camera.position.z -= speed;
      if (keys.s) camera.position.z += speed;
      if (keys.a) camera.position.x -= speed;
      if (keys.d) camera.position.x += speed;
    });

    return null; // No visible component to render
  }

  function GameScene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(CameraControls),
      React.createElement(Player)
    );
  }

  return GameScene;
};

console.log('Updated player movement with custom camera controls script loaded');
