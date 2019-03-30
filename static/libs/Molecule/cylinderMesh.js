import * as THREE from 'three/src/Three'
// Рисование соединения цилиндрами
async function cylinderMesh (pointX, pointY, fromAtom, toAtom) {
  let direction = await new THREE.Vector3().subVectors(pointY, pointX)
  let arrow = await new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
  let edgeGeometry = await new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
  let edgeMesh = await new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({
    color: 0x0000ff
  }))
  await edgeMesh.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
  await edgeMesh.setRotationFromEuler(arrow.rotation)
  let mat = await new THREE.MeshPhongMaterial({
    color: this.ColorAtoms[toAtom.name][1],
    specular: 0x00b2fc,
    shininess: 12,
    blending: THREE.NormalBlending,
    depthTest: true
  })
  edgeMesh.material = await mat
  edgeMesh.userData['to'] = await toAtom.number
  await fromAtom.Object3D.add(edgeMesh)
  // return edgeMesh
}

export { cylinderMesh }
