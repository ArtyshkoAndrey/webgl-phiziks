'use strict'
import * as THREE from 'three/src/Three'

function loadMat (color) {
  const params = {
    color: color,
    specular: 0x00b2fc,
    shininess: 0,
    blending: THREE.NormalBlending,
    depthTest: true
  }
  return new Promise(resolve => {
    resolve(new THREE.MeshPhongMaterial(params))
  })
}
function loadGeo (radius, k) {
  return new Promise(resolve => {
    resolve(new THREE.SphereGeometry((radius / 100) * k, 9, 9))
  })
}

function loadMesh (color, radius, k, atom, ObjectMolecule) {
  const params = [
    loadMat(color),
    loadGeo(radius, k)
  ]

  return Promise.all(params).then(result => {
    atom.Object3D = new THREE.Mesh(result[1], result[0])
    atom.setPositionObject()
    atom.Object3D.userData['AtomPosition'] = atom.position
    atom.Object3D.userData['AtomNumber'] = atom.number
    atom.Object3D.userData['AtomName'] = atom.name
    atom.Object3D.userData['AtomConnections'] = atom.connections
    ObjectMolecule.add(atom.Object3D)
    return atom
  })
}

function creatAtoms3D (atoms, ColorAtoms, k, ObjectMolecule, fn, fn2, self) {
  return new Promise((resolve, reject) => {
    for (let atom of atoms) {
      loadMesh(ColorAtoms[atom.name].color, ColorAtoms[atom.name].radius, k, atom, ObjectMolecule)
        .then(result => {
          for (let atomSecond of atoms) {
            if (result !== atomSecond) {
              if (!result.connections.includes(Number(atomSecond.number))) {
                if (fn2(result.position, atomSecond.position) <= ((ColorAtoms[result.name].covalentRadius / 100) + (ColorAtoms[atomSecond.name].covalentRadius / 100))) {
                  result.connections.push(Number(atomSecond.number))
                  let x1 = result.x
                  let y1 = result.y
                  let z1 = result.z
                  let x2 = (atomSecond.x + x1) / 2
                  let y2 = (atomSecond.y + y1) / 2
                  let z2 = (atomSecond.z + z1) / 2
                  fn(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), result, atomSecond, ColorAtoms)
                }
              }
            }
          }
        })
    }
  })
}

async function creatModel () {
  creatAtoms3D(this.atomsTest, this.ColorAtoms, this.k, this.ObjectMolecule, this.cylinderMesh, this.get3dDistance, this)
  // .then(() => {
  //   let i = 0
  //   let j = 0
  //   for (let atomFirst of this.atomsTest) {
  //     j = 0
  //     for (let atomSecond of this.atomsTest) {
  //       if (i !== j) {
  //         if (!atomFirst.connections.includes(Number(atomSecond.number))) {
  //           if (this.get3dDistance(atomFirst.position, atomSecond.position) <= ((this.ColorAtoms[atomFirst.name].covalentRadius / 100) + (this.ColorAtoms[atomSecond.name].covalentRadius / 100))) {
  //             atomFirst.connections.push(Number(atomSecond.number))
  //             atomSecond.connections.push(Number(atomFirst.number))
  //             let x1 = atomFirst.x
  //             let y1 = atomFirst.y
  //             let z1 = atomFirst.z
  //             let x2 = (atomSecond.x + x1) / 2
  //             let y2 = (atomSecond.y + y1) / 2
  //             let z2 = (atomSecond.z + z1) / 2
  //             this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), atomFirst, atomSecond)
  //             x1 = atomSecond.x
  //             y1 = atomSecond.y
  //             z1 = atomSecond.z
  //             x2 = (atomFirst.x + x1) / 2
  //             y2 = (atomFirst.y + y1) / 2
  //             z2 = (atomFirst.z + z1) / 2
  //             this.cylinderMesh(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1), atomSecond, atomFirst)
  //           }
  //         }
  //       }
  //       j++
  //     }
  //     i++
  //   }
  // })
  this.scene.add(this.ObjectMolecule)
  console.log('end molecule')
}

export { creatModel }
