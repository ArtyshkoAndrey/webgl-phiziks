'use strict'
import * as BABYLON from 'babylonjs'

export default class Graphics {
  constructor (canvas) {
    this.canvas = canvas
    this.camera = null
    this.light0 = null
    this.molecule = null
    if (BABYLON.Engine.isSupported()) {
      this.engine = new BABYLON.Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true}, false)
    }
  }
  init () {
    this.scene = new BABYLON.Scene(this.engine)
    this.camera = new BABYLON.ArcRotateCamera('Camera', 0, 0.8, 1, new BABYLON.Vector3.Zero(), this.scene)
    this.light0 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)
    this.light0.intensity = 1
    this.light0.groundColor = new BABYLON.Color3(0.4, 0.4, 0.4)
    this.light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5)
    this.camera.attachControl(this.canvas, true)
    this.camera.lowerRadiusLimit = 10
    this.camera.upperRadiusLimit = 80
    this.camera.idleRotationSpeed = 20
    this.gizmoManager = new BABYLON.GizmoManager(this.scene)
    this.gizmoManager.positionGizmoEnabled = true
    this.gizmoManager.scaleGizmoEnabled = false
    this.scene.onPointerDown = (evt, pickResult) => {
      this.scene.unfreezeActiveMeshes()
      this.scene.freezeActiveMeshes()
      if (evt.button !== 0) { return }
      if (pickResult.hit && pickResult.pickedMesh) {
        console.log(pickResult.pickedMesh)
        pickResult.pickedMesh.material.diffuseColor = new BABYLON.Color3.FromHexString('#ff0000')
      }
    }
  }
  renderLoop () {
    this.scene.render()
  }
  set newMolecule (molecule) {
    this.molecule = molecule
  }
  startRender () {
    this.engine.runRenderLoop(this.renderLoop.bind(this))
    this.gizmoManager.attachableMeshes = this.molecule._children
  }
}
