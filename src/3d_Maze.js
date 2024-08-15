// MazeGame.js
window.initMazeGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef } = React;
  const { useFrame, Canvas } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const Player = ({ position }) => {
    return (
      React.createElement('mesh', { position: position },
        React.createElement('boxBufferGeometry', { args: [0.5, 1, 0.5] }),
        React.createElement('meshStandardMaterial', { color: 'blue' })
      )
    );
  };

  const Camera = ({ playerRef }) => {
    const cameraRef = useRef();
    
    useFrame(() => {
      if (playerRef.current) {
        // Update camera position based on player's position
        cameraRef.current.position.set(
          playerRef.current.position.x,
          playerRef.current.position.y + 2, // Height above the player
          playerRef.current.position.z + 4   // Distance behind the player
        );
        cameraRef.current.lookAt(playerRef.current.position);
      }
    });

    return React.createElement('perspectiveCamera', { ref: cameraRef, position: [0, 2, 4], fov: 75 });
  };

  function MazeGame() {
    const [playerPosition, setPlayerPosition] = useState([0, 0.5, 0]);
    const playerRef = useRef();
    const speed = 0.1;

    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setPlayerPosition((prev) => [prev[0], prev[1], prev[2] - speed]);
          break;
        case 'ArrowDown':
          setPlayerPosition((prev) => [prev[0], prev[1], prev[2] + speed]);
          break;
        case 'ArrowLeft':
          setPlayerPosition((prev) => [prev[0] - speed, prev[1], prev[2]]);
          break;
        case 'ArrowRight':
          setPlayerPosition((prev) => [prev[0] + speed, prev[1], prev[2]]);
          break;
        default:
          break;
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, []);

    return React.createElement(
      Canvas,
      null,
      React.createElement('ambientLight', null),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Player, { position: playerPosition, ref: playerRef }),
      React.createElement(Camera, { playerRef: playerRef })
    );
  }

  return MazeGame;
};

console.log('Maze Game script loaded');
