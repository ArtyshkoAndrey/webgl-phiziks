import * as THREE from 'three/src/Three'
// Изменение размера канваса при изменении окна
function resizeWindow () {
  this.camera.aspect = (window.innerWidth - 150) / window.innerHeight
  this.camera.updateProjectionMatrix()
  this.renderer.setSize(window.innerWidth - 150, window.innerHeight)
  if (window.innerWidth >= 900) {
    this.localToCameraAxesPlacement = new THREE.Vector3(-0.65 * this.camera.aspect, -0.6, -2)
  } else {
    this.localToCameraAxesPlacement = new THREE.Vector3(-0.35 * this.camera.aspect, -0.6, -2)
  }
  let axesPlacement = this.camera.localToWorld(this.localToCameraAxesPlacement.clone())
  this.axesHelper.position.copy(axesPlacement)
  this.renderer.render(this.scene, this.camera)
}

export { resizeWindow }
