import * as THREE from 'three/src/Three'
// Рисование соединения цилиндрами
function cylinderMesh (pointX, pointY, toAtom, fromAtom, ColorAtoms = undefined) {
  return new Promise(resolve => {
    let direction = new THREE.Vector3().subVectors(pointY, pointX)
    let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
    let edgeGeometry = new THREE.CylinderGeometry(0.08, 0.08, direction.length(), 8, 0, true)
    let edgeMesh
    if (ColorAtoms) {
      edgeMesh = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({
        color: ColorAtoms[toAtom.name].color,
        specular: 0x00b2fc,
        shininess: 12,
        blending: THREE.NormalBlending,
        depthTest: true
      }))
    } else {
      edgeMesh = new THREE.Mesh(edgeGeometry, new THREE.MeshPhongMaterial({
        color: this.ColorAtoms[toAtom.name].color,
        specular: 0x00b2fc,
        shininess: 12,
        blending: THREE.NormalBlending,
        depthTest: true
      }))
    }
    edgeMesh.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
    edgeMesh.setRotationFromEuler(arrow.rotation)
    edgeMesh.userData['from'] = fromAtom.number
    resolve(toAtom.Object3D.add(edgeMesh))
  })
}

export { cylinderMesh }
