window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;
  const { useFrame } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const MazeModel = React.memo(function MazeModel({ position = [0, 0, 0], scale = [1, 1, 1] }) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    return React.createElement('mesh', { position, scale, geometry, material });
  });

  const PlayerModel = React.memo(function PlayerModel({ position }) {
    return React.createElement('mesh', { position },
      React.createElement('sphereGeometry', { args: [0.5, 32, 32] }),
      React.createElement('meshStandardMaterial', { color: '#00ff00' })
    );
  });

  const CollectibleModel = ({ position, onCollect }) => {
    return React.createElement('mesh', { position, onClick: onCollect },
      React.createElement('cylinderGeometry', { args: [0.2, 0.2, 0.3, 32] }),
      React.createElement('meshStandardMaterial', { color: '#ffcc00' })
    );
  };

  const isCollision = (nextPosition) => {
    const mazeLayout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const x = Math.floor(nextPosition.x);
    const z = -Math.floor(nextPosition.z); // Invert z for correct maze indexing

    return mazeLayout[z] && mazeLayout[z][x] === 1; // Checking for a wall
  };

  function Maze() {
    const mazeLayout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    return React.createElement(
      'group',
      null,
      mazeLayout.map((row, y) =>
        row.map((cell, x) =>
          cell === 1 ? React.createElement(MazeModel, { key: `${x}-${y}`, position: [x, 0, -y] }) : null
        )
      )
    );
  }

  function Player() {
    const playerRef = useRef(new THREE.Vector3(0, 0.5, 0)); // Initialize position
    const speed = 0.1;
    const keyboardState = useRef({});

    useEffect(() => {
      const handleKeyDown = (event) => {
        keyboardState.current[event.code] = true;
      };

      const handleKeyUp = (event) => {
        keyboardState.current[event.code] = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    useFrame(() => {
      if (playerRef.current) {
        const movement = new THREE.Vector3();

        if (keyboardState.current['ArrowUp']) movement.z -= speed;
        if (keyboardState.current['ArrowDown']) movement.z += speed;
        if (keyboardState.current['ArrowLeft']) movement.x -= speed;
        if (keyboardState.current['ArrowRight']) movement.x += speed;

        const nextPosition = playerRef.current.clone().add(movement);

        // Check for collisions before updating position
        if (!isCollision(nextPosition)) {
          playerRef.current.copy(nextPosition); // Update position if no collision
        }
      }
    });

    return React.createElement(PlayerModel, { position: playerRef.current.toArray() });
  }

  const Game = () => {
    const [collectibles, setCollectibles] = useState([]);

    useEffect(() => {
      // Initialize collectibles positions
      const newCollectibles = [
        [2, 0.5, -1],
        [0, 0.5, -3],
        [-1, 0.5, -3],
      ];
      setCollectibles(newCollectibles);
    }, []);

    const collectItem = (position) => {
      setCollectibles((prev) => prev.filter(item => item[0] !== position[0] || item[1] !== position[1] || item[2] !== position[2]));
    };

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player),
      collectibles.map((pos, index) => (
        React.createElement(CollectibleModel, { key: index, position: pos, onCollect: () => collectItem(pos) })
      ))
    );
  };

  return Game;
};

console.log('3D Maze Runner game script loaded');
