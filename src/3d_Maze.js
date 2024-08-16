window.initSimple3DGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;
  const { GLTFLoader } = window.THREE;

  const CubeModel = React.memo(function CubeModel({ position = [0, 0, 0], scale = [1, 1, 1] }) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const mesh = useMemo(() => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(...scale);
      mesh.position.set(...position);
      return mesh;
    }, [scale, position]);
    
    return React.createElement('mesh', { ref: mesh });
  });

  function MovingCube() {
    const cubeRef = useRef();
    const [position, setPosition] = useState([0, 0, 0]);

    useFrame((state, delta) => {
      if (cubeRef.current) {
        const newY = Math.sin(state.clock.elapsedTime) * 2; // Simple vertical movement
        setPosition([0, newY, 0]);
        cubeRef.current.position.set(...position);
      }
    });

    return React.createElement(CubeModel, { position: position, scale: [1, 1, 1] });
  }

  function Camera() {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  }

  function Simple3DGame() {
    const [score, setScore] = useState(0);

    const handleClick = () => {
      setScore(prevScore => prevScore + 1);
    };

    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(MovingCube, { onClick: handleClick }),
      React.createElement('text', { position: [0, 4, 0], fontSize: 1, color: 'white' }, `Score: ${score}`)
    );
  }

  return Simple3DGame;
};

console.log('Simple 3D game script loaded');
