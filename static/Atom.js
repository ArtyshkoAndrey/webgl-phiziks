'use strict'
export default class Atom {
  constructor () {
    this.number = null
    this.x = null
    this.y = null
    this.z = null
    this.name = null
    this.connections = []
    this.Object3D = {}
    this.deleted = false
  }
  // get position () {
  //   return new Vector3(this.x, this.y, this.z)
  // }
  // set position (vector) {
  //   this.x = vector.x
  //   this.y = vector.y
  //   this.z = vector.z
  //   if (this.Object3D instanceof Mesh) {
  //     this.setPositionObject()
  //   }
  // }
  // setPositionObject () {
  //   this.Object3D.position.set(this.x, this.y, this.z)
  // }
}
