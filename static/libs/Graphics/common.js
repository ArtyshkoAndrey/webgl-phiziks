'use strict'
import * as BABYLON from 'babylonjs'

export default class Graphics {
  constructor (canvas, colorAtoms) {
    this.canvas = canvas
    this.camera = null
    this.light0 = null
    this.molecule = null
    this.pointer = 'tick'
    this.colorAtoms = colorAtoms.atoms
    if (BABYLON.Engine.isSupported()) {
      this.engine = new BABYLON.Engine(this.canvas, false, {preserveDrawingBuffer: true, stencil: false}, false)
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
    this.camera.lowerRadiusLimit = 5
    this.camera.upperRadiusLimit = 80
    this.camera.idleRotationSpeed = 20
    this.gizmoManager = new BABYLON.GizmoManager(this.scene)
    this.gizmoManager.positionGizmoEnabled = false

    let options = BABYLON.SceneOptimizerOptions.LowDegradationAllowed()
    // console.log(options)
    // options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1))
    // options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1.5))
    let optimizer = new BABYLON.SceneOptimizer(this.scene, options)
    optimizer.start()
    this.scene.onPointerMove = () => {
      let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY)
      while (document.getElementById('mybut')) {
        document.getElementById('mybut').parentNode.removeChild(document.getElementById('mybut'))
      }
      if (pickResult.hit && pickResult.pickedMesh.metadata.type === 'atom') {
        let but = document.createElement('p')
        // but.textContent = ' ';
        but.setAttribute('id', 'mybut')
        // but.zIndex = 0;
        let sty = but.style
        sty.position = 'absolute'
        sty.padding = '5px'
        sty.color = '#ffffff'
        sty.borderRadius = '5px'
        sty.backgroundColor = 'rgba(0,0,0,0.5)'
        sty.zIndex = 999
        sty.fontSize = '10pt'
        sty.textAlign = 'center'
        sty.top = this.scene.pointerY - 10 + 'px'
        sty.left = 150 + this.scene.pointerX + 10 + 'px'
        but.innerHTML = pickResult.pickedMesh.metadata.name + ' <br/> (' + pickResult.pickedMesh.metadata.id + ')'
        // but.textContent =
        but.setAttribute('onmouseover', 'this.style.left = parseInt(this.style.left, 10) + 30 + \'px\'')
        document.body.appendChild(but)
        console.log(pickResult)
        // but.textContent = meshEvent.meshUnderPointer.name
      }
    }
    // optimizer.onFailureObservable.add(() => {
    // console.log(optimizer.currentFrameRate)
    // })
  }
  renderLoop () {
    this.scene.render()
  }
  set newMolecule (molecule) {
    this.molecule = molecule
  }
  changeMode () {
    if (this.pointer === 'tick') {
      this.pointer = 'drag'
      this.gizmoManager.positionGizmoEnabled = true
      this.gizmoManager.gizmos.positionGizmo.onDragEndObservable.add(() => {
        console.log(this.molecule)
        this.molecule.saveDataFile()
      })
    } else {
      this.pointer = 'tick'
      this.gizmoManager.positionGizmoEnabled = false
    }
  }
  startRender () {
    this.engine.runRenderLoop(this.renderLoop.bind(this))
    if (typeof this.molecule.molecule._children === 'undefined') {
      this.molecule.molecule._children = []
    }
    this.gizmoManager.attachableMeshes = this.molecule.molecule._children
  }
}
