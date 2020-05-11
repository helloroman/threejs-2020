import * as THREE from 'three';

export class Animation {
  constructor(loader) {
    this.loader = loader;
    this.pointLight = new THREE.PointLight(0xffffff, 1);
    this.pointLight2 = new THREE.PointLight(0xffffff, .5);
    this.pointLight.position.set(10,10,10);
    this.pointLight2.position.set(-30,-10,10);
    this.loader.scene.add(this.pointLight, this.pointLight2);
    this.createCloud();
  }

  createCloud = () => {
    this.cloud = new THREE.Object3D();
    let pos = 0;
    for (let i = 0; i <= 100; i++) {
      const color = new THREE.Color(`hsl(${150+Math.random()*60}, 100%, 35%)`);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color })
      const cubeGeometry = new THREE.BoxGeometry(Math.random() * 50,Math.random() * 2,Math.random() * 10);
      const newSphere = new THREE.Mesh(cubeGeometry, cubeMaterial);
      newSphere.position.set(pos/3, -50 + pos * 2, 0);
      this.cloud.add(newSphere);
      pos++;
    }
    this.loader.scene.add(this.cloud);
  }

  update = () => {
  }
}