import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import _ from 'lodash';

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

const defaultColor = new THREE.Color('hsl(0, 0%, 65%)');
const highlightColor = new THREE.Color('hsl(40, 85%, 70%)');

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
  return new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshPhongMaterial({
    color: defaultColor,
    vertexColors: THREE.VertexColors
  }));
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const resetFacesColors = () => {
  const allBoxes = scene.children.filter(child => child.geometry && child.geometry.type === 'BoxGeometry');
  allBoxes.map((box) => box.geometry.faces.map(face => {
    console.log(face.color.getHex());
    face.color && face.color.set(0xffffff);
  }));
}

window.addEventListener('mousemove', _.throttle(resetFacesColors, 200));

window.addEventListener('mousemove', (e) => {
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length) {
    const [currentObj] = intersects;
    if (currentObj.object.geometry.type === 'BoxGeometry') {
      currentObj.object.geometry.faces.map(face => {
        face.color.set(0xffffff);
      });
      currentObj.object.geometry.colorsNeedUpdate = true;
      currentObj.object.material.vertexColors = true;
      currentObj.object.geometry.needsUpdate = true;
      if (currentObj.faceIndex % 2 === 0) {
        currentObj.object.geometry.faces[currentObj.faceIndex].color.set(highlightColor);
        currentObj.object.geometry.faces[currentObj.faceIndex + 1].color.set(highlightColor);
      } else {
        currentObj.object.geometry.faces[currentObj.faceIndex].color.set(highlightColor);
        currentObj.object.geometry.faces[currentObj.faceIndex - 1].color.set(highlightColor);
      }

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
      if (e.button === 2) {
        const boxToRemove = scene.getObjectByName(currentObj.object.name);
        scene.remove(boxToRemove);
      } else {
        const index = Math.floor(intersects[0].faceIndex / 2);
        const { object: { position: { x, y, z } } } = currentObj;
        let newBox;
        switch (index) {
          case 0:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random() * 10000000)}`;
            newBox.position.set(x + 2.05, y, z);
            scene.add(newBox);
            newBox = null;
            return;
          case 1:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random() * 10000000)}`;
            newBox.position.set(x - 2.05, y, z);
            scene.add(newBox);
            newBox = null;
            return;
          case 2:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random() * 10000000)}`;
            newBox.position.set(x, y + 2.05, z);
            scene.add(newBox);
            newBox = null;
            return;
          case 3:
            return;
          case 4:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random() * 10000000)}`;
            newBox.position.set(x, y, z + 2.05);
            scene.add(newBox);
            newBox = null;
            return;
          case 5:
            newBox = createBox();
            newBox.name = `box${Math.floor(Math.random() * 10000000)}`;
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