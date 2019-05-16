'use strict'
import * as BABYLON from 'babylonjs'
import { readOutFile } from '../functions.js'
import Atom from '../../Atom.js'
class Molecule {
  constructor (scene, colorAtoms) {
    this.scene = scene
    this.atoms = new Set()
    this.colorAtoms = colorAtoms.atoms
    this.ticks = []
    this.pointer = 'tick'
    this.maxNumber = 0
    this.molecule = new BABYLON.Mesh.CreateSphere('Sphere', 16, 0, this.scene)
    this.molecule.isVisible = false
    this.scene.onPointerDown = (evt, pickResult) => {
      this.scene.unfreezeActiveMeshes()
      this.scene.freezeActiveMeshes()
      if (evt.button !== 0) { return }
      if (pickResult.hit && pickResult.pickedMesh && this.pointer === 'tick') {
        let mesh = pickResult.pickedMesh
        if (mesh.name !== 'cylinder') {
          if (mesh.material.diffuseColor.r === 1 && mesh.material.diffuseColor.g === 0 && mesh.material.diffuseColor.b === 0) {
            mesh.material.diffuseColor = new BABYLON.Color3.FromHexString(this.colorAtoms[mesh.metadata.name].color)
            this.ticks = this.ticks.filter(num => num !== mesh.metadata.number)
          } else {
            mesh.material.diffuseColor = new BABYLON.Color3.FromHexString('#ff0000')
            this.ticks.push(mesh.metadata.number)
          }
        }
      }
    }
  }
  createAtom (symbol) {
    this.maxNumber++
    let atom = new Atom()
    atom.x = 0
    atom.y = 0
    atom.z = 0
    atom.name = symbol
    atom.number = this.maxNumber
    let atom3D = new BABYLON.Mesh.CreateSphere(atom[1], 16, this.colorAtoms[atom.name].radius / 100, this.scene)
    atom3D.material = new BABYLON.StandardMaterial('material01', this.scene)
    atom3D.material.diffuseColor = new BABYLON.Color3.FromHexString(this.colorAtoms[atom.name].color)
    atom3D.position.x = atom.x
    atom3D.position.y = atom.y
    atom3D.position.z = atom.z
    atom3D.parent = this.molecule
    atom3D.doNotSyncBoundingInfo = true
    atom3D.metadata = {}
    atom3D.metadata.number = atom.number
    atom3D.metadata.name = atom.name
    atom3D.metadata.tick = false
    atom.Object3D = atom3D
    this.atoms.add(atom)
  }
  deleteAtom () {
    if (this.ticks.length > 0) {
      for (let atom of this.atoms) {
        if (this.ticks.includes(atom.Object3D.metadata.number)) {
          atom.Object3D.material.dispose()
          atom.Object3D.dispose()
          atom.deleted = true
          for (let tempAtom of this.atoms) {
            console.log(tempAtom.Object3D._children)
            if (atom.number !== tempAtom.number && tempAtom.Object3D._children !== undefined) {
              tempAtom.Object3D._children.forEach(bound => {
                if (bound.metadata.to === atom.number) {
                  bound.dispose()
                  bound.material.dispose()
                  bound = null
                }
              })
            }
          }
        }
      }
      this.ticks = []
    }
  }
  changeMode () {
    if (this.pointer === 'tick') {
      this.pointer = 'drag'
    } else {
      this.pointer = 'tick'
    }
  }
  creatMolecule (data = null) {
    if (data) {
      let bounds = []
      data.forEach((atom, index) => {
        let tempAtom = new Atom()
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
        this.maxNumber = index
        for (let i = index + 1; i < data.length; i++) {
          let distance = BABYLON.Vector3.Distance(new BABYLON.Vector3(atom[2], atom[3], atom[4]), new BABYLON.Vector3(data[i][2], data[i][3], data[i][4]))
          let covalentRadius = (this.colorAtoms[atom[1]].covalentRadius / 100) + (this.colorAtoms[data[i][1]].covalentRadius / 100)
          let doubleCovalentRadius = (this.colorAtoms[atom[1]].doubleCovalentRadius / 100) + (this.colorAtoms[data[i][1]].doubleCovalentRadius / 100)
          let tripleCovalentRadius = (this.colorAtoms[atom[1]].tripleCovalentRadius / 100) + (this.colorAtoms[data[i][1]].tripleCovalentRadius / 100)
          // console.log('1: ', distance <= covalentRadius, '2: ', distance >= doubleCovalentRadius, distance, covalentRadius, doubleCovalentRadius)
          // console.log('1: ', distance <= doubleCovalentRadius, '2: ', distance > tripleCovalentRadius, distance, doubleCovalentRadius, tripleCovalentRadius)
          // console.log('1: ', distance <= tripleCovalentRadius + 4 '2: ', distance >= tripleCovalentRadius - 4, distance, tripleCovalentRadius + 4, tripleCovalentRadius - 4)
          // console.log('------------------------')
          if (distance <= covalentRadius && distance >= doubleCovalentRadius) { // Одинарная свяь
            bounds.push([index, i, atom3D, 'once'])
            tempAtom.connections.push({num: i, type: 'once'})
          } else if (distance <= doubleCovalentRadius && distance > tripleCovalentRadius) { // Двойная свяь
            bounds.push([index, i, atom3D, 'double'])
            tempAtom.connections.push({num: i, type: 'double'})
          } else if (distance <= tripleCovalentRadius + 0.05) { // Тройная свяь
            bounds.push([index, i, atom3D, 'triple'])
            tempAtom.connections.push({num: i, type: 'triple'})
          }
        }
        this.atoms.add(tempAtom)
      })
      bounds.forEach((bound) => {
        let bound3D = this.creatCyclinder(0, 0, 0, data[bound[1]][2] - data[bound[0]][2], data[bound[1]][3] - data[bound[0]][3], data[bound[1]][4] - data[bound[0]][4], 1)
        if (bound[3] === 'double') {
          // bound3D.parent = bound[2]
          let bound3D2 = bound3D.clone('cylinder2')
          bound3D2.position.x = Number(data[bound[1]][2] - data[bound[0]][2]) / 2 - 0.05
          bound3D2.position.y = Number(data[bound[1]][3] - data[bound[0]][3]) / 2 - 0.05
          bound3D2.position.z = Number(data[bound[1]][4] - data[bound[0]][4]) / 2 - 0.05
          // bound3D2.parent = bound[2]
          let bounds3D = BABYLON.Mesh.MergeMeshes([bound3D, bound3D2])
          bounds3D.parent = bound[2]
          bounds3D.metadata = {from: bound[1], to: bound[2].metadata.number}
        } else if (bound[3] === 'once') {
          bound3D.parent = bound[2]
          bound3D.metadata = {from: bound[1], to: bound[2].metadata.number}
        } else if (bound[3] === 'triple') {
          // bound3D.parent = bound[2]
          let bound3D2 = bound3D.clone('cylinder2')
          bound3D2.position.x = Number(data[bound[1]][2] - data[bound[0]][2]) / 2 - 0.05
          bound3D2.position.y = Number(data[bound[1]][3] - data[bound[0]][3]) / 2 - 0.05
          bound3D2.position.z = Number(data[bound[1]][4] - data[bound[0]][4]) / 2 - 0.05
          // bound3D2.parent = bound[2]
          let bound3D3 = bound3D.clone('cylinder3')
          bound3D3.position.x = Number(data[bound[1]][2] - data[bound[0]][2]) / 2 - 0.12
          bound3D3.position.y = Number(data[bound[1]][3] - data[bound[0]][3]) / 2 - 0.12
          bound3D3.position.z = Number(data[bound[1]][4] - data[bound[0]][4]) / 2 - 0.12
          // bound3D3.parent = bound[2]
          let bounds3D = BABYLON.Mesh.MergeMeshes([bound3D, bound3D2, bound3D3])
          bounds3D.parent = bound[2]
          bounds3D.metadata = {from: bound[2].metadata.number, to: bound[1]}
        }
      })
    }
  }
  fileGetContents (url) {
    let fat = readOutFile(url)
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
    let cylinder = BABYLON.Mesh.CreateCylinder('cylinder1', distance, 0.1, 0.1, 4, 1, this.scene, false)
    let material = new BABYLON.StandardMaterial('material02', this.scene)
    material.diffuseColor = new BABYLON.Color3(1, 1, 1)
    cylinder.material = material

    if (len > 0.001) {
      cylinder.rotation.z = Math.acos(v.y / len)
      cylinder.rotation.y = 0.5 * Math.PI + Math.atan2(v.x, v.z)
      cylinder.rotation.order = 'YZX'
    }
    cylinder.position.x = (x1 + x0) / 2 + 0.05
    cylinder.position.y = (y1 + y0) / 2 + 0.05
    cylinder.position.z = (z1 + z0) / 2 + 0.05
    return cylinder
  }
}

export default Molecule
