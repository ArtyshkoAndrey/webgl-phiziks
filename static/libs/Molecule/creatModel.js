import * as THREE from 'three/src/Three'

function creatModel () {
  for (let atom of this.atomsTest) {
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
    this.ObjectMolecule.add(atom.Object3D)
  }
  // связи
  let i = 0
  let j = 0
  for (let atomFirst of this.atomsTest) {
    j = 0
    for (let atomSecond of this.atomsTest) {
      if (i !== j) {
        if (!atomFirst.connections.includes(Number(atomSecond.number))) {
          if (this.get3dDistance(atomFirst.position, atomSecond.position) <= ((this.ColorAtoms[atomFirst.name].covalentRadius / 100) + (this.ColorAtoms[atomSecond.name].covalentRadius / 100))) {
            atomFirst.connections.push(Number(atomSecond.number))
            atomSecond.connections.push(Number(atomFirst.number))
            let x1 = atomFirst.x
            let y1 = atomFirst.y
            let z1 = atomFirst.z
            let x2 = (atomSecond.x + x1) / 2
            let y2 = (atomSecond.y + y1) / 2
            let z2 = (atomSecond.z + z1) / 2
            this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), atomFirst, atomSecond)
            x1 = atomSecond.x
            y1 = atomSecond.y
            z1 = atomSecond.z
            x2 = (atomFirst.x + x1) / 2
            y2 = (atomFirst.y + y1) / 2
            z2 = (atomFirst.z + z1) / 2
            this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), atomSecond, atomFirst)
          }
        }
      }
      j++
    }
    i++
  }
  this.scene.add(this.ObjectMolecule)
  console.log('end molecule')
}

export { creatModel }
