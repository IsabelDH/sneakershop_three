import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);


//orbit controls /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//dat.gui /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const gui = new dat.GUI();

const color = {color: 0xffffff};
let laces, inside, outside_1, outside_2, outside_3, sole_bottom, sole_top;

gui.addColor(color, 'color').onChange(() => {
  if (laces) {
    laces.material.color.set(color.color);
    laces.material.needsUpdate = true;
  }
});

gui.addColor(color, 'color').onChange(() => {
  if (inside) {
    inside.material.color.set(color.color);
    inside.material.needsUpdate = true;
  }
});

gui.addColor(color, 'color').onChange(() => {
  if (outside_1) {
    outside_1.material.color.set(color.color);
    outside_1.material.needsUpdate = true;
  }
});
gui.addColor(color, 'color').onChange(() => {
  if (outside_2) {
    outside_2.material.color.set(color.color);
    outside_2.material.needsUpdate = true;
  }
});
gui.addColor(color, 'color').onChange(() => {
  if (outside_3) {
    outside_3.material.color.set(color.color);
    outside_3.material.needsUpdate = true;
  }
});
gui.addColor(color, 'color').onChange(() => {
  if (sole_bottom) {
    sole_bottom.material.color.set(color.color);
    sole_bottom.material.needsUpdate = true;
  }
}); 
gui.addColor(color, 'color').onChange(() => {
  if (sole_top) {
    sole_top.material.color.set(color.color);
    sole_top.material.needsUpdate = true;
  }
});

//light /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

//camera /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
camera.position.z = 30;

//texture /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const textureLoader = new THREE.TextureLoader();
const texture360 = textureLoader.load('./textures/360.png');

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  '/envmap/nX.PNG',
	'/envmap/nY.PNG',
	'/envmap/nZ.PNG',
	'/envmap/pX.PNG',
	'/envmap/pY.PNG',
	'/envmap/pZ.PNG',
]);
scene.environment = envMap;

//Draco loader /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');

//background /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sphereGeometry = new THREE.SphereGeometry(40, 50, 30);
const spherematerial = new THREE.MeshBasicMaterial({ map: texture360, side: THREE.DoubleSide });
const sphere = new THREE.Mesh(sphereGeometry, spherematerial);
scene.add(sphere);

//load model /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);


let shoe;
loader.load('./models/shoe.glb', (gltf) => {
  shoe = gltf.scene;
  scene.add(shoe);
  shoe.position.x = -10;
  shoe.scale.set(55, 55, 55);
  shoe.rotation.y = Math.PI / 2;

  shoe.traverse((child) => {
    if (child.isMesh && child.name === 'laces') {
      console.log(child.name);
      laces = child;
      
      child.material.envMap = envMap;
      child.material.needsUpdate = true;
    }
    if (child.isMesh && child.name === 'inside') {
      console.log(child.name);
      inside = child;
    }
    if (child.isMesh && child.name === 'outside_1') {
      console.log(child.name);
      outside1= child;
    
    }
    if (child.isMesh && child.name === 'outside_2') {
      console.log(child.name);
      outside1= child;
    
    }
    if (child.isMesh && child.name === 'outside_3') {
      console.log(child.name);
      outside1= child;
    
    }
    if (child.isMesh && child.name === 'sole_bottom') {
      console.log(child.name);
      outside1= child;
    
    }
    if (child.isMesh && child.name === 'sole_top') {
      console.log(child.name);
      outside1= child;
    
    }
  }
  );
});

// Animation Loop /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Voeg event listeners toe aan de HTML-color pickers
document.getElementById('laces-color').addEventListener('input', (e) => {
  if (laces) {
    laces.material.color.set(e.target.value); // Kleur voor de veters
    laces.material.needsUpdate = true;
  }
});

document.getElementById('inside-color').addEventListener('input', (e) => {
  if (inside) {
    inside.material.color.set(e.target.value); // Kleur voor de binnenkant
    inside.material.needsUpdate = true;
  }
});

document.getElementById('outside1-color').addEventListener('input', (e) => {
  if (outside_1) {
    outside_1.material.color.set(e.target.value); // Kleur voor de buitenkant
    outside_1.material.needsUpdate = true;
  }
});

document.getElementById('outside2-color').addEventListener('input', (e) => {
  if (outside_2) {
    outside_2.material.color.set(e.target.value); // Kleur voor de buitenkant
    outside_2.material.needsUpdate = true;
  }
});

document.getElementById('outside3-color').addEventListener('input', (e) => {
  if (outside_3) {
    outside_3.material.color.set(e.target.value); // Kleur voor de buitenkant
    outside_3.material.needsUpdate = true;
  }
});

document.getElementById('sole-bottom-color').addEventListener('input', (e) => {
  if (sole_bottom) {
    sole_bottom.material.color.set(e.target.value); // Kleur voor de zool
    sole_bottom.material.needsUpdate = true;
  }
});

document.getElementById('sole-top-color').addEventListener('input', (e) => {
  if (sole_top) {
    sole_top.material.color.set(e.target.value); // Kleur voor de zool
    sole_top.material.needsUpdate = true;
  }
});
