'use strict'
import * as BABYLON from 'babylonjs'
import fs from 'fs'
import Atom from '../../Atom.js'
// import { creatModel } from './creatModel.js'
// import { finderAtoms } from './finderAtoms.js'
// import { fileGetContents } from './fileGetContents.js'
// import { tick } from './tick.js'
// import { cylinderMesh } from './cylinderMesh.js'
// import { deleteAtom } from './deleteAtom.js'
// import { addAtom } from './addAtom.js'
class Molecule {
  constructor (scene, colorAtoms) {
    this.scene = scene
    this.atoms = new Set()
    this.colorAtoms = colorAtoms.atoms
    this.ticks = []
    this.molecule = new BABYLON.Mesh.CreateSphere('Sphere', 16, 0, this.scene)
    this.molecule.isVisible = false
  }
  creatMolecule (data = null) {
    if (data) {
      let bounds = []
      data.forEach((atom, index) => {
        console.log(atom)
        let tempAtom = new Atom()
        console.log(this.colorAtoms[atom[1]])
        let atom3D = new BABYLON.Mesh.CreateSphere(atom[1], 16, this.colorAtoms[atom[1]].radius / 100, this.scene)
        atom3D.material = new BABYLON.StandardMaterial('material01', this.scene)
        atom3D.material.diffuseColor = new BABYLON.Color3.FromHexString(this.colorAtoms[atom[1]].color)
        atom3D.position.x = Number(atom[2])
        atom3D.position.y = Number(atom[3])
        atom3D.position.z = Number(atom[4])
        atom3D.parent = this.molecule
        atom3D.doNotSyncBoundingInfo = true
        atom3D.metadata = {}
        atom3D.metadata.number = index
        atom3D.metadata.name = atom[1]
        atom3D.metadata.tick = false
        tempAtom.Object3D = atom3D
        tempAtom.x = Number(atom[2])
        tempAtom.y = Number(atom[3])
        tempAtom.z = Number(atom[4])
        tempAtom.number = index
        tempAtom.name = atom[1]
        console.log(atom3D)
        for (let i = index + 1; i < data.length; i++) {
          let distance = BABYLON.Vector3.Distance(new BABYLON.Vector3(atom[2], atom[3], atom[4]), new BABYLON.Vector3(data[i][2], data[i][3], data[i][4]))
          if (distance <= ((this.colorAtoms[atom[1]].covalentRadius / 100) + (this.colorAtoms[data[i][1]].covalentRadius / 100))) {
            bounds.push([index, i, atom3D])
            tempAtom.connections.push(i)
          }
        }
        this.atoms.add(tempAtom)
      })
      bounds.forEach((bound) => {
        let bond3D = this.creatCyclinder(0, 0, 0, data[bound[1]][2] - data[bound[0]][2], data[bound[1]][3] - data[bound[0]][3], data[bound[1]][4] - data[bound[0]][4], true)
        bond3D.parent = bound[2]
      })
    }
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
    this.creatMolecule(fat)
  }
  creatCyclinder (x0, y0, z0, x1, y1, z1) {
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
    return cylinder
  }
}
// Molecule.prototype.creatModel = creatModel

export default Molecule
