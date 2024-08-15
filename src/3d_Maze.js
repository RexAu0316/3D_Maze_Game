window.initGame = (React, assetsUrl) => {
  const { useRef, useEffect, useState } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Coin({ position, onCollect }) {
    return React.createElement('mesh', { position: position, onClick: onCollect },
      React.createElement('circleGeometry', { args: [0.5, 32] }),
      React.createElement('meshStandardMaterial', { color: 'gold', side: THREE.DoubleSide })
    );
  }

  function Player({ onCoinCollect }) {
    const playerRef = useRef();
    const speed = 0.2; // Movement speed
    const keys = { w: false, a: false, s: false, d: false };
    const coins = useRef([]);

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

        // Check for coin collection
        coins.current.forEach((coin, index) => {
          const coinBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(coin.position[0], coin.position[1], coin.position[2]),
            new THREE.Vector3(1, 1, 1)
          );

          const playerBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(playerRef.current.position.x, playerRef.current.position.y, playerRef.current.position.z),
            new THREE.Vector3(1, 1, 1)
          );

          if (playerBox.intersectsBox(coinBox)) {
            onCoinCollect(index);
            coins.current.splice(index, 1); // Remove the collected coin
          }
        });
      }
    });

    return React.createElement('mesh', { ref: playerRef, position: [0, 0, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  function CameraFollow() {
    const { camera } = useThree();
    const playerRef = useRef();

    useFrame(() => {
      if (playerRef.current) {
        // Smoothly update the camera position to follow the player
        camera.position.lerp(
          new THREE.Vector3(playerRef.current.position.x, playerRef.current.position.y + 5, playerRef.current.position.z + 10),
          0.1 // Smoothness factor
        );
        camera.lookAt(playerRef.current.position);
      }
    });

    return React.createElement('group', { ref: playerRef },
      React.createElement(Player, { onCoinCollect: (index) => console.log(`Coin collected at index: ${index}`) })
    );
  }

  function GameScene() {
    const [score, setScore] = useState(0);
    const coins = useRef([
      { position: [2, 0.5, 2] },
      { position: [-2, 0.5, -2] },
      { position: [4, 0.5, 4] }
    ]);

    const handleCoinCollect = (index) => {
      setScore(score + 1);
      console.log(`Coin collected! New score: ${score + 1}`);
    };

    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(CameraFollow),
      coins.current.map((coin, index) => React.createElement(Coin, { key: index, position: coin.position, onCollect: () => handleCoinCollect(index) })),
      React.createElement('div', { style: { position: 'absolute', top: 10, left: 10, color: 'white' } }, `Score: ${score}`)
    );
  }

  return GameScene;
};

console.log('Updated player movement with camera follow and coin collection script loaded');
