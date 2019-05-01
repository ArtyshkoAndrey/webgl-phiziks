'use strict'
import * as BABYLON from 'babylonjs'
import fs from 'fs'

export default class Graphics {
  constructor (canvas) {
    this.canvas = canvas
    this.camera = null
    this.light0 = null
    this.molecule = null
    if (BABYLON.Engine.isSupported()) {
      this.engine = new BABYLON.Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true})
    }
  }
  init () {
    this.scene = new BABYLON.Scene(this.engine)
    this.camera = new BABYLON.ArcRotateCamera('Camera', 0, 0.8, 15, new BABYLON.Vector3.Zero(), this.scene)
    this.light0 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)
    this.light0.intensity = 1
    this.light0.groundColor = new BABYLON.Color3(0.4, 0.4, 0.4)
    this.light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5)
    this.camera.attachControl(this.canvas, true)
    this.camera.lowerRadiusLimit = 10
    this.camera.upperRadiusLimit = 80
    this.camera.idleRotationSpeed = 20
    this.camera.useAutoRotationBehavior = true
    this.molecule = new BABYLON.Mesh.CreateSphere('Sphere', 16, 0, this.scene)
    this.engine.runRenderLoop(this.renderLoop.bind(this))
  }
  renderLoop () {
    this.scene.render()
  }
  reedMol (data = null) {
    let bounds = [[1, 2], [3, 2], [1, 4]]
    if (data) {
      data.forEach((atom, index) => {
        let atom3D = new BABYLON.Mesh.CreateSphere('Sphere', 16, 0.7, this.scene)
        atom3D.material = new BABYLON.StandardMaterial('material01', this.scene)
        atom3D.position.x = atom[2]
        atom3D.position.y = atom[3]
        atom3D.position.z = atom[4]
        atom3D.parent = this.molecule
      })
    }
    bounds.forEach((bound) => {
      let atom1 = this.molecule._children[bound[0]]
      console.log(atom1)
      let atom2 = this.molecule._children[bound[1]]
      let bond3D = this.creatCyclinder(atom1.position.x, atom1.position.y, atom1.position.z, atom2.position.x, atom2.position.y, atom2.position.z, true)
      bond3D.parent = this.molecule
    })
    console.log(this.molecule)
  }
  fileGetContents (url) {
    let txt = fs.readFileSync(url, 'utf-8')
    let arr = txt.split('\n')
    let fix = []
    let fat = []
    let b = false
    for (let i = 0; i < arr.length; i++) {
      fix[i] = []
      for (let j = 0; j < arr[i].split(' ').length; j++) {
        if (arr[i].split(' ')[j] !== '') {
          fix[i].push(arr[i].split(' ')[j])
        }
      }
    }
    for (let i = 0; i < fix.length; i++) {
      if (b && fix[i].length >= 2) {
        if (fix[i][0] !== '') {
          fat.push(fix[i])
          if (fix[i + 1].length === 1) {
            b = false
          }
        }
      }
      if ((fix[i][0] + ' ' + fix[i][1]) === 'CARTESIAN COORDINATES') {
        b = true
        i += 4
        fat.push(fix[i])
      }
    }
    console.log('end file')
    this.reedMol(fat)
  }
  creatCyclinder (x0, y0, z0, x1, y1, z1, open) {
    x0 = Number(x0)
    y0 = Number(y0)
    z0 = Number(z0)
    x1 = Number(x1)
    y1 = Number(y1)
    z1 = Number(z1)
    let v = new BABYLON.Vector3(x0 - x1, y0 - y1, z0 - z1)
    let len = v.length()
    let cylinder = BABYLON.Mesh.CreateCylinder('cylinder', 1, 0.25, 6, this.scene, false)
    let material = new BABYLON.StandardMaterial('material01', this.scene)
    material.diffuseColor = new BABYLON.Color3(255, 255, 255)
    cylinder.material = material

    if (len > 0.001) {
      cylinder.rotation.z = Math.acos(v.y / len)
      cylinder.rotation.y = 0.5 * Math.PI + Math.atan2(v.x, v.z)
      cylinder.rotation.order = 'YZX'
    }

    cylinder.position.x = (x1 + x0) / 2
    cylinder.position.y = (y1 + y0) / 2
    cylinder.position.z = (z1 + z0) / 2

    return cylinder
  }
}
