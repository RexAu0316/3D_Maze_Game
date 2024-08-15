window.initMazeGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  // Simple Maze Layout (1 is wall, 0 is path)
  const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  function Maze() {
    const mazeRef = useRef();

    return React.createElement('group', { ref: mazeRef }, 
      mazeLayout.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (cell === 1) {
            return React.createElement('mesh', {
              key: `${rowIndex}-${colIndex}`,
              position: [colIndex * 2, 0.5, -rowIndex * 2],
            },
              React.createElement('boxGeometry', { args: [1, 1, 1] }),
              React.createElement('meshStandardMaterial', { color: 'gray' })
            );
          }
          return null;
        })
      )
    );
  }

  function Player() {
    const playerRef = useRef();
    const { camera } = useThree();
    const speed = 0.1;

    useFrame(() => {
      const moveForward = () => {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0; // Keep the player on the ground
        forward.normalize();
        playerRef.current.position.add(forward.multiplyScalar(speed));
        checkCollision(playerRef.current.position);
      };

      const moveBackward = () => {
        const backward = new THREE.Vector3();
        camera.getWorldDirection(backward);
        backward.y = 0;
        backward.normalize();
        playerRef.current.position.add(backward.multiplyScalar(-speed));
        checkCollision(playerRef.current.position);
      };

      const moveLeft = () => {
        const left = new THREE.Vector3();
        camera.getWorldDirection(left);
        left.cross(new THREE.Vector3(0, 1, 0)); 
        left.y = 0;
        left.normalize();
        playerRef.current.position.add(left.multiplyScalar(-speed));
        checkCollision(playerRef.current.position);
      };

      const moveRight = () => {
        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(new THREE.Vector3(0, 1, 0));
        right.y = 0;
        right.normalize();
        playerRef.current.position.add(right.multiplyScalar(speed));
        checkCollision(playerRef.current.position);
      };

      const checkCollision = (position) => {
        const cellX = Math.floor(position.x / 2);
        const cellZ = Math.floor(-position.z / 2);
        if (mazeLayout[cellZ] && mazeLayout[cellZ][cellX] === 1) {
          // If there's a wall, revert the last movement
          playerRef.current.position.copy(lastPosition);
        } else {
          lastPosition.copy(playerRef.current.position);
        }
      };

      let lastPosition = new THREE.Vector3(0, 1, 0);

      // Event listeners for keyboard controls
      window.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'w':
            moveForward();
            break;
          case 's':
            moveBackward();
            break;
          case 'a':
            moveLeft();
            break;
          case 'd':
            moveRight();
            break;
          default:
            break;
        }
      });
    });

    return React.createElement('mesh', { ref: playerRef, position: [0, 1, 0] },
      React.createElement('sphereGeometry', { args: [0.5, 32, 32] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function Camera() {
    const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  }

  function MazeGame() {
    return React.createElement(React.Fragment, null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player)
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');
