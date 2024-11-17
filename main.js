import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 15, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Solar System
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);

// Sun Texture
const sunTexture = new THREE.TextureLoader().load("public/sun.jpg");

// Sun
const sunGeometry = new THREE.SphereGeometry(2, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
solarSystem.add(sun);

// Sun Light
const sunLight = new THREE.PointLight(0xffffff, 200, 200);
sun.add(sunLight);

// Earth Orbit
const earthOrbit = new THREE.Object3D();
solarSystem.add(earthOrbit);

// Globe (Earth)
const globeTexture = new THREE.TextureLoader().load(
  "public/2k_earth_daymap.jpg"
);
const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({ map: globeTexture })
);
earthOrbit.add(globe);

// Set Earth's position in its orbit
globe.position.set(10, 0, 0);

// Rotation logic
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth around its axis
  globe.rotation.y += 0.001;

  // Rotate Earth orbit around the sun
  earthOrbit.rotation.y += 0.0005;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
