window.initGame = (React, assetsUrl) => {
  const { useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  // Custom hook for keyboard controls
  const useKeyboardControls = () => {
    const [keys, setKeys] = React.useState({
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    });

    useEffect(() => {
      const handleKeyDown = (event) => {
        switch (event.key) {
          case 'w':
            setKeys((prev) => ({ ...prev, moveForward: true }));
            break;
          case 's':
            setKeys((prev) => ({ ...prev, moveBackward: true }));
            break;
          case 'a':
            setKeys((prev) => ({ ...prev, moveLeft: true }));
            break;
          case 'd':
            setKeys((prev) => ({ ...prev, moveRight: true }));
            break;
          default:
            break;
        }
      };

      const handleKeyUp = (event) => {
        switch (event.key) {
          case 'w':
            setKeys((prev) => ({ ...prev, moveForward: false }));
            break;
          case 's':
            setKeys((prev) => ({ ...prev, moveBackward: false }));
            break;
          case 'a':
            setKeys((prev) => ({ ...prev, moveLeft: false }));
            break;
          case 'd':
            setKeys((prev) => ({ ...prev, moveRight: false }));
            break;
          default:
            break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    return keys;
  };

  function Player() {
    const targetRef = useRef();
    const { moveForward, moveBackward, moveLeft, moveRight } = useKeyboardControls();
    const speed = 0.2; // Movement speed

    useFrame(() => {
      if (targetRef.current) {
        targetRef.current.position.x += moveRight ? speed : moveLeft ? -speed : 0;
        targetRef.current.position.z += moveForward ? -speed : moveBackward ? speed : 0;
      }
    });

    return React.createElement('group', { ref: targetRef },
      React.createElement('mesh', { position: [0, 2, 0] },
        React.createElement('boxBufferGeometry', { args: [2, 2, 2] }),
        React.createElement('meshStandardMaterial', { color: '#ff0000' })
      )
    );
  }

  function CameraFollow() {
    const { camera } = useThree();
    const targetRef = useRef();

    useFrame(() => {
      if (targetRef.current) {
        camera.position.lerp(
          new THREE.Vector3(targetRef.current.position.x, targetRef.current.position.y + 5, targetRef.current.position.z + 10),
          0.1 // Smoothness factor
        );
        camera.lookAt(targetRef.current.position);
      }
    });

    return React.createElement('group', { ref: targetRef },
      React.createElement(Player)
    );
  }

  function GameScene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('ambientLight', { intensity: 1 }),
      React.createElement('spotLight', { position: [10, 10, 10] }),
      React.createElement('mesh', { rotation: [-Math.PI * 0.5, 0, 0], position: [0, 0, 0] },
        React.createElement('planeBufferGeometry', { args: [50, 50] }),
        React.createElement('meshStandardMaterial', { color: 'green' })
      ),
      React.createElement(CameraFollow)
    );
  }

  return GameScene;
};

console.log('Updated player movement with camera follow script loaded');
