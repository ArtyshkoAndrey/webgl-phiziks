'use strict'
import * as THREE from 'three/src/Three'
import Atom from './../../Atom.js'
function addAtom (symbol) {
  let atom = new Atom()
  atom.position = new THREE.Vector3(0, 0, 0)
  atom.name = symbol
  let num = 0
  this.atomsTest.forEach((el) => {
    if (num < el.number) {
      num = el.number
    }
  })
  console.log(num)
  atom.number = num + 1
  let material = new THREE.MeshPhongMaterial({
    color: this.ColorAtoms[atom.name].color,
    specular: 0x00b2fc,
    shininess: 0,
    blending: THREE.NormalBlending,
    depthTest: true
  })
  let geometry = new THREE.SphereGeometry((this.ColorAtoms[atom.name].radius / 100) * this.k, 9, 9) // геометрия сферы
  atom.Object3D = new THREE.Mesh(geometry, material)
  atom.setPositionObject()
  atom.Object3D.name = atom.name
  atom.Object3D.userData['AtomPosition'] = atom.position
  atom.Object3D.userData['AtomNumber'] = atom.number
  atom.Object3D.userData['AtomName'] = atom.name
  atom.Object3D.userData['AtomConnections'] = atom.connections
  this.atomsTest.add(atom)
  this.ObjectMolecule.add(atom.Object3D)
}

export { addAtom }
