import Atom from '../../Atom.js'
import * as THREE from 'three/src/Three'
// Создание Атомов по парсеру файла
function finderAtoms (url) {
  let info = this.fileGetContents(url)
  for (let i = 0; i < info.length; i++) {
    this.atoms[i] = new Atom()
    this.atoms[i].position = new THREE.Vector3(Number(info[i][2]), Number(info[i][3]), Number(info[i][4]))
    this.atoms[i].name = info[i][1]
    this.atoms[i].number = Number(info[i][0])
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

export { finderAtoms }
