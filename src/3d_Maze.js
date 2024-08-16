const App = () => {
  const canvasStyle = {
    width: "100vw",
    height: "100vh",
    position: "relative",
  };

  const sceneStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "skyblue",
  };

  // State for keyboard controls
  const [controls, setControls] = React.useState({
    moveBackward: false,
    moveForward: false,
    moveLeft: false,
    moveRight: false,
  });

  // Ref for the target object
  const targetRef = React.useRef({ position: { x: 0, y: 2, z: 0 } });

  // Keyboard event handlers
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "w":
        setControls((prev) => ({ ...prev, moveForward: true }));
        break;
      case "s":
        setControls((prev) => ({ ...prev, moveBackward: true }));
        break;
      case "a":
        setControls((prev) => ({ ...prev, moveLeft: true }));
        break;
      case "d":
        setControls((prev) => ({ ...prev, moveRight: true }));
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case "w":
        setControls((prev) => ({ ...prev, moveForward: false }));
        break;
      case "s":
        setControls((prev) => ({ ...prev, moveBackward: false }));
        break;
      case "a":
        setControls((prev) => ({ ...prev, moveLeft: false }));
        break;
      case "d":
        setControls((prev) => ({ ...prev, moveRight: false }));
        break;
      default:
        break;
    }
  };

  // UseEffect for adding/removing event listeners
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Frame update logic
  const updateFrame = () => {
    if (controls.moveRight) targetRef.current.position.x += 0.2;
    if (controls.moveLeft) targetRef.current.position.x -= 0.2;
    if (controls.moveForward) targetRef.current.position.z -= 0.2;
    if (controls.moveBackward) targetRef.current.position.z += 0.2;

    // Rendering logic would go here (not implemented)
    requestAnimationFrame(updateFrame);
  };

  // Start the animation loop
  React.useEffect(() => {
    updateFrame();
  }, []);

  // Render the scene
  const scene = React.createElement("div", { style: canvasStyle },
    React.createElement("div", { style: sceneStyle },
      React.createElement("div", { style: { position: "absolute", left: targetRef.current.position.x + "px", top: targetRef.current.position.y + "px", zIndex: targetRef.current.position.z } },
        React.createElement("div", { style: { width: "50px", height: "50px", backgroundColor: "red", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } })
      ),
      React.createElement("div", { style: { position: "absolute", bottom: "0", width: "100%", height: "50px", backgroundColor: "green" } })
    )
  );

  return scene;
};

// Assuming you have a root element in your HTML with id 'root'
const rootElement = document.getElementById("root");
rootElement.appendChild(scene);
