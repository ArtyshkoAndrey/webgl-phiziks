import { findAngle } from '../../Math.js'
function tick (intersects) {
  let ticked = false
  for (let i = 0; i < this.ticks.length; i++) {
    if (Number(this.ticks[i]) === Number(intersects.object.userData['AtomNumber'])) {
      ticked = true
    }
  }
  if (ticked === false) {
    intersects.object.material.color.set(0xff0000)
    intersects.object.children.forEach((cycle) => {
      cycle.material.color.set(0xff0000)
    })
    document.getElementById('InfoForAtom').textContent = intersects.object.userData.AtomNumber + ' ' + intersects.object.userData.AtomName + ': ' + intersects.object.userData.AtomPosition.x + ' ' + intersects.object.userData.AtomPosition.y + ' ' + intersects.object.userData.AtomPosition.z
    this.ticks.push(intersects.object.userData['AtomNumber'])
  } else {
    intersects.object.material.color.set(this.ColorAtoms[intersects.object.userData['AtomName']][1])
    intersects.object.children.forEach((cycle) => {
      cycle.material.color.set(this.ColorAtoms[intersects.object.userData['AtomName']][1])
    })
    let num = this.ticks.indexOf(intersects.object.userData['AtomNumber'])
    this.ticks.splice(num, 1)
  }
  if (this.ticks.length === 2) {
    let distance = this.get3dDistance(this.getAtom(this.ticks[0]).position, this.getAtom(this.ticks[1]).position)
    document.getElementById('InfoForAtom').textContent = distance.toFixed(2) + ' пкм'
  }
  if (this.ticks.length === 3) {
    let angle = findAngle(this.getAtom(this.ticks[0]).position, this.getAtom(this.ticks[1]).position, this.getAtom(this.ticks[2]).position) * 57.6
    if (angle > 180) {
      angle = 360 - angle
    }
    document.getElementById('InfoForAtom').textContent = angle.toFixed(2) + ' градусов'
  }
}

export { tick }
