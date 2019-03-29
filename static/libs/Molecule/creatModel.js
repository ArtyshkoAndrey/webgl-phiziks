import * as THREE from 'three/src/Three'
// Создание модели молекулы в 3d, переделать по отдельным атомам
function creatModel () {
  this.scene.add(this.ObjectMolecule)
  for (let i = 0; i < this.atoms.length; i++) {
    let material = new THREE.MeshPhongMaterial({
      color: this.ColorAtoms[this.atoms[i].name][1],
      specular: 0x00b2fc,
      shininess: 0,
      blending: THREE.NormalBlending,
      depthTest: true
    })
    let geometry = new THREE.SphereGeometry(this.ColorAtoms[this.atoms[i].name][2] * this.k, 10, 10) // геометрия сферы
    this.atoms[i].Object3D = new THREE.Mesh(geometry, material)
    this.atoms[i].setPositionObject()
    this.atoms[i].Object3D.name = this.atoms[i].name
    this.atoms[i].Object3D.userData['AtomPosition'] = new THREE.Vector3(this.atoms[i].x, this.atoms[i].y, this.atoms[i].z)
    this.atoms[i].Object3D.userData['AtomNumber'] = this.atoms[i].number
    this.atoms[i].Object3D.userData['AtomName'] = this.atoms[i].name
    this.atoms[i].Object3D.userData['AtomConnections'] = this.atoms[i].connections
    this.ObjectMolecule.add(this.atoms[i].Object3D)
  }
  // связи
  for (let i = 0; i < this.atoms.length; i++) {
    let tempAtom = this.atoms[i]
    let x1 = parseFloat(tempAtom.x)
    let y1 = parseFloat(tempAtom.y)
    let z1 = parseFloat(tempAtom.z)
    for (let j = 0; j < this.atoms.length; j++) {
      if (i !== j) {
        if (this.get3dDistance(this.atoms[i].position, this.atoms[j].position) < 1.5) {
          this.atoms[i].connections.push(Number(this.atoms[j].number))
        }
      }
    }
    if (this.atoms[i].connections.length > 0) {
      for (let j = 0; j < this.atoms[i].connections.length; j++) {
        let num = this.atoms[i].connections[j] // номер атома
        tempAtom = null
        this.atoms.forEach((d, index) => {
          if (Number(num) === Number(d.number)) {
            tempAtom = this.atoms[index]
          }
        })
        let x2 = (tempAtom.x + x1) / 2
        let y2 = (tempAtom.y + y1) / 2
        let z2 = (tempAtom.z + z1) / 2
        let fingerLength = this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1))
        let mat = new THREE.MeshPhongMaterial({
          color: this.ColorAtoms[this.atoms[i].name][1],
          specular: 0x00b2fc,
          shininess: 12,
          blending: THREE.NormalBlending,
          depthTest: true
        })
        fingerLength.material = mat
        fingerLength.userData['to'] = tempAtom.number
        this.atoms[i].Object3D.add(fingerLength)
      }
    }
  }
}
export { creatModel }
