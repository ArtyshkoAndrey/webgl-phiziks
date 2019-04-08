// Функция рекрсивная для отображение 3D
function render () {
  this.control.update()
  if (this.camera.position.x !== this.pos.position.x) {
    this.camera.updateMatrixWorld()
    let axesPlacement = this.camera.localToWorld(this.localToCameraAxesPlacement.clone())
    this.axesHelper.position.copy(axesPlacement)
    this.renderer.render(this.scene, this.camera)
  }
  this.pos = this.camera.clone()
  this.light.position.copy(this.camera.position)
  this.requestA = requestAnimationFrame(this.render.bind(this))
}

export { render }
