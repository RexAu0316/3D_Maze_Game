window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player() {
    const playerRef = useRef();
    const speed = 0.1; // Movement speed

    const movePlayer = (event) => {
      if (!playerRef.current) return;

      switch (event.key) {
        case 'w':
          playerRef.current.position.z -= speed; // Move forward
          break;
        case 's':
          playerRef.current.position.z += speed; // Move backward
          break;
        case 'a':
          playerRef.current.position.x -= speed; // Move left
          break;
        case 'd':
          playerRef.current.position.x += speed; // Move right
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', movePlayer);
      return () => window.removeEventListener('keydown', movePlayer);
    }, []);

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
        // Update camera position to follow the player
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
      React.createElement(CameraFollow)
    );
  }

  return GameScene;
};

console.log('Player movement with camera follow script loaded');
