import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);


//orbit controls /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//light /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

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

const texture1 = textureLoader.load('./textures/texture_1.png', () =>{
  console.log('texture1 loaded');
}, undefined, (error) => {
  console.error(error);
});
const texture2 = textureLoader.load('./textures/texture_2.png', () =>{
  console.log('texture2 loaded');
});

//Draco loader /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/');

//background /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sphereGeometry = new THREE.SphereGeometry(40, 50, 30);
const spherematerial = new THREE.MeshBasicMaterial({ map: envMap, side: THREE.DoubleSide });
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
      outside_1= child;
    
    }
    if (child.isMesh && child.name === 'outside_2') {
      console.log(child.name);
      outside_2= child;
    
    }
    if (child.isMesh && child.name === 'outside_3') {
      console.log(child.name);
      outside_3= child;
    
    }
    if (child.isMesh && child.name === 'sole_bottom') {
      console.log(child.name);
      sole_bottom= child;
    
    }
    if (child.isMesh && child.name === 'sole_top') {
      console.log(child.name);
      sole_top= child;
    
    }
  }
  );
});

//raycaster /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedPart = null;

//mouse click on a shoe child, zoom in on that child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(shoe.children, true);

  console.log('Click detected:', intersects.length, 'intersects'); // Debug-lijn

  if (intersects.length > 0) {
    const intersectedPart = intersects[0].object;
    console.log('Intersected part:', intersectedPart.name); // Debug-lijn

    zoomToPart(intersectedPart);
    openColorMenu(intersectedPart);
  }
});


//zoom in on a shoe child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function zoomToPart(part) {
  const boundingBox = new THREE.Box3().setFromObject(part);
  const center = boundingBox.getCenter(new THREE.Vector3());

  gsap.to(camera.position, {
    x: center.x,
    y: center.y + 5,
    z: center.z + 10,
    duration: 1,
  });

  controls.target.copy(center);
  selectedPart = part;
}

//open color menu /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function openColorMenu(part) {
  const menu = document.querySelector('.color-menu');
  console.log('openColorMenu called'); // Debug-lijn
  console.log(menu); // Controleer of menu correct wordt gevonden

  if (!menu) {
    console.error('No color menu found');
    return;
  }

  selectedPart = part;
  menu.style.display = 'block';
  console.log('Menu display set to block');

  menu.querySelectorAll('a').forEach((a) => {
    const newListener = () => {
      changeColor(selectedPart, a.dataset.color);
      menu.style.display = 'none';
    }

    a.removeEventListener('click', newListener);
    a.addEventListener('click', newListener);
    });

  menu.querySelectorAll('.texture-option').forEach((img) => {
    const newListener = () => {
      changeTexture(selectedPart, img.dataset.texture);
      menu.style.display = 'none';
    }

    img.removeEventListener('click', newListener);
    img.addEventListener('click', newListener);
  });
}


//change color of a shoe child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function changeColor(part, color) {
  part.material.color.set(color);
  part.material.needsUpdate = true;
}

//change texture of a shoe child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function changeTexture(part, textureName) {
  let texture;

  // Kies de juiste textuur
  if (textureName === 'texture1') {
    texture = texture1;
  } else if (textureName === 'texture2') {
    texture = texture2;
  }

  if (texture) {
    // Alleen de textuur wijzigen
    part.material.map = texture;
    part.material.needsUpdate = true;
  }
}



//close color menu /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    gsap.to(camera.position, { x: 0, y: 0, z: 30, duration: 1 });
    controls.target.set(0, 0, 0);
    selectedPart = null;

    const menu = document.querySelector('.color-menu');
    menu.style.display = 'none';
  }
});

// Animation Loop /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
