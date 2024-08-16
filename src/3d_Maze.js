window.initGame = (React) => {
  const { useState, useEffect, useRef, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const Maze = () => {
    const mazeLayout = [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
    ];

    const walls = [];
    for (let y = 0; y < mazeLayout.length; y++) {
      for (let x = 0; x < mazeLayout[y].length; x++) {
        if (mazeLayout[y][x] === 1) {
          walls.push(
            React.createElement('mesh', {
              key: `${x}-${y}`,
              position: [x, 0, y],
            }, React.createElement('boxBufferGeometry', { args: [1, 2, 1] }), React.createElement('meshStandardMaterial', { color: 'brown' }))
          );
        }
      }
    }

    return React.createElement(React.Fragment, null, ...walls);
  };

  const Player = () => {
    const playerRef = useRef();
    const speed = 0.1;

    const handleMovement = (event) => {
      if (playerRef.current) {
        switch(event.key) {
          case 'ArrowUp':
            playerRef.current.position.z -= speed;
            break;
          case 'ArrowDown':
            playerRef.current.position.z += speed;
            break;
          case 'ArrowLeft':
            playerRef.current.position.x -= speed;
            break;
          case 'ArrowRight':
            playerRef.current.position.x += speed;
            break;
          default:
            break;
        }
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleMovement);
      return () => {
        window.removeEventListener('keydown', handleMovement);
      };
    }, []);

    return React.createElement('mesh', { ref: playerRef, position: [0.5, 0.5, 0.5] }, 
      React.createElement('boxBufferGeometry', { args: [0.5, 1, 0.5] }), 
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  };

  const Camera = () => {
    const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  };

  const MazeGame = () => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player)
    );
  };

  return MazeGame;
};

console.log('3D Maze game script loaded');
