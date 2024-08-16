window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;
  const { Canvas, useFrame } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player() {
    const playerRef = useRef();
    const speed = 0.1;

    // Handle keyboard controls
    useEffect(() => {
      const handleKeyDown = (event) => {
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

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

    return React.createElement(
      'mesh',
      { ref: playerRef, position: [0, 0, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'orange' })
    );
  }

  function Scene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player)
    );
  }

  function Game() {
    return React.createElement(Canvas, null, React.createElement(Scene));
  }

  return Game;
};

console.log('3D Player Controller script loaded');