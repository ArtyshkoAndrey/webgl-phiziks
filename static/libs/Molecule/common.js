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
}
Molecule.prototype.creatModel = creatModel
Molecule.prototype.finderAtoms = finderAtoms
Molecule.prototype.fileGetContents = fileGetContents
Molecule.prototype.tick = tick
Molecule.prototype.cylinderMesh = cylinderMesh
Molecule.prototype.deleteAtom = deleteAtom
Molecule.prototype.addAtom = addAtom

export default Molecule
