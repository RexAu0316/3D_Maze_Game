window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const PlayerModel = React.memo(function PlayerModel({ url, scale = [1, 1, 1], position = [0, 0, 0] }) {
    const gltf = useLoader(GLTFLoader, url);
    const copiedScene = useMemo(() => gltf.scene.clone(), [gltf]);

    useEffect(() => {
      copiedScene.scale.set(...scale);
      copiedScene.position.set(...position);
    }, [copiedScene, scale, position]);

    return React.createElement('primitive', { object: copiedScene });
  });

  function Player() {
    const playerRef = useRef();
    const speed = 0.1;

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
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    return React.createElement(
      'mesh', 
      { ref: playerRef, position: [0, 0, 0] },
      React.createElement(PlayerModel, { 
        url: `${assetsUrl}/player.glb`, // Replace with your player model URL
        scale: [1, 1, 1],
        position: [0, 0, 0]
      })
    );
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
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player) // Add the player to the scene
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');
