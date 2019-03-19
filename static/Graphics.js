'use strict'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
export default class Graphics {
  constructor () {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.light = null
    this.control = null
    this.pos = null
    this.canvas = null
    this.molecule = null
  }

  init (domCanvas) {
    this.canvas = domCanvas
    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.canvas})
    this.renderer.setClearColor(0xa4a4a4)
    this.renderer.setSize(window.innerWidth - 100, window.innerHeight)
    this.camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 100) / window.innerHeight, 1, 500)
    this.camera.position.set(0, 10, 10)
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
    // Линии осей
    let axes = new THREE.AxesHelper(1000)
    this.scene.add(axes)
    this.pos = this.camera.clone()
    this.control.update()
    this.renderer.render(this.scene, this.camera)
  }
  initMolecule (molecule) {
    this.molecule = molecule
    console.log(this.molecule)
  }
  render () {
    this.control.update()
    if (this.camera.position.x !== this.pos.position.x) {
      this.renderer.render(this.scene, this.camera)
    }
    this.pos = this.camera.clone()
    this.light.position.copy(this.camera.position)
    requestAnimationFrame(this.render.bind(this))
  }
  raycast (event) {
    let vector = new THREE.Vector3()
    let raycaster = new THREE.Raycaster()
    vector.set(((event.clientX - 100) / this.canvas.width) * 2 - 1, -(event.clientY / this.canvas.height) * 2 + 1, 0.05) // z = 0.5 important!
    vector.unproject(this.camera)
    raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize())
    let intersects = raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length > 0) {
      if (intersects[0].object.type !== 'LineSegments') {
        this.molecule.tick(intersects[0])
        console.log(intersects[0].object)
      } else {
        if (intersects[1].object instanceof THREE.Mesh) {
          this.molecule.tick(intersects[1])
          console.log(intersects[1].object)
        }
      }
    }
    this.renderer.render(this.scene, this.camera)
  }
  resizeWindow () {
    this.camera.aspect = (window.innerWidth - 100) / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth - 100, window.innerHeight)
    this.renderer.render(this.scene, this.camera)
  }
  retThis () {
    return this
  }
}
