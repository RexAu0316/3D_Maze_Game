window.initGame = (React, assetsUrl) => {
  const { useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;

  function Player() {
    const playerRef = useRef();
    const speed = 0.1;

    // Create a cube to represent the player
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    
    playerMesh.position.set(0, 0.5, 0); // Adjust position to be above the ground
    playerRef.current = playerMesh;

    // Function to handle keyboard input
    const handleKeyDown = (event) => {
      if (!playerRef.current) return;

      switch (event.key) {
        case 'w':
          playerRef.current.position.z -= speed;
          break;
        case 's':
          playerRef.current.position.z += speed;
          break;
        case 'a':
          playerRef.current.position.x -= speed;
          break;
        case 'd':
          playerRef.current.position.x += speed;
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      // Add the player mesh to the scene
      window.scene.add(playerMesh);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.scene.remove(playerMesh); // Clean up on unmount
      };
    }, [playerMesh]);

    return null; // No need to return anything, as the player is added directly to the scene
  }

  function Camera() {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(0, 10, 15);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  }

  function MazeGame() {
    // Add the player and the camera to the scene
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement(Player),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] })
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');
