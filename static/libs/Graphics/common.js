'use strict'
import * as BABYLON from 'babylonjs'
import fs from 'fs'

export default class Graphics {
  constructor (canvas, colorAtoms) {
    this.canvas = canvas
    this.camera = null
    this.light0 = null
    this.molecule = null
    this.colorAtoms = colorAtoms
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
    // console.log(this.colorAtoms.atoms['H'])
    let bounds = []
    if (data) {
      data.forEach((atom, index) => {
        let atom3D = new BABYLON.Mesh.CreateSphere('Sphere', 16, 0.7, this.scene)
        atom3D.material = new BABYLON.StandardMaterial('material01', this.scene)
        atom3D.position.x = atom[2]
        atom3D.position.y = atom[3]
        atom3D.position.z = atom[4]
        atom3D.parent = this.molecule
        for (let i = index + 1; i < data.length; i++) {
          let distance = BABYLON.Vector3.Distance(new BABYLON.Vector3(atom[2], atom[3], atom[4]), new BABYLON.Vector3(data[i][2], data[i][3], data[i][4]))
          // console.log(distance)
          if (distance <= ((this.colorAtoms.atoms[atom[1]].covalentRadius / 100) + (this.colorAtoms.atoms[data[i][1]].covalentRadius / 100))) {
            bounds.push([index, i])
            // console.log(distance)
          }
        }
      })
    }
    bounds.forEach((bound) => {
      let bond3D = this.creatCyclinder(data[bound[0]][2], data[bound[0]][3], data[bound[0]][4], data[bound[1]][2], data[bound[1]][3], data[bound[1]][4], true)
      bond3D.parent = this.molecule
    })
    // console.log(this.molecule)
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
    let distance = BABYLON.Vector3.Distance(new BABYLON.Vector3(x0, y0, z0), new BABYLON.Vector3(x1, y1, z1))
    let v = new BABYLON.Vector3(x0 - x1, y0 - y1, z0 - z1)
    let len = v.length()
    let cylinder = BABYLON.Mesh.CreateCylinder('cylinder', distance, 0.25, 0.25, 6, 1, this.scene, false)
    let material = new BABYLON.StandardMaterial('material02', this.scene)
    material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5)
    cylinder.material = material

    if (len > 0.001) {
      cylinder.rotation.z = Math.acos(v.y / len)
      cylinder.rotation.y = 0.5 * Math.PI + Math.atan2(v.x, v.z)
      cylinder.rotation.order = 'YZX'
    }

    cylinder.position.x = (x1 + x0) / 2
    cylinder.position.y = (y1 + y0) / 2
    cylinder.position.z = (z1 + z0) / 2
    // console.log(cylinder)
    return cylinder
  }
}
