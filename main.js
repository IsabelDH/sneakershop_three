import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import {createOrder} from './api.js';
import { color } from 'three/webgpu';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(1);

//orbit controls /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//light /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

//camera ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
camera.position.z = 30;

//texture ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const textureLoader = new THREE.TextureLoader();
const texture360 = textureLoader.load('./textures/image.png');

const texture1 = textureLoader.load('./textures/texture_1.png', () =>{
  console.log('texture1 loaded');
  texture1.wrapS = THREE.RepeatWrapping;
  texture1.wrapT = THREE.RepeatWrapping;
  texture1.repeat.set(2, 2);
}, undefined, (error) => {
  console.error(error);
});
const texture2 = textureLoader.load('./textures/texture_2.png', () =>{
  console.log('texture2 loaded');
  texture2.wrapS = THREE.RepeatWrapping;
  texture2.wrapT = THREE.RepeatWrapping;
  texture2.repeat.set(2, 2);
});

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
  console.log('Load')
  shoe = gltf.scene;
  scene.add(shoe);
  shoe.scale.set(55, 55, 55);
  shoe.rotation.y = Math.PI / 2;
  shoe.updateMatrixWorld(true); // Update de wereldmatrix van de schoen voor de raycaster

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

let charms = [];
let charm1, charm2;
const charmLoader = new GLTFLoader();

charmLoader.load('./models/foodie_charm_pizza/charm1.gltf', (gltf) => {
  charm1 = gltf.scene;
  charm1.scale.set(1,1,1);
  charm1.visible = false;
  scene.add(charm1);
  charms.push(charm1);
});

charmLoader.load('./models/auspicious_charm/charm2.gltf', (gltf) => {
  charm2 = gltf.scene;
  charm2.scale.set(0.005,0.005,0.005);
  charm2.visible = false;
  scene.add(charm2);
  charms.push(charm2);
}
);

//raycaster /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedPart = null;
let highlightedPart = null;

//mouse move on a shoe child, highlight that child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  let intersectableObjects = [];
  shoe.traverse((child) => {
    if (child.isMesh) {
      intersectableObjects.push(child);
    }
  });

  const intersects = raycaster.intersectObjects(intersectableObjects, true);

  if (intersects.length > 0) {
    const intersectedPart = intersects[0].object;

    if (highlightedPart !== intersectedPart) {
      if (highlightedPart) {
        resetHighlight(highlightedPart);
      }

      highlightObject(intersectedPart);
      highlightedPart = intersectedPart;
    }
  } else {
    if (highlightedPart) {
      resetHighlight(highlightedPart);
      highlightedPart = null;
    }
  }
});

function highlightObject(object) {
  object.material.emissive.set(0xaaaaaa); 
  object.material.emissiveIntensity = 0.5; 
}
function resetHighlight(object) {
  object.material.emissive.set(0x000000); 
  object.material.emissiveIntensity = 0; 
}


//mouse click on a shoe child, zoom in on that child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Gebruik traverse om kinderen van de schoen te vinden
  let intersectableObjects = [];
  shoe.traverse((child) => {
    if (child.isMesh) {
      intersectableObjects.push(child);
    }
  });

  const intersects = raycaster.intersectObjects(intersectableObjects, true);

  if (intersects.length > 0) {
    const intersectedPart = intersects[0].object;
    changeColorOnClick(intersectedPart);
    zoomToPart(intersectedPart);
    openColorMenu(intersectedPart);
    selectedPart = intersectedPart;
  }
});

// Functie om de kleur van het aangeklikte object te veranderen
function changeColorOnClick(part) {
  part.material.color.set(0xcccccc); 
  part.material.needsUpdate = true;
}

//zoom in on a shoe child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function zoomToPart(part) {
  const boundingBox = new THREE.Box3().setFromObject(part);
  const center = boundingBox.getCenter(new THREE.Vector3());

  gsap.to(camera.position, {
    x: center.x,
    y: center.y + 3,
    z: center.z + 18,
    duration: 1,
  });

  controls.target.copy(center);
  selectedPart = part;
}

//open color menu /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let menuVisible = false; // Variabele om de zichtbaarheid van het menu bij te houden

function openColorMenu(part) {
  const menu = document.querySelector('.color-menu');

  if (!menu) {
    console.error('No color menu found');
    return;
  }

  // Controleer of het menu al zichtbaar is
  if (!menuVisible) {
    menu.style.display = 'block';
    menuVisible = true; // Menu is nu zichtbaar, bijgewerkte status
    console.log('Menu set to visible');
  }

  selectedPart = part;

  // Voeg event listeners toe voor de kleuren
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      changeColor(selectedPart, a.dataset.color);
    });
  });

  // Voeg event listeners toe voor de texturen
  menu.querySelectorAll('.texture-option').forEach((img) => {
    img.addEventListener('click', () => {
      changeTexture(selectedPart, img.dataset.texture);
    });
  });

   // Custom color picker
   const colorPicker = document.getElementById('custom-color-picker');
   colorPicker.addEventListener('input', (e) => {
     changeColor(selectedPart, e.target.value); // Change color based on custom picker input
   });
}


