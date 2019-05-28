'use strict'
import * as BABYLON from 'babylonjs'
import fs from 'fs'
import Atom from '../../Atom.js'
import exec from 'executive'
// TODO Везде пиреписать BOUND BOUNDS на BOND BONDS
class Molecule {
  constructor (scene, colorAtoms) {
    this.scene = scene
    this.atoms = new Set()
    this.colorAtoms = colorAtoms.atoms
    this.ticks = []
    this.pointer = 'tick'
    this.maxNumber = 0
    this.textFile = ''
    this.molecule = new BABYLON.Mesh.CreateSphere('Sphere', 16, 0, this.scene)
    this.molecule.isVisible = false
    this.scene.onPointerDown = (evt, pickResult) => {
      this.scene.unfreezeActiveMeshes()
      this.scene.freezeActiveMeshes()
      if (evt.button !== 0) { return }
      if (pickResult.hit && pickResult.pickedMesh && this.pointer === 'tick') {
        let mesh = pickResult.pickedMesh
        console.log(mesh.parent)
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
  babelData (path = null, saveData = false, getData = false) {
    if (getData) {
      fs.readFile(path, 'utf8', (err, contents) => {
        if (err) {
          console.log(err)
        } else {
          this.textFile = contents
        }
        console.log(this.textFile)
      })
    }
    if (saveData) {
      console.log('saved')
    }
    if (path) {
      let arrayPath = path.split('\\')
      let nameFile = arrayPath.pop()
      let babelResult = null
      exec.sync('babel ' + nameFile + ' -ocml', {cwd: arrayPath.join('\\')}, (err, stdout, stderr) => {
        if (err) {
          console.log(new Error('Lol'))
        } else {
          console.log(stderr)
          let parseString = require('xml2js').parseString
          parseString(stdout, {
            trim: true,
            normalize: true,
            explicitArray: false,
            preserveChildrenOrder: true,
            explicitCharkey: true
          }, (err, result) => {
            if (err) {
              return new Error('Lol')
            }
            babelResult = result
          })
        }
      })
      return babelResult.molecule
    }
    return null
  }
  connectAtom () {
    if (this.ticks.length === 2) {
      return console.log(this.ticks)
    }
  }
  // TODO Переисать bond
  createAtom (symbol) {
    this.maxNumber++
    let bounds = []
    let atom = new Atom()
    atom.x = 0
    atom.y = 0
    atom.z = 0
    atom.name = symbol
    atom.number = this.maxNumber
    let atom3D = new BABYLON.Mesh.CreateSphere(symbol, 16, this.colorAtoms[atom.name].radius / 100, this.scene)
    atom3D.material = new BABYLON.StandardMaterial('material01', this.scene)
    atom3D.material.diffuseColor = new BABYLON.Color3.FromHexString(this.colorAtoms[symbol].color)
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
    if (bounds.length > 0) {
      this.createBounds(bounds)
    }
  }
  findAtom (id) {
    for (let atom of this.atoms) {
      if (atom.id === id) {
        return atom
      }
    }
    return undefined
  }
  createBounds (bounds) {
    bounds.forEach((bound) => {
      let atom = this.findAtom(bound[0])
      let atom2 = this.findAtom(bound[1])
      let position = atom.Object3D.position
      let position2 = atom2.Object3D.position
      let bound3D = this.creatCyclinder(0, 0, 0, position2.x - position.x, position2.y - position.y, position2.z - position.z, 1)
      if (bound[2] === '2') {
        let bound3D2 = bound3D.clone('cylinder2')
        bound3D2.position.x = Number(position2.x - position.x) / 2 - 0.05
        bound3D2.position.y = Number(position2.y - position.y) / 2 - 0.05
        bound3D2.position.z = Number(position2.z - position.z) / 2 - 0.05
        let bounds3D = BABYLON.Mesh.MergeMeshes([bound3D, bound3D2])
        bounds3D.material.diffuseColor = new BABYLON.Color3.FromHexString('#747474')
        bounds3D.name = 'cylinder'
        bounds3D.parent = atom.Object3D
        bounds3D.metadata = {from: atom.number, to: atom2.number}
      } else if (bound[2] === '1') {
        bound3D.name = 'cylinder'
        bound3D.parent = atom.Object3D
        bound3D.metadata = {from: atom.number, to: atom2.number}
      } else if (bound[2] === '3') {
        let bound3D2 = bound3D.clone('cylinder2')
        bound3D2.position.x = Number(position2.x - position.x) / 2 - 0.05
        bound3D2.position.y = Number(position2.y - position.y) / 2 - 0.05
        bound3D2.position.z = Number(position2.z - position.z) / 2 - 0.05
        let bound3D3 = bound3D.clone('cylinder3')
        bound3D3.position.x = Number(position2.x - position.x) / 2 - 0.12
        bound3D3.position.y = Number(position2.y - position.y) / 2 - 0.12
        bound3D3.position.z = Number(position2.z - position.z) / 2 - 0.12
        let bounds3D = BABYLON.Mesh.MergeMeshes([bound3D, bound3D2, bound3D3])
        bounds3D.material.diffuseColor = new BABYLON.Color3.FromHexString('#494848')
        bounds3D.name = 'cylinder'
        bounds3D.parent = atom.Object3D
        console.log(atom)
        bounds3D.metadata = {from: atom.number, to: atom2.number}
      }
    })
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
      let bonds = []
      data.atomArray.atom.forEach((atom, index) => {
        atom = atom.$
        let tempAtom = new Atom()
        let atom3D = new BABYLON.Mesh.CreateSphere(atom[1], 16, this.colorAtoms[atom.elementType].radius / 100, this.scene)
        atom3D.material = new BABYLON.StandardMaterial('material01', this.scene)
        atom3D.material.diffuseColor = new BABYLON.Color3.FromHexString(this.colorAtoms[atom.elementType].color)
        atom3D.position.x = Number(atom.x3)
        atom3D.position.y = Number(atom.y3)
        atom3D.position.z = Number(atom.z3)
        atom3D.parent = this.molecule
        atom3D.doNotSyncBoundingInfo = true
        atom3D.metadata = {}
        atom3D.metadata.number = index
        atom3D.metadata.name = atom.elementType
        atom3D.metadata.tick = false
        atom3D.metadata.id = atom.id
        tempAtom.Object3D = atom3D
        tempAtom.x = Number(atom.x3)
        tempAtom.y = Number(atom.y3)
        tempAtom.z = Number(atom.z3)
        tempAtom.number = index
        tempAtom.name = atom.elementType
        tempAtom.id = atom.id
        this.maxNumber = index
        this.atoms.add(tempAtom)
      })
      data.bondArray.bond.forEach((bond, index) => {
        bond = bond.$
        let ids = bond.atomRefs2.split(' ')
        bonds.push([ids[0], ids[1], bond.order])
      })
      this.createBounds(bonds)
    }
  }
  fileGetContents (url) {
    let fat = this.babelData(url)
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
