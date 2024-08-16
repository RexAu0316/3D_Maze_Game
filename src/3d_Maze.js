window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  // Create a simple red cube
  function RedCube() {
    const cubeRef = useRef();
    
    // Use useFrame to rotate the cube for some visual effect
    useFrame(() => {
      if (cubeRef.current) {
        cubeRef.current.rotation.y += 0.01;
      }
    });

    return React.createElement(
      'mesh',
      { ref: cubeRef, position: [0, 0.5, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'red' })
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

  function WhackAMole3D() {
    const [moles, setMoles] = useState(Array(9).fill(false));
    const [score, setScore] = useState(0);

    // Pop-up and pop-down logic for moles
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
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      moles.map((isActive, index) => 
        React.createElement(Mole, {
          key: index,
          position: [
            (index % 3 - 1) * 4,
            0,
            (Math.floor(index / 3) - 1) * 4
          ],
          isActive: isActive,
          onWhack: () => whackMole(index)
        })
      ),
      React.createElement(RedCube) // Add the red cube here
    );
  }

  return WhackAMole3D;
};

console.log('3D Whack-a-Mole game script loaded');
