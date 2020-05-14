import * as THREE from 'three';

let scene, camera, renderer;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.0001, 10000);
camera.position.set(0, 0, 50);
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const handleResize = () => {
  const { innerWidth, innerHeight } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};

const createBox = (s = 2, color = 0xffffff) => {
  const boxGeo = new THREE.BoxGeometry(s, s, s);
  const boxMat = new THREE.MeshPhongMaterial({
    color: 0xfdd927,
    shininess: 0,
  });
  return new THREE.Mesh(boxGeo, boxMat);
};

const createPointLight = (i = 1, color = 0xffffff) => {
  return new THREE.PointLight(color, i);
};

const l1 = createPointLight(1);
l1.position.set(0, 0, 100);
scene.add(l1);

let boxes = [];

for (let i = 0; i <= 10; i++) {
  for (let j = 0; j <= 15; j++) {
    const newBox = createBox(5);
    newBox.position.set(6 * j - 35, 7.2 * i-25, 0);
    boxes.push(newBox);
  }
}

boxes.forEach(box => scene.add(box));


const loop = () => {
  boxes.forEach((box, i) => box.rotation.x += 0.0002*i);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};

loop();
window.addEventListener('resize', handleResize);