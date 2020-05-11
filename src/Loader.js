import * as THREE from 'three';

export class Loader {
  constructor(Animation) {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.animation = new Animation(this);
    this.loop();

    window.addEventListener('resize', this.handleResize);
  }

  setupScene = () => {
    this.scene = new THREE.Scene();
  }

  setupCamera = () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(80, aspectRatio, 0.0001, 10000);
    this.camera.position.set(0, 0, 50);
  }

  setupRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  handleResize = () => {
    const {innerWidth, innerHeight} = window;
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  loop = () => {
    if (this.animation.update) {
      this.animation.update();
    }
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop);
  }
}