import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import {DRACOLoader} from 'three/examples/jsm/Addons.js'
import * as dat from 'dat.gui'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnomationLoop(animate);
document.body.appendChild(renderer.domElement);

//orbit controls ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//light //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

//camera /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
camera.position.z = 5;

//Animation Loop /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
    controls.update();
    renderer.render(scene, camera);
}

animate();