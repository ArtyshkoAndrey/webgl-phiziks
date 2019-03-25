'use strict'
import * as THREE from 'three'
import Atom from './Atom.js'
import fs from 'fs'
import { findAngle } from './Math.js'
export default class Molecule {
  constructor (scene) {
    this.scene = scene
    this.atoms = []
    this.k = 0.4
    this.ColorAtoms = {}
    this.ticks = []
  }
  // Создание модели молекулы в 3d, переделать по отдельным атомам
  creatModel () {
    for (let i = 0; i < this.atoms.length; i++) {
      let mat = new THREE.MeshPhongMaterial({
        color: this.ColorAtoms[this.atoms[i].name][1],
        specular: 0x00b2fc,
        shininess: 0,
        blending: THREE.NormalBlending,
        depthTest: true
      })
      let geometry = new THREE.SphereGeometry(this.ColorAtoms[this.atoms[i].name][2] * this.k, 10, 10) // геометрия сферы
      this.atoms[i].Object3D = new THREE.Mesh(geometry, mat)
      this.atoms[i].Object3D.name = this.atoms[i].name
      this.atoms[i].Object3D.position.set(this.atoms[i].x, this.atoms[i].y, this.atoms[i].z)
      this.atoms[i].Object3D.userData['AtomPosition'] = new THREE.Vector3(this.atoms[i].x, this.atoms[i].y, this.atoms[i].z)
      this.atoms[i].Object3D.userData['AtomNumber'] = this.atoms[i].number
      this.atoms[i].Object3D.userData['AtomName'] = this.atoms[i].name
      this.atoms[i].Object3D.userData['AtomConnections'] = this.atoms[i].connections
      this.scene.add(this.atoms[i].Object3D)
    }
    // связи
    for (let i = 0; i < this.atoms.length; i++) {
      let tempAtom = this.atoms[i]
      let self = this
      let x1 = parseFloat(tempAtom.x)
      let y1 = parseFloat(tempAtom.y)
      let z1 = parseFloat(tempAtom.z)
      if (this.atoms[i].connections.length > 0) {
        for (let j = 0; j < this.atoms[i].connections.length; j++) {
          let num = this.atoms[i].connections[j] // номер атома
          tempAtom = null
          this.atoms.forEach(function (d, index) {
            if (Number(num) === Number(d.number)) {
              tempAtom = self.atoms[index]
            }
          })
          let x2 = (parseFloat(tempAtom.x) + x1) / 2
          let y2 = (parseFloat(tempAtom.y) + y1) / 2
          let z2 = (parseFloat(tempAtom.z) + z1) / 2
          let fingerLength = this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1))
          let mat = new THREE.MeshPhongMaterial({
            color: this.ColorAtoms[this.atoms[i].name][1],
            specular: 0x00b2fc,
            shininess: 12,
            blending: THREE.NormalBlending,
            depthTest: true
          })
          // console.log(mat)
          fingerLength.material = mat
          this.atoms[i].Object3D.add(fingerLength)
        }
      }
    }
  }
  // Рисование соединения цилиндрами
  cylinderMesh (pointX, pointY) {
    // edge from X to Y
    let direction = new THREE.Vector3().subVectors(pointY, pointX)
    let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())

    // cylinder: radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
    let edgeGeometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)

    let edgeMesh = new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({
      color: 0x0000ff
    }))
    edgeMesh.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))

    edgeMesh.setRotationFromEuler(arrow.rotation)
    return edgeMesh
  }
  // Создание Атомов по парсеру файла
  finderAtoms (url) {
    let sssr = this.fileGetContents(url)
    let info = sssr.split('\n')
    if (info[info.length - 1].length < 1) {
      info.pop()
    }
    // переводим info в массив вида [ [ 1, C, -0.231579, -0.350841, -0.037475, 1, 2, 4, 5, 6 ], [2, C, 0.229441...] ... ]
    for (let i = 1; i < info.length; i++) {
      this.atoms[i - 1] = new Atom()
      this.atoms[i - 1].x = info[i].match(/\S+/g)[2]
      this.atoms[i - 1].y = info[i].match(/\S+/g)[3]
      this.atoms[i - 1].z = info[i].match(/\S+/g)[4]
      this.atoms[i - 1].name = info[i].match(/\S+/g)[1]
      this.atoms[i - 1].number = Number(info[i].match(/\S+/g)[0])
      if (info[i].match(/\S+/g).length > 4) {
        for (let j = 6; j < info[i].match(/\S+/g).length; j++) {
          this.atoms[i - 1].connections.push(info[i].match(/\S+/g)[j])
        }
      }
    }
    let allAtomSymbol = ''
    let number = 0
    for (let i = 0; i < this.atoms.length; i++) {
      let AtomSymbol = this.atoms[i].name
      let pos = allAtomSymbol.indexOf('#' + AtomSymbol + '#')
      if (pos < 0) {
        allAtomSymbol = allAtomSymbol + '#' + AtomSymbol + '#'
        if (this.ColorAtoms[AtomSymbol] === undefined) {
          this.ColorAtoms[AtomSymbol] = [ number, Math.random() * 0xFFFFFF, 0.7 ]
        }
        number++
      }
    }
  }
  // Парсер файла. Переделать под наш
  fileGetContents (url) {
    return fs.readFileSync(url, 'utf-8')
  }
  tick (intersects) {
    let self = this
    this.scene.children.forEach(function (atom) {
      if (atom instanceof THREE.Mesh) {
        if (atom.geometry instanceof THREE.SphereGeometry) {
          let scope = self
          let ticked = false
          for (let i = 0; i < self.ticks.length; i++) {
            if (Number(self.ticks[i]) === Number(atom.userData['AtomNumber'])) {
              ticked = true
            }
          }
          if (ticked === false) {
            atom.material.color.set(self.ColorAtoms[atom.name][1])
            atom.children.forEach(function (cycle) {
              cycle.material.color.set(scope.ColorAtoms[atom.name][1])
            })
          }
        }
      }
    })
    if (intersects.object instanceof THREE.Mesh) {
      if (intersects.object.geometry instanceof THREE.SphereGeometry) {
        let ticked = false
        for (let i = 0; i < this.ticks.length; i++) {
          if (Number(this.ticks[i]) === Number(intersects.object.userData['AtomNumber'])) {
            ticked = true
          }
        }
        if (ticked === false) {
          intersects.object.material.color.set(0xff0000)
          intersects.object.children.forEach(function (cycle) {
            cycle.material.color.set(0xff0000)
          })
          document.getElementById('InfoForAtom').textContent = intersects.object.userData.AtomNumber + ' ' + intersects.object.userData.AtomName + ': ' + intersects.object.userData.AtomPosition.x + ' ' + intersects.object.userData.AtomPosition.y + ' ' + intersects.object.userData.AtomPosition.z
          this.ticks.push(intersects.object.userData['AtomNumber'])
        } else {
          intersects.object.material.color.set(this.ColorAtoms[intersects.object.userData['AtomName']][1])
          let self = this
          intersects.object.children.forEach(function (cycle) {
            cycle.material.color.set(self.ColorAtoms[intersects.object.userData['AtomName']][1])
          })
          let num = this.ticks.indexOf(intersects.object.userData['AtomNumber'])
          this.ticks.splice(num, 1)
        }
      }
    }
    if (this.ticks.length === 3) {
      let angle = findAngle(this.getAtom(this.ticks[0]), this.getAtom(this.ticks[1]), this.getAtom(this.ticks[2])) * 57.6
      if (angle > 180) {
        angle = 360 - angle
      }
      document.getElementById('InfoForAtom').textContent = Math.round(angle) + ' градусов'
    }
  }
  getAtom (num) {
    for (let i = 0; i < this.atoms.length; i++) {
      if (Number(num) === Number(this.atoms[i].number)) {
        // console.log(this.atoms[i].Object3D.position)
        return this.atoms[i].Object3D.position
      }
    }
  }
  changePosition (numAtom, position) {
    let glavAtom = null
    let chAtom = null
    for (let i = 0; i < this.atoms.length; i++) {
      if (Number(this.atoms[i].number) === numAtom) {
        glavAtom = this.atoms[i]
      }
    }
    glavAtom.x = Number(position.x)
    glavAtom.y = Number(position.y)
    glavAtom.z = Number(position.z)
    glavAtom.Object3D.position.set(Number(position.x), Number(position.y), Number(position.z))
    // console.log(glavAtom.Object3D)
    glavAtom.Object3D.children = []
    for (let j = 0; j < glavAtom.connections.length; j++) {
      let num = Number(glavAtom.connections[j])
      for (let k = 0; k < this.atoms.length; k++) {
        if (num === this.atoms[k].number) {
          chAtom = this.atoms[k]
        }
      }
      chAtom.Object3D.children = []
      let x2 = (parseFloat(chAtom.x) + glavAtom.x) / 2
      let y2 = (parseFloat(chAtom.y) + glavAtom.y) / 2
      let z2 = (parseFloat(chAtom.z) + glavAtom.z) / 2
      let fingerLength = this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - glavAtom.x, y2 - glavAtom.y, z2 - glavAtom.z))
      let mat = new THREE.MeshPhongMaterial({
        color: this.ColorAtoms[glavAtom.name][1],
        specular: 0x00b2fc,
        shininess: 12,
        blending: THREE.NormalBlending,
        depthTest: true
      })
      // console.log(mat)
      fingerLength.material = mat
      glavAtom.Object3D.add(fingerLength)
      for (let f = 0; f < chAtom.connections.length; f++) {
        let ch2Atom = null
        let num2 = Number(chAtom.connections[f])
        for (let k = 0; k < this.atoms.length; k++) {
          if (Number(num2) === Number(this.atoms[k].number)) {
            ch2Atom = this.atoms[k]
          }
        }
        let x3 = (parseFloat(Number(ch2Atom.x)) + Number(chAtom.x)) / 2
        let y3 = (parseFloat(Number(ch2Atom.y)) + Number(chAtom.y)) / 2
        let z3 = (parseFloat(Number(ch2Atom.z)) + Number(chAtom.z)) / 2
        let fingerLength = this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x3 - chAtom.x, y3 - chAtom.y, z3 - chAtom.z))
        let mat = new THREE.MeshPhongMaterial({
          color: this.ColorAtoms[chAtom.name][1],
          specular: 0x00b2fc,
          shininess: 12,
          blending: THREE.NormalBlending,
          depthTest: true
        })
        // console.log(mat)
        fingerLength.material = mat
        chAtom.Object3D.add(fingerLength)
      }
    }
  }
  destuctor () {
    for (let i = 0; i < this.atoms.length; i++) {
      this.atoms[i].Object3D.material.dispose()
      this.atoms[i].Object3D.geometry.dispose()
      this.atoms[i] = null
      console.log(this.atoms.length)
    }
    this.atoms = null
    this.ColorAtoms = null
    this.ticks = null
  }
}
