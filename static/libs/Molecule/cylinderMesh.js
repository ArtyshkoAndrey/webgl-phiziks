import * as THREE from 'three/src/Three'
// Рисование соединения цилиндрами
async function cylinderMesh (pointX, pointY, toAtom, fromAtom) {
  let direction = await new THREE.Vector3().subVectors(pointY, pointX)
  let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
  let edgeGeometry = await new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
  let edgeMesh = await new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({
    color: 0x0000ff
  }))
  edgeMesh.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
  edgeMesh.setRotationFromEuler(arrow.rotation)
  let mat = new THREE.MeshPhongMaterial({
    color: this.ColorAtoms[toAtom.name][1],
    specular: 0x00b2fc,
    shininess: 12,
    blending: THREE.NormalBlending,
    depthTest: true
  })
  edgeMesh.material = mat
  edgeMesh.userData['from'] = fromAtom.number
  toAtom.Object3D.add(edgeMesh)
  // return edgeMesh
}

export { cylinderMesh }
