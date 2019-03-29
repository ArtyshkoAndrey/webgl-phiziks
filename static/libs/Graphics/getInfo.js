import * as THREE from 'three/src/Three'
// Вывод инфы при наведении на атом
function getInfo (event) {
  let div = document.getElementById('infoMouse')
  let vector = new THREE.Vector3()
  let raycaster = new THREE.Raycaster()
  vector.set(((event.clientX - 150) / this.canvas.width) * 2 - 1, -(event.clientY / this.canvas.height) * 2 + 1, 0.05) // z = 0.5 important!
  vector.unproject(this.camera)
  raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize())
  let intersects = raycaster.intersectObjects(this.ObjectMolecule.children, true)
  if (intersects.length > 0) {
    if (intersects[0].object.geometry instanceof THREE.SphereGeometry) {
      div.style.top = event.clientY + 10 + 'px'
      div.style.left = event.clientX + 10 + 'px'
      div.style.display = 'block'
      div.textContent = intersects[0].object.userData['AtomName']
    } else {
      div.style.display = 'none'
    }
  } else {
    div.style.display = 'none'
  }
}

export { getInfo }
