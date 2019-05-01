'use strict'
import * as BABYLON from 'babylonjs'

export default class Graphics {
  constructor (canvas) {
    this.canvas = canvas
    this.camera = null
    this.light0 = null
    if (BABYLON.Engine.isSupported()) {
      this.engine = new BABYLON.Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true})
    }
  }
  init () {
    this.scene = new BABYLON.Scene(this.engine)
    this.camera = new BABYLON.ArcRotateCamera('Camera', 0, 0.8, 15, new BABYLON.Vector3.Zero(), this.scene)
    this.light0 = new BABYLON.PointLight('Omni0', new BABYLON.Vector3(0, 100, 100), this.scene)
    let sphere = BABYLON.Mesh.CreateSphere('Sphere', 16, 0, this.scene)
    let atom = BABYLON.Mesh.CreateSphere('Sphere', 16, 0.7, this.scene)
    let material = new BABYLON.StandardMaterial('material01', this.scene)
    material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0)
    atom.material = material
    atom.position.x = 10
    atom.position.y = 10
    atom.position.z = 10
    atom.parent = sphere
    this.engine.runRenderLoop(this.renderLoop.bind(this))
  }
  renderLoop () {
    this.scene.render()
  }
  reedMol (data = null) {
    if (data) {
      
    }
  }
}
