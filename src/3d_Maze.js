window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const MazeWall = ({ position, scale }) => {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshStandardMaterial({ color: 'gray' })
    });
  };

  const Collectible = ({ position }) => {
    return React.createElement('mesh', {
      position: position,
      geometry: new THREE.SphereGeometry(0.2, 32, 32),
      material: new THREE.MeshStandardMaterial({ color: 'gold' })
    });
  };

  function Player() {
    const playerRef = useRef();
    const speed = 0.1;
    const keys = useRef({});

    useEffect(() => {
      const handleKeyDown = (event) => {
        keys.current[event.key] = true;
      };

      const handleKeyUp = (event) => {
        keys.current[event.key] = false;
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
        const direction = new THREE.Vector3();
        if (keys.current['ArrowUp']) direction.z -= speed;
        if (keys.current['ArrowDown']) direction.z += speed;
        if (keys.current['ArrowLeft']) direction.x -= speed;
        if (keys.current['ArrowRight']) direction.x += speed;

        // Update position
        playerRef.current.position.add(direction);
      }
    });

    return React.createElement('mesh', {
      ref: playerRef,
      position: [0, 0.5, 0],
      geometry: new THREE.BoxGeometry(0.5, 1, 0.5),
      material: new THREE.MeshStandardMaterial({ color: 'blue' })
    });
  }

  function Camera() {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  }

  function Maze() {
    const walls = [
      { position: [0, 0, -5], scale: [10, 1, 1] },
      { position: [5, 0, 0], scale: [1, 1, 10] },
      { position: [-5, 0, 0], scale: [1, 1, 10] },
      { position: [0, 0, 5], scale: [10, 1, 1] },
      { position: [-2.5, 0, -2.5], scale: [1, 1, 5] },
      { position: [2.5, 0, -2.5], scale: [1, 1, 5] }
    ];

    return React.createElement(
      React.Fragment,
      null,
      walls.map((wall, index) =>
        React.createElement(MazeWall, {
          key: index,
          position: wall.position,
          scale: wall.scale
        })
      )
    );
  }

  function MazeRunnerGame() {
    const [collectibles, setCollectibles] = useState([]);

    useEffect(() => {
      // Generate random collectibles
      const newCollectibles = [];
      for (let i = 0; i < 5; i++) {
        newCollectibles.push({
          position: [
            (Math.random() - 0.5) * 8,
            0.2,
            (Math.random() - 0.5) * 8
          ]
        });
      }
      setCollectibles(newCollectibles);
    }, []);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Player),
      collectibles.map((collectible, index) =>
        React.createElement(Collectible, {
          key: index,
          position: collectible.position
        })
      )
    );
  }

  return MazeRunnerGame;
};

console.log('3D Maze Runner game script loaded');
