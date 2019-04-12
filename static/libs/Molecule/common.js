'use strict'
import * as THREE from 'three/src/Three'
import { creatModel } from './creatModel.js'
import { finderAtoms } from './finderAtoms.js'
import { fileGetContents } from './fileGetContents.js'
import { tick } from './tick.js'
import { cylinderMesh } from './cylinderMesh.js'
import { deleteAtom } from './deleteAtom.js'
import { addAtom } from './addAtom.js'
class Molecule {
  constructor (scene, ColorAtoms) {
    this.scene = scene
    this.atoms = []
    this.atomsTest = new Set()
    this.k = 0.4
    this.ColorAtoms = ColorAtoms.atoms
    this.ticks = []
    this.ObjectMolecule = new THREE.Object3D()
  }
  destructor () {
    for (let i = 0; i < this.atoms.length; i++) {
      this.ObjectMolecule.remove(this.atoms[i].Object3D)
      this.atoms[i].Object3D.material.dispose()
      this.atoms[i].Object3D.geometry.dispose()
      this.atoms[i] = null
    }
    this.scene.remove(this.ObjectMolecule)
    this.atoms = null
    this.ticks = null
  }
  get3dDistance (startCoords, endCoords) {
    let dx = Math.pow((startCoords.x - endCoords.x), 2)
    let dy = Math.pow((startCoords.y - endCoords.y), 2)
    let dz = Math.pow((startCoords.z - endCoords.z), 2)
    return Math.sqrt(dx + dy + dz)
  }
  getAtom (num) {
    for (let atom of this.atomsTest) {
      if (atom.number === num) {
        return atom
      }
    }
    return false
  }
  getCycle (numAtom) {
    console.log(numAtom)
    let atomFirst = this.getAtom(numAtom)
    atomFirst.connections = []
    atomFirst.Object3D.children = []
    for (let atomSecond of this.atomsTest) {
      if (atomSecond.connections.indexOf(numAtom) !== -1) {
        atomSecond.connections.splice(atomSecond.connections.indexOf(numAtom), 1)
        atomSecond.Object3D.children.forEach((cycle, index) => {
          if (cycle.userData['from'] === numAtom) {
            cycle.material.dispose()
            cycle.geometry.dispose()
            atomSecond.Object3D.children.splice(index, 1)
          }
        })
      }
      if (atomFirst.number !== atomSecond.number) {
        if (!atomFirst.connections.includes(Number(atomSecond.number))) {
          if (this.get3dDistance(atomFirst.position, atomSecond.position) <= ((this.ColorAtoms[atomFirst.name].covalentRadius / 100) + (this.ColorAtoms[atomSecond.name].covalentRadius / 100))) {
            atomFirst.connections.push(Number(atomSecond.number))
            atomSecond.connections.push(Number(atomFirst.number))
            let x1 = atomFirst.x
            let y1 = atomFirst.y
            let z1 = atomFirst.z
            let x2 = (atomSecond.x + x1) / 2
            let y2 = (atomSecond.y + y1) / 2
            let z2 = (atomSecond.z + z1) / 2
            this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), atomFirst, atomSecond)
            x1 = atomSecond.x
            y1 = atomSecond.y
            z1 = atomSecond.z
            x2 = (atomFirst.x + x1) / 2
            y2 = (atomFirst.y + y1) / 2
            z2 = (atomFirst.z + z1) / 2
            this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), atomSecond, atomFirst)
          }
        }
      }
    }
  }
}
Molecule.prototype.creatModel = creatModel
Molecule.prototype.finderAtoms = finderAtoms
Molecule.prototype.fileGetContents = fileGetContents
Molecule.prototype.tick = tick
Molecule.prototype.cylinderMesh = cylinderMesh
Molecule.prototype.deleteAtom = deleteAtom
Molecule.prototype.addAtom = addAtom

export default Molecule
