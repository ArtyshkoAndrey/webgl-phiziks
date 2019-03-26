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
    this.ObjectMolecule = new THREE.Object3D()
  }
  // Создание модели молекулы в 3d, переделать по отдельным атомам
  creatModel () {
    this.scene.add(this.ObjectMolecule)
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
      this.ObjectMolecule.add(this.atoms[i].Object3D)
    }
    // связи
    for (let i = 0; i < this.atoms.length; i++) {
      let tempAtom = this.atoms[i]
      let self = this
      let x1 = parseFloat(tempAtom.x)
      let y1 = parseFloat(tempAtom.y)
      let z1 = parseFloat(tempAtom.z)
      for (let j = 0; j < this.atoms.length; j++) {
        if (i !== j) {
          if (this.get3dDistance(this.atoms[i].Object3D.position, this.atoms[j].Object3D.position) < 1.5) {
            this.atoms[i].connections.push(Number(this.atoms[j].number))
          }
        }
      }
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
          fingerLength.userData['to'] = tempAtom.number
          this.atoms[i].Object3D.add(fingerLength)
        }
      }
    }
  }
  // Рисование соединения цилиндрами
  cylinderMesh (pointX, pointY, returned = 'all') {
    let direction = new THREE.Vector3().subVectors(pointY, pointX)
    let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
    let edgeGeometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
    if (returned === 'geometry') {
      return edgeGeometry
    }
    let edgeMesh = new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({
      color: 0x0000ff
    }))
    edgeMesh.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
    edgeMesh.setRotationFromEuler(arrow.rotation)
    return edgeMesh
  }
  // Создание Атомов по парсеру файла
  finderAtoms (url) {
    let info = this.fileGetContents(url)
    // переводим info в массив вида [ [ 1, C, -0.231579, -0.350841, -0.037475, 1, 2, 4, 5, 6 ], [2, C, 0.229441...] ... ]
    for (let i = 0; i < info.length; i++) {
      this.atoms[i] = new Atom()
      this.atoms[i].x = info[i][2]
      this.atoms[i].y = info[i][3]
      this.atoms[i].z = info[i][4]
      this.atoms[i].name = info[i][1]
      this.atoms[i].number = Number(info[i][0])
      if (info[i].length > 5) {
        for (let j = 6; j < info[i].length; j++) {
          this.atoms[i].connections.push(info[i][j])
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
        console.log(b)
        if (fix[i][0] !== '') {
          fat.push(fix[i])
          if (fix[i + 1].length === 1) {
            // if (fix[i + 1][0] === '') {
            b = false
            console.log('stop')
            // }
          }
        }
      }
      if ((fix[i][0] + ' ' + fix[i][1]) === 'CARTESIAN COORDINATES') {
        b = true
        i += 4
        fat.push(fix[i])
      }
    }
    console.log(fat)
    return fat
  }
  tick (intersects) {
    // WTF
    // let self = this
    // this.ObjectMolecule.children.forEach(function (atom) {
    //   if (atom instanceof THREE.Mesh) {
    //     if (atom.geometry instanceof THREE.SphereGeometry) {
    //       let scope = self
    //       let ticked = false
    //       for (let i = 0; i < self.ticks.length; i++) {
    //         if (Number(self.ticks[i]) === Number(atom.userData['AtomNumber'])) {
    //           ticked = true
    //         }
    //       }
    //       if (ticked === false) {
    //         atom.material.color.set(self.ColorAtoms[atom.name][1])
    //         atom.children.forEach(function (cycle) {
    //           cycle.material.color.set(scope.ColorAtoms[atom.name][1])
    //         })
    //       }
    //     }
    //   }
    // })
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
    if (this.ticks.length === 2) {
      let distance = this.get3dDistance(this.getAtomPosition(this.ticks[0]), this.getAtomPosition(this.ticks[1]))
      document.getElementById('InfoForAtom').textContent = distance.toFixed(2) + ' пкм'
    }
    if (this.ticks.length === 3) {
      let angle = findAngle(this.getAtomPosition(this.ticks[0]), this.getAtomPosition(this.ticks[1]), this.getAtomPosition(this.ticks[2])) * 57.6
      if (angle > 180) {
        angle = 360 - angle
      }
      document.getElementById('InfoForAtom').textContent = angle.toFixed(2) + ' градусов'
    }
  }
  changePosition (numAtom, position) {
    let glavAtom = null
    let massEdgeTo = []
    for (let i = 0; i < this.atoms.length; i++) {
      if (Number(this.atoms[i].number) === numAtom) {
        glavAtom = this.atoms[i]
      }
    }
    glavAtom.x = Number(position.x)
    glavAtom.y = Number(position.y)
    glavAtom.z = Number(position.z)
    glavAtom.Object3D.position.set(Number(position.x), Number(position.y), Number(position.z))
    let self = this
    glavAtom.Object3D.material.color.set(this.ColorAtoms[glavAtom.name][1])
    glavAtom.Object3D.children.forEach(function (edge) {
      massEdgeTo.push(edge.userData['to'])
      let tempAtomPosition = self.getAtomPosition(edge.userData['to'])
      let x = ((Number(tempAtomPosition.x) + Number(position.x)) / 2) - Number(position.x)
      let y = ((Number(tempAtomPosition.y) + Number(position.y)) / 2) - Number(position.y)
      let z = ((Number(tempAtomPosition.z) + Number(position.z)) / 2) - Number(position.z)
      let pointX = new THREE.Vector3(0, 0, 0)
      let pointY = new THREE.Vector3(x, y, z)
      let direction = new THREE.Vector3().subVectors(pointY, pointX)
      let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
      edge.geometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
      edge.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
      edge.setRotationFromEuler(arrow.rotation)
      edge.material.color.set(self.ColorAtoms[glavAtom.name][1])
    })
    while (massEdgeTo.length > 0) {
      let tempAtom = this.getAtom(massEdgeTo.pop())
      tempAtom.Object3D.children.forEach(function (edge) {
        if (edge.userData['to'] === glavAtom.number) {
          let x = ((Number(position.x) + Number(tempAtom.x)) / 2) - Number(tempAtom.x)
          let y = ((Number(position.y) + Number(tempAtom.y)) / 2) - Number(tempAtom.y)
          let z = ((Number(position.z) + Number(tempAtom.z)) / 2) - Number(tempAtom.z)
          let pointX = new THREE.Vector3(0, 0, 0)
          let pointY = new THREE.Vector3(x, y, z)
          let direction = new THREE.Vector3().subVectors(pointY, pointX)
          let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
          edge.geometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
          edge.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
          edge.setRotationFromEuler(arrow.rotation)
        }
      })
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
  getAtomPosition (num) {
    for (let i = 0; i < this.atoms.length; i++) {
      if (Number(num) === Number(this.atoms[i].number)) {
        return this.atoms[i].Object3D.position
      }
    }
  }
}
