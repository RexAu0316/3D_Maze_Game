// MazeGame.js
window.initMazeGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;
  const { useFrame, Canvas } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const Player = ({ position }) => {
    return (
      React.createElement('mesh', { position: position },
        React.createElement('boxBufferGeometry', { args: [0.5, 1, 0.5] }),
        React.createElement('meshStandardMaterial', { color: 'blue' })
      )
    );
  };
// MazeGame.js
window.initMazeGame = (React) => {
  const { useState, useEffect, useRef } = React;
  const { useFrame, Canvas } = window.ReactThreeFiber;
  const THREE = window.THREE;

  // Simple maze structure
  const mazeLayout = [
    [1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];

  const cellSize = 2; // Size of each cell in the maze

  const Player = ({ position }) => {
    return (
      React.createElement('mesh', { position: position },
        React.createElement('boxBufferGeometry', { args: [0.5, 1, 0.5] }),
        React.createElement('meshStandardMaterial', { color: 'blue' })
      )
    );
  };

  const Camera = ({ playerRef }) => {
    const cameraRef = useRef();
    
    useFrame(() => {
      if (playerRef.current) {
        // Update camera position based on player's position
        cameraRef.current.position.set(
          playerRef.current.position.x,
          playerRef.current.position.y + 2, // Height above the player
          playerRef.current.position.z + 4   // Distance behind the player
        );
        cameraRef.current.lookAt(playerRef.current.position);
      }
    });

    return React.createElement('perspectiveCamera', { ref: cameraRef, position: [0, 2, 4], fov: 75 });
  };

  const Maze = () => {
    return mazeLayout.map((row, rowIndex) => 
      row.map((cell, colIndex) => {
        if (cell === 1) {
          // Create walls
          return React.createElement('mesh', {
            key: `${rowIndex}-${colIndex}`,
            position: [
              colIndex * cellSize - (mazeLayout[0].length * cellSize) / 2,
              0,
              rowIndex * cellSize - (mazeLayout.length * cellSize) / 2,
            ]
          },
          React.createElement('boxBufferGeometry', { args: [cellSize, 2, cellSize] }),
          React.createElement('meshStandardMaterial', { color: 'gray' }));
        }
        return null;
      })
    );
  };

  function MazeGame() {
    const [playerPosition, setPlayerPosition] = useState([0, 0.5, 0]);
    const playerRef = useRef();
    const speed = 0.1;

    const handleKeyPress = (event) => {
      const direction = {
        ArrowUp: [0, 0, -speed],
        ArrowDown: [0, 0, speed],
        ArrowLeft: [-speed, 0, 0],
        ArrowRight: [speed, 0, 0],
      };

      if (direction[event.key]) {
        const nextPosition = playerPosition.map((pos, index) => pos + direction[event.key][index]);

        // Check for collisions
        if (!checkCollision(nextPosition)) {
          setPlayerPosition(nextPosition);
        }
      }
    };

    const checkCollision = (nextPosition) => {
      const [nextX, nextY, nextZ] = nextPosition;

      // Convert 3D coordinates to maze grid indices
      const colIndex = Math.floor((nextX + (mazeLayout[0].length * cellSize) / 2) / cellSize);
      const rowIndex = Math.floor((nextZ + (mazeLayout.length * cellSize) / 2) / cellSize);

      // Check if the next position collides with a wall
      if (rowIndex >= 0 && rowIndex < mazeLayout.length && colIndex >= 0 && colIndex < mazeLayout[0].length) {
        return mazeLayout[rowIndex][colIndex] === 1; // 1 means wall
      }
      return true; // Out of bounds is a collision
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, [playerPosition]);

    return React.createElement(
      Canvas,
      null,
      React.createElement('ambientLight', null),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player, { position: playerPosition, ref: playerRef }),
      React.createElement(Camera, { playerRef: playerRef })
    );
  }

  return MazeGame;
};

console.log('Maze Game script loaded');  const Camera = ({ playerRef }) => {
    const cameraRef = useRef();
    
    useFrame(() => {
      if (playerRef.current) {
        // Update camera position based on player's position
        cameraRef.current.position.set(
          playerRef.current.position.x,
          playerRef.current.position.y + 2, // Height above the player
          playerRef.current.position.z + 4   // Distance behind the player
        );
        cameraRef.current.lookAt(playerRef.current.position);
      }
    });

    return React.createElement('perspectiveCamera', { ref: cameraRef, position: [0, 2, 4], fov: 75 });
  };

  function MazeGame() {
    const [playerPosition, setPlayerPosition] = useState([0, 0.5, 0]);
    const playerRef = useRef();
    const speed = 0.1;

    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setPlayerPosition((prev) => [prev[0], prev[1], prev[2] - speed]);
          break;
        case 'ArrowDown':
          setPlayerPosition((prev) => [prev[0], prev[1], prev[2] + speed]);
          break;
        case 'ArrowLeft':
          setPlayerPosition((prev) => [prev[0] - speed, prev[1], prev[2]]);
          break;
        case 'ArrowRight':
          setPlayerPosition((prev) => [prev[0] + speed, prev[1], prev[2]]);
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, []);

    return React.createElement(
      Canvas,
      null,
      React.createElement('ambientLight', null),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player, { position: playerPosition, ref: playerRef }),
      React.createElement(Camera, { playerRef: playerRef })
    );
  }

  return MazeGame;
};

console.log('Maze Game script loaded');
