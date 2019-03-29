import * as THREE from 'three/src/Three'
// Выделение атома при клике
function raycast (event) {
  let vector = new THREE.Vector3()
  let raycaster = new THREE.Raycaster()
  vector.set((event.offsetX / this.canvas.width) * 2 - 1, -(event.offsetY / this.canvas.height) * 2 + 1, 0.05) // z = 0.5 important!
  vector.unproject(this.camera)
  raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize())
  let intersects = raycaster.intersectObjects(this.ObjectMolecule.children, true)
  if (intersects.length > 0) {
    if (intersects[0].object.geometry instanceof THREE.SphereGeometry) {
      this.molecule.tick(intersects[0])
    }
  }
  this.renderer.render(this.scene, this.camera)
}

export { raycast }
