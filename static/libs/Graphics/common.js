'use strict'
import * as BABYLON from 'babylonjs'
class Molvwr {
}

class BabylonContext {
  constructor (canvas) {
    this.canvas = canvas
    this.scene = new BABYLON.Scene(this.engine)
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true })
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render()
      }
    })
    this.bindedResize = this.resize.bind(this)
    window.addEventListener('resize', this.bindedResize)
  }
  resize () {
    this.engine.resize()
  }
  exportScreenshot () {
    return this.canvas.toDataURL('image/png')
  }
  dispose () {
    this.engine.dispose()
    window.removeEventListener('resize', this.bindedResize)
  }
  sphereMaterial (mesh, atomMat, useEffects) {
    if (this.viewmode) {
      this.viewmode.sphereMaterial(this, mesh, atomMat, useEffects)
    }
  }
}
