window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;
  const { GLTFLoader } = window.THREE;

  const Wall = ({ position }) => {
    const wallRef = useRef();
    return React.createElement('mesh', {
      ref: wallRef,
      position: position,
      geometry: new THREE.BoxGeometry(1, 2, 1),
      material: new THREE.MeshStandardMaterial({ color: 'brown' }),
    });
  };

  const Collectible = ({ position, onCollect }) => {
    const collectibleRef = useRef();
    return React.createElement('mesh', {
      ref: collectibleRef,
      position: position,
      onClick: onCollect,
      geometry: new THREE.SphereGeometry(0.3, 32, 32),
      material: new THREE.MeshStandardMaterial({ color: 'gold' }),
    });
  };

  const Player = () => {
    const playerRef = useRef();
    const { camera } = useThree();
    const [position, setPosition] = useState([0, 1, 0]);

    useFrame(() => {
      if (playerRef.current) {
        camera.position.copy(playerRef.current.position.clone().add(new THREE.Vector3(0, 2, -5)));
        camera.lookAt(playerRef.current.position);
      }
    });

    const handleKeyDown = (event) => {
      const speed = 0.1;
      const newPosition = [...position];

      switch (event.key) {
        case 'ArrowUp':
          newPosition[2] -= speed;
          break;
        case 'ArrowDown':
          newPosition[2] += speed;
          break;
        case 'ArrowLeft':
          newPosition[0] -= speed;
          break;
        case 'ArrowRight':
          newPosition[0] += speed;
          break;
        default:
          break;
      }

      setPosition(newPosition);
      playerRef.current.position.set(...newPosition);
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [position]);

    return React.createElement('mesh', {
      ref: playerRef,
      position: position,
      geometry: new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
      material: new THREE.MeshStandardMaterial({ color: 'blue' }),
    });
  };

  const Camera = () => {
    const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  };

  function Maze() {
    const walls = [
      [-3, 1, 0], [3, 1, 0],
      [0, 1, -3], [0, 1, 3],
      [-2, 1, -2], [2, 1, 2],
      [-1, 1, -1], [1, 1, 1],
    ];

    const [collectibles, setCollectibles] = useState([
      [0, 1, -1], [1, 1, 2],
      [2, 1, 0], [-1, 1, 1]
    ]);

    const collectItem = (position) => {
      setCollectibles(current => current.filter(item => item[0] !== position[0] || item[2] !== position[2]));
    };

    return React.createElement(
      React.Fragment,
      null,
      walls.map((pos, index) => React.createElement(Wall, { key: index, position: pos })),
      collectibles.map((pos, index) => React.createElement(Collectible, { key: index, position: pos, onCollect: () => collectItem(pos) })),
      React.createElement(Player)
    );
  }

  function WhackAMole3D() {
    const [moles, setMoles] = useState(Array(9).fill(false));
    const [score, setScore] = useState(0);

    useEffect(() => {
      const popUpMole = () => {
        setMoles(prevMoles => {
          const newMoles = [...prevMoles];
          const inactiveIndices = newMoles.reduce((acc, mole, index) => !mole ? [...acc, index] : acc, []);
          if (inactiveIndices.length > 0) {
            const randomIndex = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
            newMoles[randomIndex] = true;
          }
          return newMoles;
        });
      };

      const popDownMole = () => {
        setMoles(prevMoles => {
          const newMoles = [...prevMoles];
          const activeIndices = newMoles.reduce((acc, mole, index) => mole ? [...acc, index] : acc, []);
          if (activeIndices.length > 0) {
            const randomIndex = activeIndices[Math.floor(Math.random() * activeIndices.length)];
            newMoles[randomIndex] = false;
          }
          return newMoles;
        });
      };

      const popUpInterval = setInterval(popUpMole, 1000);
      const popDownInterval = setInterval(popDownMole, 2000);

      return () => {
        clearInterval(popUpInterval);
        clearInterval(popDownInterval);
      };
    }, []);

    const whackMole = (index) => {
      if (moles[index]) {
        setScore(prevScore => prevScore + 1);
        setMoles(prevMoles => {
          const newMoles = [...prevMoles];
          newMoles[index] = false;
          return newMoles;
        });
      }
    };

    return React.createElement(
      React.Fragment,
      null,
      moles.map((isActive, index) => 
        React.createElement(Collectible, {
          key: index,
          position: [
            (index % 3 - 1) * 4,
            0,
            (Math.floor(index / 3) - 1) * 4
          ],
          onCollect: () => whackMole(index)
        })
      )
    );
  }

  function MazeGame() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(WhackAMole3D) // Adding Whack-a-Mole interaction in the maze
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');
