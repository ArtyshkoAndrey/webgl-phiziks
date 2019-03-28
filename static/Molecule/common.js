'use strict'
import * as THREE from 'three'
import { creatModel } from './creatModel.js'
import { finderAtoms } from './finderAtoms.js'
import { fileGetContents } from './fileGetContents.js'
import { tick } from './tick.js'
import { changePosition } from './changePosition.js'
import { cylinderMesh } from './cylinderMesh.js'
class Molecule {
  constructor (scene) {
    this.scene = scene
    this.atoms = []
    this.k = 0.4
    this.ColorAtoms = {}
    this.ticks = []
    this.ObjectMolecule = new THREE.Object3D()
  }
  destuctor () {
    for (let i = 0; i < this.atoms.length; i++) {
      this.ObjectMolecule.remove(this.atoms[i].Object3D)
      this.atoms[i].Object3D.material.dispose()
      this.atoms[i].Object3D.geometry.dispose()
      this.atoms[i] = null
    }
    this.scene.remove(this.ObjectMolecule)
    this.atoms = null
    this.ColorAtoms = null
    this.ticks = null
  }
  get3dDistance (startCoords, endCoords) {
    let dx = Math.pow((startCoords.x - endCoords.x), 2)
    let dy = Math.pow((startCoords.y - endCoords.y), 2)
    let dz = Math.pow((startCoords.z - endCoords.z), 2)
    return Math.sqrt(dx + dy + dz)
  }
  getAtom (num) {
    for (let i = 0; i < this.atoms.length; i++) {
      if (num === this.atoms[i].number) {
        return this.atoms[i]
      }
    }
    return false
  }
}
Molecule.prototype.creatModel = creatModel
Molecule.prototype.finderAtoms = finderAtoms
Molecule.prototype.fileGetContents = fileGetContents
Molecule.prototype.tick = tick
Molecule.prototype.changePosition = changePosition
Molecule.prototype.cylinderMesh = cylinderMesh

export default Molecule
