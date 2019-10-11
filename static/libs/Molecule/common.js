'use strict'
import * as BABYLON from 'babylonjs'
import fs from 'fs'
import Atom from '../../Atom.js'
import exec from 'executive'
class Molecule {
  constructor (scene, colorAtoms) {
    this.scene = scene
    this.atoms = new Set()
    this.colorAtoms = colorAtoms.atoms
    this.ticks = []
    this.pointer = 'tick'
    this.maxNumber = 0
    this.bonds = new Set()
    this.textFile = null
    this.nameFile = null
    this.pathWithoutFile = null
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
  async saveDataFile () {
    let path
    if (this.pathWithoutFile !== null && this.nameFile !== null) {
      path = this.pathWithoutFile + '\\' + this.nameFile.split('.')[0] + '.mop'
    } else {
      const {dialog} = require('electron').remote
      path = dialog.showSaveDialog({
        filters: [
          {name: 'MOPAC', extensions: ['mop']}
        ]
      })
      let arrayPath = path.split('\\')
      let nameFile = arrayPath.pop()
      this.nameFile = nameFile
      let pathWithoutFile = arrayPath.join('\\')
      this.pathWithoutFile = pathWithoutFile
    }
    console.log(path)
    fs.open(path, 'w', (err, fd) => {
      if (err) {
        return console.log(err)
      }
      try {
        delete this.textFile.molecule.bondArray
      } catch (e) {
        console.log('Error deleted', e)
      }
      let text = []
      text.push('')
      text.push(this.nameFile.split('.')[0] + '')
      text.push('')
      for (let atom of this.atoms) {
        if (!atom.deleted) {
          console.log(atom)
          let temp = ''
          temp += atom.name.toUpperCase() + ' ' + atom.Object3D.position.x + ' 1 ' + atom.Object3D.position.y + ' 1 ' + atom.Object3D.position.z + ' 1 '
          text.push(temp)
        }
      }
      text = text.join('\n')
      fs.writeFile(path, text, err => {
        if (err) return new Error('Error save data')
        fs.close(fd, err => {
          if (err) return new Error('Error save data')
          this.refreshBond(path)
        })
      })
    })
  }
  babelData (path = null) {
    if (path) {
      let arrayPath = path.split('\\')
      let nameFile = arrayPath.pop()
      this.nameFile = nameFile
      let pathWithoutFile = arrayPath.join('\\')
      this.pathWithoutFile = pathWithoutFile
      let babelResult = null
      exec.sync('obabel ' + nameFile + ' -ocml', {cwd: pathWithoutFile}, (err, stdout, stderr) => {
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
      this.textFile = babelResult
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
    let atom = new Atom()
    atom.x = 0
    atom.y = 0
    atom.z = 0
    atom.name = symbol
    atom.number = this.maxNumber
    atom.id = 'a' + this.maxNumber
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
    this.saveDataFile()
  }
  findAtom (id) {
    for (let atom of this.atoms) {
      if (atom.id === id) {
        console.log(atom)
        return atom
      }
    }
    console.warning('Нет атома с id ', id)
    return undefined
  }
  createBonds (bonds) {
    bonds.forEach((bond) => {
      let atom = this.findAtom(bond[0])
      let atom2 = this.findAtom(bond[1])
      let position = atom.Object3D.position
      let position2 = atom2.Object3D.position
      let bond3D = this.creatCyclinder(0, 0, 0, position2.x - position.x, position2.y - position.y, position2.z - position.z, 1)
      if (bond[2] === '2') {
        let bond3D2 = bond3D.clone('cylinder2')
        bond3D2.position.x = Number(position2.x - position.x) / 2 - 0.05
        bond3D2.position.y = Number(position2.y - position.y) / 2 - 0.05
        bond3D2.position.z = Number(position2.z - position.z) / 2 - 0.05
        let bonds3D = BABYLON.Mesh.MergeMeshes([bond3D, bond3D2])
        bonds3D.material.diffuseColor = new BABYLON.Color3.FromHexString('#747474')
        bonds3D.name = 'cylinder'
        bonds3D.parent = atom.Object3D
        bonds3D.metadata = {from: atom.id, to: atom2.id}
        this.bonds.add(bonds3D)
      } else if (bond[2] === '1') {
        bond3D.name = 'cylinder'
        bond3D.parent = atom.Object3D
        bond3D.metadata = {from: atom.id, to: atom2.id}
        this.bonds.add(bond3D)
      } else if (bond[2] === '3') {
        let bond3D2 = bond3D.clone('cylinder2')
        bond3D2.position.x = Number(position2.x - position.x) / 2 - 0.05
        bond3D2.position.y = Number(position2.y - position.y) / 2 - 0.05
        bond3D2.position.z = Number(position2.z - position.z) / 2 - 0.05
        let bond3D3 = bond3D.clone('cylinder3')
        bond3D3.position.x = Number(position2.x - position.x) / 2 - 0.12
        bond3D3.position.y = Number(position2.y - position.y) / 2 - 0.12
        bond3D3.position.z = Number(position2.z - position.z) / 2 - 0.12
        let bonds3D = BABYLON.Mesh.MergeMeshes([bond3D, bond3D2, bond3D3])
        bonds3D.material.diffuseColor = new BABYLON.Color3.FromHexString('#494848')
        bonds3D.name = 'cylinder'
        bonds3D.parent = atom.Object3D
        bonds3D.metadata = {from: atom.id, to: atom2.id}
        this.bonds.add(bonds3D)
      }
    })
  }
  deleteAtom () {
    if (this.ticks.length > 0) {
      let i = 0
      for (let atom of this.atoms) {
        if (this.ticks.includes(atom.Object3D.metadata.number)) {
          atom.Object3D.material.dispose()
          atom.Object3D.dispose()
          atom.deleted = true
          this.atoms.delete(atom)
          this.saveDataFile()
        } else {
          i++
          atom.id = 'a' + i
        }
      }
      this.maxNumber = i
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
  refreshBond () {
    if (this.pathWithoutFile !== null && this.nameFile !== null) {
      let path = this.pathWithoutFile + '\\' + this.nameFile.split('.')[0] + '.mop'
      console.log(path)
      if (!fs.existsSync(path)) {
        this.saveDataFile(path)
      } else {
        let data = this.babelData(path)
        let bonds = []
        console.log(data)
        try {
          data.bondArray.bond.forEach((bond, index) => {
            console.log(bond)
            bond = bond.$
            let ids = bond.atomRefs2.split(' ')
            bonds.push([ids[0], ids[1], bond.order])
          })
          console.log(bonds)
          console.log(this.atoms)
          for (let bond of this.bonds) {
            bond.material.dispose()
            bond.dispose()
          }
          this.bonds.clear()
          this.createBonds(bonds)
        } catch (e) {
          try {
            console.log('is not Array', e)
            let ids = data.bondArray.bond.$.atomRefs2.split(' ')
            bonds.push([ids[0], ids[1], data.bondArray.bond.$.order])
            for (let bond of this.bonds) {
              bond.material.dispose()
              bond.dispose()
            }
            this.bonds.clear()
            this.createBonds(bonds)
          } catch (e) {
            console.log('Нет соединений', e)
          }
        }
      }
    }
  }
  creatMolecule (data = null) {
    if (data) {
      console.log(data)
      let bonds = []
      try {
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
          atom3D.metadata.number = index + 1
          atom3D.metadata.name = atom.elementType
          atom3D.metadata.tick = false
          atom3D.metadata.id = atom.id
          tempAtom.Object3D = atom3D
          tempAtom.x = Number(atom.x3)
          tempAtom.y = Number(atom.y3)
          tempAtom.z = Number(atom.z3)
          tempAtom.number = index + 1
          tempAtom.name = atom.elementType
          tempAtom.id = atom.id
          this.maxNumber = index + 1
          this.atoms.add(tempAtom)
        })
      } catch (e) {
        try {
          let atom = data.atomArray.atom.$
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
          atom3D.metadata.number = 1
          atom3D.metadata.name = atom.elementType
          atom3D.metadata.tick = false
          atom3D.metadata.id = atom.id
          tempAtom.Object3D = atom3D
          tempAtom.x = Number(atom.x3)
          tempAtom.y = Number(atom.y3)
          tempAtom.z = Number(atom.z3)
          tempAtom.number = 1
          tempAtom.name = atom.elementType
          tempAtom.id = atom.id
          this.maxNumber = 1
          this.atoms.add(tempAtom)
        } catch (e) {
          console.log('Нет атомов', e)
        }
      }
      try {
        data.bondArray.bond.forEach((bond, index) => {
          bond = bond.$
          let ids = bond.atomRefs2.split(' ')
          bonds.push([ids[0], ids[1], bond.order])
        })
        this.createBonds(bonds)
      } catch (e) {
        try {
          let bond = data.bondArray.bond.$
          let ids = bond.atomRefs2.split(' ')
          bonds.push([ids[0], ids[1], bond.order])
          this.createBonds(bonds)
        } catch (e) {
          console.log('Нет соединений', e)
        }
      }
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
