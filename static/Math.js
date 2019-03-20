/*
* Calculates the angle ABC (in radians)
*
* A first point, ex: {x: 0, y: 0}
* C second point
* B center point
*/
function findAngle (a, b, c) {
  let ab = { x: b.x - a.x, y: b.y - a.y }
  let cb = { x: b.x - c.x, y: b.y - c.y }

  let dot = (ab.x * cb.x + ab.y * cb.y)
  let cross = (ab.x * cb.y - ab.y * cb.x)

  let alpha = -Math.atan2(cross, dot)
  if (alpha < 0) {
    alpha += 2 * Math.PI
  }
  return alpha
}
module.exports.findAngle = findAngle
