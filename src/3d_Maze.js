window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

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

  const MouseControlledCamera = () => {
    const { camera } = useThree();
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);
    const sensitivity = 0.1;

    const handleMouseDown = (event) => {
      if (event.button === 0) { // Left mouse button
        setIsMouseDown(true);
        setMouseX(event.clientX);
        setMouseY(event.clientY);
      }
    };

    const handleMouseUp = () => setIsMouseDown(false);
    
    const handleMouseMove = (event) => {
      if (isMouseDown) {
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;

        camera.rotation.y -= deltaX * sensitivity;
        camera.rotation.x -= deltaY * sensitivity;

        // Constrain the camera rotation to prevent flipping
        camera.rotation.x = Math.max(Math.min(camera.rotation.x, Math.PI / 2), -Math.PI / 2);

        setMouseX(event.clientX);
        setMouseY(event.clientY);
      }
    };

    useEffect(() => {
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [isMouseDown]);

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

  function Camera() {
    const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  }

  function MazeGame() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement(MouseControlledCamera),  // Added MouseControlledCamera here
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze)
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');
