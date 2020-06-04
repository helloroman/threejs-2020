import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xeeeeee);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
const scene = new THREE.Scene();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(4, 5, 12);
camera.rotation.set(0, -5, 0);
controls.update();

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 1));
const spotLight = new THREE.SpotLight(0xffffff, 0.75);
spotLight.position.set(500, 400, 200);
spotLight.angle = 0.4;
spotLight.penumbra = 0.05;
spotLight.decay = 1;
spotLight.distance = 2000;
spotLight.castShadow = true;
scene.add(spotLight);
spotLight.target.position.set(3, 0, -3);
scene.add(spotLight.target);


const meshFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 100, 100),
  new THREE.MeshLambertMaterial({ color: 0xbbbbbb })
);

meshFloor.rotation.x = -Math.PI / 2;
meshFloor.position.y = -1.05;
meshFloor.receiveShadow = true;
scene.add(meshFloor);

let defaultColor = new THREE.Color('hsl(0, 0%, 65%)');
const highlightColor = new THREE.Color('hsl(40, 85%, 70%)');
const emptyColor = new THREE.Color();


const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({
  color: defaultColor,
  vertexColors: THREE.VertexColors
}));
box.material.vertexColors = true;
box.castShadow = true;
box.geometry.elementsNeedUpdate = true;
box.geometry.colorsNeedUpdate = true;
box.geometry.groupsNeedUpdate = true;
scene.add(box);

const createBox = () => {
  return new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({
    color: defaultColor,
    vertexColors: THREE.VertexColors
  }));
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let lastBox
let lastFaces

window.addEventListener('mousemove', (e) => {
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length) {
    const [currentObj] = intersects;
    let currentFaces

    if (currentObj.object.geometry.type === 'BoxGeometry') {
      if (currentObj.faceIndex % 2 === 0) {
        currentObj.object.geometry.faces[currentObj.faceIndex].color.set(highlightColor);
        currentObj.object.geometry.faces[currentObj.faceIndex + 1].color.set(highlightColor);
        currentFaces = [currentObj.faceIndex, currentObj.faceIndex + 1]
      } else {
        currentObj.object.geometry.faces[currentObj.faceIndex].color.set(highlightColor);
        currentObj.object.geometry.faces[currentObj.faceIndex - 1].color.set(highlightColor);
        currentFaces = [currentObj.faceIndex, currentObj.faceIndex - 1]
      }
      currentObj.object.geometry.colorsNeedUpdate = true;
      currentObj.object.material.needsUpdate = true;

      if (lastBox) {
        if (currentObj.object.id === lastBox.id) {
          if (currentFaces[0] !== lastFaces[0] || currentFaces[1] !== lastFaces[1]) {
            currentObj.object.geometry.faces[lastFaces[0]].color.set(emptyColor);
            currentObj.object.geometry.faces[lastFaces[1]].color.set(emptyColor);
          }
        } else {
          resetBoxColor(lastBox)
        }
      }

      lastBox = currentObj.object
      lastFaces = currentFaces
    } else if (lastBox) {
      resetBoxColor(lastBox)
      lastBox = null
    }
  }
}, false);

const addNewBox = (x, y, z) => {
  const newBox = createBox();
  newBox.name = `box${Math.floor(Math.random() * 10000000)}`;
  newBox.position.set(x, y, z);
  newBox.castShadow = true;
  scene.add(newBox);
};


window.addEventListener('mousedown', (e) => {
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length) {
    const [currentObj] = intersects;
    if (currentObj.object.geometry.type === 'BoxGeometry') {
      if (e.button === 2) {
        const boxToRemove = scene.getObjectByName(currentObj.object.name);
        scene.remove(boxToRemove);
      } else {
        const index = Math.floor(intersects[0].faceIndex / 2);
        const { object: { position: { x, y, z } } } = currentObj;
        switch (index) {
          case 0:
            return addNewBox(x + 2.05, y, z);
          case 1:
            return addNewBox(x - 2.05, y, z);
          case 2:
            if (y < 10) {
              return addNewBox(x, y + 2.05, z);
            }
            return;
          case 3:
            return;
          case 4:
            return addNewBox(x, y, z + 2.05);
          case 5:
            return addNewBox(x, y, z - 2.05);
        }
      }
    }
  }
}, false);


const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};


const control = document.querySelectorAll('.control');

control.forEach(button => button.addEventListener('click', () => {
  if (button.classList.contains('black')) {
    defaultColor = new THREE.Color(0x444444);
  }
  if (button.classList.contains('white')) {
    defaultColor = new THREE.Color(0xaaaaaa);
  }
  if (button.classList.contains('wood')) {
    defaultColor = new THREE.Color(0x8F7C56);
  }
  const allBoxes = scene.children.filter(child => child.geometry && child.geometry.type === 'BoxGeometry');
  allBoxes.map(box => {
    box.material.color.set(defaultColor);
    box.geometry.colorsNeedUpdate = true;
    box.material.needsUpdate = true;
  });
}));


render();

function resetBoxColor(box) {
  console.log('reseting box color')
  box.geometry.faces.map(face => face.color.set(emptyColor));
  box.geometry.colorsNeedUpdate = true;
  box.material.needsUpdate = true;
}