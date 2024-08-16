window.initMazeGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense } = React;
  const { useFrame } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player({ playerRef }) {
    const speed = 0.1; // Movement speed
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
      React.createElement('boxGeometry', { args: [0.5, 1, 0.5] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function createMaze() {
    const mazeLayout = [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const walls = [];
    const wallHeight = 1; // Height of the wall
    const wallThickness = 1;

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          const wall = React.createElement('mesh', {
            position: [colIndex, wallHeight / 2, -rowIndex],
            key: `wall-${rowIndex}-${colIndex}`
          },
            React.createElement('boxGeometry', { args: [wallThickness, wallHeight, wallThickness] }),
            React.createElement('meshStandardMaterial', { color: 'gray' })
          );
          walls.push(wall);
        }
      });
    });

    return walls;
  }

  function MazeGame() {
    const playerRef = useRef();

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      createMaze(),
      React.createElement(Player, { playerRef })
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');