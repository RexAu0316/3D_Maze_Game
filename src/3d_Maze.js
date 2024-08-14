window.initGame = (React, assetsUrl) => {
  const { useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const MazeWall = ({ position, scale }) => {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshStandardMaterial({ color: 'gray' }),
      className: 'maze-wall'
    });
  };

  const Coin = ({ position }) => {
    return React.createElement('mesh', {
      position: position,
      geometry: new THREE.CircleGeometry(0.5, 32),
      material: new THREE.MeshStandardMaterial({ color: 'gold', side: THREE.DoubleSide }),
      rotation: [0, 0, 0]
    });
  };

  function Player({ wallBoxes, onCoinCollect }) {
    const playerRef = useRef();
    const speed = 0.1;
    const keys = useRef({});
    const collectedCoins = useRef(0);

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

    const checkCollision = (nextPosition) => {
      const playerBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(...nextPosition),
        new THREE.Vector3(0.5, 1, 0.5)
      );

      return wallBoxes.some(wallBox => playerBox.intersectsBox(wallBox));
    };

    useFrame(() => {
      if (playerRef.current) {
        const direction = new THREE.Vector3();
        if (keys.current['ArrowUp']) direction.z -= speed;
        if (keys.current['ArrowDown']) direction.z += speed;
        if (keys.current['ArrowLeft']) direction.x -= speed;
        if (keys.current['ArrowRight']) direction.x += speed;

        const nextPosition = [
          playerRef.current.position.x + direction.x,
          playerRef.current.position.y,
          playerRef.current.position.z + direction.z,
        ];

        if (!checkCollision(nextPosition)) {
          playerRef.current.position.set(nextPosition[0], nextPosition[1], nextPosition[2]);
        }

        // Check for coin collection
        const coinPosition = [-8.5, 0.5, 10.5]; // Example coin position
        const playerBox = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...nextPosition),
          new THREE.Vector3(0.5, 1, 0.5)
        );

        const coinBox = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(...coinPosition),
          new THREE.Vector3(0.5, 0.1, 0.5)
        );

        if (playerBox.intersectsBox(coinBox)) {
          collectedCoins.current++;
          onCoinCollect(collectedCoins.current);
          // Move the coin away after collection
          coinPosition[0] = Math.random() * 20 - 10;
          coinPosition[2] = Math.random() * 20 - 10;
        }
      }
    });

    return React.createElement('mesh', {
      ref: playerRef,
      position: [8.5, 0.5, -8.5], // Centered position
      geometry: new THREE.BoxGeometry(0.5, 1, 0.5),
      material: new THREE.MeshStandardMaterial({ color: 'blue' })
    });
  }

  function Camera({ playerRef }) {
    const { camera } = useThree();
    useEffect(() => {
      const updateCameraPosition = () => {
        if (playerRef.current) {
          camera.position.set(playerRef.current.position.x, playerRef.current.position.y + 5, playerRef.current.position.z + 5);
          camera.lookAt(playerRef.current.position);
        }
      };

      const frame = () => {
        updateCameraPosition();
        requestAnimationFrame(frame);
      };
      frame();

      return () => cancelAnimationFrame(frame);
    }, [camera, playerRef]);
    return null;
  }

  function Maze() {
    const wallHeight = 1;
    const mazeLayout = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    ];

    const wallPositions = [];
    const wallBoxes = [];

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) {
          const position = [
            colIndex - mazeLayout[0].length / 2 + 0.5,
            wallHeight / 2,
            rowIndex - mazeLayout.length / 2 + 0.5,
          ];
          wallPositions.push({
            position: position,
            scale: [1, wallHeight, 1]
          });

          const wallBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(...position),
            new THREE.Vector3(1, wallHeight, 1)
          );
          wallBoxes.push(wallBox);
        }
      });
    });

    return React.createElement(
      React.Fragment,
      null,
      wallPositions.map((wall, index) =>
        React.createElement(MazeWall, {
          key: index,
          position: wall.position,
          scale: wall.scale
        })
      ),
      React.createElement(Player, { wallBoxes, onCoinCollect: (count) => console.log(`Coins collected: ${count}`) }) // Log coins collected
    );
  }

  function MazeRunnerGame() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera, { playerRef: useRef() }), // Pass playerRef to Camera
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze)
    );
  }

  return MazeRunnerGame;
};

console.log('3D Maze Runner game script loaded');