//change color of a shoe child /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function changeColor(part, color) {
  part.material.color.set(color);
  part.material.needsUpdate = true;

  if (currentConfig) {
    currentConfig.colors[part.name] = color;
  }
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
    part.material.map = texture;
    part.material.needsUpdate = true;
    currentConfig.textures[part.name] = textureName;
  }
}

//colorpicker
// Kleur kiezen via de invoer (hex-code)
document.getElementById('custom-color-input').addEventListener('input', function() {
  let customColor = this.value;
  if (isValidHexColor(customColor)) {
    // Gebruik customColor in je 3D-configurator om de kleur van een object te veranderen
    console.log("Selected custom color: " + customColor);
    // Je kunt de 3D-sneaker kleur hier aanpassen
  }
});

// Kleur kiezen via de kleurkiezer
document.getElementById('custom-color-picker').addEventListener('input', function() {
  let customColor = this.value;
  // Gebruik customColor in je 3D-configurator om de kleur van een object te veranderen
  console.log("Selected custom color: " + customColor);
});

// Functie om te controleren of de ingevoerde hex-kleur geldig is
function isValidHexColor(color) {
  const hexColorPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;
  return hexColorPattern.test(color);
}


//change charm /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function attachCharmToShoe(charm, position) {
  charm.visible = true;

  const anchorPoints = {
      top: new THREE.Vector3(-1, 3.5, 3.5),
      side: new THREE.Vector3(0.75, 2, 3),
      front: new THREE.Vector3(0, -2, 5),
  };

  const targetPosition = anchorPoints[position];
  if (targetPosition) {
      charm.position.copy(targetPosition);
      currentConfig.charms.push({ name: charm.name, position });
  }
}

document.querySelectorAll('.charms-menu button').forEach((button) => {
  button.addEventListener('click', () => {
    const charmName = button.dataset.charm;

    if (charmName === 'charm1' && charm1) {
      attachCharmToShoe(charm1, 'top'); // Plaats charm 1 aan de bovenkant
    } else if (charmName === 'charm2' && charm2) {
      attachCharmToShoe(charm2, 'side'); // Plaats charm 2 aan de zijkant
    }
  });
});

//function remove charm /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function removeCharmFromShoe(charm) {
  charm.visible = false;
  currentConfig.charms = currentConfig.charms.filter(({ name }) => name !== charm.name);
  console.log(`${charm.name} is verwijderd!`);
}

document.querySelector('.remove-charm').addEventListener('click', () => {
  if (currentConfig.charms.length > 0) {
    const lastCharm = currentConfig.charms.pop();
    const charmToRemove = charms.find(({ name }) => name === lastCharm.name);
    if (charmToRemove) {
      removeCharmFromShoe(charmToRemove);
    }
  } else {
    console.log('Er zijn geen charms om te verwijderen.');
  }
});

//shoe size /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let shoeSize = null;

const shoeSizeSelect = document.querySelector('#shoe-size');
shoeSizeSelect.addEventListener('change', (event) => {
  shoeSize = event.target.value;  // Verkrijg de geselecteerde maat
  currentConfig.size = shoeSize;  // Update de currentConfig met de maat
  console.log(`Shoe size selected: ${shoeSize}`);
});

// Generate order /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentConfig = {
  selectedPart: null,
  colors: {}, // Houd kleurinstellingen bij
  textures: {}, // Houd textuurinstellingen bij
  charms: [], // Houd charms bij
  size: null, // Houd de maat bij
};

//create order /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Selecteer de knoppen en het formulier
const orderButton = document.querySelector('.order');
const orderForm = document.querySelector('#order-form');

// Toon het formulier als op 'Order' wordt geklikt
orderButton.addEventListener('click', (event) => {
  event.preventDefault(); // Voorkom dat de pagina opnieuw laadt

  // Zorg ervoor dat het formulier zichtbaar wordt
  orderForm.style.display = 'flex';
});

// Verzend de order wanneer het formulier wordt ingediend
document.querySelector('#order-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Voorkom dat de pagina opnieuw laadt

  const user = document.querySelector('#user-name').value;
  const email = document.querySelector('#user-email').value;
  const address = document.querySelector('#user-address').value;

  if (!user || !email || !address) {
    alert('Vul alstublieft alle velden in!');
    return;
  }

  // Verzend de order
  const orderData = {
    user,
    email,
    address,
    size: shoeSize || 'default-size',  // Als de schoenmaat niet is geselecteerd, gebruik een standaardwaarde
    order: [
      ...Object.keys(currentConfig.colors).map(partName => ({
        name: partName,
        material: currentConfig.material || 'default-material',
        color: currentConfig.colors[partName],
        size: shoeSize || 'default-size',
        quantity: 1,
      })),
    ],
  };

  console.log('Preparing to send order data:', orderData);

  try {
    const response = await createOrder(orderData);
    console.log('Order placed:', response);
    alert('Uw bestelling is succesvol geplaatst!');
    orderForm.style.display = 'none'; // Verberg het formulier na succesvolle bestelling
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Er ging iets mis bij het plaatsen van uw bestelling.');
  }
});


// Animation Loop /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
  controls.update();
  renderer.render(scene, camera);

  renderer.setAnimationLoop(animate);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
