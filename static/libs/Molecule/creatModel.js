import * as THREE from 'three/src/Three'
// Создание модели молекулы в 3d, переделать по отдельным атомам
async function creatModel () {
  for (let i = 0; i < this.atoms.length; i++) {
    console.time('test')
    let material = new THREE.MeshPhongMaterial({
      color: this.ColorAtoms[this.atoms[i].name][1],
      specular: 0x00b2fc,
      shininess: 0,
      blending: THREE.NormalBlending,
      depthTest: true
    })
    let geometry = new THREE.SphereGeometry(this.ColorAtoms[this.atoms[i].name][2] * this.k, 6, 6) // геометрия сферы
    this.atoms[i].Object3D = new THREE.Mesh(geometry, material)
    this.atoms[i].setPositionObject()
    this.atoms[i].Object3D.name = this.atoms[i].name
    this.atoms[i].Object3D.userData['AtomPosition'] = this.atoms[i].position
    this.atoms[i].Object3D.userData['AtomNumber'] = this.atoms[i].number
    this.atoms[i].Object3D.userData['AtomName'] = this.atoms[i].name
    this.atoms[i].Object3D.userData['AtomConnections'] = this.atoms[i].connections
    this.ObjectMolecule.add(this.atoms[i].Object3D)
    console.timeEnd('test')
  }
  console.time('cycle')
  // связи
  for (let i = 0; i < this.atoms.length; i++) {
    for (let j = 0; j < this.atoms.length; j++) {
      if (i !== j) {
        if (!this.atoms[i].connections.includes(Number(this.atoms[j].number))) {
          if (this.get3dDistance(this.atoms[i].position, this.atoms[j].position) < 1.5) {
            this.atoms[i].connections.push(Number(this.atoms[j].number))
            this.atoms[j].connections.push(Number(this.atoms[i].number))
            let tempAtom = this.atoms[i]
            let x1 = tempAtom.x
            let y1 = tempAtom.y
            let z1 = tempAtom.z
            tempAtom = this.atoms[j]
            let x2 = (tempAtom.x + x1) / 2
            let y2 = (tempAtom.y + y1) / 2
            let z2 = (tempAtom.z + z1) / 2
            this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), this.atoms[i], this.atoms[j])
            tempAtom = this.atoms[j]
            x1 = tempAtom.x
            y1 = tempAtom.y
            z1 = tempAtom.z
            tempAtom = this.atoms[i]
            x2 = (tempAtom.x + x1) / 2
            y2 = (tempAtom.y + y1) / 2
            z2 = (tempAtom.z + z1) / 2
            this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), this.atoms[j], this.atoms[i])
          }
        }
      }
    }
    // if (this.atoms[i].connections.length > 0) {
    //   for (let j = 0; j < this.atoms[i].connections.length; j++) {
    //     let num = this.atoms[i].connections[j] // номер атома
    //
    //
    //   }
    // }
  }
  console.timeEnd('cycle')
  console.log('end molecule')
}
export { creatModel }
