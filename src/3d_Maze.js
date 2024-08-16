window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;
  const { GLTFLoader } = window.THREE;

  // Existing MoleModel, HammerModel, and other components...

  const PlayerModel = React.memo(function PlayerModel({ url, scale = [1, 1, 1], position = [0, 0, 0] }) {
    const gltf = useLoader(GLTFLoader, url);
    const copiedScene = useMemo(() => gltf.scene.clone(), [gltf]);
    
    useEffect(() => {
      copiedScene.scale.set(...scale);
      copiedScene.position.set(...position);
    }, [copiedScene, scale, position]);

    return React.createElement('primitive', { object: copiedScene });
  });

  function Player() {
    return React.createElement(
      'group',
      { position: [0, 0, 0] }, // Positioning the player in the center
      React.createElement(PlayerModel, { 
        url: `${assetsUrl}/player.glb`, // Assume you have a player model
        scale: [1, 1, 1],
        position: [0, 0, 0]
      })
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
      React.createElement(Hammer),
      React.createElement(Player) // Add the Player component here
    );
  }

  return WhackAMole3D;
};

console.log('3D Whack-a-Mole game script loaded');