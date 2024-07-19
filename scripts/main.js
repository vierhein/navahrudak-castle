import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Player } from './player';

const scene = new THREE.Scene();

// Camera
const orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
orbitCamera.position.set(0, 1.6, 3);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(orbitCamera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// GLTFLoader
const loader = new GLTFLoader();

loader.load(
    '/castle/scene.gltf',
    function (gltf) {
        console.log('Model loaded:', gltf);
        scene.add(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

const player = new Player(scene);

// Lighting
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(5, 10, 7.5);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-5, -10, -7.5);
scene.add(directionalLight2);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

let previousTime = performance.now();
function animate() {
    let currentTime = performance.now();
    let dt = (currentTime - previousTime) / 1000;

    requestAnimationFrame(animate);
    controls.update();
    player.applyInputs(dt);
    renderer.render(scene, player.controls.isLocked ? player.camera : orbitCamera);

    previousTime = currentTime;
}

animate();

window.addEventListener('resize', () => {
  // Resize camera aspect ratio and renderer size to the new window size
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});