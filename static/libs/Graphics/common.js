'use strict'
import { getInfo } from './getInfo.js'
import { init } from './init.js'
import { raycast } from './raycast.js'
import { render } from './render.js'
import { resizeWindow } from './resizeWindow.js'
class Graphics {
  constructor (bgColorBool) {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.light = null
    this.control = null
    this.pos = null
    this.canvas = null
    this.molecule = null
    this.bgColorBool = bgColorBool
    this.requestA = null
    this.localToCameraAxesPlacement = null
    this.axesHelper = null
    this.ObjectMolecule = null
  }
  // Создание свойства молекулы
  initMolecule (molecule, ObjectMolecule) {
    this.molecule = molecule
    this.ObjectMolecule = ObjectMolecule
  }
  retThis () {
    return this
  }
  destuctor () {
    cancelAnimationFrame(this.requestA)
    this.scene.remove(this.light)
    this.scene.remove(this.camera)
    this.renderer.dispose()
    this.scene.dispose()
    this.requestA = null
    this.pos = null
    this.scene = null
    this.control = null
    this.camera = null
    this.light = null
    this.renderer.forceContextLoss()
    this.renderer.context = null
    this.renderer.domElement = null
    this.canvas = null
    this.molecule = null
    this.bgColorBool = null
  }
}

Graphics.prototype.init = init
Graphics.prototype.getInfo = getInfo
Graphics.prototype.raycast = raycast
Graphics.prototype.render = render
Graphics.prototype.resizeWindow = resizeWindow
export default Graphics
