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

// Moon Orbit
const moonOrbit = new THREE.Object3D();
globe.add(moonOrbit);

// Moon
const moonTexture = new THREE.TextureLoader().load("public/moon.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.27, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);
moonOrbit.add(moon);

// Set Moon's position in its orbit
moon.position.set(2, 0, 0);

// Stars background (texture sphere)
const starTexture = new THREE.TextureLoader().load("public/stars.png");
const stars = new THREE.Mesh(
  new THREE.SphereGeometry(100, 64, 64),
  new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide, // Texture faces inward
  })
);
scene.add(stars);

// Raycaster for hover and click
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredCountry = null;

document.addEventListener("mousemove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0 && intersects[0].object.geometry.features) {
    if (hoveredCountry !== intersects[0].object) {
      hoveredCountry = intersects[0].object;
      document.getElementById("info").innerText =
        hoveredCountry.geometry.properties.name;
    }
  } else {
    hoveredCountry = null;
    document.getElementById("info").innerText = "";
  }
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth around its axis
  globe.rotation.y += 0.001;

  // Rotate Earth orbit around the sun
  earthOrbit.rotation.y += 0.0005;

  // Rotate Moon orbit around Earth
  moonOrbit.rotation.y += 0.005;

  // Rotate Moon around its axis
  moon.rotation.y += 0.002;

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