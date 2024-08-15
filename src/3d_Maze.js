const MazeGame = () => {
  const playerRef = React.useRef();
  const walls = [
    [-3, 1, 0], [3, 1, 0], [0, 1, -3], [0, 1, 3],
    [-2, 1, -2], [2, 1, 2], [-1, 1, -1], [1, 1, 1],
  ];
  
  const [collectibles, setCollectibles] = React.useState([
    [0, 1, -1], [1, 1, 2], [2, 1, 0], [-1, 1, 1]
  ]);

  const collectItem = (position) => {
    setCollectibles(current => current.filter(item => item[0] !== position[0] || item[2] !== position[2]));
  };

  const Player = React.forwardRef((props, ref) => {
    const [position, setPosition] = React.useState([0, 1, 0]);
    const speed = 0.1;

    const handleKeyDown = (event) => {
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
      ref.current.position.set(...newPosition);
    };

    React.useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [position]);

    return React.createElement(
      'mesh', 
      { ref: ref, position: position },
      React.createElement('cylinderGeometry', { args: [0.5, 0.5, 1, 32] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  });

  const Wall = ({ position }) => {
    return React.createElement(
      'mesh',
      { position: position },
      React.createElement('boxGeometry', { args: [1, 2, 1] }),
      React.createElement('meshStandardMaterial', { color: 'brown' })
    );
  };

  const Collectible = ({ position, onCollect }) => {
    return React.createElement(
      'mesh',
      { position: position, onClick: onCollect },
      React.createElement('sphereGeometry', { args: [0.3, 32, 32] }),
      React.createElement('meshStandardMaterial', { color: 'gold' })
    );
  };

  const Camera = React.forwardRef((props, ref) => {
    const { camera } = useThree();

    useFrame(() => {
      if (ref.current) {
        camera.position.set(ref.current.position.x, ref.current.position.y + 5, ref.current.position.z + 10);
        camera.lookAt(ref.current.position);
      }
    });

    return null;
  });

  return React.createElement(
    'canvas',
    null,
    React.createElement('ambientLight', { intensity: 0.5 }),
    React.createElement('pointLight', { position: [10, 10, 10] }),
    React.createElement(Camera, { ref: playerRef }),
    React.createElement(Player, { ref: playerRef }),
    walls.map((pos, index) => React.createElement(Wall, { key: index, position: pos })),
    collectibles.map((pos, index) => 
      React.createElement(Collectible, { key: index, position: pos, onCollect: () => collectItem(pos) })
    )
  );
};

ReactDOM.render(React.createElement(MazeGame), document.getElementById('root'));
