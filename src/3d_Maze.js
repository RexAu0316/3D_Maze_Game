// App.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const App = () => {
  const sceneRef = useRef();

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);

    // Create a player
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    scene.add(player);

    // Maze walls
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const walls = [
      new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 10), wallMaterial),
      new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.5), wallMaterial),
      new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 10), wallMaterial),
      new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.5), wallMaterial),
    ];
    
    walls[0].position.set(-5, 2.5, 0); // Left wall
    walls[1].position.set(0, 2.5, -5); // Back wall
    walls[2].position.set(5, 2.5, 0); // Right wall
    walls[3].position.set(0, 2.5, 5); // Front wall

    walls.forEach(wall => scene.add(wall));

    // Set camera position
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Handle key events for player movement
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          player.position.z -= 0.1;
          break;
        case 'ArrowDown':
          player.position.z += 0.1;
          break;
        case 'ArrowLeft':
          player.position.x -= 0.1;
          break;
        case 'ArrowRight':
          player.position.x += 0.1;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      sceneRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default App;
