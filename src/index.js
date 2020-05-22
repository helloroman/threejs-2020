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

const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0xaaaaaa }));
box.castShadow = true;
box.geometry.elementsNeedUpdate = true;
box.geometry.colorsNeedUpdate = true;
box.geometry.groupsNeedUpdate = true;
scene.add(box);

const createBox = () => {
  return new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({ color: 0xaaaaaa }));
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length) {
    const [currentObj] = intersects;
    if (currentObj.object.geometry.type === 'BoxGeometry') {

      const index = Math.floor(intersects[0].faceIndex / 2);
      currentObj.object.geometry.faces[index].color.set(0x1122ff);
    }
  }
}, false);

window.addEventListener('mousedown', (e) => {
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length) {
    const [currentObj] = intersects;
    if (currentObj.object.geometry.type === 'BoxGeometry') {
      console.log(e.button);
      if (e.button === 2) {
        const boxToRemove = scene.getObjectByName(currentObj.object.name);
        scene.remove(boxToRemove);
      } else {
        console.log('cycki');
        const index = Math.floor(intersects[0].faceIndex / 2);
        const { object: { position: { x, y, z } } } = currentObj;
        let newBox;
        switch (index) {
          case 0:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random()*10000000)}`;
            console.log(newBox.name);
            newBox.position.set(x + 2.05, y, z);
            scene.add(newBox);
            newBox = null;
            return;
          case 1:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random()*10000000)}`;
            newBox.position.set(x - 2.05, y, z);
            scene.add(newBox);
            newBox = null;
            return;
          case 2:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random()*10000000)}`;
            newBox.position.set(x, y + 2.05, z);
            scene.add(newBox);
            newBox = null;
            return;
          case 3:
            return;
          case 4:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random()*10000000)}`;
            newBox.position.set(x, y, z + 2.05);
            scene.add(newBox);
            newBox = null;
            return;
          case 5:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random()*10000000)}`;
            newBox.position.set(x, y, z - 2.05);
            scene.add(newBox);
            newBox = null;
            return;
        }
      }
    }
  }
}, false);


const render = () => {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

render();