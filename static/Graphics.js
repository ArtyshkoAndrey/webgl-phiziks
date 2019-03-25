'use strict'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
export default class Graphics {
  constructor (bgColorBool) {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.light = null
    this.control = null
    this.pos = null
    this.canvas = null
    this.molecule = null
    this.bgColorBool = bgColorBool
    this.requestA = null
    this.localToCameraAxesPlacement = null
    this.axesHelper = null
  }
  // Инициализация канваса и всё для 3D
  init (domCanvas) {
    this.canvas = domCanvas
    this.canvas.style.marginLeft = '150px'
    this.renderer = new THREE.WebGLRenderer({antialias: true, canvas: this.canvas})
    if (this.bgColorBool) {
      this.renderer.setClearColor(0xE6E6E6)
    } else {
      this.renderer.setClearColor(0x1E1E1E)
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
    // Линии осей
    // let axes = new THREE.AxesHelper(10)
    // this.scene.add(axes)
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
  // Создание свойства молекулы
  initMolecule (molecule) {
    this.molecule = molecule
    console.log(this.molecule)
  }
  // Функция рекрсивная для отображение 3D
  render () {
    this.control.update()
    if (this.camera.position.x !== this.pos.position.x) {
      this.camera.updateMatrixWorld()
      let axesPlacement = this.camera.localToWorld(this.localToCameraAxesPlacement.clone())
      this.axesHelper.position.copy(axesPlacement)
      this.renderer.render(this.scene, this.camera)
    }
    this.pos = this.camera.clone()
    this.light.position.copy(this.camera.position)
    this.requestA = requestAnimationFrame(this.render.bind(this))
  }
  // Выделение атома при клике
  raycast (event) {
    console.log(event.offsetX)
    let vector = new THREE.Vector3()
    let raycaster = new THREE.Raycaster()
    vector.set((event.offsetX / this.canvas.width) * 2 - 1, -(event.offsetY / this.canvas.height) * 2 + 1, 0.05) // z = 0.5 important!
    vector.unproject(this.camera)
    raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize())
    let intersects = raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length > 0) {
      console.log(intersects)
      if (intersects[0].object.type !== 'LineSegments') {
        if (intersects[0].object.geometry instanceof THREE.SphereGeometry) {
          this.molecule.tick(intersects[0])
          // console.log(intersects[0].object)
        }
      } else {
        if (typeof intersects[3] === 'object') {
          if (intersects[3].object instanceof THREE.Mesh) {
            if (intersects[3].object.geometry instanceof THREE.SphereGeometry) {
              this.molecule.tick(intersects[3])
              // console.log(intersects[1].object)
            }
          }
        }
      }
    }
    this.renderer.render(this.scene, this.camera)
  }
  // Изменение размера канваса при изменении окна
  resizeWindow () {
    this.camera.aspect = (window.innerWidth - 150) / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth - 150, window.innerHeight)
    if (window.innerWidth >= 900) {
      this.localToCameraAxesPlacement = new THREE.Vector3(-0.65 * this.camera.aspect, -0.6, -2)
    } else {
      this.localToCameraAxesPlacement = new THREE.Vector3(-0.35 * this.camera.aspect, -0.6, -2)
    }
    let axesPlacement = this.camera.localToWorld(this.localToCameraAxesPlacement.clone())
    this.axesHelper.position.copy(axesPlacement)
    this.renderer.render(this.scene, this.camera)
  }
  // Вывод инфы при наведении на атом
  getInfo (event) {
    // console.log(event)
    let div = document.getElementById('infoMouse')
    let vector = new THREE.Vector3()
    let raycaster = new THREE.Raycaster()
    vector.set(((event.clientX - 150) / this.canvas.width) * 2 - 1, -(event.clientY / this.canvas.height) * 2 + 1, 0.05) // z = 0.5 important!
    vector.unproject(this.camera)
    raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize())
    let intersects = raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length > 0) {
      if (intersects[0].object.type !== 'LineSegments') {
        if (intersects[0].object.geometry instanceof THREE.SphereGeometry) {
          // console.log(intersects[0].object)
          div.style.top = event.clientY + 10 + 'px'
          div.style.left = event.clientX + 10 + 'px'
          div.style.display = 'block'
          div.textContent = intersects[0].object.userData['AtomName']
        } else {
          div.style.display = 'none'
        }
      } else {
        // console.log(typeof intersects[1])
        if (typeof intersects[3] === 'object') {
          if (intersects[3].object instanceof THREE.Mesh) {
            if (intersects[3].object.geometry instanceof THREE.SphereGeometry) {
              // console.log(intersects[1].object)
              div.style.top = event.clientY + 10 + 'px'
              div.style.left = event.clientX + 10 + 'px'
              div.style.display = 'block'
              div.textContent = intersects[3].object.userData['AtomName']
            } else {
              div.style.display = 'none'
            }
          } else {
            div.style.display = 'none'
          }
        } else {
          div.style.display = 'none'
        }
      }
    } else {
      div.style.display = 'none'
    }
  }
  retThis () {
    return this
  }
  destuctor () {
    cancelAnimationFrame(this.requestA)
    let self = this
    this.molecule.atoms.forEach(function (atom) {
      self.scene.remove(atom.Object3D)
    })
    this.scene.remove(this.light)
    this.scene.remove(this.camera)
    this.renderer.dispose()
    this.scene.dispose()
    this.requestA = null
    this.pos = null
    this.scene = null
    this.control = null
    this.camera = null
    this.light = null
    this.renderer.forceContextLoss()
    this.renderer.context = null
    this.renderer.domElement = null
    this.canvas = null
    this.molecule = null
    this.bgColorBool = null
  }
}
