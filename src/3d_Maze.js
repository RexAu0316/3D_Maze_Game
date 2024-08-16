window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Cube() {
    const cubeRef = useRef();

    useEffect(() => {
      if (cubeRef.current) {
        cubeRef.current.material.color.set('red'); // Set the color of the cube to red
      }
    }, []);

    return React.createElement('mesh', { ref: cubeRef },
      React.createElement('boxBufferGeometry', { args: [1, 1, 1] }), // Create a cube
      React.createElement('meshStandardMaterial', { color: 'red' }) // Material for the cube
    );
  }

  function Camera() {
    const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 2, 5); // Adjust the camera position
      camera.lookAt(0, 0, 0); // Look at the center of the scene
    }, [camera]);

    return null;
  }

  function SimpleScene() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }), // Ambient light
      React.createElement('pointLight', { position: [10, 10, 10] }), // Point light
      React.createElement(Cube) // Add the cube to the scene
    );
  }

  return SimpleScene; // Return the simple scene
};

console.log('3D Simple Scene with Cube script loaded');
