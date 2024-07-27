import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
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
        // add mesh objects to octree
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                player.octree.fromGraphNode(child);
            }
        });
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
const fillLight1 = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5);
fillLight1.position.set(2, 1, 1);
scene.add(fillLight1);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(-5, 25, -1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = -0.00006;
scene.add(directionalLight);

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

let previousTime = performance.now();
function animate() {
    let currentTime = performance.now();
    let dt = (currentTime - previousTime) / 1000;

    requestAnimationFrame(animate);
    controls.update();
    player.applyInputs(dt);
    renderer.render(scene, player.controls.isLocked ? player.camera : orbitCamera);

    stats.update();

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
