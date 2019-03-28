import * as THREE from 'three'
function changePosition (numAtom, position) {
  let glavAtom = this.getAtom(numAtom)
  let massEdgeTo = []
  glavAtom.position = position
  glavAtom.Object3D.material.color.set(this.ColorAtoms[glavAtom.name][1])
  glavAtom.Object3D.children.forEach((edge) => {
    massEdgeTo.push(edge.userData['to'])
    let tempAtomPosition = this.getAtom(edge.userData['to']).position
    let x = ((tempAtomPosition.x + position.x) / 2) - position.x
    let y = ((tempAtomPosition.y + position.y) / 2) - position.y
    let z = ((tempAtomPosition.z + position.z) / 2) - position.z
    let pointX = new THREE.Vector3(0, 0, 0)
    let pointY = new THREE.Vector3(x, y, z)
    let direction = new THREE.Vector3().subVectors(pointY, pointX)
    let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
    edge.geometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
    edge.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
    edge.setRotationFromEuler(arrow.rotation)
    edge.material.color.set(this.ColorAtoms[glavAtom.name][1])
  })
  while (massEdgeTo.length > 0) {
    let tempAtom = this.getAtom(massEdgeTo.pop())
    tempAtom.Object3D.children.forEach((edge) => {
      if (edge.userData['to'] === glavAtom.number) {
        let x = ((position.x + tempAtom.x) / 2) - tempAtom.x
        let y = ((position.y + tempAtom.y) / 2) - tempAtom.y
        let z = ((position.z + tempAtom.z) / 2) - tempAtom.z
        let pointX = new THREE.Vector3(0, 0, 0)
        let pointY = new THREE.Vector3(x, y, z)
        let direction = new THREE.Vector3().subVectors(pointY, pointX)
        let arrow = new THREE.ArrowHelper(direction.clone().normalize(), pointX, direction.length())
        edge.geometry = new THREE.CylinderGeometry(0.1, 0.1, direction.length(), 16, 4)
        edge.position.copy(new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5)))
        edge.setRotationFromEuler(arrow.rotation)
      }
    })
  }
}

export { changePosition }
