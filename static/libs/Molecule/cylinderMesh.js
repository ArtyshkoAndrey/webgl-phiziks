import * as THREE from 'three/src/Three'
// Рисование соединения цилиндрами
function cylinderMesh (pointX, pointY) {
  let direction = new THREE.Vector3().subVectors(pointY, pointX)
  let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
  let edgeGeometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
  let edgeMesh = new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({
    color: 0x0000ff
  }))
  edgeMesh.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
  edgeMesh.setRotationFromEuler(arrow.rotation)
  return edgeMesh
}

export { cylinderMesh }
