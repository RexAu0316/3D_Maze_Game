window.initMazeGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const Wall = ({ position, scale }) => {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: React.createElement('boxGeometry', {}),
      material: React.createElement('meshStandardMaterial', { color: 'gray' }),
    });
  };

  const PlayerModel = React.memo(({ url, position }) => {
    const gltf = useLoader(window.THREE.GLTFLoader, url);
    return React.createElement('primitive', { object: gltf.scene, position: position });
  });

  function Player() {
    const playerRef = useRef();
    const { camera } = useThree();
    const speed = 0.1;

    useFrame((state) => {
      if (playerRef.current) {
        if (state.keyboard.w) {
          playerRef.current.position.z -= speed;
        }
        if (state.keyboard.s) {
          playerRef.current.position.z += speed;
        }
        if (state.keyboard.a) {
          playerRef.current.position.x -= speed;
        }
        if (state.keyboard.d) {
          playerRef.current.position.x += speed;
        }

        camera.position.set(playerRef.current.position.x, playerRef.current.position.y + 5, playerRef.current.position.z + 10);
        camera.lookAt(playerRef.current.position);
      }
    });

    return React.createElement('group', { ref: playerRef },
      React.createElement(PlayerModel, { url: `${assetsUrl}/player.glb`, position: [0, 0, 0] })
    );
  }

  function Maze() {
    return React.createElement(React.Fragment, null,
      React.createElement(Wall, { position: [0, 0, -5], scale: [10, 1, 0.5] }),
      React.createElement(Wall, { position: [0, 0, 5], scale: [10, 1, 0.5] }),
      React.createElement(Wall, { position: [-5, 0, 0], scale: [0.5, 1, 10] }),
      React.createElement(Wall, { position: [5, 0, 0], scale: [0.5, 1, 10] }),
      React.createElement(Wall, { position: [0, 0, 0], scale: [1, 1, 1] }) // Add more walls as needed
    );
  }

  function MazeGame() {
    return React.createElement(React.Fragment, null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player)
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');
