import Atom from '../../Atom.js'
import * as THREE from 'three/src/Three'
// Создание Атомов по парсеру файла
function finderAtoms (url) {
  let info = this.fileGetContents(url)
  for (let i = 0; i < info.length; i++) {
    let atom = new Atom()
    atom.position = new THREE.Vector3(Number(info[i][2]), Number(info[i][3]), Number(info[i][4]))
    atom.name = info[i][1]
    atom.number = Number(info[i][0])
    this.atomsTest.add(atom)
  }
}

export { finderAtoms }
