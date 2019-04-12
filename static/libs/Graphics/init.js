import * as THREE from 'three/src/Three'
import OrbitControls from 'three-orbitcontrols'
// Инициализация канваса и всё для 3D
function init (domCanvas) {
  this.canvas = domCanvas
  this.canvas.style.marginLeft = '150px'
  this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.canvas})
  if (this.bgColorBool) {
    this.renderer.setClearColor(0x1E1E1E)
  } else {
    this.renderer.setClearColor(0xE6E6E6)
  }
  this.renderer.setSize(window.innerWidth - 150, window.innerHeight)
  this.camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 150) / window.innerHeight, 1, 50)
  this.camera.position.set(10, 10, 10)
  this.control = new OrbitControls(this.camera, this.renderer.domElement)
  this.control.enableDamping = false
  this.control.enableZoom = true
  this.control.autoRotate = false
  this.control.rotateSpeed = 1
  this.control.zoomSpeed = 1.2
  this.scene = new THREE.Scene()
  this.light = new THREE.DirectionalLight(0xffffff, 1)
  this.light.position.set(10, 10, 10)
  this.scene.add(this.light)
  this.axesHelper = new THREE.AxesHelper(0.2)
  if (window.innerWidth >= 900) {
    this.localToCameraAxesPlacement = new THREE.Vector3(-0.65 * this.camera.aspect, -0.6, -2)
  } else {
    this.localToCameraAxesPlacement = new THREE.Vector3(-0.35 * this.camera.aspect, -0.6, -2)
  }
  this.scene.add(this.axesHelper)
  this.pos = this.camera.clone()
  this.pos.position.x = 0
  this.control.update()
  this.renderer.render(this.scene, this.camera)
}

export { init }
