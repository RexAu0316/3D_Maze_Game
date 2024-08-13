window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
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
    const playerRef = useRef();
    const speed = 0.1;
    const [position, setPosition] = useState([0, 0.5, 0]);

    useFrame(() => {
      if (playerRef.current) {
        const movement = new THREE.Vector3();

        if (keyboardState.current['KeyW']) movement.z -= speed;
        if (keyboardState.current['KeyS']) movement.z += speed;
        if (keyboardState.current['KeyA']) movement.x -= speed;
        if (keyboardState.current['KeyD']) movement.x += speed;

        playerRef.current.position.add(movement);
      }
    });

    return React.createElement(PlayerModel, { ref: playerRef, position });
  }

  const Game = () => {
    const [collectibles, setCollectibles] = useState([]);
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

      // Initialize collectibles positions
      const newCollectibles = [
        [2, 0.5, -1],
        [0, 0.5, -3],
        [-1, 0.5, -3],
      ];
      setCollectibles(newCollectibles);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
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
